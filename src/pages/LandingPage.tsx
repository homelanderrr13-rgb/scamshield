import {
  ShieldCheck,
  Search,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  Lock,
  Eye,
  BookOpen,
  Zap,
} from "lucide-react";
import type { Page } from "@/components/Logo";

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-shield-500/10 blur-[120px]" />
          <div className="absolute right-0 top-40 h-[300px] w-[300px] rounded-full bg-navy-600/20 blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-shield-500/30 bg-shield-500/10 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-shield-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-shield-500" />
              </span>
              <span className="text-xs font-semibold text-shield-300">
                GTU AI Idea Forge 2026 Prototype
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Spot digital arrest scams
              <span className="block bg-gradient-to-r from-shield-400 to-shield-600 bg-clip-text text-transparent">
                before they spot you
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              ScamShield AI analyzes suspicious SMS, WhatsApp messages, and call transcripts for
              fraud patterns — then explains exactly what it found and why it matters.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => onNavigate("analyzer")}
                className="btn-primary group w-full sm:w-auto"
              >
                <Search size={18} />
                Analyze a Message
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate("dashboard")}
                className="btn-secondary w-full sm:w-auto"
              >
                <BarChart3 size={18} />
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-navy-800/40 bg-navy-900/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4">
          {[
            { icon: Search, label: "Messages Analyzed", value: "Live", sub: "Session-based" },
            { icon: AlertTriangle, label: "Detection Rules", value: "16+", sub: "Transparent" },
            { icon: ShieldCheck, label: "Risk Levels", value: "3", sub: "Low / Med / High" },
            { icon: Lock, label: "Your Privacy", value: "100%", sub: "Local storage only" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 py-6 text-center md:py-8"
            >
              <stat.icon size={20} className="text-shield-400" />
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <span className="text-[10px] text-slate-600">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white">How ScamShield AI Works</h2>
          <p className="mt-3 text-slate-400">
            Three steps from suspicious message to informed decision
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Paste & Analyze",
              desc: "Paste any suspicious SMS, WhatsApp message, or call transcript. The engine scans it against 16+ explainable fraud-detection rules in real time.",
              step: "01",
            },
            {
              icon: AlertTriangle,
              title: "See What's Suspicious",
              desc: "Every flagged phrase is highlighted in your text with a plain-language explanation of why it's a warning sign — no black-box magic.",
              step: "02",
            },
            {
              icon: ShieldCheck,
              title: "Get Safety Advice",
              desc: "Receive a risk score, practical safety steps, and clear guidance on what to do next. Legitimate and ambiguous messages are handled carefully.",
              step: "03",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="card card-hover group relative overflow-hidden p-6"
            >
              <div className="absolute right-4 top-4 text-5xl font-black text-navy-800/40 transition-colors group-hover:text-navy-700/40">
                {feature.step}
              </div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-shield-500/15 text-shield-400 transition-transform group-hover:scale-110">
                <feature.icon size={24} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What it detects */}
      <section className="border-y border-navy-800/40 bg-navy-900/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Built for the digital arrest epidemic
              </h2>
              <p className="mt-4 text-slate-400">
                In India, fraudsters impersonate police, CBI, and TRAI officials to threaten
                victims with fake "digital arrest" over video calls — extracting money through fear
                and isolation. ScamShield AI detects the patterns these scams share.
              </p>
              <button
                onClick={() => onNavigate("analyzer")}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-shield-400 hover:text-shield-300"
              >
                Try it with a sample scam message
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: AlertTriangle, label: "Threats & Intimidation", color: "text-red-400" },
                { icon: Eye, label: "Authority Impersonation", color: "text-orange-400" },
                { icon: Zap, label: "Urgency & Pressure", color: "text-amber-400" },
                { icon: BookOpen, label: "Information Harvesting", color: "text-yellow-400" },
                { icon: ShieldCheck, label: "Financial Demands", color: "text-shield-400" },
                { icon: Lock, label: "KYC / Account Lures", color: "text-blue-400" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-xl border border-navy-700/50 bg-navy-900/60 p-3"
                >
                  <item.icon size={18} className={item.color} />
                  <span className="text-xs font-medium text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-shield-500/20 bg-gradient-to-br from-navy-800/80 to-navy-900/80 p-8 text-center sm:p-12">
          <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-shield-500/10 blur-[80px]" />
          <div className="relative">
            <ShieldCheck size={40} className="mx-auto mb-4 text-shield-400" />
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to check a suspicious message?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              No sign-up, no API keys. Paste a message and get an instant risk assessment with
              full explanations.
            </p>
            <button
              onClick={() => onNavigate("analyzer")}
              className="btn-primary mx-auto mt-6 group"
            >
              <Search size={18} />
              Start Analyzing
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
