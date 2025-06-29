
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from './user/DashboardHeader';
import DashboardStats from './user/DashboardStats';
import DashboardTabs from './user/DashboardTabs';
import DashboardAnimationWrapper from './DashboardAnimationWrapper';
import PaymentReminder from '@/components/payments/PaymentReminder';
import { useMemberData } from './user/hooks/useMemberData';
import { useUserStats } from './user/hooks/useUserStats';
import { useUserData } from './user/hooks/useUserData';

const UserDashboard = () => {
  const { user } = useAuth();
  const { memberData, refetchMemberData } = useMemberData();
  const { stats, refetchUserStats } = useUserStats();
  const { 
    notifications, 
    projects, 
    certificates, 
    upcomingEvents, 
    payments, 
    refetchUserData 
  } = useUserData();

  const handleDataUpdate = () => {
    refetchMemberData();
    refetchUserStats();
    refetchUserData();
  };

  return (
    <DashboardAnimationWrapper>
      <div className="container mx-auto p-4 sm:p-6">
        {/* Payment Reminders - Show at the top for approved members */}
        {memberData?.registration_status === 'approved' && (
          <div className="mb-6">
            <PaymentReminder />
          </div>
        )}
        
        {memberData && <DashboardHeader user={memberData} memberData={memberData} />}
        <DashboardStats 
          notifications={notifications}
          projects={projects}
          certificates={certificates}
          upcomingEvents={upcomingEvents}
        />

        <DashboardTabs
          memberData={memberData}
          notifications={notifications}
          upcomingEvents={upcomingEvents}
          projects={projects}
          certificates={certificates}
          payments={payments}
          onDataUpdate={handleDataUpdate}
        />
      </div>
    </DashboardAnimationWrapper>
  );
};

export default UserDashboard;
