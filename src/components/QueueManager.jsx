import React from "react";
import { HealthGauge } from "./HealthGauge.jsx";
import { formatDate } from "../engine.js";

export function QueueManager({ projects, queueOrder, analysis, onBack }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-800/50 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Queue Manager
        </h2>
      </div>

      {/* Queue Explanation */}
      <div className="glass rounded-2xl p-6 mb-6 border border-amber-500/20">
        <h3 className="text-lg font-semibold mb-2 text-amber-400 flex items-center gap-2">
          ⏳ Priority Queue
        </h3>
        <p className="text-sm text-gray-400">
          Projects are automatically ordered by priority score (P1 = highest).
          Higher-priority projects start first when capacity becomes available.
          Currently {queueOrder.length} project(s) in queue.
        </p>
      </div>

      {/* Queued Projects List */}
      <div className="space-y-3 mb-6">
        {queueOrder.map((project, index) => {
          const projectData = analysis.projects.find((p) => p.project.id === project.id);
          return (
            <div
              key={project.id}
              className="glass rounded-2xl p-4 flex items-center gap-4 card-hover transition-smooth border border-amber-500/10"
            >
              <div className="text-2xl font-bold text-amber-500">#{index + 1}</div>
              <div className="flex-1">
                <h4 className="font-bold text-white">{project.name}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <span className="px-1.5 py-0.5 bg-amber-900/30 text-amber-300 rounded">
                    Priority #{project.priority}
                  </span>
                  <span>Budget: ${project.budget?.total?.toLocaleString() || "0"}</span>
                  <span>Team: {project.team?.join(", ") || "unassigned"}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <HealthGauge score={projectData?.healthScore || 0} size={50} />
                <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all">
                  Start Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Simulation */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
          📅 Schedule Simulation
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Simulated timeline if queued projects start sequentially after current running projects:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 text-gray-300">Rank</th>
                <th className="text-left py-3 text-gray-300">Project</th>
                <th className="text-left py-3 text-gray-300">Priority</th>
                <th className="text-left py-3 text-gray-300">Budget</th>
                <th className="text-left py-3 text-gray-300">Team</th>
                <th className="text-left py-3 text-gray-300">Health</th>
                <th className="text-left py-3 text-gray-300">Est. Finish</th>
              </tr>
            </thead>
            <tbody>
              {queueOrder.map((project, index) => {
                const projectData = analysis.projects.find((p) => p.project.id === project.id);
                return (
                  <tr key={project.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 text-amber-400 font-bold">#{index + 1}</td>
                    <td className="py-3 text-white">{project.name}</td>
                    <td className="py-3 text-gray-400">#{project.priority}</td>
                    <td className="py-3 text-gray-500">${project.budget?.total?.toLocaleString() || "0"}</td>
                    <td className="py-3 text-gray-500">{project.team?.join(", ") || "—"}</td>
                    <td className="py-3">
                      <HealthGauge score={projectData?.healthScore || 0} size={40} />
                    </td>
                    <td className="py-3 text-indigo-300">{projectData?.estimatedCompletion || "TBD"}</td>
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
