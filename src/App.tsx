import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleGuard from '@/components/security/RoleGuard';
import Layout from '@/components/layout/Layout';

// Pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Careers from '@/pages/Careers';
import Projects from '@/pages/Projects';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Events from '@/pages/Events';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import CommunityDashboard from '@/pages/CommunityDashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Elections from '@/pages/Elections';
import Constitution from '@/pages/Constitution';
import Payments from '@/pages/Payments';

// Providers
import { NotificationProvider } from '@/components/notifications/NotificationProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/events" element={<Events />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                
                <Route path="/payments" element={<Payments />} />

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
                  path="/community-dashboard/:communityId"
                  element={
                    <ProtectedRoute>
                      <CommunityDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <RoleGuard requiredRole="admin">
                        <AdminDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                <Route path="/community/:communityId" element={<CommunityDashboard />} />
              </Routes>
            </Layout>
            <Toaster />
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
