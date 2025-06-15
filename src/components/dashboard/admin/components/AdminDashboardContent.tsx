
import UserManagementTabs from './UserManagementTabs';
import MemberManagementTabs from './MemberManagementTabs';
import ProjectEventTabs from './ProjectEventTabs';
import FinancialManagementTabs from './FinancialManagementTabs';
import ContentManagementTabs from './ContentManagementTabs';
import SystemManagementTabs from './SystemManagementTabs';

interface AdminDashboardContentProps {
  canManageUsers: boolean;
}

const AdminDashboardContent = ({ canManageUsers }: AdminDashboardContentProps) => {
  return (
    <div className="p-4 sm:p-6">
      <UserManagementTabs canManageUsers={canManageUsers} />
      <MemberManagementTabs />
      <ProjectEventTabs />
      <FinancialManagementTabs />
      <ContentManagementTabs />
      <SystemManagementTabs />
    </div>
  );
};

export default AdminDashboardContent;
