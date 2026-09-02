import React from "react";
import { HealthGauge } from "./HealthGauge.jsx";

export function ProjectCard({ projectData, onClick }) {
  const { project, completionPct, healthScore, estimatedCompletion, delayInfo, timeBombs, recoveryOpportunities, criticalPath, simulation } = projectData;

  const statusLabels = {
    running: "Running", queued: "Queued", completed: "Completed",
    delayed: "Delayed", "on-hold": "On Hold"
  };

  const budget = project.budget || { total: 0, spent: 0 };
  const budgetPct = budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0;
  const budgetStatus = budgetPct > 90 ? "text-red-400" : budgetPct > 70 ? "text-amber-400" : "text-green-400";

  const statusClass = {
    running: "status-running", queued: "status-queued", completed: "status-completed",
    delayed: "status-delayed", "on-hold": "status-onhold"
  }[project.status] || "status-running";

  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-6 cursor-pointer card-hover group transition-smooth border ${
        delayInfo.isDelayed ? "border-red-500/30" :
        project.status === "queued" ? "border-amber-500/20" :
        "border-gray-700"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`status-badge ${statusClass}`}>{statusLabels[project.status]}</span>
            {project.priority && (
              <span className="text-xs px-2 py-0.5 bg-gray-800/50 text-gray-300 rounded">
                Priority #{project.priority}
              </span>
            )}
            {delayInfo.isDelayed && (
              <span className="text-xs px-2 py-0.5 bg-red-900/30 text-red-300 rounded animate-pulse-slow">
                ⚠️ Delayed
              </span>
            )}
          </div>
          <h3 className="font-bold text-xl text-white group-hover:text-indigo-300 transition-colors mb-1">
            {project.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
        </div>
        <HealthGauge score={healthScore} size={90} />
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-400">Completion</span>
          <span className="font-medium text-white">{completionPct}%</span>
        </div>
        <div className="relative h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${completionPct}%`,
              background: `linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)`,
            }}
          />
        </div>
      </div>

      {/* Estimated Completion & Delay Warning */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="text-gray-400">Est. Completion: {estimatedCompletion}</span>
        {delayInfo.isDelayed && delayInfo.reasons.length > 0 && (
          <span
            className="text-red-400 text-right max-w-[200px] truncate"
            title={delayInfo.reasons.join("; ")}
          >
            ⚠️ {delayInfo.reasons[0].split("→")[1]?.split(".")[0]?.trim() || "Delay risk"}
          </span>
        )}
      </div>

      {/* Budget Burn */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        <span className="text-gray-500">Budget: ${budget.spent.toLocaleString()} / ${budget.total.toLocaleString()}</span>
        <span className={budgetStatus}>({budgetPct}%)</span>
      </div>

      {/* Time Bombs */}
      {timeBombs.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-medium text-red-400">🕐 Time-Bomb Warnings</span>
          </div>
          {timeBombs.slice(0, 2).map((bomb, i) => (
            <div key={i} className="text-xs text-gray-400 pl-2 border-l-2 border-red-900/30 mb-1">
              <span className="font-medium">{bomb.label}</span>: {bomb.description}
            </div>
          ))}
        </div>
      )}

      {/* Recovery Opportunities */}
      {recoveryOpportunities.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-medium text-amber-400">💡 Recovery Opportunities</span>
          </div>
          {recoveryOpportunities.slice(0, 1).map((opp, i) => (
            <div key={i} className="text-xs text-gray-400 pl-2 border-l-2 border-amber-900/30">
              {opp.type === "realloc"
                ? `${opp.member} overallocated — ${opp.reason}`
                : `${opp.taskName}: ${opp.reason}`}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-800 text-xs text-gray-500">
        <span>Critical Path: {criticalPath.length} tasks</span>
        <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Click to analyze →
        </span>
      </div>
    </div>
  );
}
