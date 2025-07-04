
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types/roles';

interface AuthContextType {
  member: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  memberRole: AppRole | null;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, password?: string, memberData?: any) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [member, setMember] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberRole, setMemberRole] = useState<AppRole | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setMember(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setMember(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user);
      } else {
        setIsAdmin(false);
        setMemberRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (member: User | null) => {
    if (!member) {
      setIsAdmin(false);
      setMemberRole(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Checking admin status for member:', member.id);
      
      // Get all roles for the member from user_roles table
      const { data: memberRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', member.id);

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setMemberRole('member');
        setLoading(false);
        return;
      }

      console.log('Member roles found:', memberRoles);

      if (!memberRoles || memberRoles.length === 0) {
        // Member has no roles yet, default to member
        setIsAdmin(false);
        setMemberRole('member');
        setLoading(false);
        return;
      }

      // Define admin roles in hierarchy order (highest to lowest)
      const adminRoles: AppRole[] = [
        'super_admin', 
        'chairman', 
        'vice_chairman',
        'general_admin', 
        'admin',
        'community_admin', 
        'events_admin', 
        'projects_admin', 
        'finance_admin', 
        'content_admin', 
        'technical_admin', 
        'marketing_admin'
      ];
      
      const roles = memberRoles.map(r => r.role as AppRole);
      
      // Check if member has any admin role
      const hasAdminRole = roles.some(role => adminRoles.includes(role));
      
      if (hasAdminRole) {
        setIsAdmin(true);
        // Set the highest priority admin role
        const highestRole = adminRoles.find(role => roles.includes(role)) || 'member';
        setMemberRole(highestRole);
        console.log('Member is admin with role:', highestRole);
      } else {
        setIsAdmin(false);
        setMemberRole('member');
        console.log('Member is regular member');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setMemberRole('member');
    } finally {
      setLoading(false);
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
    <AuthContext.Provider value={{ member, session, loading, isAdmin, memberRole, signIn, signUp, signOut }}>
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
