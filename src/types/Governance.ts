import { User } from './User';

/**
 * Governance proposal type enum
 */
export enum ProposalType {
  RESEARCH_GRANT = 'research_grant',       // Research funding
  PLATFORM_UPGRADE = 'platform_upgrade',   // Platform upgrade
  PARAMETER_CHANGE = 'parameter_change',   // Parameter change
  COMMUNITY_FUND = 'community_fund',        // Community fund allocation
  OTHER = 'other'
}

/**
 * Governance proposal status enum
 */
export enum ProposalStatus {
  DRAFT = 'draft',           // Draft
  PENDING = 'pending',       // Waiting for voting to begin
  ACTIVE = 'active',         // Active voting
  PASSED = 'passed',         // Passed
  REJECTED = 'rejected',     // Rejected
  EXECUTED = 'executed',     // Executed
  CANCELLED = 'cancelled'    // Cancelled
}

/**
 * Vote type enum
 */
export enum VoteType {
  YES = 'yes',       // Approve
  NO = 'no',         // Reject
  ABSTAIN = 'abstain' // Abstain
}

/**
 * Governance proposal interface
 */
export interface Proposal {
  id: string;
  title: string;
  summary: string;
  description: string;
  proposer: User | string;
  proposerId: string;
  type: ProposalType;
  status: ProposalStatus;
  createdAt: string;
  startTime?: string;
  endTime?: string;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  quorumThreshold: number;
  passThreshold: number;
  content?: ResearchGrantProposal | PlatformUpgradeProposal | ParameterChangeProposal | CommunityFundProposal;
}

/**
 * Research grant proposal content
 */
export interface ResearchGrantProposal {
  researchField: string;
  fundingAmount: number;
  timeline: string;
  milestones: {
    title: string;
    description: string;
    deliverables: string[];
    deadline: string;
  }[];
  teamMembers: {
    name: string;
    role: string;
    credentials: string;
  }[];
  expectedOutcomes: string[];
  previousWork?: string;
}

/**
 * Platform upgrade proposal content
 */
export interface PlatformUpgradeProposal {
  upgradeType: 'feature' | 'bugfix' | 'security' | 'performance';
  technicalDescription: string;
  implementationPlan: string;
  testingStrategy: string;
  rollbackProcedure: string;
  estimatedDevelopmentTime: number; // in days
  resourceRequirements: string[];
}

/**
 * Parameter change proposal content
 */
export interface ParameterChangeProposal {
  parameter: string;
  currentValue: string | number;
  proposedValue: string | number;
  justification: string;
  simulationResults?: string;
  expectedImpact: string;
}

/**
 * Community fund proposal content
 */
export interface CommunityFundProposal {
  fundingAmount: number;
  beneficiary: string;
  purpose: string;
  expectedOutcomes: string[];
  timeline: string;
  reportingSchedule: string;
}

/**
 * Vote interface
 */
export interface Vote {
  id: string;
  proposalId: string;
  voter: User | string;
  voterId: string;
  type: VoteType;
  power: number;
  timestamp: string;
  reason?: string;
}

/**
 * Token metrics interface
 */
export interface TokenMetrics {
  totalSupply: number;
  circulatingSupply: number;
  stakedAmount: number;
  stakingAPY: number;
  userBalance?: number;
  userStaked?: number;
  userVotingPower?: number;
}

/**
 * Staking info interface
 */
export interface StakingInfo {
  totalStaked: number;
  unlockedAmount: number;
  lockedAmount: number;
  stakingPositions: {
    id: string;
    amount: number;
    startTime: string;
    endTime: string;
    isLocked: boolean;
    rewardRate: number;
  }[];
}

/**
 * Governance statistics interface
 */
export interface GovernanceStatistics {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  rejectedProposals: number;
  averageVoterParticipation: number;
  totalVoters: number;
  proposalsByType: Record<ProposalType, number>;
}

/**
 * User voting history interface
 */
export interface UserVotingHistory {
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  votingPower: number;
  votesByProposal: {
    proposalId: string;
    proposalTitle: string;
    voteType: VoteType;
    votePower: number;
    timestamp: string;
  }[];
} 