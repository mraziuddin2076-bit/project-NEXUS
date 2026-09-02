import React from "react";

export function StatsBar({ stats }) {
  const statCards = [
    { label: "Total Projects", value: stats.total, icon: "📁", color: "bg-gray-700 text-gray-300", bg: "bg-gray-800/30" },
    { label: "Running", value: stats.running, icon: "🚀", color: "status-running text-green-300", bg: "bg-gray-800/30" },
    { label: "Queued", value: stats.queued, icon: "⏳", color: "status-queued text-amber-300", bg: "bg-gray-800/30" },
    { label: "Delayed", value: stats.delayed, icon: "⚠️", color: "status-delayed text-red-300", bg: "bg-gray-800/30" },
    { label: "Completed", value: stats.completed, icon: "✅", color: "status-completed text-blue-300", bg: "bg-gray-800/30" },
    { label: "On Hold", value: stats.onHold, icon: "⏸️", color: "status-onhold text-violet-300", bg: "bg-gray-800/30" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      {statCards.map((card) => (
        <div
          key={card.label}
          className={`glass rounded-2xl p-5 text-center card-hover group transition-smooth ${card.bg}`}
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
          <div className="text-3xl font-bold text-white mb-0.5">{card.value}</div>
          <div className={`text-xs font-medium ${card.color}`}>{card.label}</div>
        </div>
      ))}
    </div>
  );
}
