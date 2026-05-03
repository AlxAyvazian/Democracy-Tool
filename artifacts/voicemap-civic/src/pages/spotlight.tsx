import { Layout } from "@/components/layout";
import { GlassCard, StatusBadge } from "@/components/ui/glass";
import { useStore } from "@/lib/store";

export default function Spotlight() {
  const { spotlight } = useStore();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.14)]">
              <svg className="w-5 h-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Good Actions Spotlight</h1>
              <p className="text-white/45 text-sm">Positive official actions, legislation, and outstanding constituent responsiveness</p>
            </div>
          </div>
          <div className="bg-amber-400/5 border border-amber-400/15 rounded-2xl p-3.5 text-xs text-amber-300/55 flex items-start gap-2 mt-4 max-w-2xl">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Accountability isn't only about problems — it also means recognizing when officials deliver. These entries highlight genuine wins.
          </div>
        </div>

        <div className="space-y-5">
          {spotlight.map((item, i) => (
            <GlassCard
              key={item.id}
              className="relative overflow-hidden border-white/10 bg-black/20 hover:border-amber-400/20 hover:shadow-[0_0_40px_rgba(251,191,36,0.07)] transition-all duration-300"
              style={{ animation: `slide-up-fade 0.5s ease-out ${i * 100}ms both` }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-yellow-600 rounded-l-2xl" />

              <div className="flex flex-col md:flex-row gap-6 pl-4">
                <div className="md:w-56 shrink-0 flex flex-col justify-center md:border-r md:border-white/8 md:pr-6">
                  <StatusBadge variant="warning" className="w-fit mb-3">{item.category}</StatusBadge>
                  <h3 className="text-xl font-black text-white mb-1 leading-tight">{item.officialName}</h3>
                  <p className="text-white/40 text-xs flex items-center gap-1.5 mt-1">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h4 className="text-base font-bold text-white mb-2 leading-snug">{item.action}</h4>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{item.description}</p>

                  <div className="bg-amber-400/6 border border-amber-400/15 rounded-xl p-3.5">
                    <p className="text-[10px] text-amber-300/50 uppercase tracking-widest font-bold mb-1">Impact</p>
                    <p className="text-amber-300/80 text-sm font-medium">{item.impactSummary}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}

          {spotlight.length === 0 && (
            <GlassCard className="text-center py-16 border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/8 border border-amber-400/15 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-amber-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-white/40 font-semibold">No spotlight entries yet</p>
              <p className="text-white/20 text-sm mt-1">Positive actions will appear here as they are recorded.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </Layout>
  );
}
