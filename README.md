# OpenScholar

A decentralized academic research collaboration platform built on the Solana blockchain.

<div align="center">
  <img src="./src/assets/logo.svg" alt="OpenScholar Logo" width="300" height="300">
  
  <p>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/version-0.1.0-brightgreen.svg" alt="Version">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/react-18.x-61DAFB.svg" alt="React">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/solana-1.x-14F195.svg" alt="Solana">
    </a>
  </p>
</div>

## Project Overview

OpenScholar is a revolutionary open-access digital research platform designed to transform how researchers collaborate, share, and discuss their work. By eliminating traditional publishing barriers, the platform democratizes research and incentivizes high-quality contributions through a token-based system ($OPS tokens).

The platform supports the entire research lifecycle - from idea conception and collaboration to peer review, publication, and community discussion. OpenScholar creates a transparent, efficient ecosystem where quality research is rewarded, and knowledge is accessible to all.

### Core Features

- **Research Fields Organization**: Content is organized into eight major fields (Computer Science, Biology, Physics, Chemistry, Mathematics, Medicine, Economics, and Psychology), each with specialized features.
- **Discussion System**: Researchers can create and participate in academic discussions, organized by field and topic.
- **User System**: Authentication via Supabase, user profiles with academic credentials, and a reputation system based on contributions.
- **Wallet Integration**: Phantom wallet integration for managing $OPS tokens on the Solana blockchain.
- **Paper Management**: Share and discuss research papers with DOI integration and version control.
- **Peer Review System**: Transparent and incentivized peer review process with token rewards.
- **Governance System**: Community-driven platform governance through proposal and voting mechanisms.
- **Data Visualization**: Advanced research metrics and data visualization tools.

## Implementation Status

The current implementation includes:

- ✅ User authentication (sign up/sign in)
- ✅ User profile management
- ✅ Discussion system (create, view, comment)
- ✅ Research paper system (view, version control)
- ✅ Wallet integration with Solana
- ✅ Token transaction history
- ✅ Mock data service for development
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Advanced search functionality
- ✅ Peer review workflow
- ✅ Data visualization dashboard
- ✅ Governance voting system
- ✅ Citation tracking and management

In progress:
- 🔄 LaTeX equation rendering
- 🔄 External DOI integration
- 🔄 AI-assisted paper analysis
- 🔄 Cross-platform API integration

Future enhancements planned:
- ⬜ Real-time collaborative editing
- ⬜ NFT certification for published papers
- ⬜ Enhanced blockchain verification features
- ⬜ Mobile app development
- ⬜ Integration with existing research databases
- ⬜ Advanced analytics for research impact

## Logo Symbolism

The OpenScholar logo represents the fusion of academic knowledge and decentralized technology:

- **Flask**: Symbolizes scientific research and experimentation
- **Network**: Represents the decentralized nature of the platform and knowledge connections
- **Chat Bubble**: Illustrates the collaborative discussion aspects of academic research
- **Blue Gradient**: Signifies trust, knowledge, and the fluid nature of innovation

The logo is available in three variants:
- Full logo (`logo.svg`): Complete brand identity with all elements
- Simple logo (`logo-simple.svg`): Streamlined version for medium-sized applications
- Favicon (`favicon.svg`): Minimalist version for browser tabs and small UI elements

## Technology Stack

- **Frontend**: React with TypeScript, Next.js, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Supabase for authentication, database management, real-time updates, and row-level security
- **Blockchain**: Solana blockchain for $OPS tokens, with Phantom wallet integration
- **Data Visualization**: Chart.js, react-chartjs-2
- **Date Handling**: date-fns, react-datepicker

## Development Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- A Supabase account
- Phantom wallet (for Solana blockchain integration)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/open-scholar.git
   cd open-scholar
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SOLANA_RPC_URL=your_solana_rpc_url
   NEXT_PUBLIC_OPS_TOKEN_MINT=your_ops_token_mint_address
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

## Project Structure

```
/src
  /assets        # Static assets
  /components    # Reusable UI components
    /ui          # Generic UI components like Button, Card, Input
    /layouts     # Layout components like Navbar, Sidebar, Footer
    /discussion  # Discussion-specific components
    /papers      # Paper-related components
    /charts      # Data visualization components
    /governance  # Governance system components
  /contexts      # React context providers (Auth, Wallet)
  /hooks         # Custom React hooks
  /pages         # Page components
    /auth        # Authentication pages (SignIn, SignUp)
    /dashboard   # User dashboard with statistics and visualizations
    /discussions # Discussion pages (list, detail, create)
    /papers      # Paper pages (list, detail, review)
    /profile     # Profile pages and settings
    /governance  # Governance pages (proposals, voting)
    /wallet      # Wallet and transaction pages
    /advanced-search # Advanced search functionality
  /services      # Service integrations (Supabase, Solana, Mock data)
  /types         # TypeScript type definitions
  /utils         # Utility functions
  /data          # Mock data for development
```

