import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Clock, Tag, Award } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Discussion } from '@/types';

// Format date to a readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

// Function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

interface DiscussionCardProps {
  discussion: Discussion;
  onLike?: (id: string) => void;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({ 
  discussion,
  onLike 
}) => {
  const { 
    id,
    title,
    content,
    author,
    researchField,
    tags,
    likes,
    commentCount,
    createdAt
  } = discussion;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) {
      onLike(id);
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {author.avatar ? (
              <img 
                src={author.avatar} 
                alt={author.username} 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                {author.username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium">{author.username}</span>
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
        <Link to={`/discussions/${id}`}>
          <CardTitle className="mt-2 hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </Link>
        <div className="flex flex-wrap gap-1 mt-2">
          <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
            {researchField}
          </span>
          {tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs rounded-full"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs rounded-full">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {truncateText(content, 200)}
        </p>
      </CardContent>
      <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike} 
            className="text-gray-500 hover:text-primary"
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            <span>{likes}</span>
          </Button>
          <Link to={`/discussions/${id}`} className="inline-flex items-center text-gray-500 hover:text-primary text-sm">
            <MessageSquare className="w-4 h-4 mr-1" />
            <span>{commentCount}</span>
          </Link>
        </div>
        {author.reputation > 100 && (
          <div className="flex items-center text-yellow-600 dark:text-yellow-500">
            <Award className="w-4 h-4 mr-1" />
            <span className="text-xs">Expert</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}; 