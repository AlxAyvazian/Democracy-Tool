import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { GlassCard, GlowButton, StatusBadge } from "@/components/ui/glass";
import { useStore } from "@/lib/store";
import { calculateAccountabilityScore, detectDonorConflicts } from "@/lib/transparency";
import { Representative } from "@/lib/data";

function GradeRing({ grade, score }: { grade: string; score: number }) {
  const colors: Record<string, { stroke: string; text: string; glow: string }> = {
    A: { stroke: '#34d399', text: 'text-emerald-400', glow: 'rgba(52,211,153,0.4)' },
    B: { stroke: '#22d3ee', text: 'text-cyan-400', glow: 'rgba(34,211,238,0.4)' },
    C: { stroke: '#fbbf24', text: 'text-amber-400', glow: 'rgba(251,191,36,0.4)' },
    D: { stroke: '#f97316', text: 'text-orange-400', glow: 'rgba(249,115,22,0.4)' },
    F: { stroke: '#f87171', text: 'text-red-400', glow: 'rgba(248,113,113,0.4)' },
  };
  const c = colors[grade] || colors['C'];
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={c.stroke} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${c.glow})`, transition: 'stroke-dasharray 1s ease-out' }}
        />
      </svg>
      <div className="text-center">
        <span className={`text-xl font-black ${c.text}`}>{grade}</span>
      </div>
    </div>
  );
}

function ScoreBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{value > 0 ? `+${value}` : value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.abs(value) / max * 100}%`,
            background: color,
            animation: 'bar-fill 1s ease-out',
          }}
        />
      </div>
    </div>
  );
}

function ConflictIndicator({ count }: { count: number }) {
  if (count === 0) return (
    <div className="flex items-center gap-1.5 text-emerald-400">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-xs font-semibold">No conflicts</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 text-red-400">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span className="text-xs font-semibold">{count} donor conflict{count > 1 ? 's' : ''}</span>
    </div>
  );
}

type SortKey = 'score' | 'name' | 'conflicts' | 'controversies';

