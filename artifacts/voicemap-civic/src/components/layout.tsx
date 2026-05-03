import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { AnimatedGlassBackground } from "./ui/glass";
import { ConflictAlert } from "./ConflictAlert";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/find-reps", label: "Find My Reps", highlight: "cyan" },
    { href: "/representatives", label: "Reps" },
    { href: "/issues", label: "Issues" },
    { href: "/petitions", label: "Petitions" },
    { href: "/messages", label: "Messages" },
    { href: "/accountability", label: "Accountability" },
    { href: "/scorecard", label: "Scorecard" },
    { href: "/on-record", label: "On Record" },
    { href: "/spotlight", label: "Spotlight" },
    { href: "/data-sources", label: "Sources", highlight: "amber" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-cyan-400/25 flex flex-col">
      <AnimatedGlassBackground />

      <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#050d1a]/70 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-[0_0_14px_rgba(6,182,212,0.45)] group-hover:shadow-[0_0_22px_rgba(6,182,212,0.65)] transition-all duration-500">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              VoiceMap <span className="text-cyan-400">Civic</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const h = (item as any).highlight;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "text-cyan-300 bg-cyan-400/12 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.25)]"
                      : h === "cyan"
                        ? "text-cyan-300/80 hover:text-cyan-200 hover:bg-cyan-400/8 border border-cyan-400/20"
                        : h === "amber"
                          ? "text-amber-300/70 hover:text-amber-200 hover:bg-amber-400/8 border border-amber-400/20"
                          : "text-white/45 hover:text-white/80 hover:bg-white/6"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            className="md:hidden text-white/50 hover:text-white transition-colors shrink-0"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/8 bg-[#050d1a]/90 backdrop-blur-2xl px-4 py-3 flex flex-col gap-1" style={{ animation: 'slide-up-fade 0.2s ease-out' }}>
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    isActive
                      ? "text-cyan-300 bg-cyan-400/12"
                      : "text-white/50 hover:text-white hover:bg-white/6"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <ConflictAlert />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
        {children}
      </main>

      <footer className="border-t border-white/8 bg-black/30 backdrop-blur-md py-6 mt-auto">
        <div className="container mx-auto px-4 text-center md:text-left md:flex justify-between items-center text-sm text-white/30">
          <p>VoiceMap Civic &copy; {new Date().getFullYear()} &mdash; Public Voice &amp; Representative Portal</p>
          <div className="mt-3 md:mt-0 flex items-center justify-center gap-5">
            <Link href="/about" className="hover:text-white/70 transition-colors">Mission</Link>
            <Link href="/data-sources" className="hover:text-white/70 transition-colors">Data Sources</Link>
            <Link href="/about" className="hover:text-white/70 transition-colors">Roadmap</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
