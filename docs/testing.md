# EcoSort AI — Test Cases & Validation Protocol

The project includes 5 standardized test scenarios for demonstration, PPT screenshots, and academic evaluation:

| Test Case | Sample Waste Item | Expected Category | Expected Bin | Responsible AI Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Test 1** | 🧴 Plastic Water Bottle | `Recyclable/Dry` | Blue Recycling Bin | Detects PET; advises emptying & rinsing |
| **Test 2** | 🍌 Banana Peel | `Organic/Wet` | Green Compost Bin | Identifies organic matter; recommends composting |
| **Test 3** | 📦 Corrugated Cardboard | `Recyclable/Dry` | Blue Dry Bin | Recommends flattening to save bin volume |
| **Test 4** | 🔋 Alkaline Battery | `Hazardous/Special` | Red / E-waste Bin | Warns against landfill disposal; links to e-waste deposit |
| **Test 5** | 🥤 Mixed Food + Packaging | `Unknown/Uncertain` | Separation Required | **Demonstrates Abstention**: flags mixed materials |
