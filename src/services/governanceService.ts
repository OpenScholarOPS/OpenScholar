import { 
  Proposal, 
  ProposalType, 
  ProposalStatus, 
  Vote, 
  VoteType,
  TokenMetrics,
  StakingInfo,
  GovernanceStatistics,
  UserVotingHistory,
  ResearchGrantProposal,
  PlatformUpgradeProposal
} from '@/types/Governance';
import { User } from '@/types/User';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { mockUsers } from '@/data/mockData';

// Mock proposal data
const mockProposals: Proposal[] = [
  {
    id: 'prop1',
    title: 'Research Grant for Quantum Computing in Academic Validation',
    summary: 'Funding for research on quantum verification of academic papers',
    description: 'This proposal aims to fund a research project exploring how quantum computing algorithms can be applied to verify and validate academic research results more efficiently. The project will develop new validation protocols that leverage quantum properties to detect inconsistencies and errors in published research.',
    proposerId: 'user1',
    proposer: mockUsers[0],
    type: ProposalType.RESEARCH_GRANT,
    status: ProposalStatus.ACTIVE,
    createdAt: '2023-05-01T10:00:00Z',
    startTime: '2023-05-10T00:00:00Z',
    endTime: '2023-05-25T23:59:59Z',
    totalVotes: 15600,
    yesVotes: 12500,
    noVotes: 2100,
    abstainVotes: 1000,
    quorumThreshold: 10000,
    passThreshold: 66,
    content: {
      researchField: 'Quantum Computing',
      fundingAmount: 25000,
      timeline: '6 months',
      milestones: [
        {
          title: 'Algorithm Development',
          description: 'Develop quantum algorithms for academic validation',
          deliverables: ['Technical specification', 'Initial codebase'],
          deadline: '2023-08-01'
        },
        {
          title: 'Implementation & Testing',
          description: 'Implement and test the algorithms on sample papers',
          deliverables: ['Working prototype', 'Test results report'],
          deadline: '2023-10-01'
        },
        {
          title: 'Final Report',
          description: 'Publish results and evaluate performance',
          deliverables: ['Academic paper', 'Open-source repository'],
          deadline: '2023-12-01'
        }
      ],
      teamMembers: [
        {
          name: 'Dr. Alice Johnson',
          role: 'Lead Researcher',
          credentials: 'PhD in Quantum Physics, 15 publications'
        },
        {
          name: 'Dr. Bob Smith',
          role: 'Computer Scientist',
          credentials: 'PhD in Computer Science, expertise in algorithm design'
        }
      ],
      expectedOutcomes: [
        'New quantum algorithm for research validation',
        'Proof-of-concept implementation',
        'Published paper on findings',
        'Open-source tools for the community'
      ]
    }
  },
  {
    id: 'prop2',
    title: 'Platform Upgrade: Decentralized Peer Review System',
    summary: 'Implement a blockchain-based anonymous peer review system',
    description: 'This proposal outlines an upgrade to the platform\'s peer review system, implementing a fully decentralized and anonymous review process using blockchain technology. The upgrade will increase review quality by ensuring reviewer anonymity while maintaining accountability through token incentives.',
    proposerId: 'user2',
    proposer: mockUsers[1],
    type: ProposalType.PLATFORM_UPGRADE,
    status: ProposalStatus.PENDING,
    createdAt: '2023-05-05T14:30:00Z',
    startTime: '2023-05-15T00:00:00Z',
    endTime: '2023-05-30T23:59:59Z',
    totalVotes: 0,
    yesVotes: 0,
    noVotes: 0,
    abstainVotes: 0,
    quorumThreshold: 10000,
    passThreshold: 66,
    content: {
      upgradeType: 'feature',
      technicalDescription: 'Implementation of a zero-knowledge proof system for anonymous but verifiable peer reviews. Reviews will be stored on-chain with reviewer identities cryptographically obfuscated while still allowing for verification of reviewer credentials.',
      implementationPlan: 'The development will occur in three phases: (1) ZK-proof system integration, (2) UI/UX development, (3) Testing and deployment. All code will be open-source and audited before deployment.',
      testingStrategy: 'Comprehensive testing including unit tests, integration tests, and a beta phase with selected community members.',
      rollbackProcedure: 'Dual-state contract design allowing for immediate rollback to previous system if critical issues are discovered.',
      estimatedDevelopmentTime: 60,
      resourceRequirements: [
        '3 full-time developers',
        '1 cryptography expert',
        '1 UI/UX designer',
        'Security audit'
      ]
    }
  },
  {
    id: 'prop3',
    title: 'Community Fund for Open Research Data Initiative',
    summary: 'Allocate funds to support open research data sharing',
    description: 'This proposal requests funds from the community treasury to launch an Open Research Data Initiative. The initiative will create incentives for researchers to share their raw data openly, develop standards for data sharing across disciplines, and build infrastructure to support data verification and access.',
    proposerId: 'user3',
    proposer: mockUsers[2],
    type: ProposalType.COMMUNITY_FUND,
    status: ProposalStatus.PASSED,
    createdAt: '2023-04-10T09:15:00Z',
    startTime: '2023-04-15T00:00:00Z',
    endTime: '2023-04-30T23:59:59Z',
    totalVotes: 18900,
    yesVotes: 15200,
    noVotes: 2800,
    abstainVotes: 900,
    quorumThreshold: 10000,
    passThreshold: 66
  },
  {
    id: 'prop4',
    title: 'Parameter Change: Increase Reviewer Rewards',
    summary: 'Increase token rewards for high-quality peer reviews',
    description: 'This proposal suggests increasing the token rewards allocated for completing high-quality peer reviews by 50%. The aim is to improve review quality and reduce review time by providing stronger incentives for timely, thorough reviews.',
    proposerId: 'user1',
    proposer: mockUsers[0],
    type: ProposalType.PARAMETER_CHANGE,
    status: ProposalStatus.REJECTED,
    createdAt: '2023-03-20T11:00:00Z',
    startTime: '2023-03-25T00:00:00Z',
    endTime: '2023-04-10T23:59:59Z',
    totalVotes: 12500,
    yesVotes: 5000,
    noVotes: 7000,
    abstainVotes: 500,
    quorumThreshold: 10000,
    passThreshold: 66
  }
];

