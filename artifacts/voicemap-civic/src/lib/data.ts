export type Level = "federal" | "state" | "county" | "city" | "school-board" | "other";

export interface VotingRecord {
  billId: string;
  billName: string;
  date: string;
  vote: 'YEA' | 'NAY' | 'ABSTAIN' | 'ABSENT';
  topic: string;
  alignment: 'aligned' | 'opposed' | 'unknown';
  summary: string;
}

export interface CampaignDonor {
  name: string;
  amount: number;
  type: 'PAC' | 'Individual' | 'Corporate' | 'Union';
}

export interface CampaignIndustry {
  name: string;
  amount: number;
  percentage: number;
}

export interface CampaignFinance {
  totalRaised: number;
  cycle: string;
  topDonors: CampaignDonor[];
  topIndustries: CampaignIndustry[];
}

export interface Controversy {
  id: string;
  title: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  summary: string;
  source?: string;
  category: 'ethics' | 'vote' | 'statement' | 'financial' | 'conduct';
}

export interface Representative {
  id: string;
  name: string;
  title: string;
  district: string;
  level: Level;
  party?: string;
  phone: string;
  email: string;
  website: string;
  socialLinks?: { platform: string; url: string }[];
  committees: string[];
  recentActions: { date: string; action: string }[];
  photoUrl?: string;
  votingRecord: VotingRecord[];
  campaignFinance: CampaignFinance;
  controversies: Controversy[];
}

export interface IssuePosition {
  type: 'support' | 'oppose' | 'unsure' | 'needs-info';
  count: number;
}

export interface Issue {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  topic: string;
  positions: IssuePosition[];
  comments: { id: string; author: string; text: string; date: string }[];
}

export interface Petition {
  id: string;
  title: string;
  targetOfficial: string;
  problemStatement: string;
  requestedAction: string;
  evidence: string;
  deadline: string;
  supporters: number;
  generatedText: string;
  generatedEmail: string;
  generatedSocialPost: string;
  generatedCouncilComment: string;
  createdAt: string;
}

export interface MessageLog {
  id: string;
  issueId: string;
  repId: string;
  tone: string;
  type: string;
  date: string;
}

