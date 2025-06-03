import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import MetaHead from '@/components/seo/MetaHead';
import Layout from '@/components/layout/Layout';

// Page imports
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Events from "./pages/Events";
import Blogs from "./pages/Blogs";
import Careers from "./pages/Careers";
import Community from "./pages/Community";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import AdminRegister from "./pages/AdminRegister";
import AdminRequestPending from "./pages/AdminRequestPending";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  console.log("App component rendering");
  
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <MetaHead />
              <Toaster />
              <Sonner />
              {/* Set basename to your repo name */}
              <BrowserRouter basename="/innovation">
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="about" element={<About />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="events" element={<Events />} />
                    <Route path="blogs" element={<Blogs />} />
                    <Route path="careers" element={<Careers />} />
                    <Route path="community" element={<Community />} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="admin-register" element={<AdminRegister />} />
                    <Route path="admin-request-pending" element={<AdminRequestPending />} />
                    <Route path="404" element={<NotFound />} />
                    {/* Redirect unknown routes to /404 */}
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
