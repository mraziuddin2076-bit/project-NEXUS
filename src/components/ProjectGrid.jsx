import React, { useState } from "react";
import { ProjectCard } from "./ProjectCard.jsx";

export function ProjectGrid({ projects, onProjectClick, analysis }) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("priority");

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "running", label: "Running" },
    { id: "queued", label: "Queued" },
    { id: "delayed", label: "Delayed" },
    { id: "completed", label: "Completed" },
    { id: "on-hold", label: "On Hold" },
  ];

  const sortOptions = [
    { id: "priority", label: "Priority (High→Low)" },
    { id: "health", label: "Health Score (Low→High)" },
    { id: "completion", label: "Completion (High→Low)" },
    { id: "name", label: "Name (A-Z)" },
  ];

  let filtered = projects.filter((p) =>
    filter === "all" ? true : p.project.status === filter
  );

  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case "priority": return b.project.priority - a.project.priority;
      case "health": return a.healthScore - b.healthScore;
      case "completion": return b.completionPct - a.completionPct;
      case "name": return a.project.name.localeCompare(b.project.name);
      default: return 0;
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === f.id
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                  : "bg-gray-800/30 text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
        >
          {sortOptions.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        Showing {filtered.length} of {projects.length} projects
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((projectData) => (
          <ProjectCard
            key={projectData.project.id}
            projectData={projectData}
            onClick={() => onProjectClick(projectData)}
          />
        ))}
      </div>
    </div>
  );
}
