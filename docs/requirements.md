# EcoSort AI — Product Requirements

## Functional Requirements

### FR-01 — Landing Page
The application displays:
- Product title and tagline
- Clear value proposition aligned with SDG 12
- Primary CTA to upload/capture waste
- Interactive Demo Cases for fast evaluation
- Responsible AI overview and modal trigger

### FR-02 — Image Input
- Drag and drop file upload (PNG, JPG, JPEG, WEBP)
- File selection dialog
- Live webcam photo capture
- Real-time preview with remove/replace capability

### FR-03 — AI Analysis
Sends the image to the multimodal AI pipeline to determine:
- Specific item name
- Physical material composition
- Waste category (Organic, Recyclable, General, Hazardous, Unknown)
- Recommended bin and color code
- Disposal step-by-step action
- Sustainability impact tip
- Calibrated confidence and reasoning

### FR-04 — Structured Response Schema
```json
{
  "item": "Plastic water bottle",
  "category": "Recyclable/Dry",
  "bin": "Dry Waste / Recycling (Blue)",
  "confidence": 0.94,
  "disposal_action": "Empty, rinse and crush before placing in the recyclable waste bin.",
  "sustainability_tip": "Recycling PET plastic saves up to 70% of the energy needed for virgin plastic.",
  "reason": "Clear PET plastic bottle with visible recyclable polymer characteristics.",
  "uncertainty": ""
}
```

### FR-05 — Uncertainty & Mixed Waste Handling
- If multiple items are detected or the image is ambiguous, the system flags `Unknown/Uncertain` or `Mixed Waste` and asks the user to separate components rather than guessing.

### FR-06 — Responsible AI Transparency
- Clear disclaimer that recommendations serve as decision-support guidance and should be verified against municipal/campus guidelines.