export default function Scorecard() {
  const { reps } = useStore();
  const [sortBy, setSortBy] = useState<SortKey>('score');
  const [expanded, setExpanded] = useState<string | null>(null);

  const scored = useMemo(() => {
    return reps.map(rep => ({
      rep,
      score: calculateAccountabilityScore(rep),
    })).sort((a, b) => {
      if (sortBy === 'score') return b.score.total - a.score.total;
      if (sortBy === 'name') return a.rep.name.localeCompare(b.rep.name);
      if (sortBy === 'conflicts') return b.score.donorConflicts.length - a.score.donorConflicts.length;
      if (sortBy === 'controversies') return b.rep.controversies.length - a.rep.controversies.length;
      return 0;
    });
  }, [reps, sortBy]);

  const avgScore = Math.round(scored.reduce((s, x) => s + x.score.total, 0) / scored.length);
  const totalConflicts = scored.reduce((s, x) => s + x.score.donorConflicts.length, 0);
  const totalControversies = scored.reduce((s, x) => s + x.rep.controversies.length, 0);
  const poorAccountability = scored.filter(x => x.score.grade === 'D' || x.score.grade === 'F').length;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8" style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shadow-[0_0_24px_rgba(251,191,36,0.14)]">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Transparency Scorecard</h1>
              <p className="text-white/45 text-sm">Accountability ratings based on voting alignment, donor conflicts & controversy record</p>
            </div>
          </div>
          <div className="bg-amber-400/5 border border-amber-400/15 rounded-2xl p-4 text-xs text-amber-300/60 flex items-start gap-2 mt-3 max-w-3xl">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Scores are calculated from placeholder data. Scoring methodology: base 50pts + voting alignment (up to +40) - controversy penalties - donor conflict penalties + bonuses for clean records.
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Avg Accountability Score', value: `${avgScore}/100`, color: 'text-cyan-300' },
            { label: 'Total Donor Conflicts', value: totalConflicts, color: 'text-red-400' },
            { label: 'Total Controversies', value: totalControversies, color: 'text-orange-400' },
            { label: 'Poor Accountability (D/F)', value: poorAccountability, color: 'text-red-400' },
          ].map((m, i) => (
            <GlassCard key={i} className="text-center py-5 border-white/10 bg-black/20" style={{ animation: `slide-up-fade 0.5s ease-out ${i * 80}ms both` }}>
              <p className={`text-3xl font-black ${m.color}`}>{m.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1 font-semibold">{m.label}</p>
            </GlassCard>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Sort by:</span>
          {(['score', 'name', 'conflicts', 'controversies'] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${sortBy === key ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_18px_rgba(6,182,212,0.12)]' : 'bg-white/4 text-white/40 border border-white/6 hover:bg-white/8'}`}
            >
              {key === 'score' ? 'Score' : key === 'name' ? 'Name' : key === 'conflicts' ? 'Conflicts' : 'Controversies'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {scored.map(({ rep, score }, idx) => (
            <div key={rep.id} style={{ animation: `slide-up-fade 0.5s ease-out ${idx * 50}ms both` }}>
              <GlassCard
                className={`cursor-pointer hover:border-white/15 transition-all duration-300 border-white/10 bg-black/20 ${
                  score.grade === 'A' ? 'hover:border-emerald-400/20' :
                  score.grade === 'B' ? 'hover:border-cyan-400/20' :
                  score.grade === 'C' ? 'hover:border-amber-400/20' :
                  'hover:border-red-400/20'
                }`}
                onClick={() => setExpanded(expanded === rep.id ? null : rep.id)}
              >
                <div className="flex items-center gap-4">
                    <div className="text-2xl font-black text-white/20 w-6 text-center shrink-0 tabular-nums">{idx + 1}</div>

                  {rep.photoUrl ? (
                    <img src={rep.photoUrl} alt={rep.name} className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/30 shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                  )}

                  <GradeRing grade={score.grade} score={score.total} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="text-base font-bold text-white">{rep.name}</h3>
                        <p className="text-white/45 text-xs">{rep.title} &middot; {rep.district}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <div className="text-right">
                          <span className="text-2xl font-black text-white">{score.total}</span>
                          <span className="text-white/35 text-sm">/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-white/50">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {score.alignedVotes} aligned
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/50">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                        {score.opposedVotes} opposed
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/50">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        {rep.controversies.length} controversies
                      </div>
                      <ConflictIndicator count={score.donorConflicts.length} />
                    </div>
                  </div>

                  <svg
                    className={`w-4 h-4 text-white/30 transition-transform duration-300 shrink-0 ${expanded === rep.id ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {expanded === rep.id && (
                  <div className="mt-5 pt-5 border-t border-white/8 grid grid-cols-1 md:grid-cols-2 gap-6" style={{ animation: 'slide-up-fade 0.3s ease-out' }}>
                    <div className="space-y-3">
                      <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Score Breakdown</p>
                      <ScoreBar value={score.breakdown.votingAlignment} max={40} color="#22d3ee" label="Voting alignment bonus" />
                      <ScoreBar value={-score.breakdown.controversyPenalty} max={40} color="#f87171" label="Controversy penalty" />
                      <ScoreBar value={-score.breakdown.donorConflictPenalty} max={40} color="#fb923c" label="Donor conflict penalty" />
                      <ScoreBar value={score.breakdown.bonuses} max={15} color="#34d399" label="Clean record bonuses" />
                      <div className="pt-2 border-t border-white/8 flex justify-between items-center">
                        <span className="text-xs text-white/50">Base score</span>
                        <span className="text-xs text-white/70 font-bold">50 pts</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Donor Conflict Flags</p>
                      {score.donorConflicts.length === 0 ? (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/15">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          <span className="text-sm text-emerald-400/80">No donor conflicts detected</span>
                        </div>
                      ) : (
                        score.donorConflicts.map((c, i) => (
                          <div key={i} className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-red-300">{c.billId}</span>
                              <StatusBadge variant="danger">{c.severity.toUpperCase()}</StatusBadge>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">{c.conflictDescription}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
