# 🛡️ CYBERJOAR AI — Strategic Intelligence & Analytics Platform

> **Assignment Submission** — OC.41335.2026.59218  
> Multi-Source Intelligence Fusion Dashboard & Predictive Electoral Analytics Matrix

---

## 🎯 Problem Statements Addressed

### PS1: Intelligence & Data Fusion Dashboard
A geospatial intelligence fusion platform that ingests data from multiple sources (OSINT, HUMINT, IMINT), plots them as interactive markers on a terrain map, and provides hover-and-view functionality for instant visual confirmation.

**Key Features:**
- 🗺️ Interactive Leaflet.js map with dark terrain tiles
- 📡 Multi-source data ingestion (MongoDB, S3, REST API simulation)
- 📁 Drag-and-drop file upload (CSV, JSON, Images)
- 🟢🔵🔴 Color-coded markers per intelligence type
- 🔍 Hover popups with metadata, confidence scores, and imagery
- ⚡ Real-time layer toggle filters (OSINT/HUMINT/IMINT)
- 🔄 Pulsing animation for active data points

### PS5: Electoral Analytics Matrix
A predictive political strategy matrix that compares candidates across multiple weighted factors with real-time Probability of Win (PoW) forecasting and turnout scenario simulation.

**Key Features:**
- 👤 Interactive candidate profile cards with score bars
- ⚖️ Configurable weight sliders for 6 scoring factors
- 📊 Radar chart for multi-factor comparison
- 📉 Bar chart for factor-by-factor breakdown
- 🎯 PoW donut chart with normalized probabilities
- 📋 Detailed comparison matrix table
- 🗳️ Turnout scenario simulator (Low/Medium/High)
- 🧠 Transparent algorithm logic documentation

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Build Tool | Vite | Fast HMR, instant dev server |
| Maps | Leaflet.js + CARTO Tiles | Interactive geospatial visualization |
| Charts | Chart.js | Radar, Bar, Doughnut charts |
| File Parsing | PapaParse | CSV/JSON data ingestion |
| Styling | Vanilla CSS | Glassmorphism dark mode design system |
| Typography | Inter + JetBrains Mono | Premium UI fonts |
| Language | Vanilla JavaScript (ES Modules) | Zero framework overhead |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📐 Project Structure

```
cyberjoar-ai/
├── index.html                          # Entry HTML
├── package.json
├── src/
│   ├── main.js                         # Router & app bootstrap
│   ├── styles/
│   │   ├── globals.css                 # Design system tokens & base styles
│   │   ├── ps1-dashboard.css           # Intelligence dashboard styles
│   │   └── ps5-electoral.css           # Electoral analytics styles
│   ├── pages/
│   │   ├── home.js                     # Landing / Command Center
│   │   ├── intelligence-dashboard.js   # PS1 module
│   │   └── electoral-analytics.js      # PS5 module
│   ├── components/
│   │   └── sidebar.js                  # Navigation sidebar
│   └── utils/
│       ├── demo-data.js                # Realistic demo datasets
│       ├── data-parser.js              # CSV/JSON/Image parsing
│       └── scoring-engine.js           # PoW calculation engine
└── public/
    └── favicon.svg
```

---

## 🧮 Algorithms & Logic

### PS1: Intelligence Marker Classification
```
MarkerType = f(source):
  if source ∈ {MongoDB, S3, API}   → OSINT (🟢 Green)
  if source ∈ {CSV, JSON, Excel}   → HUMINT (🔵 Blue)
  if source ∈ {JPG, JPEG, PNG}     → IMINT (🔴 Red)
```

### PS5: Probability of Win (PoW) Model
```
PoW(candidate) = Σ(weight_i × score_i) / Σ(weight_i × max_score_i) × 100

Factors = [Incumbency, PartyStrength, PastWork, PersonalBase, CasteReligion, Sentiment]

Turnout Adjustment:
  Low Turnout  → Incumbent +5%, Challenger -2%
  High Turnout → Incumbent -3%, Challenger +4%

Final PoW is normalized across all candidates to sum to ~100%
```

---

## 📊 Demo Data

The platform comes pre-loaded with realistic demo data:
- **6 OSINT data points** across major Indian cities (Lucknow, Delhi, Mumbai, Bangalore, Chennai, Hyderabad)
- **4 HUMINT field reports** (Jaipur, Kolkata, Pune, Ahmedabad)
- **3 IMINT satellite/drone captures** (Kashmir, Rajasthan, Visakhapatnam)
- **2 constituencies** (Lucknow, Varanasi) with **3-4 candidates each**

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

### Netlify
```bash
npm run build
# Deploy the `dist/` directory
```

---

## 📝 License

Built for CYBERJOAR AI Assignment — April 2026
