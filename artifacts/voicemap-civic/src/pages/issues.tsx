import { useState } from "react";
import { Layout } from "@/components/layout";
import { GlassCard, GlowButton, StatusBadge } from "@/components/ui/glass";
import { useStore } from "@/lib/store";
import { Issue, IssuePosition } from "@/lib/data";
import { getIssueRepAlignment } from "@/lib/transparency";

function SentimentBar({ positions }: { positions: IssuePosition[] }) {
  const total = positions.reduce((acc, p) => acc + p.count, 0);
  if (total === 0) return null;

  const support = positions.find(p => p.type === 'support')?.count || 0;
  const oppose = positions.find(p => p.type === 'oppose')?.count || 0;
  const unsure = positions.find(p => p.type === 'unsure')?.count || 0;
  const needsInfo = positions.find(p => p.type === 'needs-info')?.count || 0;

  const supportPct = (support / total) * 100;
  const opposePct = (oppose / total) * 100;
  const unsurePct = (unsure / total) * 100;
  const needsInfoPct = (needsInfo / total) * 100;

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between text-xs font-bold mb-1">
        <span className="text-cyan-300">{Math.round(supportPct)}% Support</span>
        <span className="text-white/40 text-[10px]">{total.toLocaleString()} responses</span>
        <span className="text-red-400">{Math.round(opposePct)}% Oppose</span>
      </div>
      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden flex">
        <div style={{ width: `${supportPct}%` }} className="h-full bg-cyan-400 transition-all duration-1000" />
        <div style={{ width: `${unsurePct}%` }} className="h-full bg-white/25 transition-all duration-1000" />
        <div style={{ width: `${needsInfoPct}%` }} className="h-full bg-amber-400 transition-all duration-1000" />
        <div style={{ width: `${opposePct}%` }} className="h-full bg-red-400 transition-all duration-1000" />
      </div>
      <div className="flex justify-center gap-5 text-[10px] text-white/40">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>Support</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>Oppose</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/30 inline-block"></span>Unsure</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>Needs Info</div>
      </div>
    </div>
  );
}

