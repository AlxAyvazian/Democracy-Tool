import { useState } from "react";
import { Layout } from "@/components/layout";
import { GlassCard, GlowButton } from "@/components/ui/glass";
import { useStore } from "@/lib/store";

const selectClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/35 transition-all appearance-none cursor-pointer";
const labelClass = "block text-xs text-white/50 uppercase tracking-wider font-semibold mb-2";

export default function Messages() {
  const { reps, issues, logMessage } = useStore();
  const [selectedRep, setSelectedRep] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [tone, setTone] = useState("respectful");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const tones = [
    { id: "respectful", label: "Respectful & Formal", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "urgent", label: "Urgent & Direct", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { id: "personal", label: "Personal Story", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { id: "short", label: "Short & Sharp", icon: "M13 5l7 7-7 7M5 5l7 7-7 7" },
  ];

  const handleGenerate = () => {
    if (!selectedRep || !selectedIssue) return;

    const rep = reps.find(r => r.id === selectedRep);
    const issue = issues.find(i => i.id === selectedIssue);
    if (!rep || !issue) return;

    let content = "";

    if (tone === "urgent") {
      content = `Dear ${rep.title} ${rep.name},\n\nI am writing to demand immediate action on ${issue.title}. We can no longer wait while ${issue.summary.toLowerCase()}\n\nYour constituents are watching how you handle this. We expect you to prioritize this issue and vote accordingly.\n\nSincerely,\n[Your Name]`;
    } else if (tone === "personal") {
      content = `Dear ${rep.title} ${rep.name},\n\nI am a resident of your district and ${issue.title} deeply impacts my daily life. When I look at the current situation regarding ${issue.topic}, I am concerned about our community's future.\n\n${issue.whyItMatters}\n\nPlease support initiatives that address this.\n\nSincerely,\n[Your Name]`;
    } else if (tone === "short") {
      content = `${rep.title} ${rep.name} — Please support ${issue.title}. ${issue.whyItMatters} We are counting on your leadership.\n\n— [Your Name], Constituent`;
    } else {
      content = `Dear ${rep.title} ${rep.name},\n\nI am writing respectfully to urge your support for ${issue.title}.\n\nAs you know, ${issue.summary} This is vital because ${issue.whyItMatters.toLowerCase()}\n\nThank you for your service and for considering the voices of your constituents on this critical matter.\n\nSincerely,\n[Your Name]\n[Your Address]`;
    }

    setGenerated(content);
    logMessage({
      id: `msg_${Date.now()}`,
      issueId: selectedIssue,
      repId: selectedRep,
      tone,
      type: 'email',
      date: new Date().toISOString()
    });
  };

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const selectedRepObj = reps.find(r => r.id === selectedRep);
  const selectedIssueObj = issues.find(i => i.id === selectedIssue);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Message Generator</h1>
              <p className="text-white/45 text-sm">Draft high-impact communications to your representatives instantly</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-5" style={{ animation: 'slide-up-fade 0.5s ease-out 100ms both' }}>
            <GlassCard>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>1. Select Official</label>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={selectedRep}
                      onChange={e => setSelectedRep(e.target.value)}
                    >
                      <option value="" disabled className="bg-[#0d1829]">Choose a representative...</option>
                      {reps.map(r => (
                        <option key={r.id} value={r.id} className="bg-[#0d1829]">{r.title} {r.name} ({r.level})</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>2. Select Issue</label>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={selectedIssue}
                      onChange={e => setSelectedIssue(e.target.value)}
                    >
                      <option value="" disabled className="bg-[#0d1829]">Choose an issue...</option>
                      {issues.map(i => (
                        <option key={i.id} value={i.id} className="bg-[#0d1829]">{i.title}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>3. Choose Tone</label>
                  <div className="grid grid-cols-2 gap-2">
                    {tones.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center gap-2 ${
                          tone === t.id
                            ? 'bg-amber-400/15 text-amber-300 border-amber-400/35 shadow-[0_0_14px_rgba(251,191,36,0.15)]'
                            : 'bg-white/4 text-white/45 border-white/10 hover:bg-white/8 hover:text-white/70'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                        </svg>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <GlowButton
                    variant="primary"
                    className="w-full h-11 text-sm font-bold"
                    onClick={handleGenerate}
                    disabled={!selectedRep || !selectedIssue}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Message
                  </GlowButton>
                </div>
              </div>
            </GlassCard>

            {selectedRepObj && selectedIssueObj && (
              <div className="p-4 rounded-2xl bg-white/3 border border-white/8 space-y-2" style={{ animation: 'slide-up-fade 0.3s ease-out' }}>
                <p className="text-xs text-white/35 uppercase tracking-wider font-semibold">Ready to generate</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-cyan-400/15 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <p className="text-sm text-white font-medium">{selectedRepObj.title} {selectedRepObj.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                  </div>
                  <p className="text-sm text-white/70 truncate">{selectedIssueObj.title}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7" style={{ animation: 'slide-up-fade 0.5s ease-out 200ms both' }}>
            <GlassCard className="h-full min-h-[460px] flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/8">
                <h2 className="text-base font-bold text-white">Generated Message</h2>
                {generated && (
                  <span className="text-[10px] text-cyan-400/60 bg-cyan-400/8 border border-cyan-400/15 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">Ready to send</span>
                )}
              </div>

              {generated ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 bg-black/25 border border-white/8 rounded-xl p-5 font-mono text-sm text-white/80 whitespace-pre-wrap leading-relaxed mb-5">
                    {generated}
                  </div>
                  <div className="flex gap-3">
                    <GlowButton variant="primary" className="flex-1 h-10 text-sm" onClick={handleCopy}>
                      {copied ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          Copied
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          Copy Text
                        </span>
                      )}
                    </GlowButton>
                    <a
                      href={`mailto:${selectedRepObj?.email || ''}?subject=${encodeURIComponent(selectedIssueObj?.title || '')}&body=${encodeURIComponent(generated)}`}
                      className="flex-1"
                    >
                      <GlowButton variant="secondary" className="w-full h-10 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Open in Mail
                      </GlowButton>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <p className="text-white/35 font-semibold text-sm">Your message will appear here</p>
                  <p className="text-white/20 text-xs mt-1">Select an official, issue, and tone to get started</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}
