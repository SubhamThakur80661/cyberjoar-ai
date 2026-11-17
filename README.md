# Cyberjoar AI — Intelligence Map & Electoral Analytics

Assignment submission — OC.41335.2026.59218

Two dashboards in one app:

- **Intelligence map (PS1).** Reports from open sources, field teams and imagery, plotted on a Leaflet map. Click a marker to read the full report, filter by source, or drop in your own CSV, JSON or images to add to the map.
- **Electoral analytics (PS5).** Candidates in a constituency, scored across six factors. Move the weights or pick a turnout scenario and the win probabilities update.

Everything runs on demo data. No backend, no API keys.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview the build
```

## How it's put together

```
cyberjoar-ai/
├── index.html
├── package.json
├── src/
│   ├── main.js                    # router, toasts, app bootstrap
│   ├── components/
│   │   ├── sidebar.js             # navigation sidebar
│   │   └── icons.js               # inline SVG icons
│   ├── pages/
│   │   ├── home.js                # landing page
│   │   ├── intelligence-dashboard.js   # PS1 — map dashboard
│   │   └── electoral-analytics.js      # PS5 — electoral dashboard
│   ├── styles/
│   │   ├── globals.css            # tokens, sidebar, buttons, toasts
│   │   ├── home.css               # landing page
│   │   ├── ps1-dashboard.css      # map dashboard
│   │   └── ps5-electoral.css      # electoral dashboard
│   └── utils/
│       ├── demo-data.js           # demo reports and constituencies
│       ├── data-parser.js         # CSV / JSON / image upload parsing
│       └── scoring-engine.js      # win-probability calculation
└── public/
    └── favicon.svg
```

## The map

Leaflet with OpenStreetMap standard tiles — no API key needed. (CARTO tiles used to be the basemap; they now need an API key and show a watermark, so they were swapped out. Don't put them back.)

Markers are coloured by source: OSINT green, HUMINT blue, IMINT red. Uploaded files without coordinates get placed somewhere in India so they still show up.

## The win-probability model

```
score = Σ(weight × factor score) / Σ(weight × 100) × 100

Low turnout:  incumbent +5, everyone else -2
High turnout: incumbent -3, everyone else +4

Win probability = adjusted score / total of all adjusted scores × 100
```

Factors: incumbency, party strength, past work, personal base, caste/religious base, digital sentiment. Weights are normalised, so they don't need to add up to 100.

## Demo data

- 6 OSINT reports (Lucknow, Delhi, Mumbai, Bangalore, Chennai, Hyderabad)
- 4 HUMINT field reports (Jaipur, Kolkata, Pune, Ahmedabad)
- 3 IMINT captures (Kashmir, Rajasthan, Visakhapatnam)
- 2 constituencies (Lucknow, Varanasi) with 3–4 candidates each

## Tech

Vite, Leaflet + OpenStreetMap, Chart.js, PapaParse, vanilla JS and CSS. Fonts: Inter + JetBrains Mono.

## Deploy

```bash
npm run build
npx vercel --prod
```

The live site deploys from `main` on Vercel automatically.

## License

Built for the Cyberjoar AI assignment — April 2026.
