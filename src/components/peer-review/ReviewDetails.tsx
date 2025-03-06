import React from 'react';
import { PeerReview, ReviewRecommendation, ReviewStatus } from '@/types/PeerReview';
import { formatDate } from '@/utils/formatters';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/ui/StarRating';
import { UserIcon, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ReviewDetailsProps {
  review: PeerReview;
  showPrivateComments?: boolean;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({ review, showPrivateComments = false }) => {
  // Convert numerical scores to star ratings (from 1-10 to 1-5)
  const convertToStars = (score: number) => Math.round(score / 2);
  
  const getStatusIcon = () => {
    switch (review.status) {
      case ReviewStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case ReviewStatus.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case ReviewStatus.PENDING:
        return <Clock className="h-5 w-5 text-gray-500" />;
      case ReviewStatus.REJECTED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getRecommendationColor = () => {
    if (!review.recommendation) return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    
    switch (review.recommendation) {
      case ReviewRecommendation.ACCEPT:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case ReviewRecommendation.MINOR_REVISIONS:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case ReviewRecommendation.MAJOR_REVISIONS:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case ReviewRecommendation.REJECT:
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getRecommendationLabel = () => {
    if (!review.recommendation) return 'No Recommendation';
    
    switch (review.recommendation) {
      case ReviewRecommendation.ACCEPT:
        return 'Accept';
      case ReviewRecommendation.MINOR_REVISIONS:
        return 'Minor Revisions';
      case ReviewRecommendation.MAJOR_REVISIONS:
        return 'Major Revisions';
      case ReviewRecommendation.REJECT:
        return 'Reject';
      default:
        return 'No Recommendation';
    }
  };
  
  const statusLabels = {
    [ReviewStatus.COMPLETED]: 'Completed',
    [ReviewStatus.IN_PROGRESS]: 'In Progress',
    [ReviewStatus.PENDING]: 'Pending',
    [ReviewStatus.REJECTED]: 'Rejected'
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {review.isAnonymous ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
            ) : (
              <Avatar
                src={review.reviewer?.avatar || ''}
                alt={review.reviewer?.name || 'Reviewer'}
                size="md"
              />
            )}
            <div className="ml-3">
              <div className="font-medium">
                {review.isAnonymous ? 'Anonymous Reviewer' : review.reviewer?.name}
              </div>
              {!review.isAnonymous && review.reviewer?.institution && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {review.reviewer.institution}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getRecommendationColor()}>
              {getRecommendationLabel()}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getStatusIcon()}
              <span>{statusLabels[review.status]}</span>
            </Badge>
          </div>
        </div>
        
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <span className="font-medium mr-2">Assigned:</span>
            <span>{formatDate(review.assignedAt)}</span>
          </div>
          
          {review.submittedAt && (
            <div className="flex items-center mt-1">
              <span className="font-medium mr-2">Submitted:</span>
              <span>{formatDate(review.submittedAt)}</span>
            </div>
          )}
        </div>
        
        {review.scores && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Methodology:</span>
                <div className="flex items-center">
                  <StarRating rating={convertToStars(review.scores.methodology)} />
                  <span className="ml-2 text-sm">{review.scores.methodology}/10</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Originality:</span>
                <div className="flex items-center">
                  <StarRating rating={convertToStars(review.scores.originality)} />
                  <span className="ml-2 text-sm">{review.scores.originality}/10</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Clarity:</span>
                <div className="flex items-center">
                  <StarRating rating={convertToStars(review.scores.clarity)} />
                  <span className="ml-2 text-sm">{review.scores.clarity}/10</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Significance:</span>
                <div className="flex items-center">
                  <StarRating rating={convertToStars(review.scores.significance)} />
                  <span className="ml-2 text-sm">{review.scores.significance}/10</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Literature Review:</span>
                <div className="flex items-center">
                  <StarRating rating={convertToStars(review.scores.literature)} />
                  <span className="ml-2 text-sm">{review.scores.literature}/10</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:col-span-2">
                <span className="text-sm font-medium">Overall Score:</span>
                <div className="flex items-center">
                  <span className="font-semibold mr-1">
                    {((
                      review.scores.methodology +
                      review.scores.originality +
                      review.scores.clarity +
                      review.scores.significance +
                      review.scores.literature
                    ) / 5).toFixed(1)}
                  </span>
                  <span className="text-sm">/10</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Comments for Authors</h3>
          {review.comments ? (
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <p className="whitespace-pre-line">{review.comments}</p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No comments provided yet.</p>
          )}
        </div>
        
        {showPrivateComments && review.privateComments && (
          <div className="mb-6 border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span>Private Comments (Not Visible to Authors)</span>
            </h3>
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <p className="whitespace-pre-line">{review.privateComments}</p>
            </div>
          </div>
        )}
        
        {review.responseFromAuthor && (
          <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Author's Response</h3>
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <p className="whitespace-pre-line">{review.responseFromAuthor}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReviewDetails; 