import { Shield } from "lucide-react";

export type Page = "home" | "analyzer" | "dashboard" | "about";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  onClick?: () => void;
}

export function Logo({ size = "md", showText = true, onClick }: LogoProps) {
  const sizes = {
    sm: { box: "h-8 w-8", icon: 16, text: "text-base" },
    md: { box: "h-10 w-10", icon: 20, text: "text-xl" },
    lg: { box: "h-14 w-14", icon: 28, text: "text-2xl" },
  };
  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 transition-opacity hover:opacity-90"
      disabled={!onClick}
    >
      <div
        className={`${s.box} flex items-center justify-center rounded-xl bg-gradient-to-br from-shield-500 to-shield-700 shadow-lg shadow-shield-500/20 transition-transform group-hover:scale-105`}
      >
        <Shield size={s.icon} className="text-white" strokeWidth={2.5} />
      </div>
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className={`${s.text} font-bold text-white`}>
            ScamShield<span className="text-shield-400"> AI</span>
          </span>
          {size !== "sm" && (
            <span className="mt-0.5 text-[11px] font-medium text-slate-500">
              Cyber Fraud Detector
            </span>
          )}
        </div>
      )}
    </button>
  );
}
