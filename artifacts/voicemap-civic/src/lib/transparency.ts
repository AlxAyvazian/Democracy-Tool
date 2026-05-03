import { Representative, Issue } from "./data";

export interface AccountabilityScore {
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    votingAlignment: number;
    controversyPenalty: number;
    donorConflictPenalty: number;
    bonuses: number;
  };
  alignedVotes: number;
  opposedVotes: number;
  totalVotes: number;
  donorConflicts: DonorConflict[];
}

export interface DonorConflict {
  repId: string;
  repName: string;
  billName: string;
  billId: string;
  vote: string;
  donorIndustry: string;
  donorAmount: number;
  donorPct: number;
  constituentAlignment: string;
  conflictDescription: string;
  severity: 'low' | 'medium' | 'high';
}

const TOPIC_TO_INDUSTRY: Record<string, string[]> = {
  housing: ['Real Estate', 'Real Estate/Landlords', 'Real Estate/Construction', 'Construction'],
  transit: ['Transportation/Unions', 'Transportation'],
  environment: ['Energy', 'Environment/Energy', 'Oil & Gas'],
  education: ['Education', 'Education/Charter Schools', 'Charter Schools'],
  economy: ['Finance/Banking', 'Finance/Insurance', 'Finance', 'Business Services'],
  'public safety': ['Law Enforcement', 'Police', 'Security'],
  technology: ['Technology'],
  healthcare: ['Healthcare', 'Healthcare/Mental Health', 'Mental Health'],
  immigration: ['Border Security', 'Immigration'],
  defense: ['Defense', 'Military'],
  'public welfare': ['Real Estate/Construction', 'Hospitality', 'Business Services'],
};

export function detectDonorConflicts(rep: Representative): DonorConflict[] {
  const conflicts: DonorConflict[] = [];

  for (const vote of rep.votingRecord) {
    if (vote.alignment !== 'opposed') continue;

    const relatedIndustries = TOPIC_TO_INDUSTRY[vote.topic] || [];
    const matchingDonors = rep.campaignFinance.topIndustries.filter(ind =>
      relatedIndustries.some(ri => ind.name.toLowerCase().includes(ri.toLowerCase()) || ri.toLowerCase().includes(ind.name.toLowerCase()))
    );

    if (matchingDonors.length === 0) continue;

    const topMatch = matchingDonors.sort((a, b) => b.amount - a.amount)[0];
    if (topMatch.percentage < 8) continue;

    const severity: 'low' | 'medium' | 'high' =
      topMatch.percentage >= 25 ? 'high' :
      topMatch.percentage >= 15 ? 'medium' : 'low';

    conflicts.push({
      repId: rep.id,
      repName: rep.name,
      billName: vote.billName,
      billId: vote.billId,
      vote: vote.vote,
      donorIndustry: topMatch.name,
      donorAmount: topMatch.amount,
      donorPct: topMatch.percentage,
      constituentAlignment: 'Constituents supported — Rep voted against',
      conflictDescription: `Voted ${vote.vote} on "${vote.billName}" while ${topMatch.name} contributed ${topMatch.percentage.toFixed(1)}% of campaign funds (${formatMoney(topMatch.amount)}).`,
      severity,
    });
  }

  return conflicts;
}

function formatMoney(n: number): string {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;
}

export function calculateAccountabilityScore(rep: Representative): AccountabilityScore {
  const total = rep.votingRecord.length;
  const aligned = rep.votingRecord.filter(v => v.alignment === 'aligned').length;
  const opposed = rep.votingRecord.filter(v => v.alignment === 'opposed').length;

  const votingAlignmentScore = total > 0 ? Math.round((aligned / total) * 40) : 20;

  const controversyPenalty = rep.controversies.reduce((acc, c) => {
    return acc + (c.severity === 'high' ? 15 : c.severity === 'medium' ? 8 : 3);
  }, 0);

  const donorConflicts = detectDonorConflicts(rep);
  const donorConflictPenalty = donorConflicts.reduce((acc, c) => {
    return acc + (c.severity === 'high' ? 12 : c.severity === 'medium' ? 7 : 4);
  }, 0);

  const noControversyBonus = rep.controversies.length === 0 ? 10 : 0;
  const fullAlignmentBonus = total > 0 && opposed === 0 ? 5 : 0;
  const bonuses = noControversyBonus + fullAlignmentBonus;

  const base = 50;
  const raw = base + votingAlignmentScore - controversyPenalty - donorConflictPenalty + bonuses;
  const scoreTotal = Math.max(0, Math.min(100, raw));

  const grade: 'A' | 'B' | 'C' | 'D' | 'F' =
    scoreTotal >= 85 ? 'A' :
    scoreTotal >= 70 ? 'B' :
    scoreTotal >= 55 ? 'C' :
    scoreTotal >= 40 ? 'D' : 'F';

  return {
    total: scoreTotal,
    grade,
    breakdown: {
      votingAlignment: votingAlignmentScore,
      controversyPenalty,
      donorConflictPenalty,
      bonuses,
    },
    alignedVotes: aligned,
    opposedVotes: opposed,
    totalVotes: total,
    donorConflicts,
  };
}

export function getRepVotesOnTopic(rep: Representative, topic: string) {
  return rep.votingRecord.filter(v => v.topic === topic);
}

export function getAllTopics(reps: Representative[]): string[] {
  const topics = new Set<string>();
  reps.forEach(rep => rep.votingRecord.forEach(v => topics.add(v.topic)));
  return Array.from(topics).sort();
}

export function getRepsWhoVotedOnTopic(reps: Representative[], topic: string): { rep: Representative; votes: Representative['votingRecord'] }[] {
  return reps
    .map(rep => ({ rep, votes: rep.votingRecord.filter(v => v.topic === topic) }))
    .filter(({ votes }) => votes.length > 0);
}

export function getIssueRepAlignment(reps: Representative[], issue: Issue): {
  rep: Representative;
  relatedVotes: Representative['votingRecord'];
  overallAlignment: 'aligned' | 'opposed' | 'mixed' | 'no-record';
}[] {
  const constituentSupport = (() => {
    const total = issue.positions.reduce((s, p) => s + p.count, 0);
    const support = issue.positions.find(p => p.type === 'support')?.count || 0;
    return total > 0 ? support / total : 0;
  })();

  return reps.map(rep => {
    const relatedVotes = rep.votingRecord.filter(v => v.topic === issue.topic);
    if (relatedVotes.length === 0) return { rep, relatedVotes: [], overallAlignment: 'no-record' as const };

    const aligned = relatedVotes.filter(v => v.alignment === 'aligned').length;
    const opposed = relatedVotes.filter(v => v.alignment === 'opposed').length;

    const overallAlignment =
      aligned > 0 && opposed === 0 ? 'aligned' :
      opposed > 0 && aligned === 0 ? 'opposed' :
      aligned > 0 && opposed > 0 ? 'mixed' : 'no-record';

    return { rep, relatedVotes, overallAlignment };
  });
}

export interface SentimentSnapshot {
  id: string;
  issueId: string;
  issueTitle: string;
  capturedAt: string;
  supportPct: number;
  opposePct: number;
  unsurePct: number;
  needsInfoPct: number;
  totalResponses: number;
  note: string;
  lockedBefore?: string;
}
