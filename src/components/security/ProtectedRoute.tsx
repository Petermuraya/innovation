
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requireApproval?: boolean;
}

const ProtectedRoute = ({ children, requireApproval = false }: ProtectedRouteProps) => {
  const { member, loading } = useAuth();
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [checkingApproval, setCheckingApproval] = useState(requireApproval);

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!member || !requireApproval) {
        setCheckingApproval(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('members')
          .select('registration_status')
          .eq('user_id', member.id)
          .single();

        if (error) {
          console.error('Error checking approval status:', error);
          setApprovalStatus('pending');
        } else {
          setApprovalStatus(data?.registration_status || 'pending');
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
        setApprovalStatus('pending');
      } finally {
        setCheckingApproval(false);
      }
    };

    checkApprovalStatus();
  }, [member, requireApproval]);

  if (loading || checkingApproval) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!member) {
    return <Navigate to="/login" replace />;
  }

  if (requireApproval && approvalStatus !== 'approved') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Account Pending Approval</h2>
          <p className="text-gray-600">Your account is pending approval. Please wait for admin approval.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
