import React, { useState, useEffect } from "react";
import { analyzeAllProjects } from "./engine.js";
import { projects as sampleProjects, tasks as sampleTasks, taskProgress } from "./data/sample.js";
import { ProjectGrid } from "./components/ProjectGrid.jsx";
import { QueueManager } from "./components/QueueManager.jsx";
import { WhatIfSimulator } from "./components/WhatIfSimulator.jsx";
import { StatsBar } from "./components/StatsBar.jsx";
import { ProjectDetail } from "./components/ProjectDetail.jsx";
import { ResourceClashPanel } from "./components/ResourceClashPanel.jsx";
import { HeroSection } from "./components/HeroSection.jsx";
import { TrendChart } from "./components/TrendChart.jsx";

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState("dashboard");
  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    const result = analyzeAllProjects(sampleProjects, sampleTasks, taskProgress);
    setAnalysis(result);
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/20">
              <div className="absolute inset-0 border-2 border-indigo-400/30 rounded-3xl animate-spin-slow" style={{ animationDuration: '8s' }} />
              <span className="text-3xl font-bold text-white relative z-10">PW</span>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-blue-600/20 rounded-full blur-2xl opacity-70" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mb-2">
            Initializing Project Watchtower
          </h2>
          <p className="text-sm text-gray-400 mb-6">Running Monte Carlo simulations &amp; critical path analysis</p>
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            <span>Analyzing 6 projects, 24 tasks, 6 team members</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100">
      {/* Header */}
      <header className="glass border-b border-gray-800 px-6 py-4 position-sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-xl font-bold text-white">PW</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400">
                Project Watchtower
              </h1>
              <p className="text-xs text-gray-500">AI-Powered Multi-Project Monitoring Platform</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => { setView("dashboard"); setSelectedProject(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                view === "dashboard"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setView("queue")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                view === "queue"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              Queue Manager
            </button>
            <button
              onClick={() => { setView("dashboard"); setSelectedProject(null); window.location.reload(); }}
              className="px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
              title="Refresh data"
            >
              🔄
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      {/* Hero Section - shown on dashboard */}
      {view === "dashboard" && showHero && (
        <HeroSection analysis={analysis} onGetStarted={() => setShowHero(false)} />
      )}

      {/* Trend Chart - shown after hero */}
      {view === "dashboard" && analysis && (
        <TrendChart projects={analysis.projects} />
      )}

      <main className="p-6 max-w-7xl mx-auto">
        {view === "dashboard" && (
          <>
            <StatsBar stats={analysis.stats} />
            <ResourceClashPanel clashes={analysis.resourceClashes} />
            <ProjectGrid
              projects={analysis.projects}
              onProjectClick={(p) => { setSelectedProject(p); setView("detail"); }}
              analysis={analysis}
            />
          </>
        )}

        {view === "queue" && (
          <QueueManager
            projects={analysis.projects}
            queueOrder={analysis.queueOrder}
            analysis={analysis}
            onBack={() => setView("dashboard")}
          />
        )}

        {view === "detail" && selectedProject && (
          <ProjectDetail
            projectData={selectedProject}
            analysis={analysis}
            onBack={() => setView("dashboard")}
            onWhatIf={() => setView("whatif")}
          />
        )}

        {view === "whatif" && selectedProject && (
          <WhatIfSimulator
            projectData={selectedProject}
            allTasks={sampleTasks}
            taskProgress={taskProgress}
            onBack={() => setView("detail")}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-3 mt-auto">
        <p className="text-xs text-gray-500 text-center">
          Project Watchtower — Local AI Engine (Monte Carlo + CPM). No external APIs.
        </p>
      </footer>
    </div>
  );
}

export default App;
