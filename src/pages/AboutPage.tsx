import {
  ShieldCheck,
  AlertTriangle,
  Eye,
  Search,
  Cpu,
  Database,
  Lock,
  Github,
  BookOpen,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { getEngineInfo } from "@/engine/detectionEngine";
import { SAMPLE_MESSAGES } from "@/data/sampleMessages";
import type { Page } from "@/components/Logo";

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const engineInfo = getEngineInfo();

  const techStack = [
    { name: "React 18", desc: "UI framework with hooks" },
    { name: "TypeScript", desc: "Type-safe development" },
    { name: "Vite", desc: "Fast build tooling" },
    { name: "Tailwind CSS", desc: "Utility-first styling" },
    { name: "Lucide Icons", desc: "Consistent icon system" },
    { name: "LocalStorage API", desc: "Browser-based history" },
  ];

  const futureImprovements = [
    "Integrate an LLM API (e.g. OpenAI / Gemini) for deeper contextual analysis beyond pattern matching",
    "Add voice/call transcript upload with speech-to-text transcription",
    "Support regional Indian languages (Hindi, Gujarati, Tamil, etc.)",
    "Build a community-reporting feature to crowdsource new scam patterns",
    "Add browser extension for real-time WhatsApp Web and SMS analysis",
    "Implement server-side analysis with Supabase for aggregate scam trend tracking",
    "Add two-factor-auth and user accounts to sync history across devices",
  ];

  const limitations = [
    "The baseline engine uses pattern matching — it can miss novel scam formats or cleverly worded messages.",
    "False positives are possible: legitimate messages containing words like 'OTP', 'legal', or 'urgent' may be flagged.",
    "It cannot analyze images, voice notes, or links — only text input is supported.",
    "The detector does not verify sender identity or phone numbers.",
    "No AI model is integrated yet — all analysis is rule-based and transparent.",
    "History is stored locally per browser — it will not sync across devices.",
  ];

  const testCases = SAMPLE_MESSAGES.map((s) => ({
    label: s.label,
    description: s.description,
    expectedRisk: s.expectedRisk,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6">
      {/* Header */}
      <div className="mb-12 max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-shield-500/30 bg-shield-500/10 px-4 py-1.5">
          <BookOpen size={14} className="text-shield-400" />
          <span className="text-xs font-semibold text-shield-300">About ScamShield AI</span>
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Fighting the digital arrest epidemic
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          ScamShield AI is a transparency-first scam-message detector built for the GTU AI Idea
          Forge 2026 hackathon. It helps ordinary people recognize the patterns used in digital
          arrest scams, impersonation fraud, and other cyber fraud schemes.
        </p>
      </div>

      {/* Problem section */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <AlertTriangle size={22} className="text-amber-400" />
          The Problem
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-200">Digital Arrest Scams</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Fraudsters impersonate police, CBI, TRAI, or customs officials and threaten victims
              with fake "digital arrest" over video calls. They claim a package in the victim's
              name contains drugs, passports, or illegal items — then demand money to "clear" the
              case. Victims are told to stay on the call and not tell anyone, creating isolation
              and panic.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-slate-200">The Scale</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              India lost over Rs 1,750 crore to cyber fraud in 2024 alone. Digital arrest scams
              have targeted students, senior citizens, and professionals alike. Most victims don't
              recognize the scam until after they've transferred money. Education and awareness
              are the first line of defense.
            </p>
          </div>
        </div>
      </section>

      {/* Solution section */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <ShieldCheck size={22} className="text-shield-400" />
          Our Solution
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Transparent Detection",
              desc: "16+ explainable rules scan for known fraud patterns. Every flagged phrase comes with a plain-language explanation — no black-box magic.",
            },
            {
              icon: Eye,
              title: "Visual Highlighting",
              desc: "Suspicious phrases are highlighted directly in your message so you can see exactly what triggered each warning.",
            },
            {
              icon: TrendingUp,
              title: "Risk Scoring & Advice",
              desc: "A weighted scoring system produces Low/Medium/High risk. Each result includes practical safety advice tailored to the detected patterns.",
            },
          ].map((item) => (
            <div key={item.title} className="card card-hover p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-shield-500/15 text-shield-400">
                <item.icon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture section */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <Cpu size={22} className="text-shield-400" />
          Architecture & Detection Engine
        </h2>
        <div className="card p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">How It Works</h3>
              <ol className="mt-3 space-y-3">
                {[
                  "User pastes a suspicious message into the Analyzer.",
                  "The detection engine scans the text against 16+ pattern-matching rules organized into 7 categories.",
                  "Each matching rule contributes a weighted score (10–25 points) to the total risk score.",
                  "Legitimacy indicators (OTP messages, delivery updates, personal notes) reduce false positives.",
                  "The score is mapped to Low (<18), Medium (18–44), or High (45+) risk.",
                  "Every signal is displayed with its category, matched text, and plain-language explanation.",
                  "Safety advice is dynamically generated based on which categories were triggered.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-400">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-shield-500/15 text-[10px] font-bold text-shield-400">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Rule Categories</h3>
              <div className="mt-3 space-y-2">
                {engineInfo.categories.map((cat) => {
                  const rules = engineInfo.rules.filter((r) => r.category === cat);
                  return (
                    <div
                      key={cat}
                      className="rounded-lg border border-navy-700/40 bg-navy-950/40 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">{cat}</span>
                        <span className="rounded-full bg-navy-800/60 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                          {rules.length} rule{rules.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {rules.map((r) => (
                          <span
                            key={r.id}
                            className="rounded bg-navy-800/40 px-1.5 py-0.5 text-[10px] text-slate-500"
                            title={r.explanation}
                          >
                            +{r.weight}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-navy-700/40 pt-4">
            <p className="text-xs leading-relaxed text-slate-500">
              <strong className="text-slate-400">AI Integration Path:</strong> The detection engine
              is isolated in <code className="text-shield-400">src/engine/detectionEngine.ts</code>{" "}
              and exposes a single <code className="text-shield-400">analyzeMessage()</code>{" "}
              function. To integrate an LLM API, replace or augment this function with a call to
              OpenAI, Gemini, or any other model — the UI components consume the same{" "}
              <code className="text-shield-400">AnalysisResult</code> interface and require no
              changes.
            </p>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <Database size={22} className="text-shield-400" />
          Technology Stack
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-3 rounded-xl border border-navy-700/40 bg-navy-900/40 p-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-shield-500/15 text-shield-400">
                <Cpu size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{tech.name}</p>
                <p className="text-xs text-slate-500">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Limitations */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <AlertTriangle size={22} className="text-amber-400" />
          Limitations
        </h2>
        <div className="card p-5">
          <ul className="space-y-2.5">
            {limitations.map((lim, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/60" />
                <span className="leading-relaxed">{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Test cases */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <Search size={22} className="text-shield-400" />
          Test Cases
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          The app includes {testCases.length} sample messages covering scams, legitimate messages,
          and ambiguous cases. Load any of them from the "Sample Messages" menu in the Analyzer.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {testCases.map((tc) => (
            <div
              key={tc.label}
              className="rounded-xl border border-navy-700/40 bg-navy-900/40 p-4"
            >
              <div className="flex items-center gap-2">
                {tc.expectedRisk === "high" ? (
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-red-400">
                    Scam
                  </span>
                ) : tc.expectedRisk === "medium" ? (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400">
                    Ambiguous
                  </span>
                ) : (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-green-400">
                    Legitimate
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-200">{tc.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{tc.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Future improvements */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <TrendingUp size={22} className="text-shield-400" />
          Future Improvements
        </h2>
        <div className="card p-5">
          <ul className="space-y-2.5">
            {futureImprovements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                <ArrowRight size={14} className="mt-0.5 shrink-0 text-shield-500" />
                <span className="leading-relaxed">{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <Lock size={22} className="text-shield-400" />
          Privacy
        </h2>
        <div className="card p-5">
          <p className="text-sm leading-relaxed text-slate-400">
            ScamShield AI processes messages entirely in your browser. No message content is sent
            to any server. Analysis history stores only a short 80-character preview of each
            message in your browser's local storage — the full text is never persisted. You can
            clear all history at any time from the Analyzer or Dashboard. No account or sign-up is
            required.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-shield-500/20 bg-gradient-to-br from-navy-800/60 to-navy-900/60 p-6 text-center">
        <p className="text-sm text-slate-400">Ready to try it?</p>
        <button onClick={() => onNavigate("analyzer")} className="btn-primary mt-3">
          <Search size={16} />
          Open the Analyzer
        </button>
      </div>
    </div>
  );
}
