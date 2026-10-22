import { useCallback, useMemo, useState } from "react";
import {
  Search,
  AlertTriangle,
  ShieldCheck,
  Info,
  Trash2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  MinusCircle,
  FlaskConical,
  History,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { analyzeMessage } from "@/engine/detectionEngine";
import { SAMPLE_MESSAGES } from "@/data/sampleMessages";
import { getHistory, addToHistory, clearHistory } from "@/utils/history";
import { RiskBadge, RiskGauge } from "@/components/RiskBadge";
import type { AnalysisResult, RiskLevel } from "@/types";
import type { Page } from "@/components/Logo";

interface AnalyzerPageProps {
  onNavigate: (page: Page) => void;
}

function highlightText(
  text: string,
  signals: AnalysisResult["signals"],
): React.ReactNode[] {
  if (signals.length === 0) return [text];

  const lowerText = text.toLowerCase();

  // Find all match positions, skipping any that overlap a previous match
  const allMatches: { idx: number; end: number; signal: AnalysisResult["signals"][number] }[] = [];
  for (const s of signals) {
    const lower = s.matchedText.toLowerCase();
    let searchFrom = 0;
    while (searchFrom < lowerText.length) {
      const idx = lowerText.indexOf(lower, searchFrom);
      if (idx === -1) break;
      allMatches.push({ idx, end: idx + s.matchedText.length, signal: s });
      searchFrom = idx + 1;
    }
  }

  // Sort by position, then remove overlaps (keep the first/earlier match)
  allMatches.sort((a, b) => a.idx - b.idx);
  const nonOverlapping: typeof allMatches = [];
  let lastEnd = 0;
  for (const m of allMatches) {
    if (m.idx >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.end;
    }
  }

  if (nonOverlapping.length === 0) return [text];

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const m of nonOverlapping) {
    if (m.idx > cursor) {
      parts.push(text.slice(cursor, m.idx));
    }
    const isHigh = m.signal.weight >= 15;
    parts.push(
      <mark
        key={`${m.signal.id}-${m.idx}`}
        className={isHigh ? "signal-highlight" : "signal-highlight-medium"}
        title={m.signal.explanation}
      >
        {text.slice(m.idx, m.end)}
      </mark>,
    );
    cursor = m.end;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

function riskIconColor(level: RiskLevel): string {
  if (level === "high") return "text-red-400";
  if (level === "medium") return "text-amber-400";
  return "text-green-400";
}

function riskBorderColor(level: RiskLevel): string {
  if (level === "high") return "border-red-500/30";
  if (level === "medium") return "border-amber-500/30";
  return "border-green-500/30";
}

function riskBgColor(level: RiskLevel): string {
  if (level === "high") return "bg-red-500/5";
  if (level === "medium") return "bg-amber-500/5";
  return "bg-green-500/5";
}

export function AnalyzerPage({ onNavigate: _onNavigate }: AnalyzerPageProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null);
  const [showSampleMenu, setShowSampleMenu] = useState(false);
  const [history, setHistory] = useState(() => getHistory());
  const [showHistory, setShowHistory] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleAnalyze = useCallback(() => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    // Small delay for UX feedback
    setTimeout(() => {
      const res = analyzeMessage(input);
      setResult(res);
      const updated = addToHistory(res);
      setHistory(updated);
      setIsAnalyzing(false);
    }, 350);
  }, [input]);

  const handleSampleSelect = useCallback((text: string) => {
    setInput(text);
    setResult(null);
    setShowSampleMenu(false);
    setCharCount(text.length);
  }, []);

  const handleClearInput = useCallback(() => {
    setInput("");
    setResult(null);
    setCharCount(0);
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const highlighted = useMemo(
    () => (result ? highlightText(result.inputText, result.signals) : null),
    [result],
  );

  const sampleByRisk = useMemo(() => {
    return {
      high: SAMPLE_MESSAGES.filter((s) => s.expectedRisk === "high"),
      medium: SAMPLE_MESSAGES.filter((s) => s.expectedRisk === "medium"),
      low: SAMPLE_MESSAGES.filter((s) => s.expectedRisk === "low"),
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Message Analyzer</h1>
        <p className="mt-2 text-slate-400">
          Paste a suspicious message below. The engine will scan it for fraud patterns and explain
          every finding.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Input column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-300">
                Suspicious Message
              </label>
              <div className="flex items-center gap-2">
                {input && (
                  <button
                    onClick={handleClearInput}
                    className="btn-ghost text-xs"
                  >
                    <Trash2 size={14} />
                    Clear
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setCharCount(e.target.value.length);
                setResult(null);
              }}
              placeholder="Paste an SMS, WhatsApp message, or call transcript here…"
              rows={8}
              maxLength={5000}
              className="w-full resize-y rounded-xl border border-navy-700/60 bg-navy-950/60 p-4 font-mono text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-shield-500/50 focus:ring-1 focus:ring-shield-500/30"
            />

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-600">{charCount}/5000 characters</span>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowSampleMenu(!showSampleMenu)}
                    className="btn-secondary text-xs"
                  >
                    <FlaskConical size={14} />
                    Sample Messages
                    {showSampleMenu ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {showSampleMenu && (
                    <div className="absolute right-0 top-full z-20 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-navy-700 bg-navy-900 p-3 shadow-2xl">
                      {(["high", "medium", "low"] as const).map((risk) => (
                        <div key={risk} className="mb-3 last:mb-0">
                          <div className="mb-1.5 flex items-center gap-1.5">
                            {risk === "high" ? (
                              <XCircle size={12} className="text-red-400" />
                            ) : risk === "medium" ? (
                              <MinusCircle size={12} className="text-amber-400" />
                            ) : (
                              <CheckCircle2 size={12} className="text-green-400" />
                            )}
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                              {risk === "high"
                                ? "Scam Examples"
                                : risk === "medium"
                                  ? "Ambiguous Examples"
                                  : "Legitimate Examples"}
                            </span>
                          </div>
                          {sampleByRisk[risk].map((sample) => (
                            <button
                              key={sample.id}
                              onClick={() => handleSampleSelect(sample.text)}
                              className="block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-navy-800"
                            >
                              <span className="block text-xs font-semibold text-slate-300">
                                {sample.label}
                              </span>
                              <span className="block text-[11px] text-slate-500">
                                {sample.description}
                              </span>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!input.trim() || isAnalyzing}
                  className="btn-primary"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Highlighted text */}
          {result && (
            <div className="card animate-slide-up p-5">
              <div className="mb-3 flex items-center gap-2">
                <Info size={16} className="text-shield-400" />
                <h3 className="text-sm font-semibold text-slate-300">
                  Flagged Phrases in Your Message
                </h3>
              </div>
              {result.signals.length > 0 ? (
                <p className="rounded-xl bg-navy-950/60 p-4 font-mono text-sm leading-relaxed text-slate-300">
                  {highlighted}
                </p>
              ) : (
                <p className="rounded-xl bg-navy-950/60 p-4 text-sm text-slate-400">
                  No suspicious phrases were detected. This does not guarantee the message is safe.
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="signal-highlight">High-weight match</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="signal-highlight-medium">Medium-weight match</span>
                </span>
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-300"
                >
                  <History size={16} className="text-shield-400" />
                  Analysis History ({history.length})
                  {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button onClick={handleClearHistory} className="btn-ghost text-xs text-red-400/70">
                  <Trash2 size={14} />
                  Clear History
                </button>
              </div>
              {showHistory && (
                <div className="space-y-2">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 rounded-lg border border-navy-700/40 bg-navy-950/40 p-3"
                    >
                      <div className="mt-0.5">
                        {entry.riskLevel === "high" ? (
                          <XCircle size={14} className="text-red-400" />
                        ) : entry.riskLevel === "medium" ? (
                          <MinusCircle size={14} className="text-amber-400" />
                        ) : (
                          <CheckCircle2 size={14} className="text-green-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-slate-400">{entry.inputText}</p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
                          <span>{new Date(entry.timestamp).toLocaleString()}</span>
                          <span>·</span>
                          <span className={riskIconColor(entry.riskLevel)}>
                            {entry.riskLevel} risk
                          </span>
                          <span>·</span>
                          <span>{entry.signalsCount} signals</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="pt-1 text-[10px] text-slate-600">
                    Only short previews are stored in your browser — full messages are not saved.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results column */}
        <div className="lg:col-span-2 space-y-4">
          {!result && !isAnalyzing && (
            <div className="card flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-800/60">
                <Search size={28} className="text-slate-600" />
              </div>
              <p className="text-sm text-slate-500">
                Your analysis results will appear here
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Paste a message and click Analyze
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="card flex flex-col items-center justify-center p-12 text-center">
              <Loader2 size={32} className="animate-spin text-shield-400" />
              <p className="mt-4 text-sm text-slate-400">Scanning for fraud patterns…</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="animate-slide-up space-y-4">
              {/* Risk score */}
              <div className={`card border-2 p-5 ${riskBorderColor(result.riskLevel)} ${riskBgColor(result.riskLevel)}`}>
                <div className="flex flex-col items-center">
                  <RiskGauge level={result.riskLevel} score={result.score} />
                  <div className="mt-2">
                    <RiskBadge level={result.riskLevel} score={result.score} size="lg" />
                  </div>
                  <p className="mt-3 text-center text-sm leading-relaxed text-slate-400">
                    {result.summary}
                  </p>
                </div>
              </div>

              {/* Signals */}
              {result.signals.length > 0 && (
                <div className="card p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-400" />
                    <h3 className="text-sm font-semibold text-slate-300">
                      Warning Signs Detected ({result.signals.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {result.signals.map((signal) => {
                      const isExpanded = expandedSignal === signal.id;
                      return (
                        <div
                          key={signal.id}
                          className="rounded-xl border border-navy-700/40 bg-navy-950/40 overflow-hidden"
                        >
                          <button
                            onClick={() =>
                              setExpandedSignal(isExpanded ? null : signal.id)
                            }
                            className="flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-navy-800/40"
                          >
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-navy-800 text-[10px] font-bold text-slate-400">
                              +{signal.weight}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-200">
                                  {signal.category}
                                </span>
                                {signal.weight >= 18 && (
                                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold uppercase text-red-400">
                                    Critical
                                  </span>
                                )}
                              </div>
                              <code className="mt-0.5 block text-xs text-slate-500">
                                "{signal.matchedText}"
                              </code>
                            </div>
                            {isExpanded ? (
                              <ChevronUp size={14} className="mt-1 shrink-0 text-slate-600" />
                            ) : (
                              <ChevronDown size={14} className="mt-1 shrink-0 text-slate-600" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="border-t border-navy-700/40 px-3 py-3">
                              <p className="text-xs leading-relaxed text-slate-400">
                                {signal.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Safety advice */}
              <div className="card p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb size={16} className="text-shield-400" />
                  <h3 className="text-sm font-semibold text-slate-300">Safety Advice</h3>
                </div>
                <ul className="space-y-2">
                  {result.safetyAdvice.map((advice, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <ShieldCheck size={14} className="mt-0.5 shrink-0 text-shield-500" />
                      <span className="text-xs leading-relaxed text-slate-400">{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="rounded-xl border border-navy-700/40 bg-navy-900/40 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={14} className="mt-0.5 shrink-0 text-slate-500" />
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    ScamShield AI is an educational prototype. It cannot guarantee whether a message
                    is fraudulent or legitimate. Always verify independently and report suspicious
                    activity to 1930 or cybercrime.gov.in.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
