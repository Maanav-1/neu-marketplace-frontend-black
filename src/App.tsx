import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Footer from './components/Footer';
import VerificationBanner from '@/components/VerificationBanner';
import { Toaster } from '@/components/ui/toaster';

// Page Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateListing from '@/pages/CreateListing';
import EditListing from '@/pages/EditListing';
import ListingDetail from '@/pages/ListingDetail';
import Inbox from '@/pages/Inbox';
import Chat from '@/pages/Chat';
import Profile from '@/pages/Profile';
import MyListings from '@/pages/MyListings';
import SavedListings from '@/pages/SavedListings';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ReportManagement from '@/pages/admin/ReportManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OAuthCallback from './pages/OAuthCallback';

function ProtectedRoute({
  children,
  adminOnly = false
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col bg-white text-gray-900 ${isHomePage ? 'overflow-hidden' : ''}`}>
      <Navbar />
      <VerificationBanner />
      {isHomePage ? (
        // Home page has its own layout with fixed sidebar
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      ) : (
        // Other pages get standard layout with footer
        <>
          <main className="flex-1 px-4 lg:px-8 py-6">
            <Routes>
              <Route path="/listings/:slug" element={<ListingDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><SavedListings /></ProtectedRoute>} />
              <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
              <Route path="/chat/:conversationId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
              <Route path="/listings/:slug/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute adminOnly><ReportManagement /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;