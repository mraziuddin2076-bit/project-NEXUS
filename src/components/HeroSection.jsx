import React from "react";
import { formatDate } from "../engine.js";

export function HeroSection({ analysis, onGetStarted }) {
  const { stats, resourceClashes } = analysis;
  const delayedProjects = analysis.projects.filter((p) => p.delayInfo?.isDelayed);
  const runningProjects = analysis.projects.filter((p) => p.project.status === "running");
  const avgHealth = Math.round(
    analysis.projects.reduce((sum, p) => sum + p.healthScore, 0) / analysis.projects.length
  );

  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Insights",
      desc: "Monte Carlo simulations & Critical Path Method predict risks before they happen",
    },
    {
      icon: "⚡",
      title: "Real-time Monitoring",
      desc: "Live health scores, budget burn, and team workload tracking",
    },
    {
      icon: "🎯",
      title: "What-If Simulator",
      desc: "Test changes and see cascading impact on entire project timelines",
    },
    {
      icon: "⏳",
      title: "Priority Queue",
      desc: "Auto-prioritized project queue with schedule simulation",
    },
    {
      icon: "📊",
      title: "Resource Intelligence",
      desc: `${resourceClashes.length} clash${resourceClashes.length !== 1 ? 'es' : ''} detected across ${stats.total} projects`,
    },
    {
      icon: "🔮",
      title: "Zero External APIs",
      desc: "All computation runs locally in your browser — no backend required",
    },
  ];

  return (
    <div className="relative mb-8 overflow-hidden">
      {/* Gradient background orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-indigo-600/30 to-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl" />

      <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden border border-indigo-500/20">
        {/* Animated grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#3b82f6_1px,transparent_0)] [background-size:20px_20px] opacity-10" />

        <div className="relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 mb-2">
                Project Watchtower
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                AI-Powered multi-project monitoring platform. Track progress, predict delays,
                detect resource conflicts, and simulate "what-if" scenarios — all running locally.
              </p>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <span>Explore Dashboard</span>
              <span>→</span>
            </button>
          </div>

          {/* Key metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon="📁"
              label="Active Projects"
              value={stats.running + stats.delayed}
              gradient="from-indigo-500 to-blue-500"
            />
            <MetricCard
              icon="🏥"
              label="Avg Health"
              value={`${avgHealth}/100`}
              gradient={avgHealth >= 70 ? "from-green-500 to-emerald-400" : avgHealth >= 40 ? "from-amber-500 to-orange-400" : "from-red-500 to-pink-500"}
            />
            <MetricCard
              icon="⚠️"
              label="At Risk"
              value={delayedProjects.length}
              gradient="from-amber-500 to-orange-500"
            />
            <MetricCard
              icon="⏱️"
              label="Avg Days Left"
              value={Math.round(runningProjects.reduce((sum, p) => sum + (p.daysRemaining || 0), 0) / Math.max(1, runningProjects.length))}
              gradient="from-purple-500 to-violet-500"
            />
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, gradient }) {
  return (
    <div className="bg-gray-800/40 rounded-xl p-4 text-center border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</div>
      <div className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient} mb-0.5`}>
        {value}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 group">
      <div className="flex items-start gap-3">
        <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
        <div>
          <h4 className="font-semibold text-white mb-0.5 group-hover:text-indigo-300 transition-colors">{title}</h4>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
    </div>
  );
}
