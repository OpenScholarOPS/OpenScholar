import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewRecommendation, ReviewScores } from '@/types/PeerReview';
import { submitReview } from '@/services/peerReviewService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { Loader2, Check } from 'lucide-react';

interface RatingSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
}

const RatingSlider: React.FC<RatingSliderProps> = ({ label, value, onChange, description }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <Label>{label}</Label>
        <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{value}</span>
      </div>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{description}</p>
      )}
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>Poor (1)</span>
        <span>Excellent (10)</span>
      </div>
    </div>
  );
};

interface ReviewFormProps {
  reviewId: string;
  paperId: string;
  paperTitle: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ reviewId, paperId, paperTitle, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [recommendation, setRecommendation] = useState<ReviewRecommendation>(ReviewRecommendation.MINOR_REVISIONS);
  const [scores, setScores] = useState<ReviewScores>({
    methodology: 5,
    originality: 5,
    clarity: 5,
    significance: 5,
    literature: 5
  });
  const [comments, setComments] = useState('');
  const [privateComments, setPrivateComments] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  
  const updateScore = (key: keyof ReviewScores, value: number) => {
    setScores(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (comments.trim().length < 50) {
      setError('Please provide more detailed comments (at least 50 characters)');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await submitReview(reviewId, {
        recommendation,
        scores,
        comments,
        privateComments: privateComments || undefined,
        isAnonymous
      });
      
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate(`/papers/${paperId}`);
          }
        }, 1500);
      } else {
        setError('Failed to submit the review. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while submitting the review.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const getRecommendationLabel = (rec: ReviewRecommendation): string => {
    switch (rec) {
      case ReviewRecommendation.ACCEPT:
        return 'Accept (The paper can be published as is)';
      case ReviewRecommendation.MINOR_REVISIONS:
        return 'Minor Revisions (The paper requires small changes before publication)';
      case ReviewRecommendation.MAJOR_REVISIONS:
        return 'Major Revisions (The paper requires significant changes before publication)';
      case ReviewRecommendation.REJECT:
        return 'Reject (The paper is not suitable for publication)';
      default:
        return '';
    }
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Review for "{paperTitle}"</h2>
      
      {success ? (
        <div className="text-center py-8">
          <div className="mx-auto mb-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 w-16 h-16 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Review Submitted Successfully</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for your valuable contribution to the scientific community.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Label className="mb-2">Recommendation</Label>
            <Select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value as ReviewRecommendation)}
              className="mb-1"
            >
              {Object.values(ReviewRecommendation).map((rec) => (
                <option key={rec} value={rec}>
                  {getRecommendationLabel(rec)}
                </option>
              ))}
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your overall recommendation for this paper
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Evaluation Criteria</h3>
            <div className="space-y-6">
              <RatingSlider 
                label="Methodology" 
                value={scores.methodology} 
                onChange={(val) => updateScore('methodology', val)}
                description="The appropriateness and rigor of the research methods"
              />
              
              <RatingSlider 
                label="Originality" 
                value={scores.originality} 
                onChange={(val) => updateScore('originality', val)}
                description="The novelty and innovation of the research"
              />
              
              <RatingSlider 
                label="Clarity" 
                value={scores.clarity} 
                onChange={(val) => updateScore('clarity', val)}
                description="The quality of writing and organization of the paper"
              />
              
              <RatingSlider 
                label="Significance" 
                value={scores.significance} 
                onChange={(val) => updateScore('significance', val)}
                description="The importance and impact of the contribution"
              />
              
              <RatingSlider 
                label="Literature Review" 
                value={scores.literature} 
                onChange={(val) => updateScore('literature', val)}
                description="The thoroughness and relevance of the literature review"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="comments">Comments for Authors</Label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[200px]"
              placeholder="Provide your detailed feedback, suggestions, and critique for the authors..."
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              These comments will be shared with the authors
            </p>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="privateComments">Private Comments (Optional)</Label>
            <textarea
              id="privateComments"
              value={privateComments}
              onChange={(e) => setPrivateComments(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[100px]"
              placeholder="Comments for editors only..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              These comments will only be visible to editors, not to the authors
            </p>
          </div>
          
          <div className="mb-6">
            <Checkbox
              label="Submit this review anonymously"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
              description="If checked, your identity will not be disclosed to the authors"
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/papers/${paperId}`)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Submit Review
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};

export default ReviewForm; 