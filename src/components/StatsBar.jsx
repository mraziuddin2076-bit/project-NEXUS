import React from "react";

export function StatsBar({ stats }) {
  const statCards = [
    { label: "Total Projects", value: stats.total, icon: "📁", color: "bg-gray-700" },
    { label: "Running", value: stats.running, icon: "🏃", color: "status-running text-green-300" },
    { label: "Queued", value: stats.queued, icon: "⏳", color: "text-amber-400" },
    { label: "Delayed", value: stats.delayed, icon: "⚠️", color: "status-delayed text-red-300" },
    { label: "Completed", value: stats.completed, icon: "✅", color: "status-completed text-blue-300" },
    { label: "On Hold", value: stats.onHold, icon: "⏸️", color: "status-onhold text-violet-300" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="glass rounded-2xl p-4 text-center card-hover group transition-smooth"
        >
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{card.icon}</div>
          <div className="text-3xl font-bold text-white mb-0.5">{card.value}</div>
          <div className={`text-xs font-medium ${card.color}`}>{card.label}</div>
        </div>
      ))}
    </div>
  );
}
