# Project Watchtower

**AI-Powered Multi-Project Monitoring Platform** — runs entirely client-side, no external APIs required.

## Features
- **Multi-Project Tracking** — Dashboard for all projects with status badges, priority, health scores, and completion %
- **AI Engine (Local)** — Monte Carlo simulation, Critical Path Method (CPM), resource clash detection
- **Project Health Score (0-100)** — Real-time scoring based on deadline proximity, budget burn, velocity, and risk
- **Delay Prediction & Reasons** — Auto-detects delays and identifies root causes (critical path stalls, dependency blocks, overallocation)
- **Time-Bomb Warnings** — Animated countdowns for critical future risk dates
- **What-If Simulator** — Adjust any task's duration/start date and see cascading impact on the project timeline
- **Priority Queue Manager** — Auto-prioritized project queue with schedule simulation
- **Resource Clash Detector** — Cross-project overallocation detection with recommendations
- **Recovery Opportunity Finder** — Suggests non-critical task delays and reallocation strategies

## Tech Stack
- React 18 + Vite
- TailwindCSS (glassmorphic dark design)
- Pure JS engine — no external APIs, no backend, no database

## Quick Start

### Option 1: Run Locally
```bash
cd project-monitor
npm install
npm run dev
# Open http://localhost:5173
```

### Option 2: Run the Production Build
```bash
cd project-monitor
npm install
npm run build
npx serve dist -l 4173
# Open http://localhost:4173
```

### Option 3: Just Open the HTML File
```bash
cd project-monitor
npm run build
# Open dist/index.html directly in any browser
```

## Deployment (GitHub Pages)

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Set source to `Deploy from a branch` → `gh-pages` branch
4. Or use the automated script:
```bash
npm run github-deploy
```

## License
MIT