export const INITIAL_REPS: Representative[] = [
  {
    id: "r1",
    name: "Sarah Jenkins",
    title: "U.S. Senator",
    district: "Statewide",
    level: "federal",
    party: "Independent",
    phone: "(202) 555-0192",
    email: "senator@jenkins.senate.gov",
    website: "https://jenkins.senate.gov",
    socialLinks: [{ platform: "Twitter/X", url: "#" }, { platform: "Facebook", url: "#" }],
    committees: ["Judiciary", "Environment and Public Works"],
    recentActions: [
      { date: "2024-10-12", action: "Co-sponsored Clean Water Infrastructure Act" },
      { date: "2024-09-28", action: "Voted YEA on Digital Privacy Standards" }
    ],
    votingRecord: [
      { billId: "S.1234", billName: "Clean Water Infrastructure Act", date: "2024-09-28", vote: "YEA", topic: "environment", alignment: "aligned", summary: "Allocates $40B for clean water infrastructure upgrades nationwide." },
      { billId: "HR.5678", billName: "Digital Privacy Act", date: "2024-08-14", vote: "YEA", topic: "technology", alignment: "aligned", summary: "Establishes federal consumer data protection standards." },
      { billId: "S.9012", billName: "Corporate Tax Relief Act", date: "2024-07-22", vote: "NAY", topic: "economy", alignment: "aligned", summary: "Proposed reduction of corporate tax rate from 21% to 18%." },
      { billId: "HR.3456", billName: "Border Enforcement Expansion Act", date: "2024-06-10", vote: "NAY", topic: "immigration", alignment: "unknown", summary: "Expands federal immigration enforcement at southern border." },
      { billId: "S.7890", billName: "Renewable Energy Incentive Act", date: "2024-05-05", vote: "YEA", topic: "environment", alignment: "aligned", summary: "Extends tax credits for solar and wind energy installations." }
    ],
    campaignFinance: {
      totalRaised: 8_420_000,
      cycle: "2024",
      topDonors: [
        { name: "Environmental Defense PAC", amount: 650_000, type: "PAC" },
        { name: "Tech Industry Alliance PAC", amount: 480_000, type: "PAC" },
        { name: "Jane Williams (Retired)", amount: 33_900, type: "Individual" },
        { name: "Robert Torres (Attorney)", amount: 29_400, type: "Individual" },
        { name: "GreenTech Solutions", amount: 250_000, type: "Corporate" }
      ],
      topIndustries: [
        { name: "Technology", amount: 1_840_000, percentage: 21.8 },
        { name: "Environment/Energy", amount: 1_520_000, percentage: 18.1 },
        { name: "Law Firms", amount: 1_100_000, percentage: 13.1 },
        { name: "Real Estate", amount: 880_000, percentage: 10.5 },
        { name: "Healthcare", amount: 720_000, percentage: 8.6 }
      ]
    },
    controversies: [
      { id: "c1", title: "Missed 23% of Senate Votes in 2023", date: "2024-01-08", severity: "medium", category: "vote", summary: "Senator Jenkins missed 23% of Senate floor votes in 2023, ranking in the bottom 20% of attendance among sitting senators. Her office cited committee work and constituent travel.", source: "GovTrack.us" },
      { id: "c2", title: "Stock Trades During Tech Regulation Debate", date: "2023-11-15", severity: "high", category: "financial", summary: "Financial disclosures revealed purchases of tech sector stocks in the month before she sponsored a digital privacy bill widely seen as favorable to industry. No formal investigation was opened.", source: "OpenSecrets.org" }
    ]
  },
  {
    id: "r2",
    name: "Marcus Chen",
    title: "U.S. Representative",
    district: "District 4",
    level: "federal",
    party: "Democrat",
    phone: "(202) 555-0144",
    email: "rep.chen@mail.house.gov",
    website: "https://chen.house.gov",
    socialLinks: [{ platform: "Twitter/X", url: "#" }],
    committees: ["Transportation", "Science, Space, and Technology"],
    recentActions: [
      { date: "2024-10-15", action: "Introduced High-Speed Rail Initiative" },
      { date: "2024-09-02", action: "Secured $50M DOT grant for District 4 transit" }
    ],
    votingRecord: [
      { billId: "HR.2200", billName: "National High-Speed Rail Act", date: "2024-10-01", vote: "YEA", topic: "transit", alignment: "aligned", summary: "Authorizes $150B over 10 years for a national high-speed rail network." },
      { billId: "HR.4400", billName: "Highway Expansion Authorization", date: "2024-08-20", vote: "NAY", topic: "transit", alignment: "aligned", summary: "Proposed $80B for new highway construction. Critics noted it prioritizes cars over public transit." },
      { billId: "S.1234", billName: "Clean Water Infrastructure Act", date: "2024-09-28", vote: "YEA", topic: "environment", alignment: "aligned", summary: "Allocates $40B for clean water infrastructure upgrades." },
      { billId: "HR.9900", billName: "Defense Budget Authorization FY2025", date: "2024-07-15", vote: "YEA", topic: "defense", alignment: "unknown", summary: "Approves $886B in defense spending for fiscal year 2025." },
      { billId: "HR.1122", billName: "Minimum Wage Increase Act", date: "2024-04-11", vote: "YEA", topic: "economy", alignment: "aligned", summary: "Raises federal minimum wage to $17/hr by 2026." }
    ],
    campaignFinance: {
      totalRaised: 3_250_000,
      cycle: "2024",
      topDonors: [
        { name: "Transit Workers Union PAC", amount: 420_000, type: "Union" },
        { name: "Urban Infrastructure PAC", amount: 310_000, type: "PAC" },
        { name: "Michael Santos (Developer)", amount: 33_900, type: "Individual" },
        { name: "Amtrak Employee PAC", amount: 180_000, type: "PAC" },
        { name: "CleanTech Ventures LLC", amount: 145_000, type: "Corporate" }
      ],
      topIndustries: [
        { name: "Transportation/Unions", amount: 900_000, percentage: 27.7 },
        { name: "Real Estate", amount: 560_000, percentage: 17.2 },
        { name: "Technology", amount: 440_000, percentage: 13.5 },
        { name: "Construction", amount: 380_000, percentage: 11.7 },
        { name: "Energy", amount: 290_000, percentage: 8.9 }
      ]
    },
    controversies: [
      { id: "c3", title: "Lobbyist-Funded Travel Disclosure", date: "2024-02-20", severity: "medium", category: "ethics", summary: "Ethics filings show Rep. Chen accepted four all-expenses-paid trips from transportation industry lobbyists while chairing the Transportation subcommittee. The trips were disclosed but critics question the optics.", source: "ProPublica" },
      { id: "c4", title: "Voted for Emergency Defense Supplement", date: "2023-10-05", severity: "low", category: "vote", summary: "Chen voted for an emergency $14.3B defense supplemental, surprising some progressive constituents who had expected opposition. His office cited national security imperatives." }
    ]
  },
  {
    id: "r3",
    name: "Elena Rodriguez",
    title: "State Senator",
    district: "District 12",
    level: "state",
    party: "Democrat",
    phone: "(555) 123-4567",
    email: "elena.rodriguez@state.gov",
    website: "https://senate.state.gov/rodriguez",
    committees: ["Education", "Housing"],
    recentActions: [
      { date: "2024-10-05", action: "Voted NAY on Corporate Tax Reduction" },
      { date: "2024-09-10", action: "Held town hall on affordable housing" }
    ],
    votingRecord: [
      { billId: "SB.401", billName: "Tenant Protection Act", date: "2024-09-28", vote: "YEA", topic: "housing", alignment: "aligned", summary: "Caps annual rent increases and guarantees right to legal counsel in eviction hearings." },
      { billId: "SB.220", billName: "Corporate Tax Reduction Bill", date: "2024-10-05", vote: "NAY", topic: "economy", alignment: "aligned", summary: "Proposed reducing state corporate income tax rate by 3 points." },
      { billId: "SB.315", billName: "Universal Pre-K Funding Act", date: "2024-08-18", vote: "YEA", topic: "education", alignment: "aligned", summary: "Establishes state-funded pre-kindergarten programs for all 4-year-olds." },
      { billId: "SB.500", billName: "Police Oversight Commission Act", date: "2024-07-30", vote: "YEA", topic: "public safety", alignment: "aligned", summary: "Creates an independent civilian oversight board for law enforcement." }
    ],
    campaignFinance: {
      totalRaised: 1_180_000,
      cycle: "2024",
      topDonors: [
        { name: "Teachers Union PAC", amount: 95_000, type: "Union" },
        { name: "Housing Justice Fund PAC", amount: 72_000, type: "PAC" },
        { name: "Ana Reyes (Healthcare)", amount: 10_400, type: "Individual" },
        { name: "SEIU Local 1021 PAC", amount: 68_000, type: "Union" }
      ],
      topIndustries: [
        { name: "Labor/Unions", amount: 320_000, percentage: 27.1 },
        { name: "Education", amount: 210_000, percentage: 17.8 },
        { name: "Healthcare", amount: 185_000, percentage: 15.7 },
        { name: "Non-profit sector", amount: 140_000, percentage: 11.9 },
        { name: "Law Firms", amount: 110_000, percentage: 9.3 }
      ]
    },
    controversies: []
  },
  {
    id: "r4",
    name: "David Washington",
    title: "Mayor",
    district: "Citywide",
    level: "city",
    party: "Republican",
    phone: "(555) 987-6543",
    email: "mayor@city.gov",
    website: "https://city.gov/mayor",
    socialLinks: [{ platform: "Instagram", url: "#" }],
    committees: [],
    recentActions: [
      { date: "2024-10-20", action: "Announced new public transit funding" },
      { date: "2024-09-15", action: "Signed Balanced Budget Ordinance for FY2025" }
    ],
    votingRecord: [
      { billId: "ORD-2024-41", billName: "City Budget FY2025", date: "2024-09-15", vote: "YEA", topic: "economy", alignment: "aligned", summary: "Approved $2.1B city budget with increased allocations for public safety and infrastructure." },
      { billId: "ORD-2024-33", billName: "Homeless Services Expansion Ordinance", date: "2024-07-10", vote: "NAY", topic: "public welfare", alignment: "opposed", summary: "Proposed expanding shelter capacity and low-barrier housing programs. Mayor cited cost concerns." },
      { billId: "ORD-2024-28", billName: "Vision Zero Street Safety Plan", date: "2024-05-22", vote: "YEA", topic: "transit", alignment: "aligned", summary: "Commits city to eliminating traffic fatalities through road redesign and speed enforcement." }
    ],
    campaignFinance: {
      totalRaised: 2_640_000,
      cycle: "2024",
      topDonors: [
        { name: "Real Estate Developers PAC", amount: 340_000, type: "PAC" },
        { name: "Business Improvement District PAC", amount: 220_000, type: "PAC" },
        { name: "Tom Bradley (Construction)", amount: 33_900, type: "Individual" },
        { name: "City Contractors Alliance", amount: 185_000, type: "Corporate" }
      ],
      topIndustries: [
        { name: "Real Estate/Construction", amount: 940_000, percentage: 35.6 },
        { name: "Finance/Insurance", amount: 520_000, percentage: 19.7 },
        { name: "Business Services", amount: 380_000, percentage: 14.4 },
        { name: "Hospitality", amount: 230_000, percentage: 8.7 },
        { name: "Retail", amount: 180_000, percentage: 6.8 }
      ]
    },
    controversies: [
      { id: "c5", title: "Vetoed Homeless Shelter Expansion", date: "2024-07-10", severity: "high", category: "vote", summary: "Mayor Washington vetoed an ordinance to expand emergency shelter capacity by 400 beds, citing budget constraints — despite the city projecting a $180M surplus. Homeless advocates condemned the decision.", source: "City Council Records" },
      { id: "c6", title: "No-Bid Contracts to Campaign Donors", date: "2024-03-18", severity: "high", category: "financial", summary: "Investigative reporting revealed three city construction contracts totaling $12M were awarded without competitive bidding to firms whose principals are listed among the mayor's top campaign donors.", source: "Local Investigative Tribune" },
      { id: "c7", title: "Golf Trip on City Credit Card", date: "2023-12-05", severity: "medium", category: "conduct", summary: "Expense reports obtained via public records request showed $4,200 in charges at a private golf resort billed to a city discretionary account. His office called it a 'constituent engagement event.' No guests from the city were documented.", source: "Public Records Request" }
    ]
  },
  {
    id: "r5",
    name: "Anita Patel",
    title: "City Council Member",
    district: "Ward 3",
    level: "city",
    party: "Democrat",
    phone: "(555) 456-7890",
    email: "apatel@citycouncil.gov",
    website: "https://citycouncil.gov/ward3",
    committees: ["Public Safety", "Zoning"],
    recentActions: [
      { date: "2024-10-18", action: "Proposed mental health crisis response team" },
      { date: "2024-09-22", action: "100% constituent response rate for Q3" }
    ],
    votingRecord: [
      { billId: "CC-2024-12", billName: "Mental Health Crisis Response Ordinance", date: "2024-10-18", vote: "YEA", topic: "public safety", alignment: "aligned", summary: "Creates a civilian mental health crisis response team as alternative to police dispatch." },
      { billId: "ORD-2024-41", billName: "City Budget FY2025", date: "2024-09-15", vote: "YEA", topic: "economy", alignment: "aligned", summary: "Voted for the full city budget with public safety and infrastructure provisions." },
      { billId: "CC-2024-08", billName: "Ward 3 Rezoning Plan", date: "2024-08-05", vote: "YEA", topic: "housing", alignment: "aligned", summary: "Upzones key commercial corridors in Ward 3 to allow mixed-use residential development." }
    ],
    campaignFinance: {
      totalRaised: 480_000,
      cycle: "2024",
      topDonors: [
        { name: "Ward 3 Neighborhood PAC", amount: 42_000, type: "PAC" },
        { name: "Mental Health Advocates PAC", amount: 35_000, type: "PAC" },
        { name: "Linda Chen (Teacher)", amount: 2_800, type: "Individual" }
      ],
      topIndustries: [
        { name: "Healthcare/Mental Health", amount: 120_000, percentage: 25.0 },
        { name: "Small Business", amount: 95_000, percentage: 19.8 },
        { name: "Labor/Unions", amount: 80_000, percentage: 16.7 },
        { name: "Education", amount: 65_000, percentage: 13.5 },
        { name: "Non-profit", amount: 55_000, percentage: 11.5 }
      ]
    },
    controversies: []
  },
  {
    id: "r6",
    name: "James O'Connor",
    title: "School Board President",
    district: "District 1",
    level: "school-board",
    party: "Republican",
    phone: "(555) 234-5678",
    email: "joconnor@schools.edu",
    website: "https://schools.edu/board",
    committees: ["Budget", "Curriculum"],
    recentActions: [
      { date: "2024-10-01", action: "Approved new STEM curriculum funding" }
    ],
    votingRecord: [
      { billId: "SBR-24-01", billName: "STEM Curriculum Expansion", date: "2024-10-01", vote: "YEA", topic: "education", alignment: "aligned", summary: "Allocates $2.4M for new STEM equipment and teacher training across District 1 schools." },
      { billId: "SBR-24-05", billName: "Library Book Removal Policy", date: "2024-07-15", vote: "YEA", topic: "education", alignment: "opposed", summary: "Approved a list of 47 titles to be removed from school library shelves. Policy was challenged by the state ACLU." },
      { billId: "SBR-24-08", billName: "Inclusive History Curriculum", date: "2024-05-20", vote: "NAY", topic: "education", alignment: "opposed", summary: "Voted against an updated history curriculum that included expanded coverage of civil rights and Indigenous history." }
    ],
    campaignFinance: {
      totalRaised: 185_000,
      cycle: "2024",
      topDonors: [
        { name: "Parents for School Choice PAC", amount: 28_000, type: "PAC" },
        { name: "Charter School Alliance", amount: 22_000, type: "Corporate" },
        { name: "Mark Sullivan (Business Owner)", amount: 5_800, type: "Individual" }
      ],
      topIndustries: [
        { name: "Education/Charter Schools", amount: 68_000, percentage: 36.8 },
        { name: "Business/Entrepreneurship", amount: 42_000, percentage: 22.7 },
        { name: "Religious Organizations", amount: 30_000, percentage: 16.2 },
        { name: "Real Estate", amount: 22_000, percentage: 11.9 }
      ]
    },
    controversies: [
      { id: "c8", title: "Book Removal Policy Under Legal Challenge", date: "2024-09-10", severity: "high", category: "conduct", summary: "The ACLU filed suit against the district over the removal of 47 books, arguing the policy violates First Amendment rights. A federal judge issued a preliminary injunction. The case is ongoing.", source: "ACLU Press Release" },
      { id: "c9", title: "Voted Against Inclusive History Curriculum", date: "2024-05-20", severity: "medium", category: "vote", summary: "O'Connor was the deciding vote against a revised history curriculum. Critics said the curriculum was a standard update; O'Connor called it 'ideologically biased.'" }
    ]
  },
  {
    id: "r7",
    name: "Patricia Nguyen",
    title: "State Representative",
    district: "Assembly District 22",
    level: "state",
    party: "Republican",
    phone: "(555) 345-6789",
    email: "p.nguyen@assembly.state.gov",
    website: "https://assembly.state.gov/nguyen",
    committees: ["Finance", "Veterans Affairs"],
    recentActions: [
      { date: "2024-10-08", action: "Sponsored Veterans Healthcare Access Act" },
      { date: "2024-09-19", action: "Voted against statewide rent control measure" }
    ],
    votingRecord: [
      { billId: "AB.212", billName: "Veterans Healthcare Access Act", date: "2024-10-08", vote: "YEA", topic: "healthcare", alignment: "aligned", summary: "Expands state healthcare coverage for veterans and adds two new VA-affiliated clinics." },
      { billId: "AB.330", billName: "Statewide Rent Control Measure", date: "2024-09-19", vote: "NAY", topic: "housing", alignment: "opposed", summary: "Would cap rent increases at inflation + 5% statewide. Nguyen argued it would discourage housing development." },
      { billId: "SB.500", billName: "Police Oversight Commission Act", date: "2024-07-30", vote: "NAY", topic: "public safety", alignment: "opposed", summary: "Voted against civilian oversight board for law enforcement." }
    ],
    campaignFinance: {
      totalRaised: 920_000,
      cycle: "2024",
      topDonors: [
        { name: "Landlord & Property Owners PAC", amount: 110_000, type: "PAC" },
        { name: "National Realtors PAC", amount: 88_000, type: "PAC" },
        { name: "Law Enforcement PAC", amount: 75_000, type: "PAC" }
      ],
      topIndustries: [
        { name: "Real Estate/Landlords", amount: 310_000, percentage: 33.7 },
        { name: "Law Enforcement", amount: 150_000, percentage: 16.3 },
        { name: "Finance/Banking", amount: 120_000, percentage: 13.0 },
        { name: "Agriculture", amount: 95_000, percentage: 10.3 },
        { name: "Healthcare", amount: 80_000, percentage: 8.7 }
      ]
    },
    controversies: [
      { id: "c10", title: "Personal Rental Properties Create Conflict of Interest", date: "2024-01-25", severity: "medium", category: "ethics", summary: "Nguyen owns 14 rental units in the district. Ethics watchdogs flagged her votes against rent control and eviction protections as a potential conflict of interest. She has not recused herself on housing votes.", source: "State Ethics Board Filing" }
    ]
  },
  {
    id: "r8",
    name: "Robert Okafor",
    title: "County Commissioner",
    district: "County District 5",
    level: "county",
    phone: "(555) 678-9012",
    email: "rokafor@county.gov",
    website: "https://county.gov/commission/d5",
    committees: ["Public Health", "Emergency Management"],
    recentActions: [
      { date: "2024-10-12", action: "Launched county mobile health clinic program" },
      { date: "2024-09-05", action: "Proposed emergency shelter expansion" }
    ],
    votingRecord: [
      { billId: "CO-24-15", billName: "Mobile Health Clinic Initiative", date: "2024-10-12", vote: "YEA", topic: "healthcare", alignment: "aligned", summary: "Funds three mobile health clinics to serve rural and underserved areas of the county." },
      { billId: "CO-24-11", billName: "Emergency Shelter Expansion", date: "2024-09-05", vote: "YEA", topic: "public welfare", alignment: "aligned", summary: "Adds 200 emergency shelter beds and funds case management services." },
      { billId: "CO-24-07", billName: "County Broadband Infrastructure Plan", date: "2024-07-22", vote: "YEA", topic: "technology", alignment: "aligned", summary: "Invests $8M to bring high-speed internet to underserved rural areas of the county." }
    ],
    campaignFinance: {
      totalRaised: 340_000,
      cycle: "2024",
      topDonors: [
        { name: "Healthcare Workers Union PAC", amount: 38_000, type: "Union" },
        { name: "County Employee Association", amount: 28_000, type: "Union" },
        { name: "Rural Broadband Alliance", amount: 20_000, type: "Corporate" }
      ],
      topIndustries: [
        { name: "Healthcare", amount: 98_000, percentage: 28.8 },
        { name: "Public Sector/Unions", amount: 82_000, percentage: 24.1 },
        { name: "Technology", amount: 55_000, percentage: 16.2 },
        { name: "Non-profit", amount: 42_000, percentage: 12.4 },
        { name: "Agriculture", amount: 30_000, percentage: 8.8 }
      ]
    },
    controversies: []
  }
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: "i1",
    title: "Comprehensive Transit Expansion",
    topic: "transit",
    summary: "Proposal to double funding for public transit infrastructure, including new light rail lines and electric bus fleets.",
    whyItMatters: "Current transit systems are underfunded, leading to excessive traffic congestion, increased emissions, and limited mobility for lower-income residents.",
    positions: [
      { type: 'support', count: 4250 },
      { type: 'oppose', count: 1840 },
      { type: 'unsure', count: 520 },
      { type: 'needs-info', count: 310 }
    ],
    comments: [
      { id: "c1", author: "Citizen M.", text: "We need this yesterday. Traffic is unbearable.", date: "2024-10-22" },
      { id: "c2", author: "Resident T.", text: "How will this be funded? I worry about property tax increases.", date: "2024-10-21" }
    ]
  },
  {
    id: "i2",
    title: "Affordable Housing Zoning Reform",
    topic: "housing",
    summary: "Changes to city zoning laws to allow multi-family units in historically single-family neighborhoods to increase housing supply.",
    whyItMatters: "A severe housing shortage has driven rents to historic highs, pricing out essential workers and young families from the city core.",
    positions: [
      { type: 'support', count: 5120 },
      { type: 'oppose', count: 3200 },
      { type: 'unsure', count: 800 },
      { type: 'needs-info', count: 450 }
    ],
    comments: []
  },
  {
    id: "i3",
    title: "Municipal Clean Energy Transition",
    topic: "environment",
    summary: "Mandate requiring all municipal buildings and vehicle fleets to transition to 100% renewable energy by 2030.",
    whyItMatters: "Local governments must lead by example in reducing carbon emissions to meet critical climate goals and improve local air quality.",
    positions: [
      { type: 'support', count: 6800 },
      { type: 'oppose', count: 950 },
      { type: 'unsure', count: 300 },
      { type: 'needs-info', count: 200 }
    ],
    comments: []
  },
  {
    id: "i4",
    title: "Universal Pre-K Access",
    topic: "education",
    summary: "State-funded pre-kindergarten programs for all 4-year-olds, regardless of family income.",
    whyItMatters: "Children who attend quality pre-K show significantly better academic outcomes. Currently only families who can afford private programs or qualify for low-income subsidies have access.",
    positions: [
      { type: 'support', count: 7200 },
      { type: 'oppose', count: 1100 },
      { type: 'unsure', count: 450 },
      { type: 'needs-info', count: 180 }
    ],
    comments: []
  },
  {
    id: "i5",
    title: "Mental Health Crisis Response Teams",
    topic: "public safety",
    summary: "Replace police dispatch for mental health emergencies with trained civilian mental health professionals.",
    whyItMatters: "A significant portion of 911 calls involve mental health crises. Studies show civilian responders reduce hospitalizations and arrests while improving outcomes for people in crisis.",
    positions: [
      { type: 'support', count: 5900 },
      { type: 'oppose', count: 2300 },
      { type: 'unsure', count: 1100 },
      { type: 'needs-info', count: 620 }
    ],
    comments: []
  },
  {
    id: "i6",
    title: "Federal Minimum Wage Increase",
    topic: "economy",
    summary: "Raise the federal minimum wage from $7.25 to $17 per hour over three years.",
    whyItMatters: "The federal minimum wage has not been raised since 2009. Adjusted for inflation, its purchasing power is at a historic low, leaving millions of full-time workers below the poverty line.",
    positions: [
      { type: 'support', count: 8900 },
      { type: 'oppose', count: 3400 },
      { type: 'unsure', count: 700 },
      { type: 'needs-info', count: 340 }
    ],
    comments: []
  }
];

