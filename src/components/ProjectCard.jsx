import React from "react";
import { HealthGauge } from "./HealthGauge.jsx";
import { formatDate, daysBetween, today } from "../engine.js";

export function ProjectCard({ projectData, onClick }) {
  const {
    project,
    completionPct,
    healthScore,
    estimatedCompletion,
    delayInfo,
    timeBombs,
    recoveryOpportunities,
    criticalPath,
    daysRemaining,
    daysFromStart,
    totalDuration,
    totalEffort,
    doneEffort,
  } = projectData;

  const statusLabels = {
    running: "Running", queued: "Queued", completed: "Completed",
    delayed: "Delayed", "on-hold": "On Hold"
  };

  const statusIcons = {
    running: "🚀", queued: "⏳", completed: "✅", delayed: "⚠️", "on-hold": "⏸️"
  };

  const budget = project.budget || { total: 0, spent: 0 };
  const budgetPct = budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0;

  const statusClass = {
    running: "status-running", queued: "status-queued", completed: "status-completed",
    delayed: "status-delayed", "on-hold": "status-onhold"
  }[project.status] || "status-running";

  const healthColor = healthScore >= 70 ? "text-green-400" : healthScore >= 40 ? "text-amber-400" : "text-red-400";
  const progressColor = healthScore >= 70 ? "from-green-500 to-emerald-400" : healthScore >= 40 ? "from-amber-500 to-orange-400" : "from-red-500 to-pink-500";

  // Calculate elapsed days
  const elapsedPct = totalDuration > 0 ? Math.min(100, Math.round((daysFromStart / totalDuration) * 100)) : 0;

  return (
    <div
      onClick={onClick}
      className={`glass rounded-3xl p-6 cursor-pointer card-hover group transition-smooth border ${
        delayInfo.isDelayed ? "border-red-500/30" :
        project.status === "queued" ? "border-amber-500/20" :
        "border-gray-800"
      }`}
    >
      {/* Header with Status & Priority */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`status-badge ${statusClass}`}>
              <span className="text-xs">{statusIcons[project.status]}</span>
              {statusLabels[project.status]}
            </span>
            {project.priority && (
              <span className="text-xs px-2.5 py-1 bg-gray-800/50 text-gray-300 rounded-full font-medium">
                🔥 Priority #{project.priority}
              </span>
            )}
            {delayInfo.isDelayed && (
              <span className="text-xs px-2.5 py-1 bg-red-900/30 text-red-300 rounded-full font-medium animate-pulse-slow">
                ⚠️ Delayed
              </span>
            )}
          </div>
          <h3 className="font-bold text-xl text-white group-hover:text-indigo-300 transition-colors mb-1 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <HealthGauge score={healthScore} size={80} />
        </div>
      </div>

      {/* Main Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-white">{completionPct}%</span>
            <span className={`text-sm font-medium ${healthColor}`}>
              {healthScore >= 70 ? "Healthy" : healthScore >= 40 ? "At Risk" : "Critical"}
            </span>
          </div>
          {daysRemaining !== undefined && daysRemaining > 0 && (
            <span className="text-sm text-gray-400">
              ⏱️ {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${progressColor}`}
            style={{ width: `${completionPct}%` }}
          />
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:12px_12px]" />
        </div>

        {/* Completion estimate */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{doneEffort} / {totalEffort} days of work</span>
          <span>Estimated finish: {estimatedCompletion}</span>
        </div>
      </div>

      {/* Timeline Bar (Days elapsed vs total) */}
      {totalDuration > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500">Timeline Progress</span>
            <span className="text-gray-400">{elapsedPct}% of schedule elapsed</span>
          </div>
          <div className="relative h-2 bg-gray-800/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gray-600 to-gray-700 rounded-full transition-all duration-300"
              style={{ width: `${elapsedPct}%` }}
            />
            {/* Current day marker */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-indigo-400 shadow-lg shadow-indigo-400/50 animate-pulse" />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Start: {formatDate(project.startDate)}</span>
            <span>End: {project.deadline || "TBD"}</span>
          </div>
        </div>
      )}

      {/* Budget Burn */}
      {budget.total > 0 && (
        <div className="flex items-center gap-3 mb-3 text-xs">
          <span className="text-gray-500">💰 Budget:</span>
          <span className="text-gray-300">${budget.spent.toLocaleString()} / ${budget.total.toLocaleString()}</span>
          <span className={budgetPct > 90 ? "text-red-400 font-medium" : budgetPct > 70 ? "text-amber-400" : "text-green-400"}>
            ({budgetPct}%)
          </span>
        </div>
      )}

      {/* Time Bombs (Critical Alerts) */}
      {timeBombs.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`text-sm font-medium ${timeBombs[0].severity === "high" ? "text-red-400 animate-bounce-gentle" : "text-amber-400"}`}>
              🕐 {timeBombs[0].label}
            </span>
          </div>
          <div className="text-xs text-gray-400 bg-gray-800/30 rounded-lg p-2">
            {timeBombs[0].description}
          </div>
        </div>
      )}

      {/* Recovery Opportunities */}
      {recoveryOpportunities.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-medium text-amber-400">💡 Opportunity</span>
          </div>
          <div className="text-xs text-gray-400 bg-gray-800/30 rounded-lg p-2">
            {recoveryOpportunities[0].type === "realloc"
              ? `${recoveryOpportunities[0].member} is overallocated — ${recoveryOpportunities[0].reason}`
              : `${recoveryOpportunities[0].taskName}: ${recoveryOpportunities[0].reason}`}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-800 text-xs text-gray-500">
        <span>⭐ Critical Path: {criticalPath.length} tasks</span>
        <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Click for details →
        </span>
      </div>
    </div>
  );
}
