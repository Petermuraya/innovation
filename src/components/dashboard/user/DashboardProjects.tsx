
import UserProjectsManager from './projects/UserProjectsManager';

interface DashboardProjectsProps {
  projects: any[];
  onUpdate: () => void;
}

const DashboardProjects: React.FC<DashboardProjectsProps> = ({ projects, onUpdate }) => {
  return (
    <div className="space-y-6">
      <UserProjectsManager />
    </div>
  );
};

export default DashboardProjects;
