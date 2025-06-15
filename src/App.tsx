
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import Leaderboard from '@/pages/Leaderboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Blogs from '@/pages/Blogs';
import Events from '@/pages/Events';
import Careers from '@/pages/Careers';
import CommunityDashboardRouter from '@/components/dashboard/community/CommunityDashboardRouter';
import Elections from '@/pages/Elections';
import NotificationTesterPage from '@/pages/NotificationTesterPage';
import Payments from '@/pages/Payments';
import ProtectedRoute from '@/components/security/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Layout>
                <Routes>
                  {/* Public routes - accessible without authentication */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes - require authentication */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute requireApproval={false}>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/projects" 
                    element={
                      <ProtectedRoute requireApproval={true}>
                        <Projects />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/leaderboard" 
                    element={
                      <ProtectedRoute requireApproval={true}>
                        <Leaderboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/blogs" 
                    element={
                      <ProtectedRoute requireApproval={true}>
                        <Blogs />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/events" 
                    element={
                      <ProtectedRoute requireApproval={true}>
                        <Events />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/careers" 
                    element={
                      <ProtectedRoute requireApproval={true}>
                        <Careers />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/elections" 
                    element={
                      <ProtectedRoute requireApproval={true}>
                        <Elections />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/payments" 
                    element={
                      <ProtectedRoute requireApproval={false}>
                        <Payments />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/community/:communityId" 
                    element={
                      <ProtectedRoute requireApproval={true}>
                        <CommunityDashboardRouter />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/community-dashboard/:communityId" 
                    element={
                      <ProtectedRoute requireApproval={true}>
                        <CommunityDashboardRouter />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/test-notifications" 
                    element={
                      <ProtectedRoute requireApproval={false} requiredRole="super_admin">
                        <NotificationTesterPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Layout>
              <Toaster />
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