// Mock votes data
const mockVotes: Vote[] = [
  {
    id: 'vote1',
    proposalId: 'prop1',
    voterId: 'user2',
    voter: mockUsers[1],
    type: VoteType.YES,
    power: 5000,
    timestamp: '2023-05-12T14:30:00Z',
    reason: 'This research is crucial for improving validation in quantum computing research'
  },
  {
    id: 'vote2',
    proposalId: 'prop1',
    voterId: 'user3',
    voter: mockUsers[2],
    type: VoteType.YES,
    power: 3000,
    timestamp: '2023-05-13T09:45:00Z'
  },
  {
    id: 'vote3',
    proposalId: 'prop1',
    voterId: 'user1',
    voter: mockUsers[0],
    type: VoteType.ABSTAIN,
    power: 1000,
    timestamp: '2023-05-11T16:20:00Z',
    reason: 'I am the proposer, so I will abstain from voting'
  },
  {
    id: 'vote4',
    proposalId: 'prop3',
    voterId: 'user1',
    voter: mockUsers[0],
    type: VoteType.YES,
    power: 4000,
    timestamp: '2023-04-20T10:10:00Z',
    reason: 'Open data is essential for research verification'
  },
  {
    id: 'vote5',
    proposalId: 'prop3',
    voterId: 'user2',
    voter: mockUsers[1],
    type: VoteType.YES,
    power: 6000,
    timestamp: '2023-04-22T13:40:00Z'
  },
  {
    id: 'vote6',
    proposalId: 'prop4',
    voterId: 'user3',
    voter: mockUsers[2],
    type: VoteType.NO,
    power: 3500,
    timestamp: '2023-03-30T08:50:00Z',
    reason: 'I believe the current rewards are sufficient. We should focus on quality rather than increasing rewards.'
  }
];

// Mock token economic metrics
const mockTokenMetrics: TokenMetrics = {
  totalSupply: 100000000,
  circulatingSupply: 45000000,
  stakedAmount: 35000000,
  stakingAPY: 8.5,
  userBalance: 12500,
  userStaked: 10000,
  userVotingPower: 12000
};

// Mock staking information
const mockStakingInfo: StakingInfo = {
  totalStaked: 35000000,
  unlockedAmount: 2000,
  lockedAmount: 8000,
  stakingPositions: [
    {
      id: 'stake1',
      amount: 5000,
      startTime: '2023-01-15T10:00:00Z',
      endTime: '2023-07-15T10:00:00Z',
      isLocked: true,
      rewardRate: 10
    },
    {
      id: 'stake2',
      amount: 3000,
      startTime: '2023-03-20T14:30:00Z',
      endTime: '2023-06-20T14:30:00Z',
      isLocked: true,
      rewardRate: 8
    },
    {
      id: 'stake3',
      amount: 2000,
      startTime: '2023-04-10T09:15:00Z',
      endTime: '',
      isLocked: false,
      rewardRate: 5
    }
  ]
};

// Mock governance statistics
const mockGovernanceStats: GovernanceStatistics = {
  totalProposals: 12,
  activeProposals: 2,
  passedProposals: 7,
  rejectedProposals: 3,
  averageVoterParticipation: 42.5,
  totalVoters: 156,
  proposalsByType: {
    [ProposalType.RESEARCH_GRANT]: 5,
    [ProposalType.PLATFORM_UPGRADE]: 3,
    [ProposalType.PARAMETER_CHANGE]: 2,
    [ProposalType.COMMUNITY_FUND]: 2,
    [ProposalType.OTHER]: 0
  }
};

