import { User } from './User';

/**
 * Discussion entity interface
 */
export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  tags?: string[];
  likes: number;
  views: number;
  commentCount: number;
  isPinned: boolean;
}

/**
 * Comment interface for discussions
 */
export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  replies?: Comment[];
  isEdited?: boolean;
}

/**
 * Discussion category enum
 */
export enum DiscussionCategory {
  GENERAL = 'General',
  RESEARCH_QUESTION = 'Research Question',
  METHODOLOGY = 'Methodology',
  RESULTS_INTERPRETATION = 'Results Interpretation',
  LITERATURE_REVIEW = 'Literature Review',
  COLLABORATION = 'Collaboration',
  TECHNICAL = 'Technical'
} 