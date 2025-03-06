import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { SearchResult, SearchFilters, searchContent } from '@/services/searchService';
import { Loader2, Filter, Calendar, Tag, User as UserIcon, FileText, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import PageLayout from '@/components/layouts/PageLayout';
import { formatDate } from '@/utils/formatters';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') as SearchFilters['type'] || 'all';
  const sortByParam = searchParams.get('sort') as SearchFilters['sortBy'] || 'relevance';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: typeParam,
    sortBy: sortByParam,
    tags: [],
    authors: [],
    dateRange: {}
  });

  // Get search results when query changes
  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam, filters);
    }
  }, [queryParam, typeParam, sortByParam]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.type && filters.type !== 'all') params.set('type', filters.type);
    if (filters.sortBy && filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  }, [filters.type, filters.sortBy]);

  const performSearch = async (query: string, searchFilters: SearchFilters) => {
    setLoading(true);
    try {
      const searchResults = await searchContent(query, searchFilters);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (filters.type && filters.type !== 'all') params.set('type', filters.type);
      if (filters.sortBy && filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
      
      navigate({
        pathname: '/search',
        search: params.toString()
      });
      
      performSearch(searchQuery, filters);
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (searchQuery.trim()) {
      performSearch(searchQuery, updatedFilters);
    }
  };

  const ResultItem = ({ result }: { result: SearchResult }) => {
    const icon = result.type === 'paper' ? <FileText className="h-5 w-5 text-blue-500" /> : <MessageSquare className="h-5 w-5 text-green-500" />;
    const url = result.type === 'paper' ? `/papers/${result.id}` : `/discussions/${result.id}`;
    
    return (
      <Card className="p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className="mt-1">{icon}</div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <Link to={url} className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">{result.title}</Link>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(result.date)}</span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {result.abstract || result.content}
            </div>
            
            <div className="flex flex-wrap items-center mt-2">
              <div className="flex items-center mr-4 text-sm text-gray-500 dark:text-gray-400">
                <UserIcon className="h-4 w-4 mr-1" />
                <span>{result.author.name}</span>
              </div>
              
              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.tags.slice(0, 3).map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {result.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      +{result.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Search Results</h1>
        
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search papers, discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h2 className="font-medium mb-3">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Content Type</Label>
                <Select
                  value={filters.type || 'all'}
                  onChange={(e) => handleFilterChange({ type: e.target.value as SearchFilters['type'] })}
                >
                  <option value="all">All Content</option>
                  <option value="paper">Papers Only</option>
                  <option value="discussion">Discussions Only</option>
                </Select>
              </div>
              
              <div>
                <Label>Sort By</Label>
                <Select
                  value={filters.sortBy || 'relevance'}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value as SearchFilters['sortBy'] })}
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date (Newest First)</option>
                  <option value="popularity">Popularity</option>
                </Select>
              </div>
            </div>
          </div>
        )}
        
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {results.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Found {results.length} results for "{queryParam}"
                  </p>
                  <div>
                    {results.map((result) => (
                      <ResultItem key={`${result.type}-${result.id}`} result={result} />
                    ))}
                  </div>
                </div>
              ) : (
                queryParam && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No results found for "{queryParam}"
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 mt-2">
                      Try using different keywords or removing filters
                    </p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchPage; 