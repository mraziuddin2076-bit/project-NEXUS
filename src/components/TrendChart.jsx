import React from "react";

export function TrendChart({ projects }) {
  // Filter to only projects with meaningful data
  const chartProjects = projects
    .filter((p) => p.project.status !== "completed")
    .slice(0, 6);

  if (chartProjects.length === 0) return null;

  return (
    <div className="glass rounded-3xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-indigo-300">📊 Project Trend Overview</h3>
        <div className="text-xs text-gray-500">
          Shows health distribution across active projects
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Health Distribution Bars */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Health Distribution</h4>
          <div className="space-y-3">
            {chartProjects.map((p) => {
              const healthColor = p.healthScore >= 70 ? "bg-green-400" : p.healthScore >= 40 ? "bg-amber-400" : "bg-red-400";
              const statusIcon = p.project.status === "running" ? "🚀" : p.project.status === "delayed" ? "⚠️" : p.project.status === "queued" ? "⏳" : "⏸️";

              return (
                <div key={p.project.id} className="space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{statusIcon}</span>
                      <span className="text-sm font-medium text-gray-300 truncate max-w-[140px]">
                        {p.project.name}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `rgba(${p.healthScore >= 70 ? "74,222,128" : p.healthScore >= 40 ? "251,191,36" : "248,113,113"}, 0.2)`,
                          color: p.healthScore >= 70 ? "#4ade80" : p.healthScore >= 40 ? "#fbbf24" : "#f87171",
                        }}
                      >
                        {p.healthScore}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 w-20 text-right">
                      {p.completionPct}% complete
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${healthColor}`}
                      style={{ width: `${p.completionPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Timeline Visualization */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Estimated Completion</h4>
          <div className="space-y-3">
            {chartProjects.map((p) => {
              const daysColor =
                p.daysRemaining <= 3
                  ? "text-red-400"
                  : p.daysRemaining <= 7
                  ? "text-amber-400"
                  : "text-green-400";

              return (
                <div key={`est-${p.project.id}`} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{p.project.name}</span>
                      <span className="text-gray-500">{p.estimatedCompletion}</span>
                    </div>
                    <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{
                          left: "0%",
                          width: `${Math.max(20, 100 - (p.daysRemaining / Math.max(1, p.totalDuration)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold min-w-[60px] text-right ${daysColor} ${
                      p.daysRemaining <= 3 ? "animate-pulse-slow" : ""
                    }`}
                  >
                    {p.daysRemaining}d
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-800">
        <div className="text-center">
          <div className="text-xs text-gray-500">Avg Health</div>
          <div className="text-xl font-bold text-white">
            {Math.round(chartProjects.reduce((s, p) => s + p.healthScore, 0) / Math.max(1, chartProjects.length))}/100
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Delayed</div>
          <div className="text-xl font-bold text-red-400">
            {chartProjects.filter((p) => p.delayInfo?.isDelayed).length}/{chartProjects.length}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Avg Days Left</div>
          <div className="text-xl font-bold text-amber-300">
            {Math.round(chartProjects.reduce((s, p) => s + (p.daysRemaining || 0), 0) / Math.max(1, chartProjects.length))}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Critical Tasks</div>
          <div className="text-xl font-bold text-indigo-400">
            {chartProjects.reduce((s, p) => s + (p.criticalPath || []).length, 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
