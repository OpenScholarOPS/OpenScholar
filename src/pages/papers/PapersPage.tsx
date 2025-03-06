import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Plus, Layers, Calendar, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { mockDataService } from '@/services/mockData';
import { ResearchField } from '@/types';
import type { Paper } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }).format(date);
};

const PapersPage: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState<string>('');
  const { isAuthenticated } = useAuth();
  
  // Fetch papers
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be a filtered API call
        const allPapers = mockDataService.getPapers();
        
        // Apply filters (basic implementation for MVP)
        let filteredPapers = [...allPapers];
        
        // Filter by research field
        if (selectedField) {
          filteredPapers = filteredPapers.filter(
            paper => paper.researchField === selectedField
          );
        }
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredPapers = filteredPapers.filter(
            paper => 
              paper.title.toLowerCase().includes(query) || 
              paper.abstract.toLowerCase().includes(query) ||
              paper.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        setPapers(filteredPapers);
      } catch (error) {
        console.error('Error fetching papers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPapers();
  }, [selectedField, searchQuery]);
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Research Papers</h1>
        
        {isAuthenticated && (
          <Button 
            as={Link}
            to="/papers/upload"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Upload Paper
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
                placeholder="Search papers..."
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
        
        {/* Papers list */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size={36} />
            </div>
          ) : papers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No papers found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedField 
                  ? 'Try changing your search filters'
                  : 'Be the first to upload a paper'}
              </p>
              
              {isAuthenticated && (
                <Button 
                  as={Link}
                  to="/papers/upload"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Upload Paper
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {papers.map((paper) => (
                <Card key={paper.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <Layers className="w-3 h-3 mr-1" />
                        {paper.researchField}
                      </span>
                      
                      {paper.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      
                      {paper.tags.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          +{paper.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <Link to={`/papers/${paper.id}`}>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary transition-colors">
                        {paper.title}
                      </h2>
                    </Link>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {paper.abstract}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>
                          {paper.authors.map(author => author.fullName || author.username).join(', ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center mt-2 sm:mt-0">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {formatDate(paper.publicationDate || paper.createdAt)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PapersPage; 