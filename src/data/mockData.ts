import { Paper, ResearchField, PaperStatus } from '@/types/Paper';
import { User } from '@/types/User';
import { Discussion } from '@/types/Discussion';

// Mock users data
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Dr. Alice Johnson',
    email: 'alice@university.edu',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    institution: 'University of Science',
    bio: 'Expert in quantum mechanics and computational physics.',
    publications: 42,
    citations: 1200,
    walletAddress: '8zJ9Tz7j1zKSzAGWvQH8J5XG4LHoHG6gUEJPxcB6nQWr'
  },
  {
    id: 'user2',
    name: 'Prof. David Lee',
    email: 'david@researchcenter.org',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    institution: 'International Research Center',
    bio: 'Leading researcher in biochemistry with focus on protein folding.',
    publications: 65,
    citations: 3400,
    walletAddress: 'GBQbmYonVFAvuSbxeEgP72rUcFiXLHAZPcjnVgjnEzEU'
  },
  {
    id: 'user3',
    name: 'Dr. Maria Garcia',
    email: 'maria@techuni.edu',
    avatar: 'https://randomuser.me/api/portraits/women/64.jpg',
    institution: 'Tech University',
    bio: 'Specialized in AI ethics and machine learning applications.',
    publications: 28,
    citations: 950,
    walletAddress: '4jzhTKEoJwUCSvABZSxwdvYxsQ3M3QvBQPaToCLyLRNM'
  }
];

// Mock papers data
export const mockPapers: Paper[] = [
  {
    id: 'paper1',
    title: 'Quantum Computing Applications in Academic Research Validation',
    abstract: 'This paper explores how quantum computing can revolutionize the validation of academic research by providing faster and more accurate verification of experimental results.',
    author: mockUsers[0],
    publicationDate: '2023-01-15',
    doi: '10.1234/qcomp.2023.01',
    researchField: ResearchField.COMPUTER_SCIENCE,
    status: PaperStatus.PUBLISHED,
    tags: ['Quantum Computing', 'Research Validation', 'Academic Integrity'],
    pdfUrl: 'https://example.com/papers/quantum_computing_validation.pdf',
    citations: 45,
    views: 1230,
    likes: 89,
    version: 1,
    journal: 'Journal of Quantum Computing',
    keywords: ['quantum', 'computing', 'validation', 'research']
  },
  {
    id: 'paper2',
    title: 'Decentralized Peer Review Systems: A Blockchain Approach',
    abstract: 'We propose a decentralized peer review system built on blockchain technology that ensures transparency, immutability, and fair attribution for reviewers while maintaining high academic standards.',
    author: mockUsers[1],
    publicationDate: '2023-02-22',
    doi: '10.1234/blockchain.2023.02',
    researchField: ResearchField.COMPUTER_SCIENCE,
    status: PaperStatus.PUBLISHED,
    tags: ['Blockchain', 'Peer Review', 'Decentralization'],
    pdfUrl: 'https://example.com/papers/blockchain_peer_review.pdf',
    citations: 32,
    views: 980,
    likes: 120,
    version: 1,
    journal: 'Blockchain in Academia',
    keywords: ['blockchain', 'peer review', 'decentralized', 'academic publishing']
  },
  {
    id: 'paper3',
    title: 'Token Economics for Academic Collaboration',
    abstract: 'This research examines how token economics can create incentives for academic collaboration, quality peer review, and research reproducibility in a decentralized science ecosystem.',
    author: mockUsers[2],
    publicationDate: '2023-03-10',
    doi: '10.1234/tokenomics.2023.03',
    researchField: ResearchField.ECONOMICS,
    status: PaperStatus.PUBLISHED,
    tags: ['Token Economics', 'Academic Collaboration', 'Incentives'],
    pdfUrl: 'https://example.com/papers/token_economics_academia.pdf',
    citations: 18,
    views: 750,
    likes: 65,
    version: 1,
    journal: 'Journal of Decentralized Science',
    keywords: ['token economics', 'incentives', 'academic collaboration', 'peer review']
  }
];

// Mock discussions data
export const mockDiscussions: Discussion[] = [
  {
    id: 'disc1',
    title: 'The Future of Peer Review in Decentralized Science',
    content: 'I believe that decentralized peer review systems will fundamentally change how academic quality is maintained. What do others think about this trajectory?',
    author: mockUsers[0],
    createdAt: '2023-04-05T10:30:00Z',
    tags: ['Peer Review', 'Decentralized Science', 'Academic Publishing'],
    likes: 24,
    views: 342,
    commentCount: 15,
    isPinned: true
  },
  {
    id: 'disc2',
    title: 'Research Reproducibility Crisis: Can Blockchain Help?',
    content: 'The reproducibility crisis is a major issue in many scientific fields. Could blockchain-based verification of research methods and data be a solution?',
    author: mockUsers[1],
    createdAt: '2023-04-12T14:45:00Z',
    tags: ['Reproducibility', 'Blockchain', 'Research Methods'],
    likes: 18,
    views: 256,
    commentCount: 8,
    isPinned: false
  },
  {
    id: 'disc3',
    title: 'Token Incentives for Quality Research: Models and Pitfalls',
    content: 'How should we design token incentives to reward quality research without encouraging perverse incentives or gaming of the system?',
    author: mockUsers[2],
    createdAt: '2023-04-18T09:15:00Z',
    tags: ['Token Incentives', 'Research Quality', 'Academic Rewards'],
    likes: 32,
    views: 412,
    commentCount: 21,
    isPinned: false
  }
];

// Create a simple Discussion type if it doesn't exist yet
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