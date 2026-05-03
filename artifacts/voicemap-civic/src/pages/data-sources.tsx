import { useState } from "react";
import { Layout } from "@/components/layout";
import { GlassCard, StatusBadge, GlowButton } from "@/components/ui/glass";
import { DATA_SOURCES } from "@/lib/externalLinks";

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string; dot: string }> = {
  cyan:    { bg: "bg-cyan-400/8",    border: "border-cyan-400/18",    text: "text-cyan-300",    icon: "bg-cyan-400/15 border-cyan-400/25",    dot: "bg-cyan-400" },
  amber:   { bg: "bg-amber-400/8",   border: "border-amber-400/18",   text: "text-amber-300",   icon: "bg-amber-400/15 border-amber-400/25",   dot: "bg-amber-400" },
  red:     { bg: "bg-red-400/8",     border: "border-red-400/18",     text: "text-red-300",     icon: "bg-red-400/15 border-red-400/25",       dot: "bg-red-400" },
  indigo:  { bg: "bg-indigo-400/8",  border: "border-indigo-400/18",  text: "text-indigo-300",  icon: "bg-indigo-400/15 border-indigo-400/25", dot: "bg-indigo-400" },
  emerald: { bg: "bg-emerald-400/8", border: "border-emerald-400/18", text: "text-emerald-300", icon: "bg-emerald-400/15 border-emerald-400/25", dot: "bg-emerald-400" },
  purple:  { bg: "bg-purple-400/8",  border: "border-purple-400/18",  text: "text-purple-300",  icon: "bg-purple-400/15 border-purple-400/25", dot: "bg-purple-400" },
};

const categories = ["All", ...DATA_SOURCES.map(g => g.category)];

export default function DataSources() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = DATA_SOURCES.filter(group => {
    if (activeCategory !== "All" && group.category !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return group.sources.some(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.features.some(f => f.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const total = DATA_SOURCES.reduce((acc, g) => acc + g.sources.length, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto pb-16">
        <div className="mb-8" style={{ animation: "slide-up-fade 0.5s ease-out" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Live Data Sources</h1>
              <p className="text-white/45 text-sm">
                {total} verified external platforms — directly integrated into rep profiles, issue cards, and finance data
              </p>
            </div>
          </div>
          <div className="bg-cyan-400/5 border border-cyan-400/15 rounded-2xl p-4 flex gap-3 items-start mt-4">
            <svg className="w-4 h-4 text-cyan-400/60 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-cyan-300/60 leading-relaxed">
              VoiceMap Civic uses placeholder data for demonstration. These external sources provide the live, verified data behind every metric shown here. Click "Verify" buttons on representative profiles and issue cards to cross-check directly.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6" style={{ animation: "slide-up-fade 0.5s ease-out 80ms both" }}>
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search sources, features, topics..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/35 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {["All", ...DATA_SOURCES.map(g => g.category.split(" ")[0])].map((cat, i) => {
              const fullCat = cat === "All" ? "All" : DATA_SOURCES[i - 1]?.category;
              const isActive = activeCategory === (fullCat || "All");
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(fullCat || "All")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30"
                      : "bg-white/4 text-white/40 border border-white/8 hover:bg-white/8 hover:text-white/70"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-10">
          {filtered.map((group, gi) => {
            const c = colorMap[group.color] || colorMap.cyan;
            const filteredSources = search
              ? group.sources.filter(s =>
                  s.name.toLowerCase().includes(search.toLowerCase()) ||
                  s.description.toLowerCase().includes(search.toLowerCase()) ||
                  s.features.some(f => f.toLowerCase().includes(search.toLowerCase()))
                )
              : group.sources;

            if (filteredSources.length === 0) return null;

            return (
              <div key={group.category} style={{ animation: `slide-up-fade 0.5s ease-out ${gi * 80}ms both` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${c.icon}`}>
                    <svg className={`w-4 h-4 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={group.icon} />
                    </svg>
                  </div>
                  <h2 className={`text-lg font-black ${c.text}`}>{group.category}</h2>
                  <span className="text-xs text-white/25 bg-white/4 border border-white/8 px-2 py-0.5 rounded-full">{filteredSources.length} sources</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSources.map((source, si) => (
                    <GlassCard
                      key={source.name}
                      className={`border group hover:${c.border} transition-all duration-300 hover:shadow-lg`}
                      style={{ animation: `slide-up-fade 0.4s ease-out ${si * 60}ms both` }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${c.icon}`}>
                            <span className={`text-[11px] font-black ${c.text}`}>{source.name.charAt(0)}</span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-black text-white leading-tight">{source.name}</h3>
                            <p className={`text-[10px] font-semibold uppercase tracking-widest ${c.text} opacity-60`}>{source.url.replace("https://", "").split("/")[0]}</p>
                          </div>
                        </div>
                        <StatusBadge variant={source.badgeVariant} className="shrink-0 text-[10px]">{source.badge}</StatusBadge>
                      </div>

                      <p className="text-white/55 text-sm leading-relaxed mb-4">{source.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {source.features.map(f => (
                          <span key={f} className={`text-[10px] px-2 py-1 rounded-lg border font-medium ${c.bg} ${c.border} ${c.text}`}>
                            {f}
                          </span>
                        ))}
                      </div>

                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-200 ${c.bg} ${c.border} ${c.text} hover:opacity-100 opacity-80`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit {source.name}
                      </a>
                    </GlassCard>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <GlassCard className="mt-10 border-white/10 text-center py-10" style={{ animation: "slide-up-fade 0.5s ease-out 400ms both" }}>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-base mb-1">Know a better source?</h3>
          <p className="text-white/35 text-sm mb-4 max-w-sm mx-auto">Help us improve civic data transparency. If you know a reliable source not listed here, it belongs on this page.</p>
          <GlowButton variant="secondary" className="text-xs">
            Suggest a Source
          </GlowButton>
        </GlassCard>
      </div>
    </Layout>
  );
}
