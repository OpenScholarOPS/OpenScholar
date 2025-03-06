import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import PapersPage from '@/pages/papers/PapersPage';
import PaperDetailPage from '@/pages/papers/PaperDetailPage';
import UploadPaperPage from '@/pages/papers/UploadPaperPage';
import PaperReviewPage from '@/pages/papers/PaperReviewPage';
import DiscussionsPage from '@/pages/discussions/DiscussionsPage';
import DiscussionDetailPage from '@/pages/discussions/DiscussionDetailPage';
import CreateDiscussionPage from '@/pages/discussions/CreateDiscussionPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';
import SearchPage from '@/pages/SearchPage';
import AdvancedSearchPage from '@/pages/AdvancedSearchPage';
import MyReviewsPage from '@/pages/reviews/MyReviewsPage';
import ReviewInvitationsPage from '@/pages/reviews/ReviewInvitationsPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import WalletPage from '@/pages/wallet/WalletPage';
import GovernancePage from '@/pages/governance/GovernancePage';
import ProposalDetailPage from '@/pages/governance/ProposalDetailPage';
import CreateProposalPage from '@/pages/governance/CreateProposalPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/papers" element={<PapersPage />} />
      <Route path="/papers/upload" element={<UploadPaperPage />} />
      <Route path="/papers/:id" element={<PaperDetailPage />} />
      <Route path="/papers/:paperId/reviews" element={<PaperReviewPage />} />
      <Route path="/papers/:paperId/reviews/:reviewId" element={<PaperReviewPage />} />
      <Route path="/papers/:paperId/reviews/:reviewId/edit" element={<PaperReviewPage />} />
      <Route path="/my-reviews" element={<MyReviewsPage />} />
      <Route path="/review-invitations" element={<ReviewInvitationsPage />} />
      <Route path="/discussions" element={<DiscussionsPage />} />
      <Route path="/discussions/create" element={<CreateDiscussionPage />} />
      <Route path="/discussions/:id" element={<DiscussionDetailPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/advanced-search" element={<AdvancedSearchPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/governance" element={<GovernancePage />} />
      <Route path="/governance/proposals/:id" element={<ProposalDetailPage />} />
      <Route path="/governance/create-proposal" element={<CreateProposalPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes; 