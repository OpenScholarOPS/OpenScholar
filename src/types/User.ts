/**
 * User entity interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  institution?: string;
  role?: 'researcher' | 'reviewer' | 'editor' | 'admin';
  publications?: number;
  citations?: number;
  walletAddress: string;
  joinedAt?: string;
  lastActive?: string;
  website?: string;
  orcidId?: string;
} 