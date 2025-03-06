import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Plus, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { DiscussionCard } from '@/components/discussion/DiscussionCard';
import { useAuth } from '@/contexts/AuthContext';
import { discussionService } from '@/services/supabase';
import { ResearchField, type Discussion } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const DiscussionsPage: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [totalDiscussions, setTotalDiscussions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useAuth();
  
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalDiscussions / ITEMS_PER_PAGE);

  // Fetch discussions when filters change
  useEffect(() => {
    fetchDiscussions();
  }, [currentPage, selectedField, searchQuery]);

  // Function to fetch discussions with filters
  const fetchDiscussions = async () => {
    setIsLoading(true);
    try {
      const { discussions: fetchedDiscussions, count } = await discussionService.getDiscussions({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        field: selectedField || undefined,
        searchQuery: searchQuery || undefined,
      });
      
      setDiscussions(fetchedDiscussions);
      setTotalDiscussions(count);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching discussions:', err);
      setError('Failed to load discussions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle liking a discussion
  const handleLikeDiscussion = async (id: string) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/signin?redirect=/discussions';
      return;
    }

    try {
      await discussionService.likeDiscussion(id);
      // Update the local state to reflect the like
      const updatedDiscussions = discussions.map(discussion => {
        if (discussion.id === id) {
          // Toggle the like (this is a simplified approach - in a real app you'd need to track if the user has already liked it)
          return { ...discussion, likes: discussion.likes + 1 };
        }
        return discussion;
      });
      setDiscussions(updatedDiscussions);
    } catch (err) {
      console.error('Error liking discussion:', err);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discussions</h1>
        
        {isAuthenticated && (
          <Button 
            as={Link}
            to="/discussions/create"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Discussion
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>
            
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <Input
                type="search"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4 text-gray-400" />}
                className="w-full"
              />
            </form>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Research Fields</h3>
              <div className="space-y-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedField === '' 
                      ? 'bg-primary-50 text-primary dark:bg-primary-900/30 dark:text-primary-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedField('')}
                >
                  All Fields
                </button>
                
                {Object.values(ResearchField).map((field) => (
                  <button
                    key={field}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                      selectedField === field 
                        ? 'bg-primary-50 text-primary dark:bg-primary-900/30 dark:text-primary-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedField(field)}
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    {field}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Discussions list */}
        <div className="lg:col-span-3 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size={36} />
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No discussions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedField 
                  ? 'Try changing your search filters'
                  : 'Be the first to start a discussion'}
              </p>
              
              {isAuthenticated && (
                <Button 
                  as={Link}
                  to="/discussions/create"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  New Discussion
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <DiscussionCard 
                    key={discussion.id} 
                    discussion={discussion}
                    onLike={handleLikeDiscussion}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionsPage; 