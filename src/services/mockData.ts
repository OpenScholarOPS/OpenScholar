import { User, Discussion, Comment, Paper, ResearchField, TransactionType, TransactionStatus, TokenTransaction } from '@/types';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Create mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    username: 'johndoe',
    fullName: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=john',
    bio: 'Researcher in Computer Science with focus on artificial intelligence and machine learning.',
    institution: 'Stanford University',
    researchFields: [ResearchField.COMPUTER_SCIENCE],
    reputation: 750,
    tokenBalance: 2500,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    fullName: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    bio: 'Biologist studying genomics and molecular biology with a special interest in CRISPR.',
    institution: 'MIT',
    researchFields: [ResearchField.BIOLOGY],
    reputation: 620,
    tokenBalance: 1800,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: 'user-3',
    email: 'alex.johnson@example.com',
    username: 'alexj',
    fullName: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    bio: 'Physicist working on quantum computing and information theory.',
    institution: 'Caltech',
    researchFields: [ResearchField.PHYSICS, ResearchField.COMPUTER_SCIENCE],
    reputation: 890,
    tokenBalance: 3200,
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

// Create mock discussions
export const mockDiscussions: Discussion[] = [
  {
    id: 'disc-1',
    title: 'Advancements in Quantum Machine Learning',
    content: `Recent advances in quantum computing are opening new possibilities for machine learning algorithms. Quantum machine learning (QML) is an emerging interdisciplinary field that combines quantum physics and machine learning.

This discussion aims to explore how quantum algorithms can potentially offer exponential speedups for certain machine learning tasks, and what challenges remain in implementing these algorithms on current noisy intermediate-scale quantum (NISQ) devices.

Some key topics to consider:
- Quantum neural networks and their expressive power
- Quantum kernel methods for support vector machines
- Challenges in training quantum circuits
- Potential quantum advantage in ML tasks

I'm particularly interested in hearing from those working on practical implementations and what results you've observed so far.`,
    author: mockUsers[0],
    researchField: ResearchField.COMPUTER_SCIENCE,
    subFields: [],
    tags: ['Quantum Computing', 'Machine Learning', 'Quantum Algorithms', 'Neural Networks'],
    likes: 42,
    commentCount: 3,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: 'disc-2',
    title: 'CRISPR-Cas9 for Treating Genetic Disorders: Current Status and Ethical Considerations',
    content: `CRISPR-Cas9 technology has revolutionized genetic engineering by providing a precise, efficient, and relatively simple method for editing genomes. This discussion aims to explore the current state of CRISPR-based therapies for genetic disorders, ongoing clinical trials, and associated ethical considerations.

Key topics I'd like to discuss:
1. Recent clinical applications of CRISPR for genetic disorders
2. Challenges in delivery methods for CRISPR systems
3. Off-target effects and strategies to minimize them
4. Ethical considerations regarding germline editing
5. Regulatory frameworks across different countries

I believe sharing insights from different perspectives will help us better understand both the potential and limitations of this technology in treating genetic disorders.`,
    author: mockUsers[1],
    researchField: ResearchField.BIOLOGY,
    subFields: [],
    tags: ['CRISPR', 'Gene Editing', 'Bioethics', 'Genetic Disorders', 'Clinical Trials'],
    likes: 38,
    commentCount: 5,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: 'disc-3',
    title: 'The Future of Blockchain in Scientific Research',
    content: `Blockchain technology has potential applications beyond cryptocurrencies, including in scientific research. This discussion aims to explore how blockchain could address issues in scientific publishing, data integrity, reproducibility, and collaboration.

Specific areas I'd like to discuss:
- Using blockchain for transparent peer review processes
- Timestamping experimental data to establish provenance
- Smart contracts for managing collaborative research funds
- Tokenizing scientific contributions to create better incentives
- Decentralized scientific publishing models

What are your thoughts on these applications? Are there specific challenges or solutions you've encountered in implementing blockchain in scientific contexts?`,
    author: mockUsers[2],
    researchField: ResearchField.COMPUTER_SCIENCE,
    subFields: [],
    tags: ['Blockchain', 'Scientific Publishing', 'Open Science', 'Decentralization'],
    likes: 29,
    commentCount: 4,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

// Create mock comments
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    content: `Great discussion topic! I've been working on quantum kernel methods for the past two years. One significant challenge we've faced is that quantum kernels can sometimes perform worse than classical kernels when the dataset doesn't have a structure that quantum computers can exploit. 

I think the field needs more work on identifying which problems are truly suited for quantum advantage in ML.`,
    author: mockUsers[2],
    discussionId: 'disc-1',
    likes: 12,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  },
  {
    id: 'comment-2',
    content: `I agree with Alex. My research group recently published a paper comparing classical and quantum methods for several ML tasks, and we found that the quantum advantage only becomes apparent for certain data structures with specific properties. 

However, I remain optimistic about the future of QML, especially as we develop better hardware with higher qubit counts and lower error rates.`,
    author: mockUsers[1],
    discussionId: 'disc-1',
    parentCommentId: 'comment-1',
    likes: 8,
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days ago
    updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days ago
  },
  {
    id: 'comment-3',
    content: `One aspect that often gets overlooked in QML discussions is the challenge of loading classical data into quantum systems efficiently. The data loading bottleneck can potentially negate any quantum speedup we might achieve with the algorithms themselves.

Has anyone here explored quantum feature maps that can be implemented efficiently while still capturing relevant structures in the data?`,
    author: mockUsers[0],
    discussionId: 'disc-1',
    likes: 5,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
  },
  {
    id: 'comment-4',
    content: `I've been closely following the first CRISPR clinical trials for sickle cell disease and beta-thalassemia, and the early results are promising. However, delivery remains a significant challenge, especially for in vivo applications targeting solid tissues rather than ex vivo editing of blood cells.

I'd be interested to hear if anyone is working on novel delivery methods beyond the current viral and lipid nanoparticle approaches.`,
    author: mockUsers[0],
    discussionId: 'disc-2',
    likes: 10,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
  },
  {
    id: 'comment-5',
    content: `Regarding ethical considerations, I think we need to have more public engagement on where to draw the line between therapeutic applications (which have broader support) and enhancement applications (which are more controversial).

The recent international summit on human genome editing made some progress in establishing guidelines, but there's still a lack of consensus on many issues, and regulatory frameworks vary widely between countries.`,
    author: mockUsers[2],
    discussionId: 'disc-2',
    likes: 14,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  },
];