## Database Schema

For the Supabase implementation, the following tables are required:

- **users**: Extended user profiles beyond auth.users
- **discussions**: Research discussions with fields for different research areas
- **comments**: Hierarchical comments on discussions
- **papers**: Research papers with versioning support
- **paper_versions**: Version history for papers
- **peer_reviews**: Peer review records and evaluations
- **review_invitations**: Peer review invitation management
- **review_rounds**: Management of review rounds for papers
- **governance_proposals**: Platform governance proposals
- **governance_votes**: Votes on governance proposals
- **likes**: Tracks likes on discussions and comments
- **tags**: Tag system for discussions and papers
- **transactions**: Records of token transactions
- **staking_positions**: Token staking records

## Peer Review System

OpenScholar implements a transparent and tokenized peer review system:

- **Double-blind peer review**: Protecting reviewer and author identities
- **Token incentives**: Rewards for quality and timely reviews
- **Reputation building**: Reviewer reputation based on review quality
- **Review rounds**: Support for multiple rounds of review
- **Review invitation system**: Editorial control over reviewer selection
- **Transparent metrics**: Clear metrics for review process

## Governance System

The platform is governed through a decentralized mechanism:

- **Proposal types**:
  - Research grants
  - Platform upgrades
  - Parameter changes
  - Community fund allocations
- **Voting mechanisms**: Token-weighted voting with quorum requirements
- **Execution process**: Automated execution of passed proposals
- **Treasury management**: Community-controlled funds for development

## Token Economics

The $OPS token is central to the OpenScholar ecosystem, with the following distribution:

- **Community Rewards (40%)**: Incentivizing contributions
  - Peer review rewards
  - Quality publication rewards
  - Discussion participation
  - Governance participation
  
- **Platform Development (20%)**: Supporting ongoing development
  - Technical enhancements
  - UI/UX improvements
  - Security audits
  
- **Fair Launch (15%)**: Initial distribution
  - Community airdrops
  - Academic institution allocations
  
- **Academic Grants (10%)**: Supporting research
  - Field-specific grants
  - Innovative methodology grants
  - Replication study grants
  
- **Protocol Treasury (10%)**: Long-term sustainability
  - Emergency funds
  - Strategic initiatives
  
- **Ecosystem Development (5%)**: Partnerships and integrations
  - Academic partnerships
  - Technical integrations
  - Cross-chain initiatives

## Staking and Rewards

- **Staking mechanisms**: Lock tokens to earn additional rewards
- **Governance power**: Staked tokens provide enhanced voting power
- **Reviewer rewards**: Earn tokens for completing quality reviews
- **Contribution rewards**: Token rewards for valuable platform contributions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style Guidelines

- Follow TypeScript best practices
- Use functional components with hooks for React
- Follow the project's component structure
- Write tests for new features
- Ensure responsive design
- Support dark mode

## Roadmap

### 2022-2024 Achievements
- ✅ Core platform architecture and design
- ✅ Complete user authentication and profile management
- ✅ Discussion and research paper systems
- ✅ Solana blockchain wallet integration
- ✅ Peer review workflow implementation
- ✅ Governance voting system
- ✅ Advanced search and data visualization
- ✅ Dark mode and responsive design

### Q1 2025 (Current)
- LaTeX equation rendering
- External DOI integration
- AI-assisted paper analysis
- Enhanced blockchain features

### Q2 2025 (Planned)
- Mobile app development
- Real-time collaborative editing
- NFT certification for published papers
- API integrations with research databases

### Q3 2025 (Upcoming)
- Advanced analytics platform
- Integration with academic institutions
- Multi-language support
- Extended mobile capabilities

### Q4 2025 (Upcoming)
- Cross-chain interoperability
- Enhanced governance mechanisms
- Automated research grants distribution
- Publication impact metrics

### 2026 Vision
- Decentralized academic publishing revolution
- Global research collaboration network
- AI-driven research recommendations
- Complete academic lifecycle support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Solana ecosystem for providing the blockchain infrastructure
- Supabase for the backend services
- The academic community for inspiring this project
- All contributors who have helped shape OpenScholar 