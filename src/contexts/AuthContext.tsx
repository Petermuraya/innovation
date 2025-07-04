
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types/roles';

interface AuthContextType {
  member: User | null;
  user: User | null; // Add this for backward compatibility
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
      
      // Check if user_roles table exists and get roles
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

      // Define admin roles in hierarchy
      const adminRoles = [
        'super_admin',
        'chairman', 
        'vice_chairman',
        'general_admin',
        'admin',
        'finance_admin',
        'community_admin',
        'events_admin',
        'projects_admin',
        'content_admin',
        'technical_admin',
        'marketing_admin'
      ];

      const roles = memberRoles.map(r => r.role);
      const hasAdminRole = roles.some(role => adminRoles.includes(role));
      
      setIsAdmin(hasAdminRole);
      
      // Set the highest role
      const highestRole = adminRoles.find(role => roles.includes(role)) || 'member';
      setMemberRole(highestRole as AppRole);
      
      console.log('Admin status set:', { hasAdminRole, highestRole, roles });
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
      setMemberRole('member');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  };

  const signUp = async (email: string, password?: string, memberData?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: password || Math.random().toString(36),
      options: {
        data: memberData,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    member,
    user: member, // For backward compatibility
    session,
    loading,
    isAdmin,
    memberRole,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
