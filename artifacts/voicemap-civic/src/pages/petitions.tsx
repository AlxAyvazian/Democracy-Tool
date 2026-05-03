import { useState } from "react";
import { Layout } from "@/components/layout";
import { GlassCard, GlowButton } from "@/components/ui/glass";
import { useStore } from "@/lib/store";
import { Petition } from "@/lib/data";

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/35 transition-all";
const labelClass = "block text-xs text-white/50 uppercase tracking-wider font-semibold mb-2";

export default function Petitions() {
  const { addPetition } = useStore();
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"text" | "email" | "social" | "council">("text");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    targetOfficial: "",
    problemStatement: "",
    requestedAction: "",
    evidence: "",
    deadline: ""
  });

  const [generated, setGenerated] = useState<Petition | null>(null);

  const handleGenerate = () => {
    const newPetition: Petition = {
      id: `p_${Date.now()}`,
      ...formData,
      supporters: 1,
      createdAt: new Date().toISOString(),
      generatedText: `PETITION TO: ${formData.targetOfficial}\n\nSUBJECT: ${formData.title}\n\nWHEREAS, ${formData.problemStatement}\n\nWHEREAS, ${formData.evidence}\n\nWE THE UNDERSIGNED respectfully request that you immediately:\n${formData.requestedAction}\n\nDeadline for action: ${formData.deadline || "Immediate"}`,
      generatedEmail: `Subject: Petition: ${formData.title}\n\nDear ${formData.targetOfficial},\n\nI am writing to you today as a concerned constituent regarding an urgent matter in our community.\n\n${formData.problemStatement}\n\n${formData.evidence}\n\nI strongly urge you to take the following action:\n${formData.requestedAction}\n\nI look forward to your prompt response regarding your position on this issue.\n\nSincerely,\n[Your Name]\n[Your Address]`,
      generatedSocialPost: `We need action on ${formData.title}. I'm calling on ${formData.targetOfficial} to step up. ${formData.problemStatement.substring(0, 100)}...\n\nSign the petition and demand they act. #CivicAction #VoiceMapCivic`,
      generatedCouncilComment: `Good evening members of the council. My name is [Name] from [Neighborhood].\n\nI am here to speak about ${formData.title}. ${formData.problemStatement}\n\nThe evidence is clear: ${formData.evidence}\n\nI am formally requesting that this body ${formData.requestedAction}.\n\nThank you for your time and I expect to see action on this before ${formData.deadline || "the next meeting"}.`
    };

    setGenerated(newPetition);
    addPetition(newPetition);
    setStep(2);
  };

  const tabs = [
    { id: "text" as const, label: "Official Petition" },
    { id: "email" as const, label: "Direct Email" },
    { id: "social" as const, label: "Social Post" },
    { id: "council" as const, label: "Council Comment" },
  ];

  const activeContent = generated
    ? { text: generated.generatedText, email: generated.generatedEmail, social: generated.generatedSocialPost, council: generated.generatedCouncilComment }[activeTab]
    : "";

  const handleCopy = () => {
    if (!activeContent) return;
    navigator.clipboard.writeText(activeContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-400/15 border border-indigo-400/25 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Petition Builder</h1>
              <p className="text-white/45 text-sm">Turn frustration into formatted, professional demands</p>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <GlassCard style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
            <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/8">Draft Your Demands</h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Petition Title</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Fund the Northside Transit Hub"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Target Official or Body</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Mayor Washington or City Council"
                    value={formData.targetOfficial}
                    onChange={e => setFormData({ ...formData, targetOfficial: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Problem Statement</label>
                <textarea
                  className={`${inputClass} min-h-[96px] resize-none`}
                  placeholder="Describe the issue concisely and factually..."
                  value={formData.problemStatement}
                  onChange={e => setFormData({ ...formData, problemStatement: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Supporting Evidence / Impact</label>
                <textarea
                  className={`${inputClass} min-h-[96px] resize-none`}
                  placeholder="Who is affected? What data or evidence supports your claim?"
                  value={formData.evidence}
                  onChange={e => setFormData({ ...formData, evidence: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Requested Action</label>
                <textarea
                  className={`${inputClass} min-h-[96px] resize-none`}
                  placeholder="What specific action do you want them to take?"
                  value={formData.requestedAction}
                  onChange={e => setFormData({ ...formData, requestedAction: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Action Deadline <span className="normal-case text-white/25 font-normal">(optional)</span></label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Before the Q3 budget vote"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <div className="pt-5 border-t border-white/8">
                <GlowButton
                  variant="primary"
                  className="w-full h-12 text-base font-bold"
                  onClick={handleGenerate}
                  disabled={!formData.title || !formData.targetOfficial || !formData.problemStatement}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Generate Formatted Petition
                </GlowButton>
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-5" style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
            <GlassCard className="border-cyan-400/15 bg-cyan-400/3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-400/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Petition Generated</h2>
                    <p className="text-white/40 text-xs">Your demands have been formatted into 4 ready-to-use versions.</p>
                  </div>
                </div>
                <GlowButton variant="secondary" className="text-xs h-8 px-3" onClick={() => setStep(1)}>Edit Details</GlowButton>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex gap-1 mb-5 pb-4 border-b border-white/8 overflow-x-auto no-scrollbar">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === t.id
                        ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="bg-black/30 border border-white/8 rounded-xl p-5 font-mono text-sm text-white/80 whitespace-pre-wrap leading-relaxed mb-5 min-h-[200px]">
                {activeContent}
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
                      Copy to Clipboard
                    </span>
                  )}
                </GlowButton>
                {activeTab === 'email' && (
                  <GlowButton variant="secondary" className="flex-1 h-10 text-sm" onClick={() => {
                    window.location.href = `mailto:?subject=${encodeURIComponent(formData.title)}&body=${encodeURIComponent(activeContent || '')}`;
                  }}>
                    Open in Email App
                  </GlowButton>
                )}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </Layout>
  );
}
