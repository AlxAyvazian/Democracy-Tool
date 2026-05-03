import { useState, useMemo, useRef, useCallback } from "react";
import { Layout } from "@/components/layout";
import { GlassCard, GlowButton, StatusBadge } from "@/components/ui/glass";
import { useStore } from "@/lib/store";
import { Representative, Level } from "@/lib/data";
import { calculateAccountabilityScore, getAllTopics } from "@/lib/transparency";
import { getRepExternalLinks, getBillExternalLinks } from "@/lib/externalLinks";

function ExternalLinkChip({ href, label, color = "cyan" }: { href: string | null; label: string; color?: "cyan" | "amber" | "red" | "indigo" | "emerald" }) {
  if (!href) return null;
  const colorMap = {
    cyan:    "bg-cyan-400/8 border-cyan-400/20 text-cyan-300/70 hover:text-cyan-200 hover:bg-cyan-400/15",
    amber:   "bg-amber-400/8 border-amber-400/20 text-amber-300/70 hover:text-amber-200 hover:bg-amber-400/15",
    red:     "bg-red-400/8 border-red-400/20 text-red-300/70 hover:text-red-200 hover:bg-red-400/15",
    indigo:  "bg-indigo-400/8 border-indigo-400/20 text-indigo-300/70 hover:text-indigo-200 hover:bg-indigo-400/15",
    emerald: "bg-emerald-400/8 border-emerald-400/20 text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-400/15",
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition-all ${colorMap[color]}`}
    >
      <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      {label}
    </a>
  );
}

function PhotoUpload({ rep, onUpload }: { rep: Representative; onUpload: (id: string, url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(rep.id, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/15 bg-white/5 flex items-center justify-center transition-all duration-300 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]">
        {rep.photoUrl ? (
          <img src={rep.photoUrl} alt={rep.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-white/30 group-hover:text-cyan-400/60 transition-colors">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[9px] font-semibold uppercase tracking-wider">Add Photo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
          <svg className="w-5 h-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function VoteBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden flex-1">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${pct}%`, background: color, animation: `bar-fill 1.2s ease-out` }}
      />
    </div>
  );
}

type RepTab = 'overview' | 'voting' | 'finance' | 'controversies';

