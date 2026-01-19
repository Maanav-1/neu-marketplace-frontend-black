import React from 'react'; // Added React import
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ReportManagement from '@/pages/admin/ReportManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

/**
 * ProtectedRoute Component
 * Prevents unauthorized access to specific routes.
 */
function ProtectedRoute({ 
  children, 
  adminOnly = false 
}: { 
  children: React.ReactNode; // Changed from JSX.Element to React.ReactNode
  adminOnly?: boolean; 
}) {
  const { user } = useAuthStore();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin route requested but user is not an admin, redirect to home
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // Wrapped in a fragment for better compatibility
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-blue-500/30">
        {/* Global Navigation */}
        <Navbar />
        
        {/* Global Verification Gate */}
        <VerificationBanner />
        
        {/* Main Content Area */}
        <main className="container mx-auto px-4 md:px-8 py-8 flex-1">
          <Routes>
            {/* Public Discovery Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/listings/:slug" element={<ListingDetail />} />
            
            {/* Auth & Security Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Authenticated User Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
            <Route path="/chat/:conversationId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            
            {/* Inventory Management */}
            <Route path="/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
            <Route path="/edit/:slug" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
            
            {/* Admin Management Routes (Gated) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute adminOnly>
                  <ReportManagement />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        {/* Global Footer */}
        <Footer />
        
        {/* Toast Notifications */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;