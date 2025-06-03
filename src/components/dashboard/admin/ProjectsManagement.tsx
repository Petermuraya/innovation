
interface Project {
  id: string;
  title: string;
  status: string;
  members?: {
    name: string;
  };
}

interface ProjectsManagementProps {
  projects: Project[];
  updateProjectStatus: (projectId: string, status: string) => Promise<void>;
}

const ProjectsManagement = ({ projects, updateProjectStatus }: ProjectsManagementProps) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Projects Management</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{project.members?.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${project.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {project.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {project.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateProjectStatus(project.id, 'approved')}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateProjectStatus(project.id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProjectsManagement;
