import { useState } from "react";
import { Layout } from "@/components/layout";
import { GlassCard, GlowButton, StatusBadge } from "@/components/ui/glass";
import { useStore } from "@/lib/store";
import { Link } from "wouter";

const LOOKUP_SERVICES = [
  {
    name: "USA.gov Official Lookup",
    url: "https://www.usa.gov/elected-officials",
    description: "The federal government's official tool — find your U.S. Senators, House Representative, state governor, and state legislators by address.",
    badge: "Official Gov",
    badgeVariant: "info" as const,
    color: "cyan",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    levels: ["Federal", "State", "Governor"],
    getUrl: (address: string, _zip: string, _state: string) =>
      address ? `https://www.usa.gov/elected-officials` : "https://www.usa.gov/elected-officials",
  },
  {
    name: "OpenStates Legislator Finder",
    url: "https://openstates.org/find_your_legislator/",
    description: "Open-source civic data — find all your state legislators instantly by entering your address. Covers all 50 states with full profiles.",
    badge: "Open Source",
    badgeVariant: "success" as const,
    color: "emerald",
    icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
    levels: ["State Senate", "State House"],
    getUrl: (_address: string, _zip: string, _state: string) =>
      `https://openstates.org/find_your_legislator/`,
  },
  {
    name: "Common Cause Find Your Reps",
    url: "https://www.commoncause.org/find-your-representative/",
    description: "Nonpartisan government watchdog — find all elected officials at every level and contact them directly with one click.",
    badge: "Nonpartisan",
    badgeVariant: "warning" as const,
    color: "amber",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    levels: ["Federal", "State", "Local"],
    getUrl: (_address: string, zip: string, _state: string) =>
      zip ? `https://www.commoncause.org/find-your-representative/?zip=${zip}` : "https://www.commoncause.org/find-your-representative/",
  },
  {
    name: "ProPublica Represent",
    url: "https://projects.propublica.org/represent/",
    description: "Investigative journalism meets civic data — look up your congressional rep's voting record, missed votes, and sponsored bills.",
    badge: "Federal Only",
    badgeVariant: "default" as const,
    color: "indigo",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    levels: ["U.S. House", "U.S. Senate"],
    getUrl: (_address: string, zip: string, _state: string) =>
      zip ? `https://projects.propublica.org/represent/locate?zip=${zip}` : "https://projects.propublica.org/represent/",
  },
  {
    name: "BallotPedia Elected Officials",
    url: "https://ballotpedia.org/Sample_Ballot_Lookup_Tool",
    description: "The comprehensive American elections encyclopedia — find all your elected officials and their profiles from city council to Congress.",
    badge: "All Levels",
    badgeVariant: "info" as const,
    color: "purple",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    levels: ["Federal", "State", "Local", "School Board"],
    getUrl: (_address: string, _zip: string, _state: string) =>
      `https://ballotpedia.org/Sample_Ballot_Lookup_Tool`,
  },
  {
    name: "Vote.gov",
    url: "https://vote.gov",
    description: "Official U.S. government voting resource — register to vote, check your registration status, and find your polling place.",
    badge: "Official Gov",
    badgeVariant: "info" as const,
    color: "red",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    levels: ["Voter Registration", "Polling Places"],
    getUrl: (_address: string, _zip: string, state: string) =>
      state ? `https://vote.gov/register/${state.toLowerCase()}/` : "https://vote.gov",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string; btn: string }> = {
  cyan:    { bg: "bg-cyan-400/8", border: "border-cyan-400/18", text: "text-cyan-300", icon: "bg-cyan-400/15 border-cyan-400/25", btn: "bg-cyan-500/20 text-cyan-300 border-cyan-500/35 hover:bg-cyan-500/30 hover:border-cyan-400/60" },
  emerald: { bg: "bg-emerald-400/8", border: "border-emerald-400/18", text: "text-emerald-300", icon: "bg-emerald-400/15 border-emerald-400/25", btn: "bg-emerald-500/20 text-emerald-300 border-emerald-500/35 hover:bg-emerald-500/30 hover:border-emerald-400/60" },
  amber:   { bg: "bg-amber-400/8", border: "border-amber-400/18", text: "text-amber-300", icon: "bg-amber-400/15 border-amber-400/25", btn: "bg-amber-500/20 text-amber-300 border-amber-500/35 hover:bg-amber-500/30 hover:border-amber-400/60" },
  indigo:  { bg: "bg-indigo-400/8", border: "border-indigo-400/18", text: "text-indigo-300", icon: "bg-indigo-400/15 border-indigo-400/25", btn: "bg-indigo-500/20 text-indigo-300 border-indigo-500/35 hover:bg-indigo-500/30 hover:border-indigo-400/60" },
  purple:  { bg: "bg-purple-400/8", border: "border-purple-400/18", text: "text-purple-300", icon: "bg-purple-400/15 border-purple-400/25", btn: "bg-purple-500/20 text-purple-300 border-purple-500/35 hover:bg-purple-500/30 hover:border-purple-400/60" },
  red:     { bg: "bg-red-400/8", border: "border-red-400/18", text: "text-red-300", icon: "bg-red-400/15 border-red-400/25", btn: "bg-red-500/20 text-red-300 border-red-500/35 hover:bg-red-500/30 hover:border-red-400/60" },
};

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","Washington D.C."
];

