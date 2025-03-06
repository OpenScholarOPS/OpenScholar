import { User } from './User';

/**
 * Research field enum
 */
export enum ResearchField {
  COMPUTER_SCIENCE = 'Computer Science',
  PHYSICS = 'Physics',
  BIOLOGY = 'Biology',
  CHEMISTRY = 'Chemistry',
  MATHEMATICS = 'Mathematics',
  MEDICINE = 'Medicine',
  ECONOMICS = 'Economics',
  PSYCHOLOGY = 'Psychology'
}

/**
 * Paper status enum
 */
export enum PaperStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ACCEPTED = 'accepted',
  PUBLISHED = 'published',
  REJECTED = 'rejected'
}

/**
 * Paper entity interface
 */
export interface Paper {
  id: string;
  title: string;
  abstract: string;
  author: User;
  coAuthors?: User[];
  publicationDate: string;
  doi?: string;
  researchField: ResearchField;
  status: PaperStatus;
  tags?: string[];
  pdfUrl: string;
  citations?: number;
  views?: number;
  likes?: number;
  version: number;
  journal?: string;
  institution?: string;
  keywords?: string[];
} 