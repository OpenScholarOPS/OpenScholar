import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Proposal, ProposalStatus, ProposalType, TokenMetrics } from '@/types/Governance';
import { getProposals, getTokenMetrics } from '@/services/governanceService';
import PageLayout from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  PlusCircle, 
  FileText, 
  Coins, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Vote as VoteIcon,
  TrendingUp,
  Calendar,
  BarChart2,
  Users
} from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { ResearchTrendChart } from '@/components/charts/ResearchChart';

const GovernancePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetrics | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  
  // Load proposals and token metrics
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [proposalData, tokenData] = await Promise.all([
          getProposals(),
          getTokenMetrics(isAuthenticated && user ? user.walletAddress : undefined)
        ]);
        
        setProposals(proposalData);
        setTokenMetrics(tokenData);
      } catch (error) {
        console.error('Error fetching governance data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, user]);
  
  // Filter proposals
  const filteredProposals = (() => {
    switch (activeTab) {
      case 'active':
        return proposals.filter(p => p.status === ProposalStatus.ACTIVE);
      case 'pending':
        return proposals.filter(p => p.status === ProposalStatus.PENDING);
      case 'passed':
        return proposals.filter(p => 
          p.status === ProposalStatus.PASSED || p.status === ProposalStatus.EXECUTED
        );
      case 'rejected':
        return proposals.filter(p => 
          p.status === ProposalStatus.REJECTED || p.status === ProposalStatus.CANCELLED
        );
      default:
        return proposals;
    }
  })();
  
  // Get proposal status color and label
  const getProposalStatusInfo = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.ACTIVE:
        return { 
          variant: 'default' as const, 
          label: 'Active',
          icon: <Clock className="h-4 w-4 mr-1" />
        };
      case ProposalStatus.PENDING:
        return { 
          variant: 'secondary' as const, 
          label: 'Pending',
          icon: <Clock className="h-4 w-4 mr-1" />
        };
      case ProposalStatus.PASSED:
        return { 
          variant: 'success' as const, 
          label: 'Passed',
          icon: <CheckCircle className="h-4 w-4 mr-1" />
        };
      case ProposalStatus.EXECUTED:
        return { 
          variant: 'success' as const, 
          label: 'Executed',
          icon: <CheckCircle className="h-4 w-4 mr-1" />
        };
      case ProposalStatus.REJECTED:
        return { 
          variant: 'danger' as const, 
          label: 'Rejected',
          icon: <XCircle className="h-4 w-4 mr-1" />
        };
      case ProposalStatus.CANCELLED:
        return { 
          variant: 'danger' as const, 
          label: 'Cancelled',
          icon: <XCircle className="h-4 w-4 mr-1" />
        };
      case ProposalStatus.DRAFT:
        return { 
          variant: 'outline' as const, 
          label: 'Draft',
          icon: <FileText className="h-4 w-4 mr-1" />
        };
      default:
        return { 
          variant: 'secondary' as const, 
          label: status,
          icon: null
        };
    }
  };
  
  // Get proposal type label
  const getProposalTypeLabel = (type: ProposalType) => {
    switch (type) {
      case ProposalType.RESEARCH_GRANT:
        return 'Research Grant';
      case ProposalType.PLATFORM_UPGRADE:
        return 'Platform Upgrade';
      case ProposalType.PARAMETER_CHANGE:
        return 'Parameter Change';
      case ProposalType.COMMUNITY_FUND:
        return 'Community Fund';
      case ProposalType.OTHER:
        return 'Other';
      default:
        return type;
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = (proposal: Proposal) => {
    const total = proposal.yesVotes + proposal.noVotes + proposal.abstainVotes;
    if (total === 0) return 0;
    return Math.round((proposal.yesVotes / total) * 100);
  };
  
  // Determine if proposal will pass
  const willPass = (proposal: Proposal) => {
    const total = proposal.yesVotes + proposal.noVotes + proposal.abstainVotes;
    if (total === 0) return false;
    const yesPercentage = (proposal.yesVotes / total) * 100;
    return yesPercentage >= proposal.passThreshold;
  };
  
  // Render voting progress bar
  const VoteProgressBar = ({ proposal }: { proposal: Proposal }) => {
    const total = proposal.totalVotes;
    const yesPercent = total ? (proposal.yesVotes / total) * 100 : 0;
    const noPercent = total ? (proposal.noVotes / total) * 100 : 0;
    const abstainPercent = total ? (proposal.abstainVotes / total) * 100 : 0;
    
    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <div>Yes: {proposal.yesVotes.toLocaleString()} ({Math.round(yesPercent)}%)</div>
          <div>No: {proposal.noVotes.toLocaleString()} ({Math.round(noPercent)}%)</div>
          <div>Abstain: {proposal.abstainVotes.toLocaleString()} ({Math.round(abstainPercent)}%)</div>
        </div>
        
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {total > 0 && (
            <>
              <div 
                className="h-full bg-green-500 dark:bg-green-600 float-left"
                style={{ width: `${yesPercent}%` }}
              />
              <div 
                className="h-full bg-red-500 dark:bg-red-600 float-left"
                style={{ width: `${noPercent}%` }}
              />
              <div 
                className="h-full bg-gray-400 dark:bg-gray-500 float-left"
                style={{ width: `${abstainPercent}%` }}
              />
            </>
          )}
        </div>
        
        {proposal.status === ProposalStatus.ACTIVE && (
          <div className="flex justify-between text-xs mt-1">
            <div className="text-gray-600 dark:text-gray-400">
              Quorum: {Math.round((proposal.totalVotes / (tokenMetrics?.totalSupply || 1)) * 100)}% / {proposal.quorumThreshold}%
            </div>
            <div className={willPass(proposal) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              {willPass(proposal) ? 'Passing' : 'Failing'}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render single proposal card
  const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
    const statusInfo = getProposalStatusInfo(proposal.status);
    
    return (
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <Badge className="mb-2">
                {getProposalTypeLabel(proposal.type)}
              </Badge>
              <h3 className="text-lg font-semibold">
                <Link 
                  to={`/governance/proposals/${proposal.id}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {proposal.title}
                </Link>
              </h3>
            </div>
            <Badge 
              variant={statusInfo.variant}
              className="flex items-center"
            >
              {statusInfo.icon}
              <span>{statusInfo.label}</span>
            </Badge>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {proposal.summary}
          </p>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Users className="h-4 w-4 mr-1" />
            <span>by {typeof proposal.proposer === 'string' ? proposal.proposer : proposal.proposer.name}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created {formatDate(proposal.createdAt)}</span>
          </div>
          
          {proposal.status === ProposalStatus.ACTIVE && proposal.endTime && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span>Voting ends {formatDate(proposal.endTime)}</span>
            </div>
          )}
          
          {proposal.totalVotes > 0 && <VoteProgressBar proposal={proposal} />}
          
          <div className="mt-4 flex">
            <Button 
              size="sm"
              onClick={() => navigate(`/governance/proposals/${proposal.id}`)}
              className="w-full"
            >
              {proposal.status === ProposalStatus.ACTIVE ? (
                <>
                  <VoteIcon className="h-4 w-4 mr-2" />
                  Vote Now
                </>
              ) : (
                'View Details'
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Governance</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Participate in shaping the future of OpenScholar platform
            </p>
          </div>
          
          {isAuthenticated && (
            <Button 
              className="mt-4 md:mt-0 flex items-center"
              onClick={() => navigate('/governance/create-proposal')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Proposal
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            {/* Proposal list */}
            <Card className="overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Proposals</h2>
              </div>
              
              <div className="p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">
                      Active
                      <span className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs py-0.5 px-1.5 rounded-full">
                        {proposals.filter(p => p.status === ProposalStatus.ACTIVE).length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="passed">Passed</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab}>
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        {filteredProposals.length > 0 ? (
                          <div className="grid grid-cols-1 gap-4">
                            {filteredProposals.map(proposal => (
                              <ProposalCard key={proposal.id} proposal={proposal} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No proposals found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              There are no {activeTab !== 'all' ? activeTab : ''} proposals at the moment.
                            </p>
                            {isAuthenticated && (
                              <Button onClick={() => navigate('/governance/create-proposal')}>
                                Create a Proposal
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            {/* Token info panel */}
            {tokenMetrics && (
              <Card className="mb-6">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Coins className="h-5 w-5 mr-2 text-yellow-500" />
                    OPS Token
                  </h2>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Your Balance</div>
                      <div className="text-2xl font-bold">
                        {tokenMetrics.userBalance?.toLocaleString()} OPS
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Governance Power: {tokenMetrics.userVotingPower?.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Staking APY</div>
                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {tokenMetrics.stakingAPY}%
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Staked</div>
                        <div className="text-lg font-semibold">
                          {tokenMetrics.stakedAmount.toLocaleString()} OPS
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/governance/staking')}
                    >
                      Manage Staking
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Governance stats */}
            <Card className="mb-6">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                  Governance Stats
                </h2>
              </div>
              
              <div className="p-4">
                {!loading ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Proposals</div>
                        <div className="text-xl font-semibold">
                          {proposals.filter(p => p.status === ProposalStatus.ACTIVE).length}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Proposals</div>
                        <div className="text-xl font-semibold">
                          {proposals.length}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Passed Proposals</div>
                        <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                          {proposals.filter(p => 
                            p.status === ProposalStatus.PASSED || 
                            p.status === ProposalStatus.EXECUTED
                          ).length}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Rejected Proposals</div>
                        <div className="text-xl font-semibold text-red-600 dark:text-red-400">
                          {proposals.filter(p => 
                            p.status === ProposalStatus.REJECTED || 
                            p.status === ProposalStatus.CANCELLED
                          ).length}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Proposal Types</h3>
                      <div className="space-y-2">
                        {Object.values(ProposalType).map(type => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-sm">{getProposalTypeLabel(type)}</span>
                            <span className="font-medium">
                              {proposals.filter(p => p.type === type).length}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default GovernancePage; 