import { useMemo } from "react";
import { Layout } from "@/components/layout";
import { GlassCard, StatusBadge } from "@/components/ui/glass";
import { useStore } from "@/lib/store";
import { detectDonorConflicts, calculateAccountabilityScore } from "@/lib/transparency";

function MetricCard({ title, value, trend, trendLabel }: { title: string, value: string | number, trend: 'up' | 'down' | 'neutral', trendLabel: string }) {
  return (
    <GlassCard className="flex flex-col">
      <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">{title}</h3>
      <div className="text-4xl font-extrabold text-white mb-4">{value}</div>
      <div className="mt-auto flex items-center gap-2 text-sm">
        {trend === 'up' && <span className="text-emerald-400 font-bold flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> {trendLabel}</span>}
        {trend === 'down' && <span className="text-red-400 font-bold flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg> {trendLabel}</span>}
        {trend === 'neutral' && <span className="text-amber-400 font-bold flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg> {trendLabel}</span>}
      </div>
    </GlassCard>
  );
}

function ConflictSeverityBar({ pct }: { pct: number }) {
  const color = pct >= 25 ? '#f87171' : pct >= 15 ? '#fb923c' : '#fbbf24';
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: color, animation: 'bar-fill 1s ease-out' }} />
      </div>
      <span className="text-xs font-bold shrink-0" style={{ color }}>{pct.toFixed(1)}%</span>
    </div>
  );
}

