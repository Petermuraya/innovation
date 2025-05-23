
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  memberData: any;
  user: any;
}

const DashboardHeader = ({ memberData, user }: DashboardHeaderProps) => {
  const { signOut } = useAuth();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-kic-gray">Welcome back, {memberData?.name || user?.email}</h1>
        <p className="text-kic-gray/70">Manage your KIC membership and activities</p>
      </div>
      <Button onClick={signOut} variant="outline">
        Sign Out
      </Button>
    </div>
  );
};

export default DashboardHeader;
