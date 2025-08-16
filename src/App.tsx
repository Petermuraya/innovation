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
import Blogs from '@/pages/Blog';
import Events from '@/pages/Events';
import Careers from '@/pages/Careers';
import CommunityDashboardRouter from '@/components/dashboard/community/CommunityDashboardRouter';
import Elections from '@/pages/Elections';
import NotificationTesterPage from '@/pages/NotificationTesterPage';
import Payments from '@/pages/Payments';
import ProtectedRoute from '@/components/security/ProtectedRoute';
import NotFound from '@/pages/NotFound';

import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import { Toaster } from '@/components/ui/toaster';

import './App.css';

// React Query client instance
const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            {/* Router with explicit basename to match vite.config.ts base */}
            <Router basename="/innovation/">
              <Layout>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/blog" element={<Blogs />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/careers" element={<Careers />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute requireApproval={false}>
                        <Dashboard />
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
                      <ProtectedRoute requireApproval={false}>
                        <NotificationTesterPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>

              {/* Global toast notifications */}
              <Toaster />
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;