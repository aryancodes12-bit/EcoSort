package com.ecosort.service;

import com.ecosort.model.WasteAnalysisResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAiService {
    private static final Logger log = LoggerFactory.getLogger(GeminiAiService.class);

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-3.1-flash-lite}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(20))
            .build();

    private static final String MASTER_SYSTEM_PROMPT = """
            You are EcoSort AI, an expert multimodal sustainability and waste-management assistant aligning with UN SDG 12 (Responsible Consumption & Production).
            Analyze the uploaded image and identify the likely waste item with deep, transparent reasoning.
            
            Strict Categories:
            - "Organic/Wet" (food scraps, fruit/vegetable peels, leftover meals, garden trimmings)
            - "Recyclable/Dry" (clean plastics e.g. PET/HDPE, cardboard, office paper, aluminium cans, glass bottles)
            - "General/Non-Recyclable" (heavily soiled wrappers, multi-layer sachets, non-recyclable domestic refuse)
            - "Hazardous/Special" (household batteries, broken electronics, chemical containers, CFL bulbs, medical items)
            - "Unknown/Uncertain" (blurry image, multiple mixed unsegregated waste items, or ambiguous object)
            
            Rules:
            1. Do not invent details not visible in the image.
            2. If multiple waste items are visible or image is unclear, category MUST be "Unknown/Uncertain", and explain what should be separated in "uncertainty".
            3. In "disposal_steps", provide an ordered array of actionable strings (e.g. ["Empty any remaining liquid", "Rinse lightly", "Crush to save space", "Place in blue recycling bin"]).
            4. In "disposal_action", provide these steps joined by periods as a single summary sentence for backward compatibility.
            5. In "material_breakdown", list array of objects with "material" (string) and "percentage_estimate" (string). For composite items (e.g. paper coffee cup: paper cup 80%, plastic lining 15%, wax coating 5%), list all parts. For simple mono-material items, list a single 100% entry.
            6. In "alternative_categories_considered", list 1-2 candidate categories you weighed before deciding, with "category" and "why_rejected" explaining the nuance.
            7. In "environmental_impact", provide widely-known facts: "co2_or_resource_note" (general lifecycle/resource note) and "decomposition_time_estimate" (e.g. "PET bottle: 450+ years in landfill"). Do not invent fake precise stats.
            8. In "image_quality_note", state if lighting, angle, or blur affected confidence, or leave as empty string if image is clear.
            9. Output STRICTLY a single raw JSON object with NO markdown formatting, NO backticks:
            {
              "item": "string",
              "category": "Organic/Wet" | "Recyclable/Dry" | "General/Non-Recyclable" | "Hazardous/Special" | "Unknown/Uncertain",
              "bin": "string (e.g. Blue Recycling Bin, Green Compost Bin, Black General Bin, Red Hazard Bin)",
              "confidence": 0.95,
              "disposal_action": "string",
              "disposal_steps": ["step 1", "step 2"],
              "material_breakdown": [
                {"material": "string", "percentage_estimate": "string"}
              ],
              "alternative_categories_considered": [
                {"category": "string", "why_rejected": "string"}
              ],
              "environmental_impact": {
                "co2_or_resource_note": "string",
                "decomposition_time_estimate": "string"
              },
              "image_quality_note": "string",
              "sustainability_tip": "string",
              "reason": "string",
              "uncertainty": "string (empty if confident)"
            }
            """;

    public WasteAnalysisResponse analyzeWaste(byte[] imageBytes, String mimeType) {
        return analyzeWaste(imageBytes, mimeType, false);
    }

    public WasteAnalysisResponse analyzeWaste(byte[] imageBytes, String mimeType, boolean liveOnly) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("your_gemini_api_key")) {
            String envKey = System.getenv("GEMINI_API_KEY");
            if (envKey != null && !envKey.trim().isEmpty()) {
                this.apiKey = envKey.trim();
            }
        }

        if (apiKey != null && !apiKey.trim().isEmpty()) {
            try {
                return callGeminiMultimodal(imageBytes, mimeType);
            } catch (Exception e) {
                log.error("Gemini API call failed: {}", e.getMessage(), e);
                if (liveOnly) {
                    throw new RuntimeException("Live Gemini inference failed: " + e.getMessage(), e);
                }
                WasteAnalysisResponse degraded = new WasteAnalysisResponse(
                        "Analysis Degraded",
                        "Unknown/Uncertain",
                        "Manual Inspection Required",
                        0.0,
                        "Unable to complete live vision classification due to upstream Gemini API error.",
                        "Responsible AI: When the multimodal model encounters an error, EcoSort AI refuses to guess to avoid contaminating waste streams.",
                        "Gemini API request failed: " + e.getMessage(),
                        "⚠️ Upstream Gemini Error: Live inference could not be completed (" + e.getMessage() + ")",
                        "fallback-error"
                );
                degraded.setErrorMessage(e.getMessage());
                return degraded;
            }
        }

        if (liveOnly) {
            throw new IllegalStateException("GEMINI_API_KEY is not configured on the backend server. Live inference requires a valid API key.");
        }

        return fallbackAnalysis(imageBytes);
    }

    private WasteAnalysisResponse callGeminiMultimodal(byte[] imageBytes, String mimeType) throws Exception {
        int maxAttempts = 3;
        Exception lastError = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return callGeminiOnce(imageBytes, mimeType);
            } catch (RetryableGeminiException e) {
                lastError = e;
                log.warn("Gemini attempt {}/{} failed with retryable error: {}", attempt, maxAttempts, e.getMessage());
                if (attempt < maxAttempts) {
                    long backoffMs = 1000L * (1L << (attempt - 1)); // 1s, 2s, 4s backoff
                    Thread.sleep(backoffMs);
                }
            }
        }
        throw lastError;
    }

    /** Thrown for transient errors (503/429/network) that are worth retrying. */
    private static class RetryableGeminiException extends Exception {
        RetryableGeminiException(String message) { super(message); }
    }

    private WasteAnalysisResponse callGeminiOnce(byte[] imageBytes, String mimeType) throws Exception {
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        String targetMime = (mimeType != null && !mimeType.isEmpty()) ? mimeType : "image/jpeg";

        String endpoint = "https://generativelanguage.googleapis.com/v1/models/" + model + ":generateContent?key=" + apiKey;

        Map<String, Object> inlineData = Map.of(
                "mimeType", targetMime,
                "data", base64Image
        );

        Map<String, Object> imagePart = Map.of("inlineData", inlineData);
        Map<String, Object> textPart = Map.of("text", MASTER_SYSTEM_PROMPT);

        Map<String, Object> contents = Map.of(
                "parts", new Object[]{imagePart, textPart}
        );

        Map<String, Object> requestBodyMap = Map.of(
                "contents", new Object[]{contents},
                "generationConfig", Map.of(
                        "temperature", 0.2,
                        "responseMimeType", "application/json"
                )
        );

        String jsonPayload = objectMapper.writeValueAsString(requestBodyMap);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(30))
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode textNode = root.at("/candidates/0/content/parts/0/text");
            if (!textNode.isMissingNode()) {
                String rawText = textNode.asText().trim();
                // Clean up any remaining markdown blocks
                if (rawText.startsWith("```json")) {
                    rawText = rawText.substring(7);
                } else if (rawText.startsWith("```")) {
                    rawText = rawText.substring(3);
                }
                if (rawText.endsWith("```")) {
                    rawText = rawText.substring(0, rawText.length() - 3);
                }
                WasteAnalysisResponse result = objectMapper.readValue(rawText.trim(), WasteAnalysisResponse.class);
                result.setSource("gemini-live");

                // Ensure disposal_action is populated if disposal_steps was parsed
                if ((result.getDisposalAction() == null || result.getDisposalAction().isEmpty()) 
                        && result.getDisposalSteps() != null && !result.getDisposalSteps().isEmpty()) {
                    result.setDisposalAction(String.join(". ", result.getDisposalSteps()));
                }

                return result;
            }
        } else {
            log.error("Gemini API returned status code {}: {}", response.statusCode(), response.body());
            if (response.statusCode() == 503 || response.statusCode() == 429) {
                throw new RetryableGeminiException("Gemini API HTTP " + response.statusCode() + ": " + response.body());
            }
            throw new RuntimeException("Gemini API HTTP " + response.statusCode() + ": " + response.body());
        }

        throw new RuntimeException("Empty response received from Gemini API");
    }

    private WasteAnalysisResponse fallbackAnalysis(byte[] imageBytes) {
        WasteAnalysisResponse resp = new WasteAnalysisResponse(
                "Household Waste (Offline Rule Fallback)",
                "Recyclable/Dry",
                "Dry / Recycling Bin (Blue)",
                0.85,
                "Rinse cleanly, dry thoroughly, and place in the dry recycling bin if clean polymer/paper.",
                "Recycling common household packaging reduces landfill burden (SDG 12.5).",
                "Simulated rule-based fallback triggered because GEMINI_API_KEY is not configured.",
                "Notice: Running in offline fallback mode without live Gemini vision inference.",
                "fallback-no-key"
        );
        resp.setDisposalSteps(List.of(
                "Empty any residue from the container",
                "Rinse lightly with clean water",
                "Dry thoroughly to prevent mildew",
                "Place in the Dry / Recycling Bin (Blue)"
        ));
        resp.setMaterialBreakdown(List.of(
                new WasteAnalysisResponse.MaterialBreakdown("Rigid Plastic / Paper Packaging", "100%")
        ));
        resp.setEnvironmentalImpact(new WasteAnalysisResponse.EnvironmentalImpact(
                "Recycling paper and clean polymers conserves timber and crude oil feedstocks.",
                "Degradation timeframe depends on exact polymer grade (typically 20-500 years)."
        ));
        return resp;
    }
}
