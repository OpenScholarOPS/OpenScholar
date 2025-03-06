import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, CornerDownRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { commentService } from '@/services/supabase';
import type { Comment, User } from '@/types';

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

interface CommentCardProps {
  comment: Comment;
  discussionId: string;
  onReplySubmit?: (parentCommentId: string) => void;
  onLike?: (id: string) => void;
  depth?: number;
  childComments?: Comment[];
}

const CommentCard: React.FC<CommentCardProps> = ({ 
  comment, 
  discussionId, 
  onReplySubmit,
  onLike,
  depth = 0,
  childComments = []
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  const maxDepth = 3; // Maximum nesting level for comments
  
  const handleReply = () => {
    if (!isAuthenticated) {
      window.location.href = `/auth/signin?redirect=/discussions/${discussionId}`;
      return;
    }
    setIsReplying(true);
  };
  
  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyContent('');
  };
  
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim()) return;
    
    try {
      setIsSubmitting(true);
      await commentService.addComment(discussionId, replyContent, comment.id);
      setReplyContent('');
      setIsReplying(false);
      if (onReplySubmit) {
        onReplySubmit(comment.id);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLike = () => {
    if (!isAuthenticated) {
      window.location.href = `/auth/signin?redirect=/discussions/${discussionId}`;
      return;
    }
    
    if (onLike) {
      onLike(comment.id);
    }
  };
  
  // Determine if the current user is the author
  const isAuthor = user?.id === comment.author.id;
  
  return (
    <div className={`pl-${depth > 0 ? depth * 4 : 0}`}>
      <Card className={`mb-4 ${depth > 0 ? 'border-l-4 border-l-primary-100 dark:border-l-primary-900' : ''}`}>
        <CardContent className="p-4">
          {/* Comment header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {depth > 0 && <CornerDownRight className="w-4 h-4 mr-2 text-gray-400" />}
              
              {comment.author.avatar ? (
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.username} 
                  className="w-6 h-6 rounded-full mr-2"
                />
              ) : (
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2">
                  {comment.author.username.charAt(0).toUpperCase()}
                </div>
              )}
              
              <span className="font-medium text-sm">
                {comment.author.username}
                {isAuthor && (
                  <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900 text-primary px-1.5 py-0.5 rounded-full">
                    Author
                  </span>
                )}
              </span>
            </div>
            
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
          
          {/* Comment content */}
          <div className="py-2 text-gray-800 dark:text-gray-200">
            {comment.content}
          </div>
          
          {/* Comment actions */}
          <div className="flex items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className="text-gray-500 hover:text-primary"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span>{comment.likes}</span>
            </Button>
            
            {depth < maxDepth && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReply}
                className="text-gray-500 hover:text-primary ml-2"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>Reply</span>
              </Button>
            )}
          </div>
          
          {/* Reply form */}
          {isReplying && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <form onSubmit={handleSubmitReply}>
                <Input
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelReply}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm" 
                    isLoading={isSubmitting}
                    disabled={!replyContent.trim()}
                  >
                    Reply
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Render child comments recursively */}
      {childComments.length > 0 && (
        <div className="ml-4">
          {childComments.map((childComment) => (
            <CommentCard
              key={childComment.id}
              comment={childComment}
              discussionId={discussionId}
              onReplySubmit={onReplySubmit}
              onLike={onLike}
              depth={depth + 1}
              childComments={[]} // For simplicity, we're not going deeper
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard; 