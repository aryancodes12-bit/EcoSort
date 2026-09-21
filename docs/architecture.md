# EcoSort AI — System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    User Client Browser                      │
│                                                             │
│  [ React 18 + Vite + Modern Eco-Tech Glassmorphism UI ]     │
│  - Drag & Drop Upload / Webcam Capture                      │
│  - 5 Interactive Demo Test Presets                          │
│  - Realtime Scanning Indicator                              │
│  - Structured Result Visualizer                             │
│  - Responsible AI Transparency Modal                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
            HTTPS Multipart / JSON REST Request
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             EcoSort Backend (Spring Boot 3 REST API)        │
│                                                             │
│  [ WasteAnalysisController ]                                │
│    ├── POST /api/analyze                                    │
│    └── GET  /api/health                                     │
│                                                             │
│  [ GeminiAiService ]                                        │
│    ├── File & Base64 Payload Validator                      │
│    ├── System Prompt Injection                              │
│    ├── Gemini Multimodal Vision API Client                  │
│    └── Strict JSON Response Deserializer                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                 Encrypted API Call (SSL)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Google Gemini Multimodal AI                  │
│  - Visual Feature Extraction                                │
│  - Object & Material Identification                         │
│  - Uncertainty & Mixed Waste Reasoner                       │
│  - Structured JSON Response Generation                      │
└─────────────────────────────────────────────────────────────┘
```

## Security & Privacy Boundary
- API keys reside securely on the backend / server environment variables.
- Uploaded user images are processed in-memory as ephemeral byte streams and never persisted to disk or databases without user consent.
