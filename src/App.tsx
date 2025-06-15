
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
import Blogs from '@/pages/Blogs';
import Events from '@/pages/Events';
import Careers from '@/pages/Careers';
import CommunityDashboardRouter from '@/components/dashboard/community/CommunityDashboardRouter';
import Elections from '@/pages/Elections';
import NotificationTesterPage from '@/pages/NotificationTesterPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/events" element={<Events />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/community/:communityId" element={<CommunityDashboardRouter />} />
                <Route path="/community-dashboard/:communityId" element={<CommunityDashboardRouter />} />
                <Route path="/elections" element={<Elections />} />
                <Route path="/test-notifications" element={<NotificationTesterPage />} />
              </Routes>
            </Layout>
            <Toaster />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
