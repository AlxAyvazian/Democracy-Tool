import { Representative } from "./data";

function slug(name: string) {
  return encodeURIComponent(name.replace(/\s+/g, "+"));
}

function ballotpediaSlug(name: string) {
  return name.replace(/\s+/g, "_");
}

export function getRepExternalLinks(rep: Representative) {
  const isFederal = rep.level === "federal";
  const isState = rep.level === "state";
  const isSenator = rep.title.toLowerCase().includes("senator");
  const nameSlug = slug(rep.name);
  const bpSlug = ballotpediaSlug(rep.name);

  return {
    govtrack: isFederal
      ? `https://www.govtrack.us/congress/members#sortby=sortname&q=${nameSlug}`
      : null,
    congress: isFederal
      ? `https://www.congress.gov/search?q=%7B%22source%22%3A%22members%22%2C%22search%22%3A%22${nameSlug}%22%7D`
      : null,
    opensecrets: (isFederal || isState)
      ? `https://www.opensecrets.org/search?q=${nameSlug}&type=politicians`
      : null,
    fec: isFederal
      ? `https://www.fec.gov/data/candidates/?q=${nameSlug}&cycle=2024&election_year=2024&is_active_candidate=true`
      : null,
    votesmart: `https://votesmart.org/search#.?search=${nameSlug}`,
    ballotpedia: `https://ballotpedia.org/${bpSlug}`,
    followthemoney: (isState || !isFederal)
      ? `https://www.followthemoney.org/entity-details?search=${nameSlug}`
      : null,
    propublica: isFederal
      ? `https://projects.propublica.org/represent/members/${isSenator ? "senate" : "house"}?q=${nameSlug}`
      : null,
    crew: `https://www.citizensforethics.org/reports-investigations/?s=${nameSlug}`,
  };
}

export function getBillExternalLinks(billId: string, billName: string) {
  const nameSlug = slug(billName);
  const idSlug = slug(billId);
  const isFederal = /^(HR|S\.|H\.R\.)/.test(billId);

  return {
    congress: isFederal
      ? `https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22${nameSlug}%22%7D`
      : null,
    govtrack: isFederal
      ? `https://www.govtrack.us/congress/bills/search?text=${nameSlug}`
      : null,
    legiscan: `https://legiscan.com/search?q=${nameSlug}&state=ALL`,
  };
}

export function getIssueExternalLinks(topic: string, title: string) {
  const topicSlug = slug(title);
  const topicMap: Record<string, string[]> = {
    transit: ["transportation", "transit infrastructure"],
    housing: ["housing", "affordable housing"],
    environment: ["environment", "climate"],
    education: ["education funding", "schools"],
    economy: ["economy", "fiscal policy"],
    "public safety": ["public safety", "police reform"],
    technology: ["technology policy", "digital privacy"],
    healthcare: ["healthcare", "health insurance"],
    immigration: ["immigration", "border"],
    defense: ["defense spending", "military"],
    "public welfare": ["social services", "public welfare"],
  };

  const terms = topicMap[topic] || [topic];
  const termSlug = slug(terms[0]);

  return {
    congress: `https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22${topicSlug}%22%7D`,
    govtrack: `https://www.govtrack.us/congress/bills/search?text=${topicSlug}`,
    legiscan: `https://legiscan.com/search?q=${termSlug}&state=ALL`,
    ballotpedia: `https://ballotpedia.org/Special:Search?search=${topicSlug}`,
  };
}

