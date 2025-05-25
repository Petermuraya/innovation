
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboardHeader = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-kic-gray">Admin Dashboard</h1>
        <p className="text-kic-gray/70">Manage KIC members, events, and activities</p>
      </div>
      <Button onClick={signOut} variant="outline">
        Sign Out
      </Button>
    </div>
  );
};

export default AdminDashboardHeader;
