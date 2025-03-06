// User related types
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  institution?: string;
  researchFields: ResearchField[];
  reputation: number;
  tokenBalance: number;
  createdAt: string;
  updatedAt: string;
}

// Research fields/categories
export enum ResearchField {
  COMPUTER_SCIENCE = "Computer Science",
  BIOLOGY = "Biology",
  PHYSICS = "Physics",
  CHEMISTRY = "Chemistry",
  MATHEMATICS = "Mathematics",
  SOCIAL_SCIENCES = "Social Sciences"
}

// Sub-fields for each main research field
export interface SubField {
  id: string;
  name: string;
  parentField: ResearchField;
}

// Discussion related types
export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: User;
  researchField: ResearchField;
  subFields: SubField[];
  tags: string[];
  likes: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  discussionId: string;
  parentCommentId?: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// Paper/Research related types
export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: User[];
  doi?: string;
  researchField: ResearchField;
  subFields: SubField[];
  tags: string[];
  publicationDate?: string;
  versions: PaperVersion[];
  citations: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaperVersion {
  id: string;
  paperId: string;
  versionNumber: number;
  content: string;
  changelog?: string;
  createdAt: string;
}

// Token related types
export interface TokenTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  signature?: string;
  createdAt: string;
}

export enum TransactionType {
  CONTRIBUTION_REWARD = "Contribution Reward",
  DISCUSSION_TIP = "Discussion Tip",
  COMMENT_TIP = "Comment Tip",
  PLATFORM_FEE = "Platform Fee",
  PAPER_REVIEW = "Paper Review",
  TRANSFER = "Transfer"
}

export enum TransactionStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  FAILED = "Failed"
} 