export const DATA_SOURCES = [
  {
    category: "Federal Voting & Legislation",
    color: "cyan",
    icon: "M3 6h18M3 12h18M3 18h18",
    sources: [
      {
        name: "Congress.gov",
        url: "https://www.congress.gov",
        description: "Official source for U.S. federal legislation, member profiles, voting records, and committee assignments.",
        badge: "Official",
        badgeVariant: "info" as const,
        features: ["Member profiles", "Bill text & status", "Roll call votes", "Committee reports"],
      },
      {
        name: "GovTrack.us",
        url: "https://www.govtrack.us",
        description: "Nonpartisan tracker of Congressional activity with voting scores, missed votes, and bill co-sponsorship analysis.",
        badge: "Free",
        badgeVariant: "success" as const,
        features: ["Voting records", "Missed vote rankings", "Bill progress", "Member statistics"],
      },
      {
        name: "VoteSmart.org",
        url: "https://votesmart.org",
        description: "Comprehensive politician profiles covering voting history, issue positions, campaign finance, and speeches at all levels.",
        badge: "Free",
        badgeVariant: "success" as const,
        features: ["Issue positions", "Voting history", "Bio & background", "State & federal"],
      },
      {
        name: "ProPublica Congress",
        url: "https://projects.propublica.org/represent/",
        description: "Investigative journalism-backed congressional tracker with missed votes, bill sponsorships, and floor statements.",
        badge: "Free",
        badgeVariant: "success" as const,
        features: ["Missed votes", "Bill sponsorship", "Floor statements", "Party unity scores"],
      },
    ],
  },
  {
    category: "Campaign Finance",
    color: "amber",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    sources: [
      {
        name: "OpenSecrets.org",
        url: "https://www.opensecrets.org",
        description: "The gold standard for federal campaign finance data — donor networks, industry contributions, PAC money, and dark money tracking.",
        badge: "Key Source",
        badgeVariant: "warning" as const,
        features: ["Donor profiles", "Industry breakdowns", "PAC tracking", "Dark money"],
      },
      {
        name: "FEC.gov",
        url: "https://www.fec.gov/data/",
        description: "Official Federal Election Commission database. Every federal campaign contribution, expenditure, and filing is publicly searchable.",
        badge: "Official",
        badgeVariant: "info" as const,
        features: ["Official filings", "Contribution search", "Candidate financials", "Expenditures"],
      },
      {
        name: "FollowTheMoney.org",
        url: "https://www.followthemoney.org",
        description: "National Institute on Money in Politics — tracks state-level campaign finance data across all 50 states.",
        badge: "State Focus",
        badgeVariant: "default" as const,
        features: ["State elections", "Donor mapping", "Industry analysis", "50-state coverage"],
      },
      {
        name: "MapLight.org",
        url: "https://maplight.org",
        description: "Connects campaign donations to legislative votes, revealing potential conflicts between money received and bills supported.",
        badge: "Watchdog",
        badgeVariant: "danger" as const,
        features: ["Money-to-vote mapping", "Conflict detection", "Bill analysis", "Transparency scores"],
      },
    ],
  },
  {
    category: "Ethics & Accountability Watchdogs",
    color: "red",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    sources: [
      {
        name: "CREW — Citizens for Ethics",
        url: "https://www.citizensforethics.org",
        description: "Leading nonpartisan watchdog exposing government corruption through investigations, litigation, and public records requests.",
        badge: "Watchdog",
        badgeVariant: "danger" as const,
        features: ["Ethics investigations", "FOIA requests", "Corruption database", "Litigation tracker"],
      },
      {
        name: "ProPublica",
        url: "https://www.propublica.org",
        description: "Award-winning investigative newsroom tracking government accountability, spending, and corporate malfeasance.",
        badge: "Press",
        badgeVariant: "default" as const,
        features: ["Nonprofit Explorer", "Investigate Congress", "Data journalism", "FOIA library"],
      },
      {
        name: "Sunlight Foundation Archive",
        url: "https://sunlightfoundation.com",
        description: "Transparency advocacy organization with tools to track lobbying, political spending, and government contracts.",
        badge: "Archive",
        badgeVariant: "default" as const,
        features: ["Lobbying disclosure", "Political ad tracking", "Open data tools", "Transparency policy"],
      },
      {
        name: "MuckRock.com",
        url: "https://www.muckrock.com",
        description: "Crowdsourced FOIA platform — file, track, and share public records requests against any government agency.",
        badge: "FOIA",
        badgeVariant: "info" as const,
        features: ["FOIA filing", "Records sharing", "Agency tracking", "Community collaboration"],
      },
    ],
  },
  {
    category: "State & Local Government",
    color: "indigo",
    icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
    sources: [
      {
        name: "BallotPedia",
        url: "https://ballotpedia.org",
        description: "The comprehensive encyclopedia of American elections — covers every candidate, ballot measure, and elected official at all levels.",
        badge: "Key Source",
        badgeVariant: "warning" as const,
        features: ["All gov levels", "Election history", "Ballot measures", "Official profiles"],
      },
      {
        name: "LegiScan",
        url: "https://legiscan.com",
        description: "Real-time state legislative tracking across all 50 states — follow bills, votes, and amendments as they happen.",
        badge: "Real-time",
        badgeVariant: "success" as const,
        features: ["50-state bills", "Real-time tracking", "Vote history", "Committee tracking"],
      },
      {
        name: "OpenStates.org",
        url: "https://openstates.org",
        description: "Open-source aggregator of state legislative data — bills, votes, and legislators scraped directly from official sources.",
        badge: "Open Source",
        badgeVariant: "success" as const,
        features: ["Bill tracking", "Legislator profiles", "Committee assignments", "API access"],
      },
      {
        name: "Cicero API (Azavea)",
        url: "https://cicero.azavea.com",
        description: "Civic district lookup — find elected officials for any address at federal, state, and local levels.",
        badge: "Lookup Tool",
        badgeVariant: "info" as const,
        features: ["Address lookup", "All gov levels", "District mapping", "Official finder"],
      },
    ],
  },
  {
    category: "Government Spending & Contracts",
    color: "emerald",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    sources: [
      {
        name: "USASpending.gov",
        url: "https://www.usaspending.gov",
        description: "Official federal spending database — every contract, grant, loan, and direct payment made by the U.S. government.",
        badge: "Official",
        badgeVariant: "info" as const,
        features: ["Federal contracts", "Grants database", "Agency spending", "Recipient profiles"],
      },
      {
        name: "OpenPayrolls.com",
        url: "https://openpayrolls.com",
        description: "Public employee salary database covering hundreds of government agencies — verify what officials and public employees are paid.",
        badge: "Free",
        badgeVariant: "success" as const,
        features: ["Public salaries", "Agency payrolls", "Benefits data", "Historical records"],
      },
      {
        name: "GovSpend",
        url: "https://govspend.com",
        description: "Local and state government contract tracking — uncover vendor relationships and procurement patterns.",
        badge: "Contracts",
        badgeVariant: "default" as const,
        features: ["Local contracts", "Vendor tracking", "Procurement data", "Spending trends"],
      },
      {
        name: "ProPublica Nonprofit Explorer",
        url: "https://projects.propublica.org/nonprofits/",
        description: "Search IRS Form 990 filings for any nonprofit — including political nonprofits, dark money groups, and advocacy organizations.",
        badge: "Nonprofits",
        badgeVariant: "warning" as const,
        features: ["IRS Form 990s", "Dark money groups", "Executive salaries", "Revenue & spending"],
      },
    ],
  },
  {
    category: "Investigative & Press",
    color: "purple",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2",
    sources: [
      {
        name: "The Marshall Project",
        url: "https://www.themarshallproject.org",
        description: "Nonprofit journalism focused on criminal justice — tracks legislation, sentencing, prison conditions, and policing nationwide.",
        badge: "Criminal Justice",
        badgeVariant: "danger" as const,
        features: ["Criminal justice", "Policing data", "State tracking", "Policy analysis"],
      },
      {
        name: "Politico Congress",
        url: "https://www.politico.com/congress",
        description: "Real-time congressional coverage — votes, hearings, floor schedules, and member activity tracked daily.",
        badge: "News",
        badgeVariant: "default" as const,
        features: ["Breaking votes", "Hearing schedules", "Member news", "Policy analysis"],
      },
      {
        name: "The Intercept",
        url: "https://theintercept.com",
        description: "Adversarial investigative journalism focused on government power, civil liberties, and corporate accountability.",
        badge: "Investigative",
        badgeVariant: "warning" as const,
        features: ["Gov accountability", "Civil liberties", "Campaign money", "Whistleblower stories"],
      },
      {
        name: "State Integrity Investigation",
        url: "https://stateintegrity.org",
        description: "Grades all 50 state governments on transparency, ethics, and accountability across 330+ metrics.",
        badge: "Transparency Grades",
        badgeVariant: "success" as const,
        features: ["State grades", "Ethics laws", "Transparency scores", "Comparative data"],
      },
    ],
  },
];
