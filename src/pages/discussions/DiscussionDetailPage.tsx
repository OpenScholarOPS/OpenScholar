import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, Share, User, MessageSquare, Tag, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import CommentCard from '@/components/discussion/CommentCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { discussionService, commentService } from '@/services/supabase';
import type { Discussion, Comment } from '@/types';

// Format date to a readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Organize comments into a hierarchy
const organizeComments = (comments: Comment[]): { 
  topLevelComments: Comment[], 
  commentMap: Record<string, Comment[]> 
} => {
  const topLevelComments: Comment[] = [];
  const commentMap: Record<string, Comment[]> = {};
  
  // First pass: categorize comments
  comments.forEach(comment => {
    if (!comment.parentCommentId) {
      topLevelComments.push(comment);
    } else {
      if (!commentMap[comment.parentCommentId]) {
        commentMap[comment.parentCommentId] = [];
      }
      commentMap[comment.parentCommentId].push(comment);
    }
  });
  
  // Sort by creation time
  topLevelComments.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  Object.keys(commentMap).forEach(parentId => {
    commentMap[parentId].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  });
  
  return { topLevelComments, commentMap };
};

const DiscussionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Fetch discussion details
  useEffect(() => {
    const fetchDiscussionDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const discussionData = await discussionService.getDiscussion(id);
        setDiscussion(discussionData);
        
        // Extract comments from the discussion data
        if (discussionData.comments) {
          setComments(discussionData.comments);
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching discussion:', err);
        setError('Failed to load discussion. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiscussionDetails();
  }, [id]);
  
  // Handle liking the discussion
  const handleLikeDiscussion = async () => {
    if (!discussion || !isAuthenticated) {
      if (!isAuthenticated) {
        navigate(`/auth/signin?redirect=/discussions/${id}`);
      }
      return;
    }
    
    try {
      await discussionService.likeDiscussion(discussion.id);
      // Update local state to reflect the like
      setDiscussion(prev => {
        if (!prev) return null;
        return { ...prev, likes: prev.likes + 1 };
      });
    } catch (err) {
      console.error('Error liking discussion:', err);
    }
  };
  
  // Handle liking a comment
  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) {
      navigate(`/auth/signin?redirect=/discussions/${id}`);
      return;
    }
    
    try {
      await commentService.likeComment(commentId);
      // Update local state to reflect the like
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: comment.likes + 1 } 
            : comment
        )
      );
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };
  
  // Handle submitting a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !commentContent.trim() || !isAuthenticated) {
      if (!isAuthenticated) {
        navigate(`/auth/signin?redirect=/discussions/${id}`);
      }
      return;
    }
    
    try {
      setIsSubmitting(true);
      const newComment = await commentService.addComment(id, commentContent);
      setComments(prev => [...prev, newComment]);
      setCommentContent('');
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle refreshing comments after a reply
  const handleCommentReply = async (parentCommentId: string) => {
    if (!id) return;
    
    try {
      const discussionData = await discussionService.getDiscussion(id);
      if (discussionData.comments) {
        setComments(discussionData.comments);
      }
    } catch (err) {
      console.error('Error refreshing comments:', err);
    }
  };
  
  // Organize comments into a hierarchy
  const { topLevelComments, commentMap } = organizeComments(comments);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={36} />
      </div>
    );
  }
  
  if (error || !discussion) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
          {error || 'Discussion not found'}
        </div>
        <Button 
          as={Link} 
          to="/discussions"
          variant="outline"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Discussions
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center">
        <Button 
          as={Link} 
          to="/discussions"
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mr-2"
        >
          Back
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Discussions / {discussion.researchField}
        </span>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {/* Discussion header */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {discussion.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Layers className="w-3 h-3 mr-1" />
                {discussion.researchField}
              </span>
              
              {discussion.tags && discussion.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {discussion.author.avatar ? (
                  <img 
                    src={discussion.author.avatar} 
                    alt={discussion.author.username} 
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-2">
                    {discussion.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {discussion.author.fullName || discussion.author.username}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Posted on {formatDate(discussion.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLikeDiscussion}
                  className="text-gray-500 hover:text-primary"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  <span>{discussion.likes}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-primary"
                >
                  <Share className="w-4 h-4 mr-1" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Discussion content */}
          <div className="py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="prose dark:prose-invert max-w-none">
              {discussion.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Comments section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Comments ({comments.length})
        </h2>
        
        {/* Add comment form */}
        {isAuthenticated ? (
          <Card className="mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleSubmitComment}>
                <Input
                  placeholder="Write a comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    type="submit" 
                    isLoading={isSubmitting}
                    disabled={!commentContent.trim()}
                  >
                    Post Comment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-4 flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">
                Sign in to join the discussion
              </span>
              <Button 
                as={Link} 
                to={`/auth/signin?redirect=/discussions/${id}`}
                leftIcon={<User className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Comments list */}
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No comments yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share your thoughts
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                discussionId={discussion.id}
                onReplySubmit={handleCommentReply}
                onLike={handleLikeComment}
                childComments={commentMap[comment.id] || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionDetailPage; 