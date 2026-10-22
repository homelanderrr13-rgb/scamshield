import { AlertTriangle, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import type { RiskLevel } from "@/types";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: "sm" | "md" | "lg";
}

const CONFIG: Record<
  RiskLevel,
  { label: string; color: string; bg: string; border: string; icon: typeof ShieldX }
> = {
  low: {
    label: "Low Risk",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: ShieldCheck,
  },
  medium: {
    label: "Medium Risk",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: ShieldAlert,
  },
  high: {
    label: "High Risk",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: ShieldX,
  },
};

export function RiskBadge({ level, score, size = "md" }: RiskBadgeProps) {
  const cfg = CONFIG[level];
  const Icon = cfg.icon;
  const sizes = {
    sm: { box: "px-2.5 py-1 text-xs gap-1.5", iconSize: 14 },
    md: { box: "px-3.5 py-1.5 text-sm gap-2", iconSize: 16 },
    lg: { box: "px-5 py-2.5 text-base gap-2.5", iconSize: 22 },
  };
  const s = sizes[size];

  return (
    <div
      className={`inline-flex items-center rounded-full border font-semibold ${s.box} ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <Icon size={s.iconSize} strokeWidth={2.5} />
      <span>{cfg.label}</span>
      {score !== undefined && (
        <span className="rounded-full bg-navy-800/60 px-2 py-0.5 text-[10px] font-bold tabular-nums text-slate-300">
          {score}/100
        </span>
      )}
    </div>
  );
}

export function RiskGauge({ level, score }: { level: RiskLevel; score: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = { low: "#16a34a", medium: "#f59e0b", high: "#dc2626" };
  const color = colors[level];

  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#1e3a7a"
          strokeWidth="12"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out, stroke 0.4s" }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold tabular-nums text-white">{score}</span>
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Risk Score
        </span>
      </div>
    </div>
  );
}
