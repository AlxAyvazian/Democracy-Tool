import { useState } from "react";
import { Layout } from "@/components/layout";
import { GlassCard, GlowButton } from "@/components/ui/glass";
import {
  StatueOfLiberty,
  BaldEagle,
  CapitolBuilding,
  WavingFlag,
  WashingtonMonument,
  CongressSeal,
  StarSpangleBanner,
} from "@/components/ui/civic-vectors";
import { Link, useLocation } from "wouter";

const CIVIC_STATS = [
  { value: "535", label: "Congress Members", sub: "House & Senate" },
  { value: "7,383", label: "State Legislators", sub: "Across all 50 states" },
  { value: "90,000+", label: "Local Elected Officials", sub: "Counties, cities & more" },
  { value: "50", label: "State Governments", sub: "Plus territories & D.C." },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [zip, setZip] = useState("");

  const handleFindReps = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/find-reps");
  };

  return (
    <Layout>
      <div className="flex flex-col gap-14 pb-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/[0.20] px-6 py-16 md:px-14 md:py-22 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/18 to-transparent rounded-t-[2rem]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.04]" />
          <div className="absolute left-0 bottom-0 w-44 pointer-events-none select-none hidden md:block">
            <StatueOfLiberty opacity={0.10} className="w-full h-auto" />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-52 pointer-events-none select-none hidden lg:block">
            <BaldEagle opacity={0.09} className="w-full h-auto" />
          </div>
          <div className="absolute top-4 left-4 w-32 pointer-events-none select-none hidden md:block">
            <StarSpangleBanner rows={4} cols={5} opacity={0.08} className="w-full h-auto" />
          </div>
          <div className="absolute right-6 bottom-6 w-28 pointer-events-none select-none hidden md:block">
            <CongressSeal opacity={0.06} className="w-full h-auto" />
          </div>

          <div className="relative flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/70 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white/70" />
              </span>
              Civic Command Center Online
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.93]">
              Make Public Opinion
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60 mt-1">
                Harder to Ignore.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              VoiceMap Civic turns community sentiment into public pressure, verified records, and representative accountability.
            </p>
            <form onSubmit={handleFindReps} className="flex items-center gap-2 w-full max-w-md">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter ZIP code to find your reps"
                  value={zip}
                  onChange={e => setZip(e.target.value.replace(/\D/, "").slice(0, 5))}
                  className="w-full bg-white/[0.08] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/25 transition-all"
                />
              </div>
              <GlowButton type="submit" variant="primary" className="h-11 px-6 font-bold whitespace-nowrap">
                Find My Reps
              </GlowButton>
            </form>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/issues">
                <GlowButton variant="secondary" className="h-11 px-7 text-base">Vote on Active Issues</GlowButton>
              </Link>
              <Link href="/scorecard">
                <GlowButton variant="ghost" className="h-11 px-7 text-base">View Scorecard</GlowButton>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CIVIC_STATS.map((stat, i) => (
            <GlassCard key={stat.label} className="text-center py-5 border-white/[0.08] bg-black/[0.15]" style={{ animation: `slide-up-fade 0.5s ease-out ${i * 80}ms both` }}>
              <p className="text-3xl font-black text-white leading-none mb-1">{stat.value}</p>
              <p className="text-white text-sm font-bold leading-tight mb-0.5">{stat.label}</p>
              <p className="text-white/35 text-[10px] font-medium uppercase tracking-wide">{stat.sub}</p>
            </GlassCard>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <GlassCard className="flex flex-col gap-4 border-white/10 bg-black/[0.20]">
            <div className="w-11 h-11 rounded-xl bg-white/[0.08] flex items-center justify-center text-white/70">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Sentiment Tracking</h3>
            <p className="text-muted-foreground">Collect community positions, then surface the majority view before officials can spin the story.</p>
            <Link href="/issues" className="mt-auto text-white/70 font-medium hover:underline inline-flex items-center gap-1">
              View Issues <span aria-hidden="true">&rarr;</span>
            </Link>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 border-white/10 bg-black/[0.20]">
            <div className="w-11 h-11 rounded-xl bg-white/[0.08] flex items-center justify-center text-white/70">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Action Generator</h3>
            <p className="text-muted-foreground">Generate polished petitions, emails, and calls without the clutter.</p>
            <Link href="/messages" className="mt-auto text-white/70 font-medium hover:underline inline-flex items-center gap-1">
              Create a Message <span aria-hidden="true">&rarr;</span>
            </Link>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 border-white/10 bg-black/[0.20]">
            <div className="w-11 h-11 rounded-xl bg-white/[0.08] flex items-center justify-center text-white/70">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Accountability</h3>
            <p className="text-muted-foreground">Compare promises, votes, and response speed in one place.</p>
            <Link href="/accountability" className="mt-auto text-white/70 font-medium hover:underline inline-flex items-center gap-1">
              View Dashboard <span aria-hidden="true">&rarr;</span>
            </Link>
          </GlassCard>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-black/[0.18] px-6 py-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex items-end justify-around gap-6 flex-wrap">
            <div className="flex flex-col items-center gap-2 opacity-80">
              <StatueOfLiberty opacity={0.20} className="w-16 h-auto" />
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold">Liberty</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-80">
              <WashingtonMonument opacity={0.18} className="w-10 h-auto" />
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold">Washington</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-80">
              <CapitolBuilding opacity={0.18} className="w-32 h-auto" />
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold">Capitol</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-80">
              <BaldEagle opacity={0.20} className="w-24 h-auto" />
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold">Eagle</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-80">
              <CongressSeal opacity={0.18} className="w-16 h-auto" />
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold">Congress</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-80">
              <WavingFlag opacity={0.18} className="w-24 h-auto" />
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold">Flag</span>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 md:p-10">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/12 rounded-l-3xl" />
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/12 rounded-r-3xl" />
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-px bg-white/15" />
              <svg className="w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div className="w-6 h-px bg-white/15" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
              Civic transparency is your right.
            </h2>
            <p className="text-white/45 leading-relaxed mb-6 max-w-xl mx-auto">
              Every vote cast, every dollar raised, every promise made — all of it is public record.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/find-reps">
                <GlowButton variant="primary" className="h-11 px-8 font-bold">Find My Representatives</GlowButton>
              </Link>
              <Link href="/data-sources">
                <GlowButton variant="secondary" className="h-11 px-8">View Data Sources</GlowButton>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <GlassCard className="relative overflow-hidden border-white/10 bg-black/[0.20]">
            <div className="absolute right-3 top-3 w-16 opacity-20 pointer-events-none">
              <BaldEagle className="w-full h-auto" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <h3 className="text-sm uppercase tracking-[0.22em] text-white/45 font-semibold">What It Shows</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Voting history, donor pressure, controversy flags, and issue-level alignment — all in one place.</p>
          </GlassCard>
          <GlassCard className="relative overflow-hidden border-white/10 bg-black/[0.20]">
            <div className="absolute right-3 top-3 w-14 opacity-20 pointer-events-none">
              <CongressSeal className="w-full h-auto" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <h3 className="text-sm uppercase tracking-[0.22em] text-white/45 font-semibold">What It Stops</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Officials pretending a bad vote was what constituents wanted.</p>
          </GlassCard>
          <GlassCard className="relative overflow-hidden border-white/10 bg-black/[0.20]">
            <div className="absolute right-3 top-3 w-16 opacity-20 pointer-events-none">
              <StatueOfLiberty className="w-full h-auto" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <h3 className="text-sm uppercase tracking-[0.22em] text-white/45 font-semibold">What It Creates</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">A public record that survives the spin cycle.</p>
          </GlassCard>
        </section>
      </div>
    </Layout>
  );
}
