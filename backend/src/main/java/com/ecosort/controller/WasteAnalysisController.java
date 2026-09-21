package com.ecosort.controller;

import com.ecosort.model.WasteAnalysisResponse;
import com.ecosort.service.GroqAiService;
import com.ecosort.service.GeminiAiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class WasteAnalysisController {

    private static final Logger log = LoggerFactory.getLogger(WasteAnalysisController.class);

    private final GroqAiService groqAiService;
    private final GeminiAiService geminiAiService;

    public WasteAnalysisController(GroqAiService groqAiService, GeminiAiService geminiAiService) {
        this.groqAiService = groqAiService;
        this.geminiAiService = geminiAiService;
    }

    // ── Health ──────────────────────────────────────────────────────────────────

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "EcoSort AI Backend (Gemini Vision + Groq Verification Pass)",
                "sdg", "SDG 12: Responsible Consumption and Production",
                "timestamp", System.currentTimeMillis()
        ));
    }

    // ── Text Analysis (Groq) ────────────────────────────────────────────────────

    @PostMapping(value = "/analyze-text", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> analyzeText(@RequestBody Map<String, Object> payload) {
        try {
            String description = (String) payload.get("description");
            if (description == null || description.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "A non-empty 'description' field is required."));
            }
            WasteAnalysisResponse result = groqAiService.analyzeText(description.trim());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error processing text analysis: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Failed to analyze text",
                    "details", e.getMessage(),
                    "source", "fallback-error"
            ));
        }
    }

    // ── Image Analysis (Gemini Multimodal Vision + Groq Verification) ───────────

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeWasteImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No image file provided."));
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only image files (JPEG, PNG, WEBP) are supported."));
            }
            byte[] imageBytes = file.getBytes();
            log.info("Analyzing waste image via Gemini: size={} bytes, contentType={}", imageBytes.length, contentType);
            WasteAnalysisResponse result = geminiAiService.analyzeWaste(imageBytes, contentType);

            // Real second-model verification pass (text-consistency check by Groq)
            attachGroqVerification(result);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error processing waste image: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Failed to analyze waste image",
                    "details", e.getMessage(),
                    "source", "fallback-error"
            ));
        }
    }

    @PostMapping("/analyze-base64")
    public ResponseEntity<?> analyzeBase64Image(@RequestBody Map<String, String> payload) {
        try {
            String base64Data = payload.get("image");
            String mimeType = payload.getOrDefault("mimeType", "image/jpeg");
            if (base64Data == null || base64Data.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing image base64 data."));
            }
            if (base64Data.contains(",")) {
                String prefix = base64Data.substring(0, base64Data.indexOf(","));
                if (prefix.contains("image/")) {
                    mimeType = prefix.substring(prefix.indexOf(":") + 1, prefix.indexOf(";"));
                }
                base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
            }
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);
            log.info("Analyzing base64 waste image via Gemini: size={} bytes, mimeType={}", imageBytes.length, mimeType);
            WasteAnalysisResponse result = geminiAiService.analyzeWaste(imageBytes, mimeType);

            // Real second-model verification pass (text-consistency check by Groq)
            attachGroqVerification(result);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error processing base64 image: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Failed to analyze image payload",
                    "details", e.getMessage(),
                    "source", "fallback-error"
            ));
        }
    }

    private void attachGroqVerification(WasteAnalysisResponse result) {
        if (result == null) return;
        // Only run cross-check if Gemini produced a valid classification (not degraded/error)
        if ("gemini-live".equals(result.getSource()) && result.getItem() != null) {
            try {
                WasteAnalysisResponse.Verification verification = groqAiService.verifyClassification(
                        result.getItem(),
                        result.getCategory(),
                        result.getReason()
                );
                result.setVerification(verification);
            } catch (Exception e) {
                log.warn("Secondary Groq verification check skipped: {}", e.getMessage());
                result.setVerification(new WasteAnalysisResponse.Verification(
                        "groq-qwen",
                        "unavailable",
                        "Secondary verification pass skipped: " + e.getMessage()
                ));
            }
        }
    }
}
