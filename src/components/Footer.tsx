import type { ReactNode } from "react";

interface FooterLink {
  label: string;
  onClick: () => void;
}

interface FooterProps {
  onNavigate: (page: "home" | "analyzer" | "dashboard" | "about") => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const links: { title: string; items: FooterLink[] }[] = [
    {
      title: "Tool",
      items: [
        { label: "Message Analyzer", onClick: () => onNavigate("analyzer") },
        { label: "Dashboard", onClick: () => onNavigate("dashboard") },
        { label: "About", onClick: () => onNavigate("about") },
      ],
    },
  ];

  return (
    <footer className="border-t border-navy-800/60 bg-navy-950/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <p className="text-sm font-bold text-white">ScamShield AI</p>
            <p className="mt-2 max-w-xs text-sm text-slate-500">
              A transparency-first scam message detector for the GTU AI Idea Forge 2026 hackathon.
            </p>
          </div>
          {links.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold text-slate-300">{section.title}</p>
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={item.onClick}
                      className="text-sm text-slate-500 transition-colors hover:text-shield-400"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-sm font-semibold text-slate-300">Resources</p>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-slate-500">National Cybercrime Helpline: 1930</span>
              </li>
              <li>
                <span className="text-sm text-slate-500">cybercrime.gov.in</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-navy-800/40 pt-6">
          <p className="text-center text-xs text-slate-600">
            ScamShield AI is a prototype for educational purposes only. It does not guarantee whether
            a message is fraudulent. Always verify independently and report to official channels.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6">{children}</div>;
}
