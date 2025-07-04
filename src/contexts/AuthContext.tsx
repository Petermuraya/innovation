
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  userRole: string | null;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, password?: string, memberData?: any) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      setUserRole(null);
      return;
    }

    try {
      console.log('Checking admin status for user:', user.id);
      
      // Get all roles for the user
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setUserRole('member');
        return;
      }

      console.log('User roles found:', userRoles);

      if (!userRoles || userRoles.length === 0) {
        // User has no roles yet, default to member
        setIsAdmin(false);
        setUserRole('member');
        return;
      }

      // Find the highest role (prioritize admin roles)
      const adminRoles = ['super_admin', 'general_admin', 'community_admin', 'events_admin', 'projects_admin', 'finance_admin', 'content_admin', 'technical_admin', 'marketing_admin', 'chairman', 'vice_chairman'];
      const roles = userRoles.map(r => r.role);
      
      // Check if user has any admin role
      const hasAdminRole = roles.some(role => adminRoles.includes(role));
      
      if (hasAdminRole) {
        setIsAdmin(true);
        // Set the highest priority admin role
        const highestRole = roles.find(role => ['super_admin', 'chairman', 'vice_chairman'].includes(role)) ||
                           roles.find(role => adminRoles.includes(role)) ||
                           'member';
        setUserRole(highestRole);
        console.log('User is admin with role:', highestRole);
      } else {
        setIsAdmin(false);
        setUserRole('member');
        console.log('User is regular member');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setUserRole('member');
    }
  };

  const signIn = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Check your email for the magic link to sign in.');
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password?: string, memberData?: any) => {
    setLoading(true);
    try {
      const signUpData: any = { email };
      if (password) signUpData.password = password;
      if (memberData) signUpData.options = { data: memberData };
      
      const { error } = await supabase.auth.signUp(signUpData);
      if (error) throw error;
      alert('Check your email to verify your member account.');
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, userRole, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