export default function Accountability() {
  const { accountability, reps } = useStore();

  const allConflicts = useMemo(() => {
    return reps.flatMap(rep => {
      const conflicts = detectDonorConflicts(rep);
      return conflicts.map(c => ({ ...c, repName: rep.name, repTitle: (rep as any).title }));
    }).sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    });
  }, [reps]);

  const repScores = useMemo(() => {
    return reps.map(rep => ({ rep, score: calculateAccountabilityScore(rep) }))
      .sort((a, b) => a.score.total - b.score.total)
      .slice(0, 5);
  }, [reps]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Accountability Dashboard</h1>
            <p className="text-white/45 text-sm">Tracking responses, voting records, and alignment with verified community sentiment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4">
          <MetricCard title="Total Engagement" value={accountability.issueEngagement.toLocaleString()} trend="up" trendLabel="+12% this month" />
          <MetricCard title="Reps Contacted" value={accountability.repsContacted} trend="up" trendLabel="+5 new this week" />
          <MetricCard title="Avg Response Time" value="4.2 Days" trend="up" trendLabel="Improved from 6 days" />
          <MetricCard title="Unanswered > 14 Days" value={accountability.noResponseAfterDays} trend="down" trendLabel="Warning threshold" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <GlassCard className="animate-in fade-in slide-in-from-bottom-4 border-white/10 bg-black/20" style={{ animationDelay: "150ms" }}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              You Said / They Did
            </h2>
            <div className="space-y-6">
              {accountability.youSaidTheyDidComparisons.map((item, i) => (
                <div key={i} className="bg-black/25 p-4 rounded-2xl border border-white/8">
                  <h3 className="font-bold text-white text-lg mb-3">{item.issue}</h3>
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Public Sentiment</p>
                      <p className="text-white font-medium bg-primary/10 border border-primary/20 px-3 py-1.5 rounded inline-block">{item.publicSentiment}</p>
                    </div>
                    <div className="hidden sm:block text-muted-foreground">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Official Action</p>
                      <p className={`font-medium px-3 py-1.5 rounded inline-block border ${item.officialAction.includes('Aligned') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                        {item.officialAction}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "300ms" }}>
            <GlassCard className="border-white/10 bg-black/20">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Official Responses</h2>
              <ul className="space-y-4">
                {accountability.recentOfficialActions.map((action, i) => (
                  <li key={i} className="flex gap-4 items-start pb-4 border-b border-white/10 last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 font-bold text-sm">
                      {action.rep.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-white font-medium">{action.rep}</p>
                      <p className="text-sm text-muted-foreground mt-1">{action.action}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="border-red-500/25 bg-red-500/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Delinquent Responses
              </h2>
              <p className="text-sm text-white/80 mb-4">The following offices have failed to respond to verified constituent petitions within the standard 14-day window.</p>
              <div className="bg-black/50 p-4 rounded border border-red-500/20 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">State Senator Rodriguez</p>
                  <p className="text-xs text-muted-foreground">Re: Housing Zoning Reform</p>
                </div>
                <StatusBadge variant="danger">21 Days Late</StatusBadge>
              </div>
            </GlassCard>
          </div>
        </div>

        <GlassCard className="border-orange-500/20 bg-orange-500/3" style={{ animation: 'slide-up-fade 0.5s ease-out 200ms both' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-orange-400/15 border border-orange-400/25 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Donor vs. Constituent Conflict Detector</h2>
              <p className="text-white/40 text-sm">Flags votes where a rep sided with major campaign donors instead of constituent sentiment</p>
            </div>
          </div>

          {allConflicts.length === 0 ? (
            <div className="text-center py-10 text-white/30">
              <svg className="w-10 h-10 mx-auto mb-3 text-emerald-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <p className="font-semibold text-emerald-400/70">No donor conflicts detected across all representatives</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allConflicts.map((conflict, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-4 ${
                    conflict.severity === 'high' ? 'bg-red-500/5 border-red-500/25' :
                    conflict.severity === 'medium' ? 'bg-orange-500/5 border-orange-500/25' :
                    'bg-amber-500/5 border-amber-500/20'
                  }`}
                  style={{ animation: `slide-up-fade 0.4s ease-out ${i * 60}ms both` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{conflict.repName}</span>
                        <StatusBadge variant={conflict.severity === 'high' ? 'danger' : 'warning'}>
                          {conflict.severity.toUpperCase()} CONFLICT
                        </StatusBadge>
                        <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded font-mono">{conflict.billId}</span>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{conflict.conflictDescription}</p>
                    </div>
                    <div className={`text-2xl font-black shrink-0 ${
                      conflict.vote === 'NAY' ? 'text-red-400' : conflict.vote === 'YEA' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>{conflict.vote}</div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-white/35 shrink-0">Donor industry share:</span>
                    <ConflictSeverityBar pct={conflict.donorPct} />
                  </div>
                  <div className="mt-2 text-xs text-white/35 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-red-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {conflict.constituentAlignment}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="border-red-500/15 bg-red-500/3" style={{ animation: 'slide-up-fade 0.5s ease-out 300ms both' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-red-400/15 border border-red-400/25 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Lowest Accountability Scores</h2>
              <p className="text-white/40 text-sm">Representatives with the most voting misalignment, controversies and donor conflicts</p>
            </div>
          </div>
          <div className="space-y-3">
            {repScores.map(({ rep, score }, i) => (
              <div key={rep.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                <span className="text-sm text-white/25 font-black w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{rep.name}</p>
                  <p className="text-xs text-white/35">{rep.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  {score.opposedVotes > 0 && (
                    <div className="text-center">
                      <p className="text-sm font-black text-red-400">{score.opposedVotes}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-wider">Opposed</p>
                    </div>
                  )}
                  {rep.controversies.length > 0 && (
                    <div className="text-center">
                      <p className="text-sm font-black text-orange-400">{rep.controversies.length}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-wider">Controv.</p>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 w-28">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${score.total}%`,
                        background: score.grade === 'A' || score.grade === 'B' ? '#34d399' : score.grade === 'C' ? '#fbbf24' : '#f87171',
                        animation: 'bar-fill 1s ease-out'
                      }} />
                    </div>
                    <span className={`text-xs font-black ${
                      score.grade === 'A' ? 'text-emerald-400' : score.grade === 'B' ? 'text-cyan-400' :
                      score.grade === 'C' ? 'text-amber-400' : score.grade === 'D' ? 'text-orange-400' : 'text-red-400'
                    }`}>{score.grade}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
}