// Create mock papers
export const mockPapers: Paper[] = [
  {
    id: 'paper-1',
    title: 'Quantum Advantage in Machine Learning: A Survey',
    abstract: 'This survey provides a comprehensive overview of the current state of quantum machine learning, focusing on algorithms that may provide computational advantages over classical counterparts. We review quantum versions of principal component analysis, support vector machines, and neural networks, discussing theoretical speedups and practical implementations on NISQ devices.',
    authors: [mockUsers[0], mockUsers[2]],
    doi: '10.1234/quantum.ml.2023.001',
    researchField: ResearchField.COMPUTER_SCIENCE,
    subFields: [],
    tags: ['Quantum Computing', 'Machine Learning', 'Survey', 'Quantum Advantage'],
    publicationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    versions: [
      {
        id: 'v1-paper-1',
        paperId: 'paper-1',
        versionNumber: 1,
        content: 'Full content of version 1',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      },
      {
        id: 'v2-paper-1',
        paperId: 'paper-1',
        versionNumber: 2,
        content: 'Full content of version 2 with revisions',
        changelog: 'Updated literature review and added new experimental results',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      }
    ],
    citations: 15,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
  {
    id: 'paper-2',
    title: 'CRISPR-Cas9 Off-target Prediction Using Deep Learning',
    abstract: 'Off-target effects remain a significant concern in CRISPR-Cas9 gene editing. This paper presents a novel deep learning approach to predict potential off-target sites with higher accuracy than existing methods. Our neural network model integrates sequence features, chromatin accessibility data, and structural information to achieve a 35% improvement in prediction accuracy compared to state-of-the-art tools.',
    authors: [mockUsers[1]],
    doi: '10.1234/bio.crispr.2023.002',
    researchField: ResearchField.BIOLOGY,
    subFields: [],
    tags: ['CRISPR', 'Deep Learning', 'Off-target Effects', 'Gene Editing', 'Bioinformatics'],
    publicationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    versions: [
      {
        id: 'v1-paper-2',
        paperId: 'paper-2',
        versionNumber: 1,
        content: 'Full content of version 1',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
      }
    ],
    citations: 8,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
  },
];

// Create mock token transactions
export const mockTokenTransactions: TokenTransaction[] = [
  {
    id: 'tx-1',
    from: 'system',
    to: mockUsers[0].id,
    amount: 500,
    type: TransactionType.CONTRIBUTION_REWARD,
    status: TransactionStatus.COMPLETED,
    signature: '5srwe7auv98n7wv89nawv89sdvnawv98',
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(), // 50 days ago
  },
  {
    id: 'tx-2',
    from: mockUsers[0].id,
    to: mockUsers[1].id,
    amount: 100,
    type: TransactionType.TRANSFER,
    status: TransactionStatus.COMPLETED,
    signature: '78asdg69s8d7g9as8dg7as98dgas98',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
  },
  {
    id: 'tx-3',
    from: 'system',
    to: mockUsers[0].id,
    amount: 50,
    type: TransactionType.DISCUSSION_TIP,
    status: TransactionStatus.COMPLETED,
    signature: 'asduhy6as7d6as7d6as87d687a6sd',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
  {
    id: 'tx-4',
    from: mockUsers[2].id,
    to: mockUsers[0].id,
    amount: 25,
    type: TransactionType.COMMENT_TIP,
    status: TransactionStatus.COMPLETED,
    signature: 'asd87ga98sdgas98dg7as98dg7',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: 'tx-5',
    from: mockUsers[0].id,
    to: 'system',
    amount: 10,
    type: TransactionType.PLATFORM_FEE,
    status: TransactionStatus.COMPLETED,
    signature: 'as8d7g6as87dg6as87dg68sa7dg',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

// Mock data service
export const mockDataService = {
  // Users
  getCurrentUser: () => mockUsers[0],
  getUsers: () => mockUsers,
  getUserById: (id: string) => mockUsers.find(user => user.id === id),
  
  // Discussions
  getDiscussions: ({ page = 1, limit = 10, field, searchQuery, tags }: { page?: number; limit?: number; field?: string; searchQuery?: string; tags?: string[] }) => {
    let filtered = [...mockDiscussions];
    
    // Filter by research field
    if (field) {
      filtered = filtered.filter(d => d.researchField === field);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(query) || 
        d.content.toLowerCase().includes(query)
      );
    }
    
    // Filter by tags
    if (tags && tags.length > 0) {
      filtered = filtered.filter(d => 
        tags.some(tag => d.tags.includes(tag))
      );
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedDiscussions = filtered.slice(start, end);
    
    return {
      discussions: paginatedDiscussions,
      count: filtered.length
    };
  },
  
  getDiscussionById: (id: string) => {
    const discussion = mockDiscussions.find(d => d.id === id);
    if (!discussion) return null;
    
    // Get comments for this discussion
    const comments = mockComments.filter(c => c.discussionId === id);
    
    return {
      ...discussion,
      comments
    };
  },
  
  createDiscussion: (data: { title: string; content: string; researchField: string; tags?: string[] }) => {
    const newDiscussion: Discussion = {
      id: `disc-${generateId()}`,
      title: data.title,
      content: data.content,
      author: mockUsers[0], // Current user
      researchField: data.researchField as ResearchField,
      subFields: [],
      tags: data.tags || [],
      likes: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to mock discussions
    mockDiscussions.push(newDiscussion);
    
    return newDiscussion;
  },
  
  // Comments
  getCommentsByDiscussionId: (discussionId: string) => 
    mockComments.filter(c => c.discussionId === discussionId),
  
  addComment: (discussionId: string, content: string, parentCommentId?: string) => {
    const newComment: Comment = {
      id: `comment-${generateId()}`,
      content,
      author: mockUsers[0], // Current user
      discussionId,
      parentCommentId,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to mock comments
    mockComments.push(newComment);
    
    // Update comment count on discussion
    const discussion = mockDiscussions.find(d => d.id === discussionId);
    if (discussion) {
      discussion.commentCount += 1;
    }
    
    return newComment;
  },
  
  // Papers
  getPapers: () => mockPapers,
  getPaperById: (id: string) => mockPapers.find(p => p.id === id),
  
  // Token transactions
  getTokenTransactions: (userId: string) => 
    mockTokenTransactions.filter(tx => tx.from === userId || tx.to === userId),
  
  recordTransaction: (transaction: { from: string; to: string; amount: number; type: TransactionType }) => {
    const newTransaction: TokenTransaction = {
      id: `tx-${generateId()}`,
      ...transaction,
      status: TransactionStatus.COMPLETED,
      signature: `sig-${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    
    // Add to mock transactions
    mockTokenTransactions.push(newTransaction);
    
    return newTransaction;
  },
}; 