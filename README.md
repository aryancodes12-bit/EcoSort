# ♻️ EcoSort AI — Smart Waste Segregation Assistant

> **Know your waste. Make the right choice.**  
> An AI-powered sustainability decision assistant aligning with **UN SDG 12 (Responsible Consumption & Production)**.

Developed for the **1M1B AI for Sustainability Virtual Internship** in collaboration with **IBM SkillsBuild and AICTE**.

---

## 🌟 Key Highlights
- 🧠 **Multimodal Vision AI**: Identifies waste items, analyzes composite physical material layers, classifies into appropriate streams, and provides ordered preparation steps.
- 🔬 **Richer Analysis & Explainability**: Surfaces material composition percentages, alternatives considered and rejected, step-by-step prep tasks, and realistic lifecycle environmental impact.
- 🛡️ **Real Second-Model Verification**: Employs an independent text-consistency pass via Groq (LLM review) to cross-check whether Gemini's classification and reasoning are logically consistent, labeling both models transparently.
- 🎯 **SDG 12 Alignment**: Targets responsible waste handling, recycling efficiency, and clean organic composting streams.
- ⚡ **Responsible AI by Design**: Implements transparency, source provenance badges (`gemini-live`, `demo-preset`, `fallback-no-key`, `fallback-error`), privacy-by-design (zero image retention), and abstention on mixed/uncertain waste.
- 📱 **Modern Eco-Tech Interface**: Responsive glassmorphic layout, Framer Motion staggered micro-animations, live webcam capture, file drag-and-drop, and animated scanning feedback.

---

## 🏗️ Architecture

```
User (Browser / Mobile)
       │
       ▼
React 18 + Vite Frontend (Eco-Tech Design + Framer Motion)
       │
       ▼ (REST API: /api/analyze or /api/analyze-base64)
Spring Boot 3 Backend
       │
       ├─────────────────────────────────────────┐
       ▼ (Pass 1: Vision Inference)              ▼ (Pass 2: Consistency Review)
Google Gemini Multimodal AI                Groq (Qwen LLM Text Review)
       │                                         │
       ▼                                         ▼
Extracted Materials, Disposal Steps,       Plausibility Verification Badge
Environmental Notes & Confidence           ("agree" | "disagree" | "unavailable")
       │                                         │
       └────────────────────┬────────────────────┘
                            ▼
              Richer Structured JSON Response
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Java JDK 17+ and Maven
- Gemini API Key (`GEMINI_API_KEY`)
- Groq API Key (`GROQ_API_KEY`)

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Backend Setup
```bash
cd backend
mvn spring-boot:run
```
The REST API will launch on [http://localhost:8080](http://localhost:8080).

---

## 📊 Standard Test Cases for Demonstration

1. **🧴 Plastic Bottle** → `Recyclable/Dry` (Blue Bin) — Advises rinsing and crushing; shows PET / PP breakdown.
2. **🍌 Banana Peel** → `Organic/Wet` (Green Bin) — Recommends aerobic composting; highlights methane prevention.
3. **📦 Cardboard Box** → `Recyclable/Dry` (Blue Bin) — Advises flattening and keeping dry.
4. **🔋 Battery** → `Hazardous/Special` (Red/E-Waste Bin) — Warns against landfill disposal; explains heavy metal risk.
5. **🥤 Mixed Food & Plastic** → `Unknown/Uncertain` — Demonstrates responsible AI refusal to guess on composite unsegregated streams.

---

## 📜 License
MIT License. Built for the 1M1B AI for Sustainability Virtual Internship.
