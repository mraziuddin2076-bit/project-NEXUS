# Project Watchtower — AI-Powered Multi-Project Monitoring Platform

**A fully local web app that monitors multiple projects, predicts delays, detects resource clashes, and simulates "what-if" scenarios — all running in your browser with zero external APIs.**

## 🌟 Key Features

| Feature | What You Get |
|---------|--------------|
| **Project Dashboard** | Visual grid of all projects (Running / Queued / Completed / Delayed / On Hold) with health scores, completion %, and estimated finish dates |
| **Health Score (0-100)** | Real-time scoring based on deadline proximity, budget burn, velocity, and risk factors |
| **Delay Prediction** | Monte Carlo simulation (1000 trials) predicts completion confidence — with root-cause analysis |
| **Time-Bomb Warnings** | Animated alerts for critical future dates when risks materialize |
| **Resource Clash Detection** | Cross-project overallocation detection with actionable suggestions |
| **What-If Simulator** | Drag sliders to delay tasks → see cascading impact on project timelines instantly |
| **Priority Queue Manager** | Auto-prioritized project queue with schedule simulation |
| **Task Gantt Timeline** | Visual timeline showing critical path, dependencies, and progress bars |
| **Offline-First** | Works entirely from a single HTML file — no backend, no database, no API calls |

## Screenshots

### Dashboard — At-a-Glance Project Overview
All projects displayed in a modern glassmorphic dashboard with completion %, health gauges, and countdown timers. Clicking any project opens its detailed view.

### Project Detail — Full Metrics
When you click a project you see:
- **Schedule**: Start date, deadline, work done vs pending
- **Timeline (Gantt)**: Visual task breakdown with critical path highlighting
- **Completion Confidence**: Monte Carlo confidence intervals (50% / 80% / 95%)
- **Delay Analysis**: Root causes of any delays
- **Time-Bomb Warnings**: Animated alerts for critical dates
- **Recovery Opportunities**: Suggestions to protect the deadline
- **Team Allocation**: Per-member workload utilization

## Tech Stack

- **React 18** + **Vite** (blazing-fast dev server & build)
- **TailwindCSS** with custom glassmorphic dark tech design system
- **Pure JS AI Engine** — Monte Carlo simulation, Critical Path Method (CPM), heuristic-based risk analysis
- **Zero external APIs** — all computation runs locally in the browser

## Quick Start

### Run Locally
```bash
cd project-monitor
npm install
npm run dev
# Open http://localhost:5173
```

### Production Build
```bash
npm run build
npx serve dist -l 4173
# Open http://localhost:4173
```

### Run from a Single File (Offline)
```bash
npm run build
# Open dist/index.html directly in any browser — works offline!
```

## Live Demo

https://mraziuddin2076-bit.github.io/project-NEXUS

## Deploy to GitHub Pages

```bash
npm run github-deploy
```

## License

MIT