const STATE_ABBR: Record<string, string> = {
  "Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA",
  "Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA",
  "Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS",
  "Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA",
  "Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT",
  "Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM",
  "New York":"NY","North Carolina":"NC","North Dakota":"ND","Ohio":"OH","Oklahoma":"OK",
  "Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC",
  "South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT",
  "Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY",
  "Washington D.C.":"DC",
};

export default function FindReps() {
  const { reps } = useStore();
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [launched, setLaunched] = useState<string | null>(null);

  const stateAbbr = state ? (STATE_ABBR[state] || "") : "";

  const handleLookup = (service: typeof LOOKUP_SERVICES[0]) => {
    const url = service.getUrl(address, zip, stateAbbr);
    window.open(url, "_blank", "noopener,noreferrer");
    setLaunched(service.name);
    setTimeout(() => setLaunched(null), 2500);
  };

  const hasInput = address.trim() || zip.trim() || state;

  const levelVariant = (level: string) => {
    if (level === "federal") return "info";
    if (level === "state") return "success";
    if (level === "county") return "warning";
    if (level === "city") return "default";
    return "default";
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-16">
        <div className="mb-10" style={{ animation: "slide-up-fade 0.5s ease-out" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Find Your Representatives</h1>
              <p className="text-white/45 text-sm">Look up every elected official who represents you — from city hall to Congress</p>
            </div>
          </div>

          <div className="mt-6 flex items-stretch gap-2 p-1 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl flex-wrap md:flex-nowrap">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <input
                type="text"
                placeholder="Street address (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/35 transition-all"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
            <input
              type="text"
              placeholder="ZIP code"
              maxLength={10}
              className="w-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/35 transition-all text-center"
              value={zip}
              onChange={e => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            />
            <div className="relative w-44">
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/35 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#0d1829]">Select state</option>
                {US_STATES.map(s => (
                  <option key={s} value={s} className="bg-[#0d1829]">{s}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {hasInput && (
            <div className="mt-3 flex items-center gap-2 px-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-emerald-400/70 font-medium">
                Ready — click any lookup service below to find your reps on that platform
              </p>
            </div>
          )}
          {!hasInput && (
            <p className="mt-3 text-xs text-white/25 px-1">
              Address and ZIP are optional — all tools below work with just a state selection, or no input at all.
            </p>
          )}
        </div>

        <div className="mb-3 flex items-center gap-2" style={{ animation: "slide-up-fade 0.5s ease-out 100ms both" }}>
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-white/30 font-semibold uppercase tracking-widest px-3">Live Lookup Services</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12" style={{ animation: "slide-up-fade 0.5s ease-out 150ms both" }}>
          {LOOKUP_SERVICES.map((svc, i) => {
            const c = colorMap[svc.color] || colorMap.cyan;
            const isLaunched = launched === svc.name;
            return (
              <GlassCard
                key={svc.name}
                className={`flex flex-col gap-4 transition-all duration-300 hover:border-white/20`}
                style={{ animation: `slide-up-fade 0.4s ease-out ${i * 60}ms both` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${c.icon}`}>
                      <svg className={`w-4 h-4 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={svc.icon} />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-white leading-tight">{svc.name}</h3>
                      <p className={`text-[10px] font-semibold uppercase tracking-widest ${c.text} opacity-60`}>
                        {svc.url.replace("https://", "").split("/")[0]}
                      </p>
                    </div>
                  </div>
                  <StatusBadge variant={svc.badgeVariant} className="shrink-0">{svc.badge}</StatusBadge>
                </div>

                <p className="text-white/55 text-sm leading-relaxed">{svc.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {svc.levels.map(level => (
                    <span key={level} className={`text-[10px] px-2 py-1 rounded-lg border font-semibold ${c.bg} ${c.border} ${c.text}`}>
                      {level}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleLookup(svc)}
                  className={`mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200 ${c.btn} ${isLaunched ? 'opacity-60' : ''}`}
                >
                  {isLaunched ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Opened in new tab
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Look Up My Reps
                    </>
                  )}
                </button>
              </GlassCard>
            );
          })}
        </div>

        <div className="mb-3 flex items-center gap-2" style={{ animation: "slide-up-fade 0.5s ease-out 400ms both" }}>
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-white/30 font-semibold uppercase tracking-widest px-3">Local Demo Representatives</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>
        <p className="text-xs text-white/30 mb-5 text-center" style={{ animation: "slide-up-fade 0.5s ease-out 450ms both" }}>
          These are placeholder profiles used in-app for tracking and accountability. Add your own officials via the{" "}
          <Link href="/representatives" className="text-cyan-400/60 hover:text-cyan-300 transition-colors">Representatives</Link> page.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ animation: "slide-up-fade 0.5s ease-out 500ms both" }}>
          {reps.slice(0, 6).map((rep, i) => (
            <Link href="/representatives" key={rep.id}>
              <GlassCard
                className="flex flex-col gap-3 hover:border-cyan-400/25 transition-all duration-200 cursor-pointer"
                style={{ animation: `slide-up-fade 0.4s ease-out ${i * 50}ms both` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0 text-white font-black text-base">
                    {rep.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-tight truncate">{rep.name}</p>
                    <p className="text-xs text-white/40 truncate">{rep.title}</p>
                  </div>
                  <StatusBadge variant={levelVariant(rep.level) as any} className="shrink-0 text-[9px]">
                    {rep.level === "school-board" ? "SCHOOL" : rep.level.slice(0, 3).toUpperCase()}
                  </StatusBadge>
                </div>
                <p className="text-xs text-white/35 leading-relaxed">{rep.district}</p>
                <div className="flex items-center gap-1.5 text-cyan-400/50 mt-auto">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-[10px] font-semibold">View profile</span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        <GlassCard className="mt-8 border-white/8 bg-gradient-to-br from-cyan-400/5 to-indigo-500/5 text-center py-8" style={{ animation: "slide-up-fade 0.5s ease-out 700ms both" }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-white/10" />
            <svg className="w-5 h-5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="h-px w-12 bg-white/10" />
          </div>
          <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
            Once you know your representatives, track their votes, campaign finance, and controversies using the{" "}
            <Link href="/representatives" className="text-cyan-400/60 hover:text-cyan-300 underline transition-colors">Representative Directory</Link>{" "}
            and{" "}
            <Link href="/scorecard" className="text-cyan-400/60 hover:text-cyan-300 underline transition-colors">Scorecard</Link>.
          </p>
        </GlassCard>
      </div>
    </Layout>
  );
}