/**
 * Function to get all proposals
 */
export const getProposals = async (): Promise<Proposal[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock proposals
  return [...mockProposals];
};

/**
 * Function to get a specific proposal by ID
 */
export const getProposalById = async (proposalId: string): Promise<Proposal | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find and return the proposal or null if not found
  const proposal = mockProposals.find(p => p.id === proposalId);
  return proposal ? { ...proposal } : null;
};

/**
 * Function to get votes for a specific proposal
 */
export const getProposalVotes = async (proposalId: string): Promise<Vote[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Filter and return votes for the specified proposal
  return mockVotes.filter(vote => vote.proposalId === proposalId);
};

/**
 * Function to create a new proposal
 */
export const createProposal = async (
  proposalData: Omit<Proposal, 'id' | 'createdAt' | 'status' | 'totalVotes' | 'yesVotes' | 'noVotes' | 'abstainVotes'> & { content: ResearchGrantProposal | PlatformUpgradeProposal }
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Generate a new proposal ID
  const newProposalId = `prop${mockProposals.length + 1}`;
  
  // In a real application, this would create the proposal in the database
  console.log(`Created proposal: ${newProposalId}`, proposalData);
  
  return newProposalId;
};

/**
 * Function to submit a vote on a proposal
 */
export const submitVote = async (
  proposalId: string,
  voteType: VoteType,
  power: number,
  reason?: string
): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real application, this would record the vote in the database
  // and update the proposal's vote counts
  console.log(`Vote submitted for proposal ${proposalId}: ${voteType}`, { power, reason });
  
  return true;
};

/**
 * Function to get token economic metrics
 */
export const getTokenMetrics = async (walletAddress?: string): Promise<TokenMetrics> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real application, this would fetch real token metrics
  // and user-specific metrics if a wallet address is provided
  return { ...mockTokenMetrics };
};

/**
 * Function to get staking information for a user
 */
export const getStakingInfo = async (walletAddress: string): Promise<StakingInfo> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real application, this would fetch real staking information
  // specific to the provided wallet address
  return { ...mockStakingInfo };
};

/**
 * Function to stake tokens
 */
export const stakeTokens = async (amount: number, period: number): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real application, this would perform the staking transaction
  // and update the user's staking positions
  console.log(`Staked ${amount} tokens for ${period} days`);
  
  return true;
};

/**
 * Function to unstake tokens
 */
export const unstakeTokens = async (amount: number): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real application, this would perform the unstaking transaction
  // and update the user's staking positions
  console.log(`Unstaked ${amount} tokens`);
  
  return true;
};

/**
 * Function to get governance statistics
 */
export const getGovernanceStatistics = async (): Promise<GovernanceStatistics> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real application, this would calculate real governance statistics
  return { ...mockGovernanceStats };
};

/**
 * Function to get a user's voting history
 */
export const getUserVotingHistory = async (userId: string): Promise<UserVotingHistory> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Filter votes by the specified user
  const userVotes = mockVotes.filter(vote => vote.voterId === userId);
  
  // Calculate aggregate statistics
  const totalVotes = userVotes.length;
  const yesVotes = userVotes.filter(vote => vote.type === VoteType.YES).length;
  const noVotes = userVotes.filter(vote => vote.type === VoteType.NO).length;
  const abstainVotes = userVotes.filter(vote => vote.type === VoteType.ABSTAIN).length;
  const votingPower = userVotes.reduce((total, vote) => total + vote.power, 0) / totalVotes;
  
  // Format voting history
  const votesByProposal = userVotes.map(vote => {
    const proposal = mockProposals.find(p => p.id === vote.proposalId);
    return {
      proposalId: vote.proposalId,
      proposalTitle: proposal?.title || 'Unknown Proposal',
      voteType: vote.type,
      votePower: vote.power,
      timestamp: vote.timestamp
    };
  });
  
  return {
    totalVotes,
    yesVotes,
    noVotes,
    abstainVotes,
    votingPower,
    votesByProposal
  };
};

/**
 * Function to execute a passed proposal
 */
export const executeProposal = async (proposalId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // In a real application, this would execute the proposal
  // and update its status in the database
  console.log(`Executed proposal: ${proposalId}`);
  
  return true;
};

/**
 * Function to cancel a proposal
 */
export const cancelProposal = async (proposalId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real application, this would cancel the proposal
  // and update its status in the database
  console.log(`Cancelled proposal: ${proposalId}`);
  
  return true;
};

// Export mock data for testing
export { mockProposals, mockVotes, mockTokenMetrics, mockStakingInfo, mockGovernanceStats }; 