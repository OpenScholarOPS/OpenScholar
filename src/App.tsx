import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Loading component
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy-loaded pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const SignInPage = lazy(() => import('./pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'));
const DiscussionsPage = lazy(() => import('./pages/discussions/DiscussionsPage'));
const DiscussionDetailPage = lazy(() => import('./pages/discussions/DiscussionDetailPage'));
const CreateDiscussionPage = lazy(() => import('./pages/discussions/CreateDiscussionPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const WalletPage = lazy(() => import('./pages/wallet/WalletPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="discussions" element={<DiscussionsPage />} />
          <Route path="discussions/:id" element={<DiscussionDetailPage />} />
          
          {/* Protected routes */}
          <Route path="discussions/create" element={
            <ProtectedRoute>
              <CreateDiscussionPage />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="wallet" element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
