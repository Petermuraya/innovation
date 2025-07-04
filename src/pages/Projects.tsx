
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Code } from 'lucide-react';

const Projects = () => {
  const featuredProjects = [
    {
      id: 1,
      title: "Smart Campus System",
      description: "An integrated IoT solution for campus management including attendance tracking, resource optimization, and security monitoring.",
      technologies: ["React", "Node.js", "MongoDB", "IoT"],
      status: "In Development",
      githubUrl: "#",
      liveUrl: "#"
    },
    {
      id: 2,
      title: "AI Study Assistant",
      description: "Machine learning powered study companion that helps students with personalized learning recommendations and progress tracking.",
      technologies: ["Python", "TensorFlow", "FastAPI", "React"],
      status: "Completed",
      githubUrl: "#",
      liveUrl: "#"
    },
    {
      id: 3,
      title: "Community Health Tracker",
      description: "Mobile application for tracking and managing community health metrics with data visualization and reporting features.",
      technologies: ["React Native", "Firebase", "Chart.js"],
      status: "Beta Testing",
      githubUrl: "#",
      liveUrl: "#"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-kic-lightGray py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-kic-gray mb-8 text-center">
              Our Projects
            </h1>
            
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Explore the innovative projects created by our club members. From web applications 
              to mobile apps and IoT solutions, our projects showcase the creativity and technical 
              skills of our community.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <a
                        href={project.githubUrl}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                      <a
                        href={project.liveUrl}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-6 h-6" />
                  Submit Your Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Have an innovative project to showcase? Join our club and submit your projects 
                  to be featured on our platform and get recognition for your work.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Requirements:</strong> All projects must include proper documentation, 
                  source code, and demonstrate practical application or innovative approach.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
