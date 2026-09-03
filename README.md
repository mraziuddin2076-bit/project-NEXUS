# 🏰 Project Watchtower — AI-Powered Multi-Project Monitoring Platform

> **Winner-tier hackathon project** — A fully local web app that monitors multiple projects, predicts delays, detects resource clashes, and simulates "what-if" scenarios — all running in your browser with zero external APIs.

[![🚀 Live Demo](https://img.shields.io/badge/Live%20Demo-Deployed-brightgreen?style=for-the-badge)](https://mraziuddin2076-bit.github.io/project-NEXUS/)
[![ 💻 GitHub](https://img.shields.io/badge/GitHub-Repo-blue?logo=github&style=for-the-badge)](https://github.com/mraziuddin2076-bit/project-monitor)
[![ MIT License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](#)
[![ React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&style=for-the-badge)](#)
[![ Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&style=for-the-badge)](#)

## 🚀 Demo Screenshots

### 🎨 Hero Dashboard
![Dashboard](https://via.placeholder.com/800x400/1e293b/ffffff?text=AI-Powered+Dashboard)
- At-a-glance project overview with live health scores
- Trend visualization and key metrics at a glance
- Interactive feature showcase

### 📊 Project Detail View
When you click any project you see:
- **Schedule**: Start date, deadline, work done vs pending
- **Timeline (Gantt)**: Visual task breakdown with critical path highlighting
- **Completion Confidence**: Monte Carlo confidence intervals (50% / 80% / 95%)
- **Delay Analysis**: Root causes with auto-generated reasoning
- **Time-Bomb Warnings**: Animated alerts for critical dates
- **Recovery Opportunities**: Suggestions to protect the deadline
- **Team Allocation**: Per-member workload utilization

### 🎯 What-If Simulator
![What-If](https://via.placeholder.com/800x400/1e293b/ffffff?text=What-If+Simulator)
- Modify any task duration or start date
- See cascading impact on the entire project timeline
- Monte Carlo re-simulation with updated confidence intervals
- Visual comparison before/after

### ⏳ Queue Manager
- Priority-based project queue
- Auto-sorted by priority score
- Schedule simulation for sequential execution
- Start projects with one click

## Tech Stack

- **React 18** + **Vite** (blazing-fast dev server & build)
- **TailwindCSS** with custom glassmorphic dark tech design system
- **Pure JS AI Engine** — Monte Carlo simulation, Critical Path Method (CPM), heuristic-based risk analysis
- **Zero external APIs** — all computation runs locally in the browser

## Quick Start

## 🛠️ Quick Start

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

## ⭐ Why Project Watchtower Stands Out

| Feature | This Project | Competitors |
|---------|-------------|-------------|
| **No External APIs** | ✅ 100% client-side | ❌ Requires backend/API |
| **Monte Carlo Simulation** | ✅ 1000 trials | ❌ Basic estimates |
| **Critical Path Method** | ✅ Full CPM analysis | ❌ No CPM |
| **Resource Clash Detection** | ✅ Cross-project | ❌ Per-project only |
| **What-If Simulator** | ✅ Interactive, with re-simulation | ❌ Static estimates |
| **Transparent AI** | ✅ Shows reasoning | ❌ Black box |
| **Manual Override** | ✅ Edit AI recommendations | ❌ No override |
| **Priority Queue** | ✅ User-defined ordering | ❌ FIFO or auto-only |
| **Time-Bomb Warnings** | ✅ Animated critical dates | ❌ No proactive alerts |

## 🔬 Tech Stack

- **React 18** + **Vite 5** — Lightning-fast build & dev experience
- **TailwindCSS 3** — Modern glassmorphic dark tech design system
- **Pure JS AI Engine** — Monte Carlo simulation, Critical Path Method (CPM), heuristic-based risk analysis
- **SVG-Based Health Gauges** — Interactive radial progress indicators
- **LocalStorage** — Persistent browser storage (no database)
- **Zero external dependencies** — Runs entirely offline

## 🚀 Live Demo

Experience the platform: https://mraziuddin2076-bit.github.io/project-NEXUS/

## 📦 Deployment

```bash
npm run github-deploy
```

## 📄 License

MIT — Built for hackathon purposes
