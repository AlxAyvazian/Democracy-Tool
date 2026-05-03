import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { detectDonorConflicts } from "@/lib/transparency";
import { Link } from "wouter";

const DISMISS_KEY = "voicemap_conflict_alert_dismissed";

export function ConflictAlert() {
  const { reps } = useStore();
  const [dismissed, setDismissed] = useState(() => {
    try {
      const stored = localStorage.getItem(DISMISS_KEY);
      if (!stored) return false;
      const ts = parseInt(stored, 10);
      return Date.now() - ts < 24 * 60 * 60 * 1000;
    } catch { return false; }
  });

  const allConflicts = reps.flatMap(rep => detectDonorConflicts(rep));
  const highSeverity = allConflicts.filter(c => c.severity === "high");

  if (dismissed || allConflicts.length === 0) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setDismissed(true);
  };

  const mostSevere = highSeverity[0] || allConflicts[0];

  return (
    <div
      className="relative z-40 border-b border-red-500/20 bg-red-500/6 backdrop-blur-md"
      style={{ animation: "slide-up-fade 0.4s ease-out" }}
    >
      <div className="container mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="w-5 h-5 rounded-md bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="text-red-300 text-xs font-black uppercase tracking-wider shrink-0">
            {highSeverity.length > 0 ? `${highSeverity.length} High-Severity Conflict${highSeverity.length > 1 ? "s" : ""}` : `${allConflicts.length} Donor Conflict${allConflicts.length > 1 ? "s" : ""} Detected`}
          </span>
          <span className="text-white/50 text-xs truncate">
            {mostSevere.repName} voted {mostSevere.vote} on &ldquo;{mostSevere.billName}&rdquo; while {mostSevere.donorIndustry} contributed {mostSevere.donorPct.toFixed(0)}% of campaign funds.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/scorecard">
            <button className="text-[10px] px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/25 text-red-300 font-bold hover:bg-red-500/25 transition-all whitespace-nowrap">
              View All
            </button>
          </Link>
          <button onClick={handleDismiss} className="text-white/25 hover:text-white/60 transition-colors" aria-label="Dismiss">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
