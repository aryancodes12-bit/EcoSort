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
import java.util.Map;

@Service
public class GroqAiService {
    private static final Logger log = LoggerFactory.getLogger(GroqAiService.class);

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.model:qwen/qwen3.8-27b}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    /**
     * Perform text-only classification using Groq.
     */
    public WasteAnalysisResponse analyzeText(String description) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("your_groq_api_key")) {
            String envKey = System.getenv("GROQ_API_KEY");
            if (envKey != null && !envKey.trim().isEmpty()) {
                this.apiKey = envKey.trim();
            }
        }

        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("your_groq_api_key")) {
            return new WasteAnalysisResponse(
                    "Analysis Offline",
                    "Unknown/Uncertain",
                    "Manual Inspection Required",
                    0.0,
                    "Live analysis unavailable – no GROQ_API_KEY configured.",
                    "Configure GROQ_API_KEY to enable text analysis.",
                    "No API key configured.",
                    "Live inference could not be performed because the server lacks a GROQ_API_KEY.",
                    "fallback-no-key"
            );
        }

        try {
            String prompt = "You are EcoSort AI. Classify the following waste description into one of: \"Organic/Wet\", \"Recyclable/Dry\", \"General/Non-Recyclable\", \"Hazardous/Special\", or \"Unknown/Uncertain\". Return a JSON object with fields: item, category, bin, confidence (0.0-1.0), disposal_action, sustainability_tip, reason, uncertainty. Description: \"" + description + "\"";

            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", new Object[]{
                            Map.of("role", "user", "content", prompt)
                    },
                    "temperature", 0.2,
                    "max_tokens", 500,
                    "response_format", Map.of("type", "json_object")
            );

            String jsonPayload = objectMapper.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .timeout(Duration.ofSeconds(20))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                var root = objectMapper.readTree(response.body());
                var contentNode = root.at("/choices/0/message/content");
                if (!contentNode.isMissingNode()) {
                    String raw = contentNode.asText();
                    WasteAnalysisResponse result = objectMapper.readValue(raw, WasteAnalysisResponse.class);
                    result.setSource("groq-live");
                    return result;
                }
            }
            log.error("Groq API returned status {}: {}", response.statusCode(), response.body());
            throw new RuntimeException("Groq API HTTP " + response.statusCode() + ": " + response.body());
        } catch (Exception e) {
            log.error("Groq API call failed: {}", e.getMessage(), e);
            WasteAnalysisResponse degraded = new WasteAnalysisResponse(
                    "Analysis Degraded",
                    "Unknown/Uncertain",
                    "Manual Inspection Required",
                    0.0,
                    "Unable to complete live text classification due to upstream Groq API error.",
                    "Responsible AI: When the LLM encounters an error, EcoSort refuses to guess.",
                    "Groq API request failed: " + e.getMessage(),
                    "⚠️ Upstream Groq Error: Live inference could not be completed (" + e.getMessage() + ")",
                    "fallback-error"
            );
            degraded.setErrorMessage(e.getMessage());
            return degraded;
        }
    }

    /**
     * Independent consistency review pass: checks if Gemini's classification is logically consistent.
     * Note: Groq never sees the image - this evaluates the reasoning text and category plausibility.
     */
    public WasteAnalysisResponse.Verification verifyClassification(String item, String category, String reason) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("your_groq_api_key")) {
            String envKey = System.getenv("GROQ_API_KEY");
            if (envKey != null && !envKey.trim().isEmpty()) {
                this.apiKey = envKey.trim();
            }
        }

        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("your_groq_api_key")) {
            return new WasteAnalysisResponse.Verification("groq-qwen", "unavailable", "Groq API key not configured on backend.");
        }

        try {
            String prompt = String.format(
                    "A vision model classified an item described as '%s' with reasoning '%s' into category '%s'. " +
                    "Does this classification look internally consistent? " +
                    "Reply strictly with a single JSON object with two fields: " +
                    "\"agreement\": \"agree\" or \"disagree\", and " +
                    "\"note\": a single concise sentence explaining your agreement or disagreement.",
                    item != null ? item.replace("\"", "") : "Unknown",
                    reason != null ? reason.replace("\"", "") : "",
                    category != null ? category.replace("\"", "") : "Unknown"
            );

            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", new Object[]{
                            Map.of("role", "user", "content", prompt)
                    },
                    "temperature", 0.1,
                    "max_tokens", 250,
                    "response_format", Map.of("type", "json_object")
            );

            String jsonPayload = objectMapper.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode contentNode = root.at("/choices/0/message/content");
                if (!contentNode.isMissingNode()) {
                    JsonNode reviewJson = objectMapper.readTree(contentNode.asText());
                    String agreement = reviewJson.path("agreement").asText("agree").toLowerCase();
                    if (!agreement.equals("agree") && !agreement.equals("disagree")) {
                        agreement = "agree";
                    }
                    String note = reviewJson.path("note").asText("Classification reasoning appears consistent.");
                    return new WasteAnalysisResponse.Verification("groq-qwen", agreement, note);
                }
            }
            log.warn("Groq verification call returned status {}: {}", response.statusCode(), response.body());
            return new WasteAnalysisResponse.Verification("groq-qwen", "unavailable", "Groq upstream service returned HTTP " + response.statusCode());
        } catch (Exception e) {
            log.warn("Groq verification cross-check failed: {}", e.getMessage());
            return new WasteAnalysisResponse.Verification("groq-qwen", "unavailable", "Cross-check skipped: " + e.getMessage());
        }
    }
}
