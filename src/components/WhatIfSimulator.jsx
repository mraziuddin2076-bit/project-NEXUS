import React, { useState } from "react";
import { whatIfScenario, formatDate } from "../engine.js";
import { HealthGauge } from "./HealthGauge.jsx";

export function WhatIfSimulator({ projectData, allTasks, taskProgress, onBack }) {
  const { project, projectTasks, healthScore, estimatedCompletion, criticalPath, simulation } = projectData;
  const [selectedTask, setSelectedTask] = useState(projectTasks[0]?.id || "");
  const [newDuration, setNewDuration] = useState(projectTasks[0]?.duration || 5);
  const [newStartDate, setNewStartDate] = useState(projectTasks[0]?.startDate || "");
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);

  const applyWhatIf = () => {
    const changes = [{
      taskId: selectedTask,
      newDuration: parseInt(newDuration),
      newStartDate: newStartDate || undefined,
      completed: completed,
      newProgress: completed ? 100 : undefined,
    }];

    const res = whatIfScenario(projectTasks, taskProgress, changes);
    setResult(res);
  };

  const selectedTaskObj = projectTasks.find((t) => t.id === selectedTask);
  const isTaskCritical = criticalPath.includes(selectedTask);

  // Format date for input
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    return dateStr || new Date().toISOString().split("T")[0];
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-800/50 rounded-xl text-sm font-medium text-gray-300 hover:text-white"
        >
          ← Back to Project Detail
        </button>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          🎯 What-If Simulator
        </h2>
        <span className="text-gray-400 text-sm">— {project.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 border border-purple-500/20">
            <h3 className="text-lg font-semibold mb-4 text-purple-400 flex items-center gap-2">
              🔧 Modify a Task
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Task to Change</label>
              <select
                value={selectedTask}
                onChange={(e) => {
                  const t = projectTasks.find((pt) => pt.id === e.target.value);
                  setSelectedTask(t?.id);
                  setNewDuration(t?.duration || 5);
                  setNewStartDate(t?.startDate || "");
                  setCompleted(t?.completed || false);
                }}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {projectTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.duration}d) {criticalPath.includes(t.id) ? "🔴 CRITICAL" : ""}
                  </option>
                ))}
              </select>
              {isTaskCritical && (
                <span className="text-xs text-red-400 mt-1 block">⚠️ This task is on the critical path</span>
              )}
            </div>

            {selectedTaskObj && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Duration (days)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    min="1"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Start Date</label>
                  <input
                    type="date"
                    value={formatDateForInput(newStartDate)}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={(e) => setCompleted(e.target.checked)}
                      className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-300">Mark as completed</span>
                  </label>
                </div>
              </>
            )}

            <button
              onClick={applyWhatIf}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Simulate Changes
            </button>
          </div>

          {/* Original Summary */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Original Project State</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Health Score</span>
                <span className="font-bold">{healthScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Est. Completion</span>
                <span>{estimatedCompletion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Critical Path Tasks</span>
                <span className="text-red-400 font-bold">{criticalPath.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">P95 Confidence</span>
                <span>{simulation.p95 ? formatDate(simulation.p95) : "TBD"}</span>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="glass rounded-2xl p-4 text-xs text-gray-400">
            <div className="font-medium text-gray-300 mb-1">💡 Pro Tip</div>
            Try increasing the duration of a <span className="text-red-400 font-medium">critical path</span> task to see cascading delays ripple through the project!
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {!result ? (
            <div className="glass rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center border border-gray-800">
              <div className="text-6xl mb-4">🔮</div>
              <h3 className="text-xl font-bold text-white mb-2">No Simulation Yet</h3>
              <p className="text-gray-400 mb-4 max-w-md">
                Select a task and modify its parameters, then click "Simulate Changes"
                to see the impact on the entire project timeline and health score.
              </p>
              <div className="text-xs text-gray-500">
                The engine will recompute the critical path and re-run Monte Carlo analysis
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Impact Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-gray-400 text-xs uppercase mb-1">Days Impact</div>
                  <div className={`text-2xl font-bold ${result.daysChange >= 0 ? "text-red-400" : "text-green-400"}`}>
                    {result.daysChange > 0 ? `+${result.daysChange}` : result.daysChange < 0 ? result.daysChange : "±0"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">vs original</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-gray-400 text-xs uppercase mb-1">New Est. Finish</div>
                  <div className="text-xl font-bold text-amber-300">{result.confidence.p80}</div>
                  <div className="text-xs text-gray-500 mt-1">80% confidence</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-gray-400 text-xs uppercase mb-1">Critical Path</div>
                  <div className="text-xl font-bold text-red-400">{result.criticalPath.length}</div>
                  <div className="text-xs text-gray-500 mt-1">tasks</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-gray-400 text-xs uppercase mb-1">Finish Date</div>
                  <div className="text-xl font-bold text-blue-300">
                    {result.projectFinish ? formatDate(result.projectFinish) : "TBD"}
                  </div>
                </div>
              </div>

              {/* Confidence Comparison */}
              <div className="glass rounded-2xl p-5">
                <h4 className="font-semibold mb-3 text-purple-300">Confidence Intervals Compared</h4>
                <div className="grid grid-cols-3 gap-3">
                  <ConfidenceCard label="50% (Most Likely)" oldDate={simulation.p50} newDate={result.simulation.p50} />
                  <ConfidenceCard label="80% (Conservative)" oldDate={simulation.p80} newDate={result.simulation.p80} />
                  <ConfidenceCard label="95% (Worst Case)" oldDate={simulation.p95} newDate={result.simulation.p95} />
                </div>
              </div>

              {/* Impacted Tasks (Critical Path) */}
              <div className="glass rounded-2xl p-5">
                <h4 className="font-semibold mb-3 text-red-300">Impacted Critical Path Tasks</h4>
                <div className="space-y-2">
                  {result.modifiedTasks
                    .filter((t) => result.criticalPath.includes(t.id))
                    .map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl">
                        <span className="text-red-400">🔴</span>
                        <div className="flex-1">
                          <div className="font-medium text-white">{task.name}</div>
                          <div className="text-xs text-gray-500">
                            Owner: {task.owner} • Risk: {task.risk} • Duration: {task.duration || 5}d
                          </div>
                        </div>
                      </div>
                    ))}

                  {result.modifiedTasks.filter((t) => result.criticalPath.includes(t.id)).length === 0 && (
                    <p className="text-gray-500 text-sm">No critical path tasks impacted by changes.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfidenceCard({ label, oldDate, newDate }) {
  const oldD = oldDate ? formatDate(oldDate) : "TBD";
  const newD = newDate ? formatDate(newDate) : "TBD";
  const changed = oldD !== newD;

  return (
    <div className={`bg-gray-800/30 rounded-xl p-3 text-center ${changed ? "border border-amber-500/30" : ""}`}>
      <div className="text-gray-500 text-xs uppercase mb-1">{label}</div>
      <div className="space-y-1">
        <div className="text-sm text-gray-400">Before: {oldD}</div>
        <div className={`text-lg font-bold ${changed ? "text-amber-300" : "text-gray-400"}`}>
          After: {newD}
        </div>
      </div>
    </div>
  );
}
