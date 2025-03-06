import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PeerReview, ReviewRound } from '@/types/PeerReview';
import { getPaperReviewRounds, getPaperReviews } from '@/services/peerReviewService';
import { getPaperById } from '@/services/paperService';
import { Paper } from '@/types/Paper';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layouts/PageLayout';
import ReviewDetails from '@/components/peer-review/ReviewDetails';
import ReviewForm from '@/components/peer-review/ReviewForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Loader2, FileText, MessageSquare, Download, ChevronLeft } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

const PaperReviewPage: React.FC = () => {
  const { paperId, reviewId } = useParams<{ paperId: string; reviewId?: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [rounds, setRounds] = useState<ReviewRound[]>([]);
  const [activeRound, setActiveRound] = useState<string | null>(null);
  const [reviews, setReviews] = useState<PeerReview[]>([]);
  const [isEditor, setIsEditor] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isReviewer, setIsReviewer] = useState(false);
  const [activeReview, setActiveReview] = useState<PeerReview | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!paperId) return;
      
      try {
        setLoading(true);
        
        // Fetch paper details
        const paperData = await getPaperById(paperId);
        if (paperData) {
          setPaper(paperData);
          
          if (isAuthenticated && user) {
            // Check if user is author
            setIsAuthor(paperData.author.id === user.id);
            
            // In a real app, we would check if user is an editor
            setIsEditor(user.id === 'editor1' || user.id === 'editor2');
          }
        }
        
        // Fetch review rounds
        const roundsData = await getPaperReviewRounds(paperId);
        setRounds(roundsData);
        
        if (roundsData.length > 0) {
          const latestRound = roundsData[roundsData.length - 1];
          setActiveRound(latestRound.id);
          
          // Fetch reviews for the latest round
          const reviewsData = await getPaperReviews(paperId);
          setReviews(reviewsData);
          
          // Check if user is a reviewer
          if (isAuthenticated && user) {
            const userReview = reviewsData.find(r => r.reviewerId === user.id);
            if (userReview) {
              setIsReviewer(true);
              setActiveReview(userReview);
              
              if (reviewId && reviewId === userReview.id) {
                setShowReviewForm(true);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching review data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [paperId, reviewId, isAuthenticated, user]);
  
  const handleRoundChange = (roundId: string) => {
    setActiveRound(roundId);
    // In a real app, we would fetch reviews for the selected round
  };
  
  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </PageLayout>
    );
  }
  
  if (!paper) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Paper Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The paper you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button onClick={() => navigate('/papers')}>Return to Papers</Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center"
          onClick={() => navigate(`/papers/${paper.id}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Paper
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{paper.title}</h1>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-4">
                <span className="font-medium">Author:</span> {paper.author.name}
              </span>
              <span>
                <span className="font-medium">Published:</span> {formatDate(paper.publicationDate)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => window.open(paper.pdfUrl, '_blank')}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Paper
            </Button>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => window.open(paper.pdfUrl, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        
        {rounds.length > 0 ? (
          <div className="mb-6">
            <Tabs value={activeRound || undefined} onValueChange={handleRoundChange}>
              <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <TabsList className="flex">
                  {rounds.map((round) => (
                    <TabsTrigger
                      key={round.id}
                      value={round.id}
                      className="px-4 py-2"
                    >
                      Round {round.roundNumber}
                      {round.status === 'open' && (
                        <span className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs py-0.5 px-1.5 rounded-full">
                          Active
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {rounds.map((round) => (
                <TabsContent key={round.id} value={round.id}>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">
                        Review Round {round.roundNumber}
                      </h3>
                      <div className="text-sm">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={round.status === 'open' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                          {round.status === 'open' ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-medium">Started:</span> {formatDate(round.startedAt)}
                      {round.endedAt && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="font-medium">Ended:</span> {formatDate(round.endedAt)}
                        </>
                      )}
                    </div>
                    
                    {round.decision && (
                      <div className="text-sm mb-2">
                        <span className="font-medium">Decision:</span>{' '}
                        <span className={
                          round.decision === 'accept' ? 'text-green-600 dark:text-green-400' :
                          round.decision === 'revise' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }>
                          {round.decision.charAt(0).toUpperCase() + round.decision.slice(1)}
                        </span>
                      </div>
                    )}
                    
                    {round.editorComments && isEditor || isAuthor && (
                      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-1">Editor Comments</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                          {round.editorComments}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 p-4 rounded-md mb-6">
            <h3 className="font-semibold mb-1">No Review Rounds</h3>
            <p className="text-sm">This paper hasn't entered the peer review process yet.</p>
          </div>
        )}
        
        {/* Reviewer's section */}
        {isReviewer && activeReview && (
          <div className="mb-8">
            <Card className="overflow-hidden">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-800">
                <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Your Review</h2>
              </div>
              <div className="p-4">
                {showReviewForm ? (
                  <ReviewForm
                    reviewId={activeReview.id}
                    paperId={paper.id}
                    paperTitle={paper.title}
                    onSuccess={() => {
                      setShowReviewForm(false);
                      // Refresh review data
                    }}
                  />
                ) : (
                  <div>
                    {activeReview.submittedAt ? (
                      <div>
                        <ReviewDetails review={activeReview} showPrivateComments={true} />
                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => {
                              setShowReviewForm(true);
                              navigate(`/papers/${paper.id}/reviews/${activeReview.id}/edit`);
                            }}
                          >
                            Edit Review
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Ready to Review This Paper?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
                          Your expertise is valuable to the scientific community. Submit your review to help ensure the quality of published research.
                        </p>
                        <Button onClick={() => setShowReviewForm(true)}>
                          Begin Review
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
        
        {/* Reviews section (visible to editors and authors after completion) */}
        {(isEditor || (isAuthor && rounds.some(r => r.status === 'closed'))) && reviews.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Reviews {isEditor && <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({reviews.length})</span>}
            </h2>
            <div className="space-y-6">
              {reviews.map(review => (
                <ReviewDetails
                  key={review.id}
                  review={review}
                  showPrivateComments={isEditor}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* If no reviews and user has permission to see reviews */}
        {(isEditor || isAuthor) && reviews.length === 0 && (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditor ? 
                "No reviews have been submitted for this paper yet." :
                "Reviews for this paper will be visible once they're completed."
              }
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default PaperReviewPage; 