export const INITIAL_ACCOUNTABILITY = {
  issueEngagement: 24500,
  repsContacted: 840,
  responsesReceived: 312,
  noResponseAfterDays: 14,
  recentOfficialActions: [
    { rep: "Marcus Chen", action: "Voted in alignment with 78% of district sentiment on transit." },
    { rep: "Sarah Jenkins", action: "Responded to 92% of constituent messages within 5 days." },
    { rep: "Anita Patel", action: "Introduced zoning amendment based on top petition." }
  ],
  youSaidTheyDidComparisons: [
    { issue: "Transit Expansion", publicSentiment: "71% Support", officialAction: "Voted YEA (Aligned)" },
    { issue: "Housing Reform", publicSentiment: "62% Support", officialAction: "Voted NAY (Misaligned)" },
    { issue: "Federal Minimum Wage", publicSentiment: "67% Support", officialAction: "Voted YEA (Aligned)" },
    { issue: "Mental Health Response", publicSentiment: "56% Support", officialAction: "No Official Vote Yet" }
  ]
};

export const INITIAL_SPOTLIGHT = [
  {
    id: "s1",
    officialName: "Marcus Chen",
    action: "Secured $50M Federal Transit Grant",
    category: "Infrastructure",
    date: "2024-10-15",
    description: "Successfully lobbied the DOT for a massive grant to begin phase 1 of the light rail expansion, directly responding to the transit petition signed by 12,000 residents.",
    impactSummary: "Will create 500+ local jobs and reduce downtown commute times by 20%."
  },
  {
    id: "s2",
    officialName: "Anita Patel",
    action: "100% Constituent Response Rate",
    category: "Responsiveness",
    date: "2024-10-10",
    description: "Council Member Patel's office achieved a 100% response rate to constituent inquiries submitted through the portal over the last quarter.",
    impactSummary: "Over 800 constituents received direct, personalized responses to their concerns."
  },
  {
    id: "s3",
    officialName: "Elena Rodriguez",
    action: "Tenant Protection Act Signed into Law",
    category: "Legislation",
    date: "2024-09-28",
    description: "Introduced comprehensive state-level tenant protections after a surge of housing instability reports from district residents.",
    impactSummary: "Provides legal counsel for evictions and caps unreasonable rent hikes for 280,000 renter households."
  },
  {
    id: "s4",
    officialName: "Robert Okafor",
    action: "Mobile Health Clinic Reaches 2,000 Patients",
    category: "Public Health",
    date: "2024-10-01",
    description: "The county's mobile health clinic program, championed by Commissioner Okafor, has now served over 2,000 patients in rural areas previously with no nearby healthcare access.",
    impactSummary: "Identified 340 undiagnosed conditions including hypertension and diabetes in its first six months."
  }
];
