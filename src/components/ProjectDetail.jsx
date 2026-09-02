import React from "react";
import { HealthGauge } from "./HealthGauge.jsx";
import { formatDate } from "../engine.js";

export function ProjectDetail({ projectData, analysis, onBack, onWhatIf }) {
  const { project, projectTasks, completionPct, healthScore, estimatedCompletion, delayInfo, timeBombs, recoveryOpportunities, criticalPath } = projectData;
  const { simulation, resourceClashes } = analysis;

  const statusColors = { running: "bg-green-500", queued: "bg-yellow-500", completed: "bg-blue-500", delayed: "bg-red-500", "on-hold": "bg-purple-500" };
  const budget = project.budget || { total: 0, spent: 0 };
  const budgetPct = budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="px-4 py-2 bg-gray-800 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors">
            ← Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">{project.name}</h2>
        </div>
        <button onClick={onWhatIf} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-medium text-white shadow-xl hover:shadow-2xl transition-all">
          🎯 What-If Simulator
        </button>
      </div>

      {/* Hero Section: Health Score + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass rounded-2xl p-8 text-center col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-gray-400">Project Health</h3>
          <HealthGauge score={healthScore} size={160} />
          <span className={`mt-3 block px-4 py-1 rounded-full text-xs font-bold ${
            healthScore >= 70 ? "bg-green-900/30 text-green-300" :
            healthScore >= 40 ? "bg-amber-900/30 text-amber-300" :
            "bg-red-900/30 text-red-300"
          }`}>
            {healthScore >= 70 ? "HEALTHY" : healthScore >= 40 ? "AT RISK" : "CRITICAL"}
          </span>
        </div>

        <div className="glass rounded-2xl p-6 col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Status" value={<span className={`font-bold ${
              project.status === "running" ? "text-green-400" :
              project.status === "delayed" ? "text-red-400" :
              project.status === "queued" ? "text-yellow-400" :
              project.status === "on-hold" ? "text-purple-400" :
              "text-blue-400"
            }`}>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>} />
            <StatCard label="Completion" value={`${completionPct}%`} trend={completionPct > 0 ? "up" : ""} />
            <StatCard label="Budget" value={`${budgetPct}%`} money={true} spent={budget.spent} total={budget.total} />
            <StatCard label="Deadline" value={project.deadline || "TBD"} />
          </div>
        </div>
      </div>

      {/* Confidence Intervals */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-purple-400">Completion Confidence (Monte Carlo)</h3>
        <div className="grid grid-cols-3 gap-4">
          <ConfidenceCard label="50% (Most Likely)" date={simulation.p50} color="blue-400" />
          <ConfidenceCard label="80% (Conservative)" date={simulation.p80} color="amber-400" />
          <ConfidenceCard label="95% (Worst Case)" date={simulation.p95} color="red-400" />
        </div>
      </div>

      {/* Delay Analysis */}
      {delayInfo.isDelayed && (
        <div className="glass rounded-2xl p-6 mb-6 border border-red-900/30">
          <h3 className="text-xl font-bold mb-3 text-red-400 flex items-center gap-2">⚠️ Delay Detected</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {delayInfo.reasons.map((reason, i) => <li key={i} className="pl-2">{reason}</li>)}
          </ul>
        </div>
      )}

      {/* Time-Bomb Warnings */}
      {timeBombs.length > 0 && (
        <div className="glass rounded-2xl p-6 mb-6 border border-orange-900/30">
          <h3 className="text-xl font-bold mb-3 text-orange-400">🕐 Time-Bomb Warnings</h3>
          <div className="space-y-2">
            {timeBombs.map((bomb, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl">
                <span className="text-red-400 text-xl">⏰</span>
                <div>
                  <span className="font-medium">{bomb.label}</span>: {bomb.description}
                  <div className="text-xs text-gray-500 mt-1">Scheduled: {bomb.date} • Hours remaining: {bomb.hoursRemaining}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recovery Opportunities */}
      {recoveryOpportunities.length > 0 && (
        <div className="glass rounded-2xl p-6 mb-6 border border-amber-900/30">
          <h3 className="text-xl font-bold mb-3 text-amber-400">💡 Recovery Opportunities</h3>
          <div className="space-y-2">
            {recoveryOpportunities.map((opp, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl">
                <span className="text-amber-400 text-xl">💡</span>
                <div>
                  {opp.type === "realloc" ? (
                    <>
                      <span className="font-medium">{opp.member} — Reallocate Work</span>
                      <p className="text-sm text-gray-400">{opp.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">Suggested task: {opp.recommendedTask}</p>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{opp.taskName}</span>
                      <p className="text-sm text-gray-400">{opp.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">Delay by up to {opp.suggestedDelay} days (has {opp.currentSlack} days slack)</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Gantt */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-blue-400">Task Breakdown</h3>
        <div className="space-y-4">
          {projectTasks.map((task) => {
            const isCritical = criticalPath.includes(task.id);
            const isCompleted = task.completed;

            return (
              <div key={task.id} className={`p-3 rounded-xl transition-all ${
                isCompleted ? "bg-gray-800/30 opacity-75" :
                isCritical ? "bg-red-900/10 border border-red-500/30" :
                "bg-gray-800/50"
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{task.name}</span>
                    {isCritical && <span className="text-xs px-2 py-0.5 bg-red-900/30 text-red-300 rounded-full">🔴 CRITICAL</span>}
                    {isCompleted && <span className="text-xs px-2 py-0.5 bg-green-900/30 text-green-300 rounded-full">DONE</span>}
                  </div>
                  <span className="text-sm text-gray-400">{task.duration || 5} days</span>
                </div>

                <div className="relative h-8 bg-gray-800/50 rounded-full overflow-hidden mb-2">
                  <div
                    className={`absolute top-0 bottom-0 rounded-full transition-all ${
                      isCompleted ? "bg-green-500" :
                      isCritical ? "bg-red-500" :
                      "bg-blue-500"
                    }`}
                    style={{ width: `${isCompleted ? 100 : 0}%` }}
                  />
                </div>

                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Owner: {task.owner}</span>
                  <span>Risk: {task.risk}</span>
                  {task.dependsOn.length > 0 && <span>Depends on: {task.dependsOn.join(", ")}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Resource Allocation */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 text-indigo-400">Team Resource Allocation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3">Member</th>
                <th className="text-left py-3">Active Tasks</th>
                <th className="text-left py-3">Effort (hrs)</th>
                <th className="text-left py-3">Utilization</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {project.team?.map((member) => {
                const memberTasks = projectTasks.filter((t) => t.owner === member && !t.completed);
                const totalEffort = memberTasks.reduce((sum, t) => sum + (t.duration || 5), 0);
                const utilization = Math.round((totalEffort / 40) * 100);
                const clash = resourceClashes.find((c) => c.name === member);

                return (
                  <tr key={member} className="border-b border-gray-800">
                    <td className="py-3 font-medium">{member}</td>
                    <td className="py-3 text-gray-400">{memberTasks.length} active</td>
                    <td className="py-3">{totalEffort}h</td>
                    <td className="py-3">
                      <span className={utilization > 100 ? "text-red-400 font-bold" : utilization > 80 ? "text-amber-400" : "text-green-400"}>
                        {utilization}%
                      </span>
                    </td>
                    <td className="py-3">
                      {clash && clash.severity === "critical" ? (
                        <span className="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded">⚠️ Overloaded</span>
                      ) : clash ? (
                        <span className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded">⚠️ High Load</span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">✓ OK</span>
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

function StatCard({ label, value, trend, money, spent, total }) {
  return (
    <div className="p-4 bg-gray-800/30 rounded-xl">
      <div className="text-gray-500 text-xs uppercase">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {money && (
        <div className="text-xs text-gray-500 mt-1">${spent?.toLocaleString()} / ${total?.toLocaleString()}</div>
      )}
    </div>
  );
}

function ConfidenceCard({ label, date, color }) {
  return (
    <div className="bg-gray-800/30 rounded-xl p-4 text-center">
      <div className="text-gray-500 text-xs uppercase mb-1">{label}</div>
      <div className={`text-2xl font-bold text-${color}`}>{date ? formatDate(date) : "TBD"}</div>
    </div>
  );
}
