
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  github_url: string;
  thumbnail_url: string | null;
  tech_tags: string[] | null;
  author_name: string | null;
  created_at: string;
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_projects_home')
        .select('*');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white -mt-20 relative z-10">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="font-bold mb-2">Featured Projects</h2>
              <p className="text-gray-600">Explore innovative projects by our members</p>
            </div>
            <Button asChild className="mt-4 sm:mt-0">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white -mt-20 relative z-10">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="font-bold mb-2">Featured Projects</h2>
            <p className="text-gray-600">Explore innovative projects by our members</p>
          </div>
          <Button asChild className="mt-4 sm:mt-0">
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No featured projects available at the moment.</p>
            <Button asChild>
              <Link to="/projects">Browse All Projects</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="card-hover overflow-hidden transform transition-all duration-300 hover:scale-105">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={project.thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?fit=crop&w=600&h=350"} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription>By {project.author_name || 'Anonymous'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  {project.tech_tags && project.tech_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tech_tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="secondary">{tag}</Badge>
                      ))}
                      {project.tech_tags.length > 3 && (
                        <Badge variant="outline">+{project.tech_tags.length - 3} more</Badge>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link 
                    to={`/projects`}
                    className="text-primary hover:underline font-medium"
                  >
                    View Details
                  </Link>
                  {project.github_url && (
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
