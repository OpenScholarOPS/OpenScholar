import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Share, ThumbsUp, Users, Calendar, FileText, Tag, Layers, Book } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { mockDataService } from '@/services/mockData';
import type { Paper, PaperVersion } from '@/types';

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

const PaperDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<PaperVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        // In a real app, this would be a service call to the backend
        const paperData = mockDataService.getPaperById(id);
        
        if (!paperData) {
          setError('Paper not found');
          return;
        }
        
        setPaper(paperData);
        
        // Select the latest version by default
        if (paperData.versions && paperData.versions.length > 0) {
          const latestVersion = paperData.versions.reduce((latest, current) => 
            current.versionNumber > latest.versionNumber ? current : latest,
            paperData.versions[0]
          );
          setSelectedVersion(latestVersion);
        }
        
      } catch (err) {
        console.error('Error fetching paper:', err);
        setError('Failed to load paper details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaper();
  }, [id]);
  
  // Handle version selection
  const handleVersionSelect = (version: PaperVersion) => {
    setSelectedVersion(version);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={36} />
      </div>
    );
  }
  
  if (error || !paper) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
          {error || 'Paper not found'}
        </div>
        <Button 
          as={Link} 
          to="/papers"
          variant="outline"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Papers
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center">
        <Button 
          as={Link} 
          to="/papers"
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mr-2"
        >
          Back
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Papers / {paper.researchField}
        </span>
      </div>
      
      {/* Paper header */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Layers className="w-3 h-3 mr-1" />
              {paper.researchField}
            </span>
            
            {paper.tags && paper.tags.map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {paper.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
              Published on {formatDate(paper.publicationDate || paper.createdAt)}
            </div>
            
            <div className="flex items-center">
              <Book className="w-4 h-4 mr-1 text-gray-500" />
              Citations: {paper.citations}
            </div>
            
            {paper.doi && (
              <div className="flex items-center">
                <ExternalLink className="w-4 h-4 mr-1 text-gray-500" />
                DOI: <a 
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:underline"
                >
                  {paper.doi}
                </a>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="flex items-center mr-2">
              <Users className="w-5 h-5 text-gray-500 mr-1" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Authors:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {paper.authors.map((author) => (
                <Link 
                  key={author.id} 
                  to={`/profile/${author.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {author.avatar ? (
                    <img 
                      src={author.avatar} 
                      alt={author.username} 
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                      {author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{author.fullName || author.username}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Abstract */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Abstract</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {paper.abstract}
            </p>
          </div>
          
          {/* Version selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Versions
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {paper.versions.map((version) => (
                <button
                  key={version.id}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedVersion?.id === version.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleVersionSelect(version)}
                >
                  v{version.versionNumber}
                  {version.versionNumber === paper.versions.length && 
                    <span className="ml-1">(Latest)</span>}
                </button>
              ))}
            </div>
          </div>
          
          {/* Version information */}
          {selectedVersion && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Version {selectedVersion.versionNumber}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatDate(selectedVersion.createdAt)}
                </span>
              </div>
              
              {selectedVersion.changelog && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Changelog:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    {selectedVersion.changelog}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  leftIcon={<Download className="w-4 h-4" />}
                  variant="outline"
                >
                  Download PDF
                </Button>
                
                <Button
                  leftIcon={<Share className="w-4 h-4" />}
                  variant="outline"
                >
                  Share
                </Button>
                
                <Button
                  leftIcon={<ThumbsUp className="w-4 h-4" />}
                  variant="outline"
                >
                  Cite
                </Button>
              </div>
            </div>
          )}
          
          {/* Paper content preview */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Content Preview
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <p className="text-gray-600 dark:text-gray-400">
                In the full version of this platform, the complete paper content would be displayed here, 
                with support for LaTeX equations, figures, tables, and code blocks.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                For MVP purposes, we're showing this placeholder. In a real implementation, 
                the content would be rendered from the selected version's content field.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaperDetailPage; 