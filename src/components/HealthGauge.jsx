import React from "react";

export function HealthGauge({ score, size = 120 }) {
  let color = "#f87171"; // red (critical)
  if (score >= 70) color = "#4ade80"; // green (healthy)
  else if (score >= 40) color = "#fbbf24"; // amber (at risk)

  const offset = size * 0.15;
  const circumference = 2 * Math.PI * (size / 2 - offset);
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  const status = score >= 70 ? "HEALTHY" : score >= 40 ? "AT RISK" : "CRITICAL";
  const statusClass = score >= 70 ? "health-healthy" : score >= 40 ? "health-atrisk" : "health-critical";

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size / 2 - offset)}
            fill="transparent"
            stroke="#334155"
            strokeWidth={8}
            strokeDasharray={circumference}
          />
          {/* Progress arc with glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size / 2 - offset)}
            fill="transparent"
            stroke={color}
            strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 0.8s ease-out",
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          {/* Center glow dot */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size * 0.08}
            fill={color}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className={`text-xs mt-2 font-medium ${statusClass}`}>
        {status}
      </span>
    </div>
  );
}
