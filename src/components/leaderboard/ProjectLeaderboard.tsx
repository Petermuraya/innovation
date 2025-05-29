import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Award, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge,
  Button,
  Skeleton
} from '@/components/ui';

const ProjectLeaderboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('project_leaderboard')
        .select('*')
        .order('engagement_score', { ascending: false })
        .limit(10);

      if (supabaseError) throw supabaseError;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (index: number) => {
    switch(index) {
      case 0: return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 1: return 'bg-gradient-to-br from-gray-300 to-gray-400';
      case 2: return 'bg-gradient-to-br from-amber-500 to-amber-700';
      default: return 'bg-primary';
    }
  };

  return (
    <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <CardTitle className="flex items-center gap-3 text-white">
          <Award className="h-6 w-6" />
          <span className="text-xl font-bold">Top Projects Leaderboard</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {error ? (
          <div className="p-6 text-center text-red-500">
            <p>{error}</p>
            <Button 
              variant="ghost" 
              className="mt-2 text-indigo-600"
              onClick={fetchLeaderboard}
            >
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 w-full">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <motion.ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {projects.map((project, index) => (
                <motion.li
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <Link 
                    to={`/projects/${project.id}`}
                    className="block p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${getRankColor(index)} text-white font-bold`}>
                          {index + 1}
                        </div>
                        
                        <div className="min-w-0">
                          <h4 className="font-semibold text-lg truncate">
                            {project.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            by {project.author_name || 'Anonymous'}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tech_tags?.slice(0, 3).map((tag: string, idx: number) => (
                              <Badge 
                                key={idx} 
                                variant="outline"
                                className="text-xs px-2 py-0.5 rounded-full border-gray-200 dark:border-gray-700"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>{project.likes_count}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            <span>{project.comments_count}</span>
                          </div>
                          
                          <div className="hidden md:block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium">
                            Score: {project.engagement_score}
                          </div>
                        </div>
                        
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </CardContent>
      
      {!loading && !error && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <Button 
            variant="ghost" 
            className="text-indigo-600 dark:text-indigo-400"
            asChild
          >
            <Link to="/projects">
              View all projects
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProjectLeaderboard;