import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layouts/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { 
  ResearchTrendChart, 
  ResearchComparisonChart, 
  ResearchDistributionChart,
  chartColors
} from '@/components/charts/ResearchChart';
import { 
  ArrowUpRight, 
  TrendingUp, 
  Award, 
  FileText, 
  MessageSquare,
  Users,
  Bookmark,
  Star,
  BarChart
} from 'lucide-react';
import { getGovernanceStatistics } from '@/services/governanceService';
import { GovernanceStatistics } from '@/types/Governance';
import { ResearchField } from '@/types/Paper';

// Mock dashboard data
const mockCitationData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Your Citations',
      data: [65, 78, 90, 115, 132, 150, 212, 260, 300, 320, 350, 410],
      borderColor: chartColors.primaryBlueBorder,
      backgroundColor: chartColors.primaryBlue,
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Field Average',
      data: [50, 60, 75, 90, 105, 120, 140, 165, 190, 210, 230, 250],
      borderColor: chartColors.grayBorder,
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      tension: 0.4,
    }
  ]
};

const mockPublicationData = {
  labels: ['2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Publications',
      data: [3, 7, 5, 12, 9],
      backgroundColor: chartColors.primaryBlue,
      borderColor: chartColors.primaryBlueBorder,
      borderWidth: 1,
    }
  ]
};

const mockFieldDistribution = {
  labels: Object.values(ResearchField),
  datasets: [
    {
      label: 'Papers by Field',
      data: [42, 35, 28, 22, 18, 15, 10, 8],
      backgroundColor: [
        chartColors.primaryBlue,
        chartColors.secondaryGreen,
        chartColors.yellow,
        chartColors.red,
        chartColors.purple,
        chartColors.gray,
        'rgba(20, 184, 166, 0.5)', // teal-500
        'rgba(6, 182, 212, 0.5)', // cyan-500
      ],
      borderColor: [
        chartColors.primaryBlueBorder,
        chartColors.secondaryGreenBorder,
        chartColors.yellowBorder,
        chartColors.redBorder,
        chartColors.purpleBorder,
        chartColors.grayBorder,
        'rgba(20, 184, 166, 1)',
        'rgba(6, 182, 212, 1)',
      ],
      borderWidth: 1,
    }
  ]
};

