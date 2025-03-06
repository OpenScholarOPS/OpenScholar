import { PeerReview, PeerReviewStatus, PeerReviewSuggestion, EvaluationCategory } from '@/types/PeerReview';
import { User } from '@/types/User';
import { Paper } from '@/types/Paper';

// Mock reviewer data
const mockReviewers: User[] = [
  {
    id: 'rev1',
    name: 'Dr. Sarah Williams',
    email: 'sarah@university.edu',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    institution: 'Technology University',
    bio: 'Expert in machine learning and data science.',
    publications: 28,
    citations: 980,
    walletAddress: '3zcmfSbLKN28TtJQBCJZqAFCRB9Y9qVXKmYhjKd9J1cA'
  },
  {
    id: 'rev2',
    name: 'Prof. Michael Chen',
    email: 'michael@scienceacademy.org',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    institution: 'Science Academy',
    bio: 'Specialized in physics and quantum computing.',
    publications: 45,
    citations: 1890,
    walletAddress: 'Ev4RGkNsNJZdmgGkVLPFNyXcCBzZSWJjYFMdvFwuBAbB'
  },
  {
    id: 'rev3',
    name: 'Dr. Elizabeth Kumar',
    email: 'elizabeth@researchinstitute.com',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    institution: 'Global Research Institute',
    bio: 'Focused on blockchain applications in scientific research.',
    publications: 16,
    citations: 560,
    walletAddress: '5VkHzHYgW3gUPxLNm9XuGJgGZLN6KpbKqwdAYGGz5bxp'
  }
];

// Mock review data
const mockReviews: PeerReview[] = [
  {
    id: 'review1',
    paperId: 'paper1',
    reviewerId: 'rev1',
    status: PeerReviewStatus.COMPLETED,
    suggestion: PeerReviewSuggestion.ACCEPT,
    evaluations: [
      { category: EvaluationCategory.METHODOLOGY, score: 4.5 },
      { category: EvaluationCategory.ORIGINALITY, score: 4.8 },
      { category: EvaluationCategory.CLARITY, score: 4.2 },
      { category: EvaluationCategory.SIGNIFICANCE, score: 4.6 },
      { category: EvaluationCategory.LITERATURE_REVIEW, score: 4.0 }
    ],
    comments: 'This paper presents innovative approaches to quantum computing applications in research validation. The methodology is sound and the results are significant.',
    privateComments: 'Some minor issues with the literature review could be addressed in a revision.',
    submittedAt: '2023-04-15T14:30:00Z',
    attachments: []
  },
  {
    id: 'review2',
    paperId: 'paper1',
    reviewerId: 'rev2',
    status: PeerReviewStatus.COMPLETED,
    suggestion: PeerReviewSuggestion.REVISION_REQUIRED,
    evaluations: [
      { category: EvaluationCategory.METHODOLOGY, score: 3.8 },
      { category: EvaluationCategory.ORIGINALITY, score: 4.5 },
      { category: EvaluationCategory.CLARITY, score: 3.5 },
      { category: EvaluationCategory.SIGNIFICANCE, score: 4.2 },
      { category: EvaluationCategory.LITERATURE_REVIEW, score: 3.7 }
    ],
    comments: 'While the paper presents interesting concepts, there are some issues with the methodology that need to be addressed. The explanation of the quantum algorithms could be clearer.',
    privateComments: 'The author shows promise but needs to refine the technical explanations.',
    submittedAt: '2023-04-18T11:15:00Z',
    attachments: []
  },
  {
    id: 'review3',
    paperId: 'paper2',
    reviewerId: 'rev3',
    status: PeerReviewStatus.COMPLETED,
    suggestion: PeerReviewSuggestion.ACCEPT,
    evaluations: [
      { category: EvaluationCategory.METHODOLOGY, score: 4.7 },
      { category: EvaluationCategory.ORIGINALITY, score: 4.9 },
      { category: EvaluationCategory.CLARITY, score: 4.5 },
      { category: EvaluationCategory.SIGNIFICANCE, score: 4.8 },
      { category: EvaluationCategory.LITERATURE_REVIEW, score: 4.6 }
    ],
    comments: 'This paper on blockchain-based peer review systems is exceptionally well-researched and presents a novel approach to a critical problem in academic publishing.',
    privateComments: 'One of the best papers I have reviewed this year. Highly recommend publication.',
    submittedAt: '2023-04-10T09:45:00Z',
    attachments: []
  }
];

