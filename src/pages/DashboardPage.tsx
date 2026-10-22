import { useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Search,
  Trash2,
  Activity,
} from "lucide-react";
import { getHistory, getHistoryStats, clearHistory } from "@/utils/history";
import { getEngineInfo } from "@/engine/detectionEngine";
import type { Page } from "@/components/Logo";
import { useState } from "react";

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  // Using state so we can force refresh after clear
  const [refreshKey, setRefreshKey] = useState(0);
  const history = useMemo(() => getHistory(), [refreshKey]);
  const stats = useMemo(() => getHistoryStats(), [refreshKey]);
  const engineInfo = useMemo(() => getEngineInfo(), []);

  const handleClear = () => {
    clearHistory();
    setRefreshKey((k) => k + 1);
  };

  const riskCards = [
    {
      level: "high" as const,
      count: stats.high,
      label: "High Risk",
      icon: ShieldX,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      level: "medium" as const,
      count: stats.medium,
      label: "Medium Risk",
      icon: ShieldAlert,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      level: "low" as const,
      count: stats.low,
      label: "Low Risk",
      icon: ShieldCheck,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
  ];

  const totalAnalyzed = stats.total;
  const highPercentage = totalAnalyzed > 0 ? Math.round((stats.high / totalAnalyzed) * 100) : 0;

  // Category distribution
  const sortedCategories = Object.entries(stats.categoryCounts).sort(
    (a, b) => b[1] - a[1],
  );
  const maxCategoryCount = sortedCategories[0]?.[1] ?? 1;

  // Risk distribution bar
  const riskBarTotal = totalAnalyzed > 0 ? totalAnalyzed : 1;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Overview of messages analyzed and fraud patterns detected
          </p>
        </div>
        {totalAnalyzed > 0 && (
          <button
            onClick={handleClear}
            className="btn-secondary text-xs text-red-400/80"
          >
            <Trash2 size={14} />
            Clear All Data
          </button>
        )}
      </div>

      {totalAnalyzed === 0 ? (
        <div className="card flex flex-col items-center justify-center p-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-800/60">
            <BarChart3 size={28} className="text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300">No analyses yet</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Analyze some messages to see your stats here — total analyzed, risk distribution, and
            detected fraud categories.
          </p>
          <button onClick={() => onNavigate("analyzer")} className="btn-primary mt-6">
            <Search size={16} />
            Go to Analyzer
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top row: summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card card-hover p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-shield-500/15 text-shield-400">
                  <Activity size={20} />
                </div>
                <span className="text-xs font-medium text-slate-500">Total</span>
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums text-white">
                {totalAnalyzed}
              </p>
              <p className="text-xs text-slate-500">Messages Analyzed</p>
            </div>

            {riskCards.map((card) => (
              <div key={card.level} className={`card card-hover p-5 ${card.border} border`}>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
                  >
                    <card.icon size={20} />
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {totalAnalyzed > 0
                      ? Math.round((card.count / totalAnalyzed) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <p className="mt-3 text-3xl font-bold tabular-nums text-white">
                  {card.count}
                </p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Risk distribution bar */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-shield-400" />
              <h3 className="text-sm font-semibold text-slate-300">Risk Distribution</h3>
            </div>
            <div className="flex h-8 overflow-hidden rounded-lg">
              {stats.high > 0 && (
                <div
                  className="flex items-center justify-center bg-red-500/80 text-xs font-bold text-white"
                  style={{ width: `${(stats.high / riskBarTotal) * 100}%` }}
                >
                  {stats.high}
                </div>
              )}
              {stats.medium > 0 && (
                <div
                  className="flex items-center justify-center bg-amber-500/80 text-xs font-bold text-white"
                  style={{ width: `${(stats.medium / riskBarTotal) * 100}%` }}
                >
                  {stats.medium}
                </div>
              )}
              {stats.low > 0 && (
                <div
                  className="flex items-center justify-center bg-green-500/80 text-xs font-bold text-white"
                  style={{ width: `${(stats.low / riskBarTotal) * 100}%` }}
                >
                  {stats.low}
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-500/80" /> High ({stats.high})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500/80" /> Medium ({stats.medium})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-green-500/80" /> Low ({stats.low})
              </span>
            </div>
          </div>

          {/* Two-column: category breakdown + engine info */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Category breakdown */}
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-300">
                  Fraud Categories Detected
                </h3>
              </div>
              {sortedCategories.length > 0 ? (
                <div className="space-y-3">
                  {sortedCategories.map(([category, count]) => (
                    <div key={category}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-slate-400">{category}</span>
                        <span className="font-semibold tabular-nums text-slate-300">
                          {count}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-navy-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-shield-500 to-shield-600 transition-all duration-700"
                          style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No fraud categories triggered yet — all analyzed messages were clean.
                </p>
              )}
            </div>

            {/* Engine info */}
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-shield-400" />
                <h3 className="text-sm font-semibold text-slate-300">Detection Engine</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-navy-700/40 bg-navy-950/40 p-4">
                  <p className="text-2xl font-bold text-shield-400">
                    {engineInfo.ruleCount}
                  </p>
                  <p className="text-xs text-slate-500">Detection Rules</p>
                </div>
                <div className="rounded-xl border border-navy-700/40 bg-navy-950/40 p-4">
                  <p className="text-2xl font-bold text-shield-400">
                    {engineInfo.categories.length}
                  </p>
                  <p className="text-xs text-slate-500">Pattern Categories</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {engineInfo.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-md bg-navy-800/60 px-2 py-1 text-[10px] font-medium text-slate-400"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                The engine uses transparent, explainable pattern-matching rules — no black-box AI.
                Each rule has a weight that contributes to the overall risk score. An LLM-based
                engine can be integrated later without changing the UI.
              </p>
            </div>
          </div>

          {/* Recent analyses table */}
          <div className="card overflow-hidden">
            <div className="border-b border-navy-700/40 p-4">
              <h3 className="text-sm font-semibold text-slate-300">Recent Analyses</h3>
            </div>
            <div className="divide-y divide-navy-800/40">
              {history.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-navy-800/30"
                >
                  <div className="shrink-0">
                    {entry.riskLevel === "high" ? (
                      <ShieldX size={16} className="text-red-400" />
                    ) : entry.riskLevel === "medium" ? (
                      <ShieldAlert size={16} className="text-amber-400" />
                    ) : (
                      <ShieldCheck size={16} className="text-green-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-slate-300">{entry.inputText}</p>
                    <p className="text-[10px] text-slate-600">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`text-xs font-semibold ${
                        entry.riskLevel === "high"
                          ? "text-red-400"
                          : entry.riskLevel === "medium"
                            ? "text-amber-400"
                            : "text-green-400"
                      }`}
                    >
                      {entry.score}/100
                    </span>
                    <p className="text-[10px] text-slate-600">{entry.signalsCount} signals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
