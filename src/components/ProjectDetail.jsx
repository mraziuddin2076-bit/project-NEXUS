import React from "react";
import { HealthGauge } from "./HealthGauge.jsx";
import { formatDate, daysBetween, today, getTimelineForProject } from "../engine.js";

export function ProjectDetail({ projectData, analysis, onBack, onWhatIf }) {
  const {
    project,
    projectTasks,
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
    remainingEffort,
    taskTimeline,
    simulation,
    queuePosition,
  } = projectData;

  const budget = project.budget || { total: 0, spent: 0 };
  const budgetPct = budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0;
  const budgetRemaining = budget.total - budget.spent;
  const budgetStatus = budgetPct > 90 ? "text-red-400" : budgetPct > 70 ? "text-amber-400" : "text-green-400";

  const statusColors = {
    running: "bg-green-500", queued: "bg-yellow-500", completed: "bg-blue-500",
    delayed: "bg-red-500", "on-hold": "bg-purple-500"
  };

  const healthColor = healthScore >= 70 ? "text-green-400" : healthScore >= 40 ? "text-amber-400" : "text-red-400";
  const healthBg = healthScore >= 70 ? "from-green-500 to-emerald-400" : healthScore >= 40 ? "from-amber-500 to-orange-400" : "from-red-500 to-pink-500";

  // Timeline data
  const timelineTasks = getTimelineForProject(projectData) || [];
  const startDate = project.startDate || formatDate(today());

  // Work summary
  const completedTasks = projectTasks.filter((t) => t.completed).length;
  const inProgressTasks = projectTasks.filter((t) => !t.completed && (projectData.simulation || true)).length;
  const notStartedTasks = projectTasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-6">
      {/* ─── Header with Back Button ─── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{project.status === "running" ? "🚀" : project.status === "queued" ? "⏳" : project.status === "delayed" ? "⚠️" : project.status === "on-hold" ? "⏸️" : "✅"}</span>
            <h2 className="text-3xl font-bold gradient-text">{project.name}</h2>
          </div>
        </div>

        <button
          onClick={onWhatIf}
          className="btn-primary flex items-center gap-2"
        >
          🎯 What-If Simulator
        </button>
      </div>

      {/* ─── Hero Section: Health Score + Key Metrics ─── */}
      <div className="glass rounded-3xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Health Gauge */}
          <div className="flex flex-col items-center text-center col-span-1">
            <h3 className="text-lg font-semibold text-gray-400 mb-3">Project Health</h3>
            <HealthGauge score={healthScore} size={160} />
            <span className={`mt-3 px-4 py-1.5 rounded-full text-xs font-bold ${
              healthScore >= 70
                ? "bg-green-900/30 text-green-300"
                : healthScore >= 40
                ? "bg-amber-900/30 text-amber-300"
                : "bg-red-900/30 text-red-300"
            }`}>
              {healthScore >= 70 ? "HEALTHY" : healthScore >= 40 ? "AT RISK" : "CRITICAL"}
            </span>
          </div>

          {/* Key Metrics */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/30 rounded-xl p-4 text-center">
              <div className="text-gray-500 text-xs uppercase mb-1">Status</div>
              <div className="flex items-center justify-center gap-2">
                <span className={`w-2 h-2 rounded-full ${statusColors[project.status]}`}></span>
                <span className={`font-bold ${
                  project.status === "running" ? "text-green-400" :
                  project.status === "delayed" ? "text-red-400" :
                  project.status === "queued" ? "text-amber-400" :
                  project.status === "on-hold" ? "text-purple-400" :
                  "text-blue-400"
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              {project.status === "queued" && queuePosition && (
                <div className="text-xs text-gray-500 mt-1">Queue #{queuePosition}</div>
              )}
            </div>

            <div className="bg-gray-800/30 rounded-xl p-4 text-center">
              <div className="text-gray-500 text-xs uppercase mb-1">Completion</div>
              <div className="text-2xl font-bold text-white">{completionPct}%</div>
              <div className="text-xs text-gray-500 mt-1">{completedTasks}/{projectTasks.length} tasks</div>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-4 text-center">
              <div className="text-gray-500 text-xs uppercase mb-1">Est. Finish</div>
              <div className="text-xl font-bold text-indigo-300">{estimatedCompletion}</div>
              {daysRemaining !== undefined && daysRemaining > 0 && (
                <div className="text-xs text-amber-400 mt-1">{daysRemaining} days remaining</div>
              )}
            </div>

            <div className="bg-gray-800/30 rounded-xl p-4 text-center">
              <div className="text-gray-500 text-xs uppercase mb-1">Budget</div>
              <div className="text-xl font-bold text-white">{budgetPct}%</div>
              <div className="text-xs text-gray-500 mt-1">${budget.spent?.toLocaleString()} / ${budget.total?.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Schedule & Timeline Section ─── */}
      <div className="glass rounded-3xl p-8">
        <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center gap-2">
          📅 Project Schedule & Timeline
        </h3>

        {/* Schedule Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800/30 rounded-xl p-5 text-center">
            <div className="text-gray-500 text-xs uppercase mb-1">Start Date</div>
            <div className="text-xl font-bold text-white">{formatDate(project.startDate) || "Not Started"}</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-5 text-center">
            <div className="text-gray-500 text-xs uppercase mb-1">Deadline</div>
            <div className="text-xl font-bold text-orange-300">{project.deadline || "No Deadline"}</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-5 text-center">
            <div className="text-gray-500 text-xs uppercase mb-1">Work Done / Remaining</div>
            <div className="text-xl font-bold text-white">{doneEffort}d / {remainingEffort}d</div>
          </div>
        </div>

        {/* Gantt Timeline */}
        {timelineTasks.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-300 mb-4">Task Timeline (Gantt)</h4>
            <div className="space-y-3">
              {timelineTasks.map((task) => {
                const barStart = daysBetween(parseDate(startDate), task.est);
                const barWidth = Math.max(2, task.duration || 5);
                const isCritical = task.isCritical;
                const isCompleted = task.completed;

                return (
                  <div key={task.id} className="relative">
                    <div className="flex items-center gap-4">
                      {/* Task name */}
                      <div className="w-48 text-sm text-gray-300 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          isCompleted ? "bg-green-400" : isCritical ? "bg-red-400" : "bg-blue-400"
                        }`} />
                        {task.name}
                      </div>

                      {/* Gantt bar */}
                      <div className="flex-1 relative h-8 bg-gray-800/40 rounded-lg overflow-hidden">
                        <div
                          className={`absolute top-1 h-6 rounded-lg transition-all duration-300 ${
                            isCompleted
                              ? "gantt-done"
                              : isCritical
                              ? "gantt-critical"
                              : "gantt-normal"
                          }`}
                          style={{
                            left: `${(barStart / Math.max(30, barStart + barWidth)) * 100}%`,
                            width: `${(barWidth / Math.max(30, barStart + barWidth)) * 100}%`,
                            maxWidth: "100%",
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/80">
                            {task.duration}d
                          </div>
                        </div>
                      </div>

                      {/* Progress/Status */}
                      <div className="w-24 text-right text-xs">
                        <span className={`px-1.5 py-0.5 rounded ${
                          isCompleted ? "bg-green-900/30 text-green-300" :
                          task.progress > 0 ? "bg-amber-900/30 text-amber-300" :
                          "bg-gray-700/50 text-gray-500"
                        }`}>
                          {isCompleted ? "Done" : `${task.progress}%`}
                        </span>
                      </div>
                    </div>

                    {/* Task metadata */}
                    <div className="flex items-center gap-6 mt-1 ml-48 text-xs text-gray-500">
                      <span>👤 {task.owner}</span>
                      <span>🎯 {task.risk} risk</span>
                      {task.isCritical && <span className="text-red-400 font-medium">🔴 Critical Path</span>}
                    </div>
                  </div>
                );
              })}

              {/* Timeline axis */}
              <div className="mt-4 h-px bg-gray-700/50" />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>{formatDate(project.startDate)}</span>
                <span className="text-center flex-1">Now</span>
                <span>{project.deadline}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Confidence Intervals (Monte Carlo) ─── */}
      <div className="glass rounded-3xl p-6">
        <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
          🎲 Completion Confidence (Monte Carlo Simulation)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-xl p-5 text-center border border-gray-700/50">
            <div className="text-gray-500 text-xs uppercase mb-2">50% — Most Likely</div>
            <div className="text-2xl font-bold text-blue-400">{simulation?.p50 ? formatDate(simulation.p50) : "TBD"}</div>
            <div className="text-xs text-gray-500 mt-1">Best case scenario</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-5 text-center border border-amber-500/20">
            <div className="text-gray-500 text-xs uppercase mb-2">80% — Conservative</div>
            <div className="text-2xl font-bold text-amber-400">{simulation?.p80 ? formatDate(simulation.p80) : "TBD"}</div>
            <div className="text-xs text-gray-500 mt-1">High confidence estimate</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-5 text-center border border-red-500/20">
            <div className="text-gray-500 text-xs uppercase mb-2">95% — Worst Case</div>
            <div className="text-2xl font-bold text-red-400">{simulation?.p95 ? formatDate(simulation.p95) : "TBD"}</div>
            <div className="text-xs text-gray-500 mt-1">Buffer needed</div>
          </div>
        </div>
      </div>

      {/* ─── Delay Analysis ─── */}
      {delayInfo?.isDelayed && (
        <div className="glass rounded-3xl p-6 border border-red-900/30">
          <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
            ⚠️ Delay Detected
          </h3>
          <ul className="space-y-2">
            {delayInfo.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 p-3 bg-gray-800/30 rounded-xl">
                <span className="text-red-400">→</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Time-Bomb Warnings ─── */}
      {timeBombs?.length > 0 && (
        <div className="glass rounded-3xl p-6 border border-orange-900/30">
          <h3 className="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
            🕐 Critical Time-Bomb Warnings
          </h3>
          <div className="space-y-3">
            {timeBombs.map((bomb, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <span className={`text-2xl ${
                  bomb.severity === "high" ? "text-red-400 animate-bounce-gentle" :
                  bomb.severity === "medium" ? "text-amber-400" :
                  "text-blue-400"
                }`}>⏰</span>
                <div>
                  <span className="font-medium text-white">{bomb.label}</span>
                  <p className="text-sm text-gray-400 mt-0.5">{bomb.description}</p>
                  <div className="text-xs text-gray-500 mt-1.5">📅 {bomb.date} • ⏱️ {Math.floor(bomb.hoursRemaining / 24)} days remaining</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Recovery Opportunities ─── */}
      {recoveryOpportunities?.length > 0 && (
        <div className="glass rounded-3xl p-6 border border-amber-900/30">
          <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
            💡 Recovery Opportunities
          </h3>
          <div className="space-y-3">
            {recoveryOpportunities.map((opp, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <span className="text-2xl text-amber-400">💡</span>
                <div>
                  {opp.type === "realloc" ? (
                    <>
                      <span className="font-medium text-white">{opp.member} — Reallocate Work</span>
                      <p className="text-sm text-gray-400 mt-0.5">{opp.reason}</p>
                      <p className="text-xs text-gray-500 mt-1.5">Suggested task: {opp.recommendedTask}</p>
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-white">{opp.taskName}</span>
                      <p className="text-sm text-gray-400 mt-0.5">{opp.reason}</p>
                      <p className="text-xs text-gray-500 mt-1.5">Delay by up to {opp.suggestedDelay} days (has {opp.currentSlack} days slack)</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Team Resource Allocation ─── */}
      <div className="glass rounded-3xl p-8">
        <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center gap-2">
          👥 Team Resource Allocation
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-3">Member</th>
                <th className="text-left py-4 px-3">Active Tasks</th>
                <th className="text-left py-4 px-3">Effort (days)</th>
                <th className="text-left py-4 px-3">Utilization</th>
                <th className="text-left py-4 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {project.team?.map((member) => {
                const memberTasks = projectTasks.filter((t) => t.owner === member && !t.completed);
                const totalEffortMember = memberTasks.reduce((sum, t) => sum + (t.duration || 5), 0);
                const utilization = Math.round((totalEffortMember / 40) * 100);
                const clash = analysis.resourceClashes?.find((c) => c.name === member);

                return (
                  <tr key={member} className="border-b border-gray-800 hover:bg-gray-800/20 transition-colors">
                    <td className="py-3 px-3 font-medium text-white">{member}</td>
                    <td className="py-3 px-3 text-gray-400">{memberTasks.length} active</td>
                    <td className="py-3 px-3 text-gray-400">{totalEffortMember}h</td>
                    <td className="py-3 px-3">
                      <span className={utilization > 100 ? "text-red-400 font-bold" : utilization > 80 ? "text-amber-400" : "text-green-400"}>
                        {utilization}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {clash && clash.severity === "critical" ? (
                        <span className="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded-full">⚠️ Overloaded</span>
                      ) : clash ? (
                        <span className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded-full">⚠️ High Load</span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded-full">✓ OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function parseDate(s) {
  if (!s) return null;
  const d = new Date(s);
  d.setHours(0, 0, 0, 0);
  return d;
}