// Mock review invitation data
const mockReviewInvitations = [
  {
    id: 'invite1',
    paperId: 'paper3',
    paperTitle: 'Token Economics for Academic Collaboration',
    reviewerId: 'rev1',
    status: 'pending',
    invitedAt: '2023-04-20T10:00:00Z',
    dueDate: '2023-05-20T23:59:59Z'
  },
  {
    id: 'invite2',
    paperId: 'paper3',
    paperTitle: 'Token Economics for Academic Collaboration',
    reviewerId: 'rev2',
    status: 'accepted',
    invitedAt: '2023-04-20T10:00:00Z',
    acceptedAt: '2023-04-21T15:30:00Z',
    dueDate: '2023-05-20T23:59:59Z'
  },
  {
    id: 'invite3',
    paperId: 'paper2',
    paperTitle: 'Decentralized Peer Review Systems: A Blockchain Approach',
    reviewerId: 'rev1',
    status: 'declined',
    invitedAt: '2023-04-05T14:00:00Z',
    declinedAt: '2023-04-06T09:15:00Z',
    reason: 'Conflict of interest with the research group.'
  }
];

// Mock review rounds data
const mockReviewRounds = [
  {
    id: 'round1',
    paperId: 'paper1',
    roundNumber: 1,
    status: 'completed',
    startDate: '2023-04-01T00:00:00Z',
    endDate: '2023-04-20T23:59:59Z',
    reviewers: ['rev1', 'rev2'],
    decision: 'revision',
    decisionDate: '2023-04-22T14:30:00Z',
    editorComments: 'The paper shows promise but requires revisions as suggested by the reviewers. Please address the methodology concerns and improve clarity of the quantum algorithm explanations.'
  },
  {
    id: 'round2',
    paperId: 'paper2',
    roundNumber: 1,
    status: 'completed',
    startDate: '2023-04-01T00:00:00Z',
    endDate: '2023-04-15T23:59:59Z',
    reviewers: ['rev3'],
    decision: 'accept',
    decisionDate: '2023-04-17T11:00:00Z',
    editorComments: 'This paper on blockchain-based peer review is innovative and well-executed. Accepted for publication.'
  },
  {
    id: 'round3',
    paperId: 'paper3',
    roundNumber: 1,
    status: 'in_progress',
    startDate: '2023-04-20T00:00:00Z',
    endDate: '2023-05-20T23:59:59Z',
    reviewers: ['rev2'],
    pendingReviewers: ['rev1']
  }
];

// Function to fetch reviews for a paper
export const fetchPaperReviews = async (paperId: string): Promise<PeerReview[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockReviews.filter(review => review.paperId === paperId);
};

// Function to fetch a specific review
export const fetchReview = async (reviewId: string): Promise<PeerReview | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const review = mockReviews.find(review => review.id === reviewId);
  return review || null;
};

// Function to fetch review invitations for a reviewer
export const fetchReviewerInvitations = async (reviewerId: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return mockReviewInvitations.filter(invite => invite.reviewerId === reviewerId);
};

// Function to respond to a review invitation
export const respondToInvitation = async (invitationId: string, accept: boolean, reason?: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const invitation = mockReviewInvitations.find(invite => invite.id === invitationId);
  if (!invitation) {
    throw new Error('Invitation not found');
  }
  
  // Update invitation in the database (mock)
  const now = new Date().toISOString();
  if (accept) {
    invitation.status = 'accepted';
    invitation.acceptedAt = now;
  } else {
    invitation.status = 'declined';
    invitation.declinedAt = now;
    invitation.reason = reason || 'No reason provided';
  }
  
  return invitation;
};

// Function to submit a review
export const submitReview = async (reviewData: Partial<PeerReview> & { id: string }): Promise<PeerReview> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  const existingReviewIndex = mockReviews.findIndex(review => review.id === reviewData.id);
  
  if (existingReviewIndex >= 0) {
    // Update existing review
    const updatedReview = {
      ...mockReviews[existingReviewIndex],
      ...reviewData,
      status: PeerReviewStatus.COMPLETED,
      submittedAt: new Date().toISOString()
    };
    mockReviews[existingReviewIndex] = updatedReview;
    return updatedReview;
  } else {
    // Create new review
    const newReview: PeerReview = {
      ...reviewData as PeerReview,
      status: PeerReviewStatus.COMPLETED,
      submittedAt: new Date().toISOString()
    };
    mockReviews.push(newReview);
    return newReview;
  }
};

// Function to save a draft review
export const saveDraftReview = async (reviewData: Partial<PeerReview> & { id: string }): Promise<PeerReview> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const existingReviewIndex = mockReviews.findIndex(review => review.id === reviewData.id);
  
  if (existingReviewIndex >= 0) {
    // Update existing review
    const updatedReview = {
      ...mockReviews[existingReviewIndex],
      ...reviewData,
      status: PeerReviewStatus.DRAFT
    };
    mockReviews[existingReviewIndex] = updatedReview;
    return updatedReview;
  } else {
    // Create new draft review
    const newReview: PeerReview = {
      ...reviewData as PeerReview,
      status: PeerReviewStatus.DRAFT
    };
    mockReviews.push(newReview);
    return newReview;
  }
};

// Function to fetch review rounds for a paper
export const fetchPaperReviewRounds = async (paperId: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return mockReviewRounds.filter(round => round.paperId === paperId);
};

// Export mock data for testing
export { mockReviewers, mockReviews, mockReviewInvitations, mockReviewRounds }; 