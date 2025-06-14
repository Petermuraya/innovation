
export interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  thumbnail_url: string | null;
  tech_tags: string[] | null;
  status: string;
  admin_notes: string | null;
  admin_feedback: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  user_id: string;
  is_featured: boolean;
  featured_by: string | null;
  featured_at: string | null;
  author_name?: string;
  reviewer_name?: string;
}

export interface ProjectsManagementProps {
  projects: Project[];
  updateProjectStatus: (projectId: string, status: string, feedback?: string) => Promise<void>;
}
