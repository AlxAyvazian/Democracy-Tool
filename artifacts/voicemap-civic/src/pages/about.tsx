import { Layout } from "@/components/layout";
import { GlassCard } from "@/components/ui/glass";

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-10 pb-12">
        <div className="text-center space-y-4" style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-[0_0_36px_rgba(6,182,212,0.38)]">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">About VoiceMap Civic</h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            A nonpartisan command center designed to translate diffuse public frustration into focused, undeniable civic action.
          </p>
        </div>

        <div className="space-y-5" style={{ animation: 'slide-up-fade 0.5s ease-out 100ms both' }}>
          <GlassCard className="border-cyan-400/15 bg-black/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-cyan-400/15 border border-cyan-400/22 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h2 className="text-lg font-black text-white">Mission Statement</h2>
            </div>
            <div className="space-y-3 text-white/60 text-sm leading-relaxed">
              <p>
                Democracy functions best when the distance between constituent sentiment and official action is zero. However, traditional civic engagement is often opaque, fragmented, and easily ignored by those in power.
              </p>
              <p>
                VoiceMap Civic exists to close that gap. We build premium, accessible tools that allow communities to aggregate their voices, format their demands professionally, and track the responses of their representatives with ruthless clarity. We believe that public participation should feel empowering, not bureaucratic.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="border-white/10 bg-black/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/22 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-lg font-black text-white">Methodology & Transparency</h2>
            </div>
            <div className="space-y-3 text-white/60 text-sm leading-relaxed">
              <p>
                Currently, VoiceMap Civic operates as an open portal. The sentiment tracking data shown on issue pages is based on unverified submissions. It is intended to reflect the momentum of community feedback rather than acting as a rigorous scientific poll.
              </p>
              <p>
                All data you input is stored locally on your device for privacy. We do not sell user data, and our language remains strictly nonpartisan — focusing on <span className="text-white/80 font-medium">accountability</span> and <span className="text-white/80 font-medium">responsiveness</span> rather than ideological alignment.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="border-indigo-400/15 bg-black/20">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-indigo-400/15 border border-indigo-400/22 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h2 className="text-lg font-black text-white">Verification Roadmap</h2>
            </div>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">To make public opinion truly impossible to ignore, we must prove its authenticity. Our upcoming technical roadmap includes:</p>
            <div className="space-y-3">
              {[
                {
                  title: "District Verification",
                  desc: "Cryptographic verification of residency to ensure officials are hearing from their actual constituents.",
                  color: "text-cyan-400",
                  bg: "bg-cyan-400/8 border-cyan-400/18",
                },
                {
                  title: "Duplicate Prevention",
                  desc: "Advanced rate-limiting and identity confirmation to prevent manipulation of sentiment data.",
                  color: "text-emerald-400",
                  bg: "bg-emerald-400/8 border-emerald-400/18",
                },
                {
                  title: "Public Audit Trail",
                  desc: "A transparent ledger of engagement metrics that can be independently verified by journalists and watchdog groups.",
                  color: "text-amber-400",
                  bg: "bg-amber-400/8 border-amber-400/18",
                },
                {
                  title: "Official Portal Access",
                  desc: "Secure logins for representatives to respond to petitions directly on the platform, creating a verified public record of their stance.",
                  color: "text-indigo-300",
                  bg: "bg-indigo-400/8 border-indigo-400/18",
                },
              ].map((item, i) => (
                <div key={i} className={`flex gap-3 p-4 rounded-xl border ${item.bg}`}>
                  <div className="shrink-0 mt-0.5">
                    <svg className={`w-4 h-4 ${item.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-bold mb-0.5 ${item.color}`}>{item.title}</p>
                    <p className="text-white/55 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
}
