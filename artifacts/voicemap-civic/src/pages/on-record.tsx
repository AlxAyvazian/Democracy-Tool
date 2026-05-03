import { useState, useMemo } from "react";
import { Layout } from "@/components/layout";
import { GlassCard, GlowButton, StatusBadge } from "@/components/ui/glass";
import { useStore } from "@/lib/store";
import { SentimentSnapshot } from "@/lib/transparency";

function useSnapshots() {
  const key = "voicemap_snapshots";
  const load = (): SentimentSnapshot[] => {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
  };
  const save = (snaps: SentimentSnapshot[]) => {
    localStorage.setItem(key, JSON.stringify(snaps));
  };
  return { load, save };
}

function SnapshotCard({ snap, onDelete }: { snap: SentimentSnapshot; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);

  const shareText = `[PUBLIC RECORD — ${new Date(snap.capturedAt).toLocaleString()}]\n\nIssue: "${snap.issueTitle}"\nTotal Responses: ${snap.totalResponses.toLocaleString()}\n\n✅ Support: ${snap.supportPct.toFixed(1)}%\n❌ Oppose: ${snap.opposePct.toFixed(1)}%\n❓ Unsure: ${snap.unsurePct.toFixed(1)}%\n📋 Needs Info: ${snap.needsInfoPct.toFixed(1)}%\n\n${snap.note ? `Note: ${snap.note}\n\n` : ''}This constituent sentiment was recorded via VoiceMap Civic BEFORE any official vote. This record is timestamped and may be used to hold representatives accountable.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const supportPct = snap.supportPct;
  const majority = supportPct >= 50;

  return (
    <GlassCard className="space-y-4" style={{ animation: 'slide-up-fade 0.4s ease-out' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <StatusBadge variant={majority ? 'success' : 'warning'}>
              {majority ? 'MAJORITY SUPPORT' : 'NO MAJORITY'}
            </StatusBadge>
            <span className="text-xs text-white/30">{new Date(snap.capturedAt).toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">{snap.issueTitle}</h3>
          {snap.note && <p className="text-white/50 text-sm mt-1 italic">"{snap.note}"</p>}
          {snap.lockedBefore && (
            <p className="text-amber-300/60 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Locked before: {snap.lockedBefore}
            </p>
          )}
        </div>
        <button onClick={onDelete} className="text-white/20 hover:text-red-400 transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: 'Support', pct: snap.supportPct, color: '#22d3ee', bg: 'bg-cyan-400/10 border-cyan-400/20' },
          { label: 'Oppose', pct: snap.opposePct, color: '#f87171', bg: 'bg-red-400/10 border-red-400/20' },
          { label: 'Unsure', pct: snap.unsurePct, color: '#9ca3af', bg: 'bg-white/5 border-white/10' },
          { label: 'Needs Info', pct: snap.needsInfoPct, color: '#fbbf24', bg: 'bg-amber-400/10 border-amber-400/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-2 ${s.bg}`}>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.pct.toFixed(1)}%</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wide font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden flex">
          <div style={{ width: `${snap.supportPct}%`, background: '#22d3ee', animation: 'bar-fill 1s ease-out' }} className="h-full" />
          <div style={{ width: `${snap.unsurePct}%`, background: '#6b7280' }} className="h-full" />
          <div style={{ width: `${snap.needsInfoPct}%`, background: '#fbbf24' }} className="h-full" />
          <div style={{ width: `${snap.opposePct}%`, background: '#f87171' }} className="h-full" />
        </div>
        <p className="text-xs text-white/30 mt-1.5 text-right">{snap.totalResponses.toLocaleString()} total responses</p>
      </div>

      <div className="flex gap-2 pt-2 border-t border-white/8">
        <GlowButton variant="primary" className="flex-1 text-xs h-8" onClick={copyToClipboard}>
          {copied ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              Copied to Clipboard
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Copy Shareable Text
            </span>
          )}
        </GlowButton>
        <GlowButton variant="secondary" className="text-xs h-8 px-3" onClick={() => {
          const blob = new Blob([shareText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url;
          a.download = `voicemap-record-${snap.issueId}-${snap.id.slice(0, 6)}.txt`;
          a.click(); URL.revokeObjectURL(url);
        }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </GlowButton>
      </div>
    </GlassCard>
  );
}

export default function OnRecord() {
  const { issues } = useStore();
  const { load, save } = useSnapshots();
  const [snapshots, setSnapshots] = useState<SentimentSnapshot[]>(load);
  const [selectedIssueId, setSelectedIssueId] = useState<string>("");
  const [note, setNote] = useState("");
  const [lockedBefore, setLockedBefore] = useState("");
  const [saved, setSaved] = useState(false);

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  const preview = useMemo(() => {
    if (!selectedIssue) return null;
    const total = selectedIssue.positions.reduce((s, p) => s + p.count, 0);
    if (total === 0) return null;
    const get = (type: string) => (selectedIssue.positions.find(p => p.type === type)?.count || 0);
    return {
      total,
      supportPct: (get('support') / total) * 100,
      opposePct: (get('oppose') / total) * 100,
      unsurePct: (get('unsure') / total) * 100,
      needsInfoPct: (get('needs-info') / total) * 100,
    };
  }, [selectedIssue]);

  const lockSnapshot = () => {
    if (!selectedIssue || !preview) return;
    const snap: SentimentSnapshot = {
      id: Date.now().toString(36),
      issueId: selectedIssue.id,
      issueTitle: selectedIssue.title,
      capturedAt: new Date().toISOString(),
      supportPct: preview.supportPct,
      opposePct: preview.opposePct,
      unsurePct: preview.unsurePct,
      needsInfoPct: preview.needsInfoPct,
      totalResponses: preview.total,
      note: note.trim(),
      lockedBefore: lockedBefore.trim(),
    };
    const updated = [snap, ...snapshots];
    setSnapshots(updated);
    save(updated);
    setSaved(true);
    setNote(""); setLockedBefore(""); setSelectedIssueId("");
    setTimeout(() => setSaved(false), 3000);
  };

  const deleteSnapshot = (id: string) => {
    const updated = snapshots.filter(s => s.id !== id);
    setSnapshots(updated);
    save(updated);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8" style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-400/15 border border-red-400/25 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Put It On The Record</h1>
              <p className="text-white/45 text-sm">Lock constituent sentiment BEFORE officials vote — create a timestamped public record</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <GlassCard className="border-cyan-400/15 bg-black/20" style={{ animation: 'slide-up-fade 0.5s ease-out 100ms both' }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/15 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Create a Timestamped Snapshot</h2>
                <p className="text-white/45 text-sm mt-0.5">Records the current public sentiment so representatives can never claim they didn't know where constituents stood.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-wider font-semibold mb-2">Select Issue</label>
                <select
                  value={selectedIssueId}
                  onChange={e => setSelectedIssueId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
                >
                  <option value="" className="bg-[#0d1829]">-- Choose an issue --</option>
                  {issues.map(issue => (
                    <option key={issue.id} value={issue.id} className="bg-[#0d1829]">{issue.title}</option>
                  ))}
                </select>
              </div>

              {preview && selectedIssue && (
                <div className="p-4 rounded-2xl bg-white/3 border border-white/8 space-y-3" style={{ animation: 'slide-up-fade 0.3s ease-out' }}>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Current Sentiment Preview</p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-xl bg-cyan-400/8 border border-cyan-400/15 p-2">
                      <p className="text-2xl font-black text-cyan-400">{preview.supportPct.toFixed(1)}%</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wide">Support</p>
                    </div>
                    <div className="rounded-xl bg-red-400/8 border border-red-400/15 p-2">
                      <p className="text-2xl font-black text-red-400">{preview.opposePct.toFixed(1)}%</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wide">Oppose</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/35 text-center">{preview.total.toLocaleString()} total responses</p>
                </div>
              )}

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-wider font-semibold mb-2">Context Note <span className="normal-case text-white/25 font-normal">(optional)</span></label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. 'Recorded ahead of City Council vote on Agenda Item 4B, scheduled Nov 14'"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all resize-none h-20"
                />
              </div>

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-wider font-semibold mb-2">Lock Before Event <span className="normal-case text-white/25 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={lockedBefore}
                  onChange={e => setLockedBefore(e.target.value)}
                  placeholder="e.g. 'Senate Floor Vote on S.1234 — Jan 20, 2025'"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
                />
              </div>

              <GlowButton
                variant="primary"
                className="w-full h-11 text-sm font-bold"
                disabled={!selectedIssueId || !preview}
                onClick={lockSnapshot}
              >
                {saved ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Snapshot Locked and Saved
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Lock Snapshot — Put It On The Record
                  </span>
                )}
              </GlowButton>
            </div>
          </GlassCard>

          <div className="space-y-4" style={{ animation: 'slide-up-fade 0.5s ease-out 200ms both' }}>
            <div className="p-4 rounded-2xl border border-amber-400/15 bg-amber-400/5">
              <h3 className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Why This Tool Matters
              </h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">1.</span>Representatives sometimes claim their constituents "supported" an unpopular vote — or that they "didn't know" where people stood.</li>
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">2.</span>This tool creates a timestamped, shareable record of constituent sentiment BEFORE the vote happens.</li>
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">3.</span>The snapshot can be posted to social media, submitted to local press, or presented at public meetings as evidence.</li>
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">4.</span>It's not a scientific poll — but it puts public opinion permanently on the record at a specific point in time.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/3">
              <h3 className="text-sm font-bold text-cyan-300 mb-2">What the shareable text includes:</h3>
              <ul className="space-y-1.5 text-xs text-white/50">
                <li className="flex gap-2"><span className="text-cyan-400">✓</span>The exact date and time the snapshot was captured</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span>Precise sentiment percentages (support / oppose / unsure)</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span>Total response count at time of capture</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span>Any context note you added</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span>Clear label that it was recorded BEFORE the official vote</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Saved Snapshots
            <span className="text-sm text-white/30 font-normal ml-1">({snapshots.length} records)</span>
          </h2>
          {snapshots.length === 0 ? (
            <GlassCard className="text-center py-14 border-white/10 bg-black/20">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-white/40 font-semibold">No snapshots yet</p>
              <p className="text-white/25 text-sm mt-1">Create your first public record above to get started.</p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {snapshots.map(snap => (
                <SnapshotCard key={snap.id} snap={snap} onDelete={() => deleteSnapshot(snap.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