function RepAlignmentSection({ issue, reps }: { issue: Issue; reps: any[] }) {
  const [expanded, setExpanded] = useState(false);
  const alignments = getIssueRepAlignment(reps, issue);
  const withRecord = alignments.filter(a => a.overallAlignment !== 'no-record');
  const opposed = alignments.filter(a => a.overallAlignment === 'opposed');

  if (withRecord.length === 0) return null;

  const voteColors: Record<string, string> = { YEA: '#22d3ee', NAY: '#f87171', ABSTAIN: '#a78bfa', ABSENT: '#6b7280' };
  const alignmentMeta = {
    aligned: { label: 'Aligned', color: '#34d399', bg: 'bg-emerald-400/6 border-emerald-400/18' },
    opposed: { label: 'Voted against you', color: '#f87171', bg: 'bg-red-400/6 border-red-400/18' },
    mixed: { label: 'Mixed', color: '#fbbf24', bg: 'bg-amber-400/6 border-amber-400/18' },
    'no-record': { label: 'No record', color: '#6b7280', bg: 'bg-white/3 border-white/8' },
  };

  return (
    <div className="mt-5 border-t border-white/8 pt-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between group mb-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white">How Your Reps Are Aligned</span>
          {opposed.length > 0 && (
            <span className="text-[10px] bg-red-400/12 text-red-400 border border-red-400/22 px-2 py-0.5 rounded-full font-bold">
              {opposed.length} voted against you
            </span>
          )}
        </div>
        <svg className={`w-4 h-4 text-white/25 transition-transform duration-200 shrink-0 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="space-y-2" style={{ animation: 'slide-up-fade 0.3s ease-out' }}>
          {alignments.map(({ rep, relatedVotes, overallAlignment }) => {
            const meta = alignmentMeta[overallAlignment];
            return (
              <div key={rep.id} className={`rounded-xl border p-3 ${meta.bg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {rep.photoUrl ? (
                      <img src={rep.photoUrl} alt={rep.name} className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{rep.name}</p>
                      <p className="text-xs text-white/40 truncate">{rep.title}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold" style={{ color: meta.color }}>{meta.label}</p>
                    {relatedVotes.length > 0 && (
                      <div className="flex gap-1 mt-1 justify-end flex-wrap">
                        {relatedVotes.map((v, vi) => (
                          <span key={vi} className="text-[10px] font-black px-1.5 py-0.5 rounded border" style={{
                            color: voteColors[v.vote],
                            borderColor: `${voteColors[v.vote]}35`,
                            background: `${voteColors[v.vote]}12`,
                          }}>
                            {v.vote}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {relatedVotes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {relatedVotes.map((v, vi) => (
                      <p key={vi} className="text-[11px] text-white/40 leading-relaxed">
                        <span className="font-semibold text-white/55">{v.billId}:</span> {v.billName}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IssueCard({ issue, userVote, onVote, reps }: { issue: Issue, userVote?: string, onVote: (type: any) => void, reps: any[] }) {
  const voteButtons = [
    { type: 'support', label: 'Support', activeClass: 'bg-cyan-400/18 text-cyan-300 border-cyan-400/40 shadow-[0_0_16px_rgba(6,182,212,0.2)]' },
    { type: 'oppose', label: 'Oppose', activeClass: 'bg-red-400/18 text-red-300 border-red-400/40 shadow-[0_0_16px_rgba(248,113,113,0.2)]' },
    { type: 'unsure', label: 'Unsure', activeClass: 'bg-white/15 text-white border-white/30' },
    { type: 'needs-info', label: 'Needs Info', activeClass: 'bg-amber-400/18 text-amber-300 border-amber-400/40 shadow-[0_0_16px_rgba(251,191,36,0.2)]' },
  ];

  return (
    <GlassCard className="flex flex-col border-white/10">
      <div className="mb-5">
        <div className="flex justify-between items-start mb-3">
          <StatusBadge variant="info" className="uppercase tracking-[0.12em] text-[10px]">{issue.topic}</StatusBadge>
          <span className="text-[10px] text-white/25 bg-white/5 border border-white/8 px-2 py-1 rounded-lg font-mono">ID: {issue.id.toUpperCase()}</span>
        </div>
        <h3 className="text-xl font-black text-white mb-2 leading-tight">{issue.title}</h3>
        <p className="text-white/55 text-sm leading-relaxed mb-4">{issue.summary}</p>

        <div className="bg-white/3 p-4 rounded-xl border border-white/8 mb-5">
          <h4 className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1.5">Why It Matters</h4>
          <p className="text-sm text-white/65 leading-relaxed">{issue.whyItMatters}</p>
        </div>

        <SentimentBar positions={issue.positions} />
      </div>

      <div className="mt-auto pt-5 border-t border-white/8">
        <h4 className="text-xs text-white/40 uppercase tracking-wider font-bold mb-3">Register Your Position</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {voteButtons.map(btn => (
            <button
              key={btn.type}
              onClick={() => onVote(btn.type)}
              className={`h-10 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                userVote === btn.type
                  ? btn.activeClass
                  : 'bg-white/4 text-white/50 border-white/10 hover:bg-white/8 hover:text-white/80'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <RepAlignmentSection issue={issue} reps={reps} />
    </GlassCard>
  );
}

export default function Issues() {
  const { issues, userVotes, voteOnIssue, reps } = useStore();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Issue Voting Center</h1>
              <p className="text-white/45 text-sm">Register your position. We hold the record.</p>
            </div>
          </div>

          <div className="bg-amber-400/5 border border-amber-400/15 rounded-2xl p-4 flex gap-3 items-start mt-4">
            <svg className="w-4 h-4 text-amber-400/60 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-300/55 leading-relaxed">
              Sentiment shown here is based on submitted responses — community feedback, not a scientific poll. Expand each issue card to see how your representatives have voted on related legislation.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {issues.map((issue, i) => (
            <div key={issue.id} style={{ animation: `slide-up-fade 0.5s ease-out ${i * 100}ms both` }}>
              <IssueCard
                issue={issue}
                userVote={userVotes[issue.id]}
                onVote={(type) => voteOnIssue(issue.id, type)}
                reps={reps}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
