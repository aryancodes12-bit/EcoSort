package com.ecosort.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class WasteAnalysisResponse {
    private String item;
    private String category;
    private String bin;
    private double confidence;
    
    @JsonProperty("disposal_action")
    private String disposalAction;
    
    @JsonProperty("sustainability_tip")
    private String sustainabilityTip;
    
    private String reason;
    private String uncertainty;
    private String source;
    
    @JsonProperty("error_message")
    private String errorMessage;

    // --- Richer analysis fields ---
    @JsonProperty("material_breakdown")
    private List<MaterialBreakdown> materialBreakdown;

    @JsonProperty("alternative_categories_considered")
    private List<AlternativeCategory> alternativeCategoriesConsidered;

    @JsonProperty("disposal_steps")
    private List<String> disposalSteps;

    @JsonProperty("environmental_impact")
    private EnvironmentalImpact environmentalImpact;

    @JsonProperty("image_quality_note")
    private String imageQualityNote;

    // --- Real second-model verification pass ---
    private Verification verification;

    public static class MaterialBreakdown {
        private String material;
        @JsonProperty("percentage_estimate")
        private String percentageEstimate;

        public MaterialBreakdown() {}
        public MaterialBreakdown(String material, String percentageEstimate) {
            this.material = material;
            this.percentageEstimate = percentageEstimate;
        }

        public String getMaterial() { return material; }
        public void setMaterial(String material) { this.material = material; }

        public String getPercentageEstimate() { return percentageEstimate; }
        public void setPercentageEstimate(String percentageEstimate) { this.percentageEstimate = percentageEstimate; }
    }

    public static class AlternativeCategory {
        private String category;
        @JsonProperty("why_rejected")
        private String whyRejected;

        public AlternativeCategory() {}
        public AlternativeCategory(String category, String whyRejected) {
            this.category = category;
            this.whyRejected = whyRejected;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getWhyRejected() { return whyRejected; }
        public void setWhyRejected(String whyRejected) { this.whyRejected = whyRejected; }
    }

    public static class EnvironmentalImpact {
        @JsonProperty("co2_or_resource_note")
        private String co2OrResourceNote;

        @JsonProperty("decomposition_time_estimate")
        private String decompositionTimeEstimate;

        public EnvironmentalImpact() {}
        public EnvironmentalImpact(String co2OrResourceNote, String decompositionTimeEstimate) {
            this.co2OrResourceNote = co2OrResourceNote;
            this.decompositionTimeEstimate = decompositionTimeEstimate;
        }

        public String getCo2OrResourceNote() { return co2OrResourceNote; }
        public void setCo2OrResourceNote(String co2OrResourceNote) { this.co2OrResourceNote = co2OrResourceNote; }

        public String getDecompositionTimeEstimate() { return decompositionTimeEstimate; }
        public void setDecompositionTimeEstimate(String decompositionTimeEstimate) { this.decompositionTimeEstimate = decompositionTimeEstimate; }
    }

    public static class Verification {
        @JsonProperty("checked_by")
        private String checkedBy;
        private String agreement; // "agree" | "disagree" | "unavailable"
        private String note;

        public Verification() {}
        public Verification(String checkedBy, String agreement, String note) {
            this.checkedBy = checkedBy;
            this.agreement = agreement;
            this.note = note;
        }

        public String getCheckedBy() { return checkedBy; }
        public void setCheckedBy(String checkedBy) { this.checkedBy = checkedBy; }

        public String getAgreement() { return agreement; }
        public void setAgreement(String agreement) { this.agreement = agreement; }

        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }

    public WasteAnalysisResponse() {}

    public WasteAnalysisResponse(String item, String category, String bin, double confidence,
                                 String disposalAction, String sustainabilityTip, String reason, String uncertainty) {
        this.item = item;
        this.category = category;
        this.bin = bin;
        this.confidence = confidence;
        this.disposalAction = disposalAction;
        this.sustainabilityTip = sustainabilityTip;
        this.reason = reason;
        this.uncertainty = uncertainty;
    }

    public WasteAnalysisResponse(String item, String category, String bin, double confidence,
                                 String disposalAction, String sustainabilityTip, String reason, String uncertainty,
                                 String source) {
        this(item, category, bin, confidence, disposalAction, sustainabilityTip, reason, uncertainty);
        this.source = source;
    }

    public String getItem() { return item; }
    public void setItem(String item) { this.item = item; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBin() { return bin; }
    public void setBin(String bin) { this.bin = bin; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public String getDisposalAction() { return disposalAction; }
    public void setDisposalAction(String disposalAction) { this.disposalAction = disposalAction; }

    public String getSustainabilityTip() { return sustainabilityTip; }
    public void setSustainabilityTip(String sustainabilityTip) { this.sustainabilityTip = sustainabilityTip; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getUncertainty() { return uncertainty; }
    public void setUncertainty(String uncertainty) { this.uncertainty = uncertainty; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public List<MaterialBreakdown> getMaterialBreakdown() { return materialBreakdown; }
    public void setMaterialBreakdown(List<MaterialBreakdown> materialBreakdown) { this.materialBreakdown = materialBreakdown; }

    public List<AlternativeCategory> getAlternativeCategoriesConsidered() { return alternativeCategoriesConsidered; }
    public void setAlternativeCategoriesConsidered(List<AlternativeCategory> alternativeCategoriesConsidered) { this.alternativeCategoriesConsidered = alternativeCategoriesConsidered; }

    public List<String> getDisposalSteps() { return disposalSteps; }
    public void setDisposalSteps(List<String> disposalSteps) { this.disposalSteps = disposalSteps; }

    public EnvironmentalImpact getEnvironmentalImpact() { return environmentalImpact; }
    public void setEnvironmentalImpact(EnvironmentalImpact environmentalImpact) { this.environmentalImpact = environmentalImpact; }

    public String getImageQualityNote() { return imageQualityNote; }
    public void setImageQualityNote(String imageQualityNote) { this.imageQualityNote = imageQualityNote; }

    public Verification getVerification() { return verification; }
    public void setVerification(Verification verification) { this.verification = verification; }
}
