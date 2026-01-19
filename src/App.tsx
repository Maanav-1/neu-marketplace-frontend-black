import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VerificationBanner from '@/components/VerificationBanner';
import { Toaster } from '@/components/ui/toaster';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      {/* The 'flex-col' and 'min-h-screen' classes on the outer div, 
        combined with 'flex-1' on the main tag, ensure the Footer stays 
        at the bottom of the page even on short screens.
      */}
      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-blue-500/30">
        
        {/* Global Navigation Bar */}
        <Navbar />
        
        {/* Global Verification Gate for Husky accounts */}
        <VerificationBanner />
        
        {/* Main Content Area */}
        <main className="container mx-auto px-4 py-8 flex-1">
          <Routes>
            {/* Discover & Public Discovery Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/listings/:slug" element={<ListingDetail />} />
            
            {/* Authentication & Security Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Authenticated Account & Messaging Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/chat/:conversationId" element={<Chat />} />
            
            {/* Inventory Management Routes */}
            <Route path="/create" element={<CreateListing />} />
            <Route path="/edit/:slug" element={<EditListing />} />
            
            {/* Admin Management Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Routes>
        </main>
        
        {/* Global Footer with Credits and Disclaimer */}
        <Footer />
        
        {/* Global Toast Notification System */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;