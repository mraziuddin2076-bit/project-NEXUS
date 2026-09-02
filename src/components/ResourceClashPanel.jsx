import React from "react";

export function ResourceClashPanel({ clashes }) {
  if (!clashes || clashes.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 mb-6 border border-green-500/20">
        <h3 className="text-lg font-semibold mb-2 text-green-300 flex items-center gap-2">
          ✅ No Resource Clashes
        </h3>
        <p className="text-sm text-gray-400">
          All team members are within their capacity limits. No overallocations detected across
          running projects.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 mb-6 border border-red-500/20">
      <h3 className="text-lg font-semibold mb-3 text-red-300 flex items-center gap-2">
        ⚡ Resource Clashes Detected
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        {clashes.length} team member(s) are overallocated across projects. This can cause delays
        and burnout.
      </p>

      <div className="space-y-3">
        {clashes.map((clash) => (
          <div
            key={clash.name}
            className={`p-4 rounded-xl transition-all border ${
              clash.severity === "critical"
                ? "bg-red-900/10 border-red-500/30"
                : "bg-amber-900/10 border-amber-500/30"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{clash.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    clash.severity === "critical"
                      ? "bg-red-900/30 text-red-300"
                      : "bg-amber-900/30 text-amber-300"
                  }`}
                >
                  {clash.severity === "critical" ? "CRITICAL OVERLOAD" : "WARNING"}
                </span>
              </div>
              <span className="font-bold text-xl text-red-400">{clash.utilization}%</span>
            </div>

            <div className="text-sm text-gray-300 mb-2">
              Working across {clash.projects.length} project(s):{" "}
              <span className="text-gray-400">{clash.projects.join(", ")}</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-500">Tasks assigned:</div>
              {clash.tasks.map((task) => (
                <div key={task.id} className="text-xs text-gray-400 pl-2 border-l-2 border-gray-700">
                  • {task.name} (Project: {task.projectId}, {task.duration}d) — Risk: {task.risk}
                </div>
              ))}
            </div>

            <div className="mt-2 text-xs text-gray-500">
              💡 Recommendation: Reallocate some tasks from {clash.name} to underutilized team members
              or extend project timelines for non-critical tasks.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