function RepDetailModal({ rep, onClose, onPhotoUpload }: { rep: Representative; onClose: () => void; onPhotoUpload: (id: string, url: string) => void }) {
  const [tab, setTab] = useState<RepTab>('overview');

  const tabs: { id: RepTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'voting', label: 'Voting Record', count: rep.votingRecord.length },
    { id: 'finance', label: 'Campaign Finance' },
    { id: 'controversies', label: 'Controversies', count: rep.controversies.length },
  ];

  const levelVariant = rep.level === 'federal' ? 'info' : rep.level === 'state' ? 'warning' : 'success';

  const voteColorMap = { YEA: '#22d3ee', NAY: '#f87171', ABSTAIN: '#a78bfa', ABSENT: '#6b7280' };
  const alignmentColorMap = { aligned: '#34d399', opposed: '#f87171', unknown: '#9ca3af' };

  const formatMoney = (n: number) => n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : `$${(n / 1_000).toFixed(0)}K`;

  const severityVariant = { low: 'warning' as const, medium: 'warning' as const, high: 'danger' as const };
  const categoryLabels = { ethics: 'Ethics', vote: 'Voting', statement: 'Statement', financial: 'Financial', conduct: 'Conduct' };
  const extLinks = getRepExternalLinks(rep);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/12 bg-[#0d1829]/95 backdrop-blur-2xl shadow-[0_0_80px_rgba(6,182,212,0.12)] flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slide-up-fade 0.3s ease-out' }}
      >
        <div className="flex items-start gap-5 p-6 border-b border-white/8">
          <PhotoUpload rep={rep} onUpload={onPhotoUpload} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white leading-tight">{rep.name}</h2>
                <p className="text-cyan-300/70 font-medium mt-0.5">{rep.title} &middot; {rep.district}</p>
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <StatusBadge variant={levelVariant}>{rep.level.replace('-', ' ').toUpperCase()}</StatusBadge>
              {rep.party && <StatusBadge variant="default">{rep.party}</StatusBadge>}
              {rep.controversies.length > 0 && (
                <StatusBadge variant="danger">{rep.controversies.length} Controvers{rep.controversies.length > 1 ? 'ies' : 'y'}</StatusBadge>
              )}
            </div>
          </div>
        </div>

        <div className="flex border-b border-white/8 px-2 shrink-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
                tab === t.id
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${tab === t.id ? 'bg-cyan-400/20 text-cyan-300' : 'bg-white/10 text-white/50'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {tab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a href={`tel:${rep.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Phone</p>
                    <p className="text-xs text-white font-medium">{rep.phone}</p>
                  </div>
                </a>
                <a href={`mailto:${rep.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-indigo-400/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-400/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Email</p>
                    <p className="text-xs text-white font-medium truncate max-w-[120px]">{rep.email}</p>
                  </div>
                </a>
                <a href={rep.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Website</p>
                    <p className="text-xs text-white font-medium">Official Site</p>
                  </div>
                </a>
              </div>

              {rep.committees.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Committees</p>
                  <div className="flex flex-wrap gap-2">
                    {rep.committees.map(c => (
                      <span key={c} className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300/80 text-xs font-medium">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Verify on External Sources</p>
                <div className="flex flex-wrap gap-1.5">
                  <ExternalLinkChip href={extLinks.ballotpedia} label="BallotPedia" color="cyan" />
                  <ExternalLinkChip href={extLinks.votesmart} label="VoteSmart" color="cyan" />
                  <ExternalLinkChip href={extLinks.govtrack} label="GovTrack" color="cyan" />
                  <ExternalLinkChip href={extLinks.congress} label="Congress.gov" color="cyan" />
                  <ExternalLinkChip href={extLinks.propublica} label="ProPublica" color="indigo" />
                </div>
              </div>

              {rep.recentActions.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Recent Actions</p>
                  <div className="space-y-2">
                    {rep.recentActions.map((a, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                        <span className="text-cyan-400/70 text-xs min-w-[70px] shrink-0 mt-0.5">
                          {new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                        </span>
                        <span className="text-white/80 text-sm">{a.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'voting' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/30">Placeholder data — verify on live sources:</p>
                <div className="flex gap-1.5">
                  <ExternalLinkChip href={extLinks.govtrack} label="GovTrack" color="cyan" />
                  <ExternalLinkChip href={extLinks.congress} label="Congress.gov" color="cyan" />
                  <ExternalLinkChip href={extLinks.propublica} label="ProPublica" color="indigo" />
                </div>
              </div>
              {rep.votingRecord.length === 0 ? (
                <div className="text-center py-12 text-white/30">No voting records available.</div>
              ) : (
                rep.votingRecord.map((v, i) => (
                  <div
                    key={v.billId}
                    className="flex gap-4 p-4 rounded-xl bg-white/3 border border-white/8 hover:border-white/12 transition-all"
                    style={{ animation: `slide-up-fade 0.4s ease-out ${i * 60}ms both` }}
                  >
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        className="w-14 h-8 rounded-md flex items-center justify-center text-xs font-bold tracking-wide"
                        style={{ background: `${voteColorMap[v.vote]}18`, color: voteColorMap[v.vote], border: `1px solid ${voteColorMap[v.vote]}40` }}
                      >
                        {v.vote}
                      </div>
                      <div
                        className="text-[9px] font-semibold uppercase tracking-wider"
                        style={{ color: alignmentColorMap[v.alignment] }}
                      >
                        {v.alignment}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-white font-semibold text-sm leading-tight">{v.billName}</p>
                          <p className="text-white/35 text-xs mt-0.5">{v.billId}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-white/40 text-xs">{new Date(v.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-white/50 capitalize">{v.topic}</span>
                        </div>
                      </div>
                      <p className="text-white/55 text-xs mt-2 leading-relaxed">{v.summary}</p>
                      {(() => {
                        const billLinks = getBillExternalLinks(v.billId, v.billName);
                        return (
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            <ExternalLinkChip href={billLinks.congress} label="Congress.gov" color="cyan" />
                            <ExternalLinkChip href={billLinks.govtrack} label="GovTrack" color="cyan" />
                            <ExternalLinkChip href={billLinks.legiscan} label="LegiScan" color="indigo" />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'finance' && (
            <div className="space-y-6">
              <div className="text-center p-5 rounded-2xl bg-amber-400/6 border border-amber-400/15">
                <p className="text-xs text-amber-300/50 uppercase tracking-widest font-semibold mb-1">Total Raised &mdash; {rep.campaignFinance.cycle} Cycle</p>
                <p className="text-4xl font-black text-amber-300" style={{ animation: 'count-up 0.6s ease-out' }}>
                  {formatMoney(rep.campaignFinance.totalRaised)}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  <ExternalLinkChip href={extLinks.opensecrets} label="OpenSecrets" color="amber" />
                  <ExternalLinkChip href={extLinks.fec} label="FEC.gov" color="amber" />
                  <ExternalLinkChip href={extLinks.followthemoney} label="FollowTheMoney" color="amber" />
                </div>
              </div>

              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-semibold">Top Industries</p>
                <div className="space-y-3">
                  {rep.campaignFinance.topIndustries.map((ind, i) => (
                    <div key={ind.name} className="space-y-1" style={{ animation: `slide-up-fade 0.4s ease-out ${i * 80}ms both` }}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80">{ind.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-amber-300/70">{formatMoney(ind.amount)}</span>
                          <span className="text-xs text-white/35">{ind.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <VoteBar pct={ind.percentage} color="#f59e0b" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-semibold">Notable Donors</p>
                <div className="space-y-2">
                  {rep.campaignFinance.topDonors.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/8 hover:border-white/12 transition-all" style={{ animation: `slide-up-fade 0.4s ease-out ${i * 60}ms both` }}>
                      <div>
                        <p className="text-sm text-white/85">{d.name}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300/60 font-semibold">{d.type}</span>
                      </div>
                      <p className="text-amber-300 font-bold text-sm">{formatMoney(d.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'controversies' && (
            <div className="space-y-4">
              {rep.controversies.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-emerald-400 font-semibold">No documented controversies</p>
                  <p className="text-white/30 text-sm mt-1">No issues have been flagged for this official.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-white/30">Placeholder — cross-check on watchdog sources:</p>
                    <div className="flex gap-1.5">
                      <ExternalLinkChip href={extLinks.crew} label="CREW Ethics" color="red" />
                      <ExternalLinkChip href={extLinks.propublica} label="ProPublica" color="indigo" />
                    </div>
                  </div>
                  {rep.controversies.map((c, i) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl border transition-all"
                      style={{
                        background: c.severity === 'high' ? 'rgba(239,68,68,0.05)' : c.severity === 'medium' ? 'rgba(251,191,36,0.05)' : 'rgba(255,255,255,0.03)',
                        borderColor: c.severity === 'high' ? 'rgba(239,68,68,0.2)' : c.severity === 'medium' ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.08)',
                        animation: `slide-up-fade 0.4s ease-out ${i * 80}ms both`
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-white font-semibold text-sm leading-snug">{c.title}</p>
                        <div className="flex gap-1.5 shrink-0">
                          <StatusBadge variant={severityVariant[c.severity]}>{c.severity.toUpperCase()}</StatusBadge>
                          <StatusBadge variant="default">{categoryLabels[c.category]}</StatusBadge>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">{c.summary}</p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-white/30 text-xs">{new Date(c.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        {c.source && <p className="text-cyan-400/50 text-xs">Source: {c.source}</p>}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RepCard({ rep, onSelect, onPhotoUpload }: { rep: Representative; onSelect: () => void; onPhotoUpload: (id: string, url: string) => void }) {
  const yeas = rep.votingRecord.filter(v => v.vote === 'YEA').length;
  const nays = rep.votingRecord.filter(v => v.vote === 'NAY').length;
  const aligned = rep.votingRecord.filter(v => v.alignment === 'aligned').length;
  const total = rep.votingRecord.length;
  const alignPct = total > 0 ? Math.round((aligned / total) * 100) : null;
  const levelVariant = rep.level === 'federal' ? 'info' : rep.level === 'state' ? 'warning' : 'success';
  const totalRaised = rep.campaignFinance.totalRaised;
  const formatMoney = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;

  return (
    <GlassCard className="flex flex-col h-full hover:border-cyan-400/25 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)] transition-all duration-300 cursor-pointer group" onClick={onSelect}>
      <div className="flex items-start gap-4 mb-4">
        <PhotoUpload rep={rep} onUpload={onPhotoUpload} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white leading-tight group-hover:text-cyan-200 transition-colors">{rep.name}</h3>
              <p className="text-white/50 text-xs mt-0.5">{rep.title}</p>
              <p className="text-cyan-400/50 text-xs">{rep.district}</p>
            </div>
            <StatusBadge variant={levelVariant} className="shrink-0 mt-0.5">
              {rep.level === 'school-board' ? 'SCHOOL' : rep.level.slice(0, 3).toUpperCase()}
            </StatusBadge>
          </div>
          {rep.party && (
            <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded bg-white/8 text-white/45 font-medium">{rep.party}</span>
          )}
        </div>
      </div>

      {total > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-white/3 border border-white/6">
          <div className="text-center">
            <p className="text-lg font-black text-emerald-400">{yeas}</p>
            <p className="text-[10px] text-white/35 uppercase tracking-wide">Yea</p>
          </div>
          <div className="text-center border-x border-white/8">
            <p className="text-lg font-black text-red-400">{nays}</p>
            <p className="text-[10px] text-white/35 uppercase tracking-wide">Nay</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-cyan-400">{alignPct ?? '—'}%</p>
            <p className="text-[10px] text-white/35 uppercase tracking-wide">Aligned</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-amber-300/40 uppercase tracking-wider font-semibold">Campaign Raised</p>
          <p className="text-amber-300 font-bold text-sm">{formatMoney(totalRaised)}</p>
        </div>
        {rep.controversies.length > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
            <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-red-400 text-xs font-semibold">{rep.controversies.length} Issue{rep.controversies.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <GlowButton variant="primary" className="w-full mt-auto text-xs h-9">
        View Full Profile
      </GlowButton>
    </GlassCard>
  );
}

export default function Representatives() {
  const { reps, updateRepPhoto } = useStore();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null);

  const allTopics = useMemo(() => getAllTopics(reps), [reps]);

  const filteredReps = useMemo(() => {
    return reps.filter(rep => {
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        rep.name.toLowerCase().includes(q) ||
        rep.title.toLowerCase().includes(q) ||
        rep.district.toLowerCase().includes(q) ||
        rep.votingRecord.some(v =>
          v.billName.toLowerCase().includes(q) ||
          v.topic.toLowerCase().includes(q) ||
          v.summary.toLowerCase().includes(q)
        );
      const matchesLevel = levelFilter === "all" || rep.level === levelFilter;
      const matchesTopic = topicFilter === "all" || rep.votingRecord.some(v => v.topic === topicFilter);
      return matchesSearch && matchesLevel && matchesTopic;
    });
  }, [reps, search, levelFilter, topicFilter]);

  const levels: (Level | "all")[] = ["all", "federal", "state", "county", "city", "school-board"];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8" style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Representative Directory</h1>
              <p className="text-white/45 text-sm">Voting records, campaign finance & accountability data</p>
            </div>
          </div>
          <p className="text-sm text-amber-300/50 bg-amber-400/5 border border-amber-400/10 rounded-xl px-4 py-2.5 inline-flex items-center gap-2 mt-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Showing placeholder data. Connect to Congress.gov, OpenSecrets, or Google Civic API for live information.
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-6 rounded-3xl border border-white/10 bg-black/20 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search by name, title, district, or issue topic (e.g. housing, transit)..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <select
                value={topicFilter}
                onChange={e => setTopicFilter(e.target.value)}
                className={`bg-white/5 border rounded-2xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all appearance-none cursor-pointer ${
                  topicFilter !== 'all'
                    ? 'border-cyan-400/35 text-cyan-300 bg-cyan-400/10'
                    : 'border-white/10 text-white/50'
                }`}
              >
                <option value="all" className="bg-[#0d1829]">Filter by issue topic</option>
                {allTopics.map(t => (
                  <option key={t} value={t} className="bg-[#0d1829]">{t.replace(/\b\w/g, l => l.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  levelFilter === level
                    ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/35 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "bg-white/4 text-white/40 border border-white/6 hover:bg-white/8 hover:text-white/70"
                }`}
              >
                {level === "all" ? "All Levels" : level.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
            {topicFilter !== 'all' && (
              <button
                onClick={() => setTopicFilter('all')}
                className="px-3 py-2 rounded-full text-xs font-semibold bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5"
              >
                Topic: {topicFilter}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          {(search || topicFilter !== 'all') && (
            <p className="text-xs text-white/30 px-1">
              {filteredReps.length} of {reps.length} representatives match
              {topicFilter !== 'all' && <span className="text-cyan-400/70"> — showing reps with "{topicFilter}" votes</span>}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredReps.length > 0 ? (
            filteredReps.map((rep, i) => (
              <div key={rep.id} style={{ animation: `slide-up-fade 0.5s ease-out ${i * 60}ms both` }}>
                <RepCard rep={rep} onSelect={() => setSelectedRep(rep)} onPhotoUpload={updateRepPhoto} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-white/35">
              No representatives found matching your search.
            </div>
          )}
        </div>
      </div>

      {selectedRep && (
        <RepDetailModal
          rep={reps.find(r => r.id === selectedRep.id) || selectedRep}
          onClose={() => setSelectedRep(null)}
          onPhotoUpload={updateRepPhoto}
        />
      )}
    </Layout>
  );
}