// Dashboard page component
const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState('year');
  const [govStats, setGovStats] = useState<GovernanceStatistics | null>(null);
  
  // Load governance statistics
  useEffect(() => {
    const fetchGovernanceStats = async () => {
      try {
        const stats = await getGovernanceStatistics();
        setGovStats(stats);
      } catch (error) {
        console.error('Error fetching governance statistics:', error);
      }
    };
    
    fetchGovernanceStats();
  }, []);
  
  // Mock user statistics data
  const userStats = {
    papers: 36,
    citations: 410,
    hIndex: 12,
    discussions: 24,
    followers: 156,
    following: 78,
    bookmarks: 42
  };
  
  // Time range dropdown options
  const timeRangeOptions = [
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];
  
  // Render statistics card
  const StatCard = ({ title, value, icon, trend, trendValue, linkTo }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    linkTo?: string;
  }) => {
    return (
      <Card className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</span>
          <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold">{value}</div>
          {trend && trendValue && (
            <div className={cn(
              "flex items-center text-sm mt-1", 
              trend === 'up' ? 'text-green-600 dark:text-green-400' : 
              trend === 'down' ? 'text-red-600 dark:text-red-400' : 
              'text-gray-500 dark:text-gray-400'
            )}>
              <ArrowUpRight className={cn(
                "h-4 w-4 mr-1",
                trend === 'down' && "transform rotate-90",
                trend === 'neutral' && "transform rotate-45"
              )} />
              <span>{trendValue} {trend === 'up' ? 'increase' : trend === 'down' ? 'decrease' : ''}</span>
            </div>
          )}
        </div>
        {linkTo && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Link 
              to={linkTo} 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              View Details
              <ArrowUpRight className="h-3 w-3 ml-1 transform rotate-45" />
            </Link>
          </div>
        )}
      </Card>
    );
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Research Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your research impact and platform activity insights
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Time Range:</span>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-40"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
            
            <Button variant="outline" className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
        
        {isAuthenticated ? (
          <>
            {/* Statistics card grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard 
                title="Research Papers" 
                value={userStats.papers} 
                icon={<FileText className="h-5 w-5" />}
                trend="up"
                trendValue="8%"
                linkTo="/papers"
              />
              
              <StatCard 
                title="Citations" 
                value={userStats.citations} 
                icon={<TrendingUp className="h-5 w-5" />}
                trend="up"
                trendValue="15%"
                linkTo="/profile/citations"
              />
              
              <StatCard 
                title="h-index" 
                value={userStats.hIndex} 
                icon={<Award className="h-5 w-5" />}
                trend="up"
                trendValue="2 points"
              />
              
              <StatCard 
                title="Discussions" 
                value={userStats.discussions} 
                icon={<MessageSquare className="h-5 w-5" />}
                trend="neutral"
                trendValue="No change"
                linkTo="/discussions"
              />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Chart section */}
              <div className="md:col-span-2 space-y-6">
                {/* Citation impact chart */}
                <Card className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Citation Impact</h2>
                  <ResearchTrendChart 
                    data={mockCitationData} 
                    height={300}
                    xAxisTitle="Month"
                    yAxisTitle="Citations"
                  />
                </Card>
                
                {/* Publication history */}
                <Card className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Publication History</h2>
                  <ResearchComparisonChart 
                    data={mockPublicationData}
                    height={250}
                    xAxisTitle="Year"
                    yAxisTitle="Papers Published"
                  />
                </Card>
              </div>
              
              {/* Community and field analysis */}
              <div className="space-y-6">
                {/* Community stats */}
                <Card className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Community</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Followers</span>
                      <div className="flex items-center mt-1">
                        <Users className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                        <span className="text-xl font-semibold">{userStats.followers}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Following</span>
                      <div className="flex items-center mt-1">
                        <Users className="h-5 w-5 mr-2 text-green-500 dark:text-green-400" />
                        <span className="text-xl font-semibold">{userStats.following}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Bookmarks</span>
                      <div className="flex items-center mt-1">
                        <Bookmark className="h-5 w-5 mr-2 text-purple-500 dark:text-purple-400" />
                        <span className="text-xl font-semibold">{userStats.bookmarks}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Favorites</span>
                      <div className="flex items-center mt-1">
                        <Star className="h-5 w-5 mr-2 text-yellow-500 dark:text-yellow-400" />
                        <span className="text-xl font-semibold">18</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-blue-600 dark:text-blue-400">
                    View Community Activity
                  </Button>
                </Card>
                
                {/* Research field distribution */}
                <Card className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Research Fields</h2>
                  <ResearchDistributionChart 
                    data={mockFieldDistribution}
                    height={250}
                  />
                </Card>
                
                {/* Governance stats */}
                <Card className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Governance</h2>
                  {govStats ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Active Proposals</span>
                        <span className="font-medium">{govStats.activeProposals}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Your Voting Power</span>
                        <span className="font-medium">{mockTokenMetrics.userVotingPower?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Your Votes</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Average Participation</span>
                        <span className="font-medium">{govStats.averageVoterParticipation}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-pulse flex space-x-4">
                        <div className="w-3/4 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-blue-600 dark:text-blue-400">
                    View Governance Dashboard
                  </Button>
                </Card>
              </div>
            </div>
          </>
        ) : (
          // Not logged in state
          <Card className="p-6 flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold mb-2">Sign in to view your research dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg">
              Track your research impact, monitor citations, view publication metrics, and manage your academic presence on OpenScholar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button as={Link} to="/signin" variant="default">
                Sign In
              </Button>
              <Button as={Link} to="/signup" variant="outline">
                Create Account
              </Button>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

// Utility function: combine classnames
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default DashboardPage; 