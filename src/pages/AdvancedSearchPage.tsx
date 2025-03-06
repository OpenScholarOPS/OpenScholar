import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { SearchResult, SearchFilters, searchContent } from '@/services/searchService';
import { ResearchField } from '@/types/Paper';
import PageLayout from '@/components/layouts/PageLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { DatePicker } from '@/components/ui/DatePicker';
import { FileText, MessageSquare, User, Filter, Book, Search, Loader2, SlidersHorizontal, ChevronRight, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

const AdvancedSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Search state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  
  // Advanced filter conditions
  const [filters, setFilters] = useState<SearchFilters>({
    type: (searchParams.get('type') as SearchFilters['type']) || 'all',
    sortBy: (searchParams.get('sort') as SearchFilters['sortBy']) || 'relevance',
    tags: searchParams.getAll('tag'),
    authors: searchParams.getAll('author'),
    dateRange: {
      start: searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined,
      end: searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined
    },
    fields: searchParams.getAll('field') as ResearchField[]
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const resultsPerPage = 10;
  
  // Load search from URL parameters
  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [currentPage]);
  
  // Perform search
  const performSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // Add pagination parameters
      const paginationParams = {
        page: currentPage,
        limit: resultsPerPage
      };
      
      const searchResults = await searchContent(query, {
        ...filters,
        ...paginationParams
      });
      
      setResults(searchResults.results);
      setTotalResults(searchResults.total);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    
    // Build URL parameters
    const params = new URLSearchParams();
    
    // Add search term
    if (query) params.set('q', query);
    
    // Add content type
    if (filters.type && filters.type !== 'all') params.set('type', filters.type);
    
    // Add sort method
    if (filters.sortBy && filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
    
    // Add tags
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => params.append('tag', tag));
    }
    
    // Add authors
    if (filters.authors && filters.authors.length > 0) {
      filters.authors.forEach(author => params.append('author', author));
    }
    
    // Add date range
    if (filters.dateRange?.start) {
      params.set('from', filters.dateRange.start.toISOString().split('T')[0]);
    }
    if (filters.dateRange?.end) {
      params.set('to', filters.dateRange.end.toISOString().split('T')[0]);
    }
    
    // Add research fields
    if (filters.fields && filters.fields.length > 0) {
      filters.fields.forEach(field => params.append('field', field));
    }
    
    // Update URL and perform search
    navigate({
      pathname: '/advanced-search',
      search: params.toString()
    });
    
    performSearch();
  };
  
  // Handle filter changes
  const handleFilterChange = (updates: Partial<SearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  // Handle date range changes
  const handleDateRangeChange = (key: 'start' | 'end', value: Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [key]: value
      }
    }));
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    
    // Update page number in URL
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };
  
  // Render search result item
  const ResultItem = ({ result }: { result: SearchResult }) => {
    const icon = result.type === 'paper' 
      ? <FileText className="h-5 w-5 text-blue-500" /> 
      : <MessageSquare className="h-5 w-5 text-green-500" />;
    
    const url = result.type === 'paper' 
      ? `/papers/${result.id}` 
      : `/discussions/${result.id}`;
    
    return (
      <Card className="p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex gap-3">
          <div className="mt-1">{icon}</div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <Link to={url} className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">
                {result.title}
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(result.date)}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {result.abstract || result.content}
            </div>
            
            <div className="flex flex-wrap items-center mt-2">
              <div className="flex items-center mr-4 text-sm text-gray-500 dark:text-gray-400">
                <User className="h-4 w-4 mr-1" />
                <span>{result.author.name}</span>
              </div>
              
              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="px-2 py-0.5 text-xs">
                      {tag}
                    </Badge>
                  ))}
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Advanced Search</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find specific research papers and discussions using multiple criteria
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left filter panel */}
          <div className="lg:col-span-1">
            <Card className="p-5 sticky top-20">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </h2>
              
              <div className="space-y-6">
                {/* Content type */}
                <div>
                  <Label className="mb-2">Content Type</Label>
                  <Select
                    value={filters.type || 'all'}
                    onChange={(e) => handleFilterChange({ type: e.target.value as SearchFilters['type'] })}
                  >
                    <option value="all">All Content</option>
                    <option value="paper">Papers Only</option>
                    <option value="discussion">Discussions Only</option>
                  </Select>
                </div>
                
                {/* Sort method */}
                <div>
                  <Label className="mb-2">Sort By</Label>
                  <Select
                    value={filters.sortBy || 'relevance'}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value as SearchFilters['sortBy'] })}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date (Newest First)</option>
                    <option value="popularity">Popularity</option>
                    <option value="citations">Citations (High to Low)</option>
                  </Select>
                </div>
                
                {/* Date range */}
                <div>
                  <Label className="mb-2">Date Range</Label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-20 text-sm">From:</span>
                      <DatePicker
                        selected={filters.dateRange?.start}
                        onChange={(date) => handleDateRangeChange('start', date || undefined)}
                        className="w-full"
                        placeholderText="Start date"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-sm">To:</span>
                      <DatePicker
                        selected={filters.dateRange?.end}
                        onChange={(date) => handleDateRangeChange('end', date || undefined)}
                        className="w-full"
                        placeholderText="End date"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Research fields */}
                <div>
                  <Label className="mb-2">Research Fields</Label>
                  <div className="space-y-2">
                    {Object.values(ResearchField).map((field) => (
                      <Checkbox
                        key={field}
                        label={field}
                        checked={filters.fields?.includes(field) || false}
                        onChange={() => {
                          const updatedFields = filters.fields ? [...filters.fields] : [];
                          if (updatedFields.includes(field)) {
                            const index = updatedFields.indexOf(field);
                            updatedFields.splice(index, 1);
                          } else {
                            updatedFields.push(field);
                          }
                          handleFilterChange({ fields: updatedFields });
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => {
                    // Reset all filters
                    setFilters({
                      type: 'all',
                      sortBy: 'relevance',
                      tags: [],
                      authors: [],
                      dateRange: {},
                      fields: []
                    });
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Right search and results */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search for papers, discussions, authors..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="md:w-auto" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  Search
                </Button>
              </div>
              
              {/* Display active filters */}
              {(filters.tags?.length || filters.authors?.length || filters.fields?.length || filters.dateRange?.start || filters.dateRange?.end) && (
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                  
                  {filters.type !== 'all' && filters.type && (
                    <Badge variant="secondary">
                      Type: {filters.type === 'paper' ? 'Papers' : 'Discussions'}
                    </Badge>
                  )}
                  
                  {filters.tags?.map((tag, idx) => (
                    <Badge key={`tag-${idx}`} variant="secondary" className="flex items-center gap-1">
                      Tag: {tag}
                    </Badge>
                  ))}
                  
                  {filters.authors?.map((author, idx) => (
                    <Badge key={`author-${idx}`} variant="secondary" className="flex items-center gap-1">
                      Author: {author}
                    </Badge>
                  ))}
                  
                  {filters.fields?.map((field, idx) => (
                    <Badge key={`field-${idx}`} variant="secondary" className="flex items-center gap-1">
                      Field: {field}
                    </Badge>
                  ))}
                  
                  {filters.dateRange?.start && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      From: {formatDate(filters.dateRange.start)}
                    </Badge>
                  )}
                  
                  {filters.dateRange?.end && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      To: {formatDate(filters.dateRange.end)}
                    </Badge>
                  )}
                </div>
              )}
            </form>
            
            {/* Search results */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {results.length > 0 ? (
                  <div>
                    <div className="mb-4 flex justify-between items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Found {totalResults} results for "{query}"
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {results.map((result) => (
                        <ResultItem key={`${result.type}-${result.id}`} result={result} />
                      ))}
                    </div>
                    
                    {/* Pagination controls */}
                    {totalPages > 1 && (
                      <div className="mt-6 flex justify-center">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                          >
                            Previous
                          </Button>
                          
                          <div className="flex items-center">
                            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = idx + 1;
                              } else if (currentPage <= 3) {
                                pageNum = idx + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + idx;
                              } else {
                                pageNum = currentPage - 2 + idx;
                              }
                              
                              return (
                                <Button
                                  key={idx}
                                  variant={currentPage === pageNum ? 'default' : 'outline'}
                                  size="sm"
                                  className="mx-1 min-w-[40px]"
                                  onClick={() => handlePageChange(pageNum)}
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  query && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No results found</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        We couldn't find any matches for "{query}". Try adjusting your search terms or filters.
                      </p>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdvancedSearchPage; 