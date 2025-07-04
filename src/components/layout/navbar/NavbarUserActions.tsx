
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const NavbarUserActions = () => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="hidden lg:flex items-center space-x-3 ml-6">
      {member ? (
        <div className="flex items-center space-x-3">
          <Link to="/dashboard">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2 text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700 rounded-lg border border-transparent hover:border-kic-green-200 transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            </motion.div>
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center space-x-2 border-kic-green-200 hover:bg-kic-green-50 hover:border-kic-green-300 hover:text-kic-green-700 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </motion.div>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <Link to="/login">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700 rounded-lg border border-transparent hover:border-kic-green-200 transition-all duration-300"
              >
                Sign In
              </Button>
            </motion.div>
          </Link>
          <Link to="/register">
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-kic-green-500 to-kic-green-600 hover:from-kic-green-600 hover:to-kic-green-700 shadow-lg hover:shadow-xl shadow-kic-green-200 rounded-lg text-white font-semibold transition-all duration-300"
              >
                Join Now
              </Button>
            </motion.div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavbarUserActions;
