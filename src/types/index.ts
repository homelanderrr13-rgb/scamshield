export type RiskLevel = "low" | "medium" | "high";

export interface ScamSignal {
  id: string;
  category: string;
  /** The matched phrase or pattern description shown to the user */
  matchedText: string;
  /** Human-readable explanation of why this is a warning sign */
  explanation: string;
  /** Weight contribution to the overall risk score */
  weight: number;
}

export interface AnalysisResult {
  id: string;
  riskLevel: RiskLevel;
  score: number; // 0–100
  signals: ScamSignal[];
  summary: string;
  safetyAdvice: string[];
  timestamp: number;
  inputText: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  inputText: string;
  riskLevel: RiskLevel;
  score: number;
  signalsCount: number;
  topCategory: string | null;
}
