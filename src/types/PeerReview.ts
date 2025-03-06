import { User } from './User';
import { Paper } from './Paper';

/**
 * Peer review status enum
 */
export enum PeerReviewStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Peer review suggestion enum
 */
export enum PeerReviewSuggestion {
  ACCEPT = 'accept',
  REVISION_REQUIRED = 'revision_required',
  REJECT = 'reject',
  MAJOR_REVISION = 'major_revision',
  MINOR_REVISION = 'minor_revision'
}

/**
 * Evaluation categories for reviews
 */
export enum EvaluationCategory {
  METHODOLOGY = 'methodology',
  ORIGINALITY = 'originality',
  CLARITY = 'clarity',
  SIGNIFICANCE = 'significance',
  LITERATURE_REVIEW = 'literature_review'
}

/**
 * Evaluation item interface
 */
export interface Evaluation {
  category: EvaluationCategory;
  score: number;
}

/**
 * Peer review entity
 */
export interface PeerReview {
  id: string;
  paperId: string;
  reviewerId: string;
  status: PeerReviewStatus;
  suggestion?: PeerReviewSuggestion;
  evaluations?: Evaluation[];
  comments?: string;
  privateComments?: string;
  submittedAt?: string;
  attachments?: string[];
  paper?: Paper;
  reviewer?: User;
}

/**
 * Review invitation interface
 */
export interface ReviewInvitation {
  id: string;
  paperId: string;
  paperTitle?: string;
  reviewerId: string;
  status: 'pending' | 'accepted' | 'declined';
  invitedAt: string;
  acceptedAt?: string;
  declinedAt?: string;
  dueDate: string;
  reason?: string;
  paper?: Paper;
}

/**
 * Review round interface
 */
export interface ReviewRound {
  id: string;
  paperId: string;
  roundNumber: number;
  status: 'in_progress' | 'completed';
  startDate: string;
  endDate: string;
  reviewers: string[];
  pendingReviewers?: string[];
  decision?: 'accept' | 'revision' | 'reject';
  decisionDate?: string;
  editorComments?: string;
} 