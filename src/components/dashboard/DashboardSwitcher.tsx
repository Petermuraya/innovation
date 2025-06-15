
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Shield, User, Settings, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardSwitcherProps {
  currentView: 'admin' | 'user';
  onViewChange: (view: 'admin' | 'user') => void;
}

const DashboardSwitcher = ({ currentView, onViewChange }: DashboardSwitcherProps) => {
  const { isAdmin } = useAuth();
  const { roleInfo, loading } = useRolePermissions();
  const [isAnimating, setIsAnimating] = useState(false);

  if (loading || !isAdmin || !roleInfo) {
    return null;
  }

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

  const isHighRole = ['super_admin', 'chairman', 'vice_chairman'].includes(roleInfo.assignedRole);

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
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <AnimatePresence mode="wait">
                  {currentView === 'admin' ? (
                    <motion.div
                      key="admin-icon"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.4, ease: "backInOut" }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                    >
                      {isHighRole ? (
                        <Crown className="w-6 h-6 text-white" />
                      ) : (
                        <Shield className="w-6 h-6 text-white" />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="user-icon"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.4, ease: "backInOut" }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg"
                    >
                      <User className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-2 h-2 text-yellow-800" />
                </motion.div>
              </motion.div>
              
              <div className="space-y-1">
                <motion.h3 
                  className="font-bold text-xl"
                  animate={{ 
                    color: currentView === 'admin' ? '#3b82f6' : '#10b981' 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentView}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentView === 'admin' ? 'Admin Dashboard' : 'Member Dashboard'}
                    </motion.span>
                  </AnimatePresence>
                </motion.h3>
                
                <motion.p 
                  className="text-sm font-medium"
                  animate={{ 
                    color: currentView === 'admin' ? '#6366f1' : '#059669' 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${currentView}-${roleInfo.assignedRole}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentView === 'admin' 
                        ? `${getRoleDisplayName(roleInfo.assignedRole)} • Administrative Access`
                        : 'Standard Member • Club Participation'
                      }
                    </motion.span>
                  </AnimatePresence>
                </motion.p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <motion.span 
                  className="text-sm font-semibold"
                  animate={{ 
                    color: currentView === 'user' ? '#10b981' : '#6b7280',
                    scale: currentView === 'user' ? 1.05 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Member
                </motion.span>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Switch
                    checked={currentView === 'admin'}
                    onCheckedChange={handleToggle}
                    disabled={isAnimating}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600 data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-green-500 data-[state=unchecked]:to-emerald-600"
                  />
                </motion.div>
                
                <motion.span 
                  className="text-sm font-semibold"
                  animate={{ 
                    color: currentView === 'admin' ? '#3b82f6' : '#6b7280',
                    scale: currentView === 'admin' ? 1.05 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Admin
                </motion.span>
              </div>
              
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="mt-4 flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="h-1 rounded-full flex-1"
              animate={{
                background: currentView === 'admin'
                  ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                  : 'linear-gradient(90deg, #10b981, #059669)'
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.span 
              className="text-xs font-medium"
              animate={{ 
                color: currentView === 'admin' ? '#6366f1' : '#059669' 
              }}
            >
              {currentView === 'admin' ? 'Administrative Mode' : 'Member Experience'}
            </motion.span>
          </motion.div>
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
