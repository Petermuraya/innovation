
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardSwitcherIcon from './switcher/DashboardSwitcherIcon';
import DashboardSwitcherInfo from './switcher/DashboardSwitcherInfo';
import DashboardSwitcherToggle from './switcher/DashboardSwitcherToggle';
import DashboardSwitcherProgressBar from './switcher/DashboardSwitcherProgressBar';

interface DashboardSwitcherProps {
  currentView: 'admin' | 'user';
  onViewChange: (view: 'admin' | 'user') => void;
}

const DashboardSwitcher = ({ currentView, onViewChange }: DashboardSwitcherProps) => {
  const { isAdmin, userRole, loading } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  console.log('DashboardSwitcher - isAdmin:', isAdmin, 'userRole:', userRole, 'loading:', loading);

  if (loading) {
    console.log('DashboardSwitcher - still loading auth');
    return null;
  }

  if (!isAdmin || !userRole || userRole === 'member') {
    console.log('DashboardSwitcher - no admin access detected');
    return null;
  }

  console.log('DashboardSwitcher - rendering with role:', userRole);

  const handleToggle = async (checked: boolean) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onViewChange(checked ? 'admin' : 'user');
    setIsAnimating(false);
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      'super_admin': 'Super Admin',
      'general_admin': 'General Admin',
      'community_admin': 'Community Admin',
      'events_admin': 'Events Admin',
      'projects_admin': 'Projects Admin',
      'finance_admin': 'Finance Admin',
      'content_admin': 'Content Admin',
      'technical_admin': 'Technical Admin',
      'marketing_admin': 'Marketing Admin',
      'chairman': 'Chairman',
      'vice_chairman': 'Vice Chairman'
    };
    return roleNames[role] || role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const isHighRole = ['super_admin', 'chairman', 'vice_chairman'].includes(userRole);
  const roleDisplayName = getRoleDisplayName(userRole);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="mb-6 border-2 overflow-hidden relative">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: currentView === 'admin' 
              ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DashboardSwitcherIcon 
                currentView={currentView}
                isHighRole={isHighRole}
              />
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentView === 'admin' ? 'Admin Dashboard' : 'Member Dashboard'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentView === 'admin' 
                    ? `${roleDisplayName} - Administrative controls and management`
                    : 'Member view with personal dashboard and activities'
                  }
                </p>
              </div>
            </div>
            
            <DashboardSwitcherToggle 
              currentView={currentView}
              isAnimating={isAnimating}
              onToggle={handleToggle}
            />
          </div>
          
          <DashboardSwitcherProgressBar currentView={currentView} />
        </CardContent>
        
        {/* Loading overlay */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default DashboardSwitcher;
