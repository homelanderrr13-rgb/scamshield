import type { AnalysisResult, HistoryEntry } from "@/types";

const STORAGE_KEY = "scamshield_history";
const MAX_ENTRIES = 50;

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToHistory(result: AnalysisResult): HistoryEntry[] {
  const history = getHistory();

  // To protect privacy, we store only a short preview of the input text,
  // not the full message content.
  const preview =
    result.inputText.length > 80
      ? result.inputText.slice(0, 80) + "…"
      : result.inputText;

  const entry: HistoryEntry = {
    id: result.id,
    timestamp: result.timestamp,
    inputText: preview,
    riskLevel: result.riskLevel,
    score: result.score,
    signalsCount: result.signals.length,
    topCategory: result.signals[0]?.category ?? null,
  };

  const updated = [entry, ...history].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage may be full or blocked — silently ignore
  }
  return updated;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getHistoryStats(): {
  total: number;
  high: number;
  medium: number;
  low: number;
  categoryCounts: Record<string, number>;
} {
  const history = getHistory();
  const stats = {
    total: history.length,
    high: 0,
    medium: 0,
    low: 0,
    categoryCounts: {} as Record<string, number>,
  };

  for (const entry of history) {
    stats[entry.riskLevel]++;
    if (entry.topCategory) {
      stats.categoryCounts[entry.topCategory] =
        (stats.categoryCounts[entry.topCategory] ?? 0) + 1;
    }
  }

  return stats;
}
