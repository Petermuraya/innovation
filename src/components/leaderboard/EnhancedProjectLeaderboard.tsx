
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code2, Heart, MessageCircle, Star, Github, ExternalLink, Eye, Award, Filter, Flame, Zap, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectRank {
  id: string;
  title: string;
  description: string;
  author_name: string;
  github_url: string | null;
  thumbnail_url: string | null;
  tech_tags: string[];
  likes_count: number;
  comments_count: number;
  engagement_score: number;
  status: string;
}

interface ProjectLeaderboardProps {
  searchTerm?: string;
  filter?: string;
  timeFilter?: string;
}

const EnhancedProjectLeaderboard = ({ searchTerm = '', filter = 'all', timeFilter = 'all' }: ProjectLeaderboardProps) => {
  const [projects, setProjects] = useState<ProjectRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(10);
  const [sortBy, setSortBy] = useState<'engagement' | 'likes' | 'recent'>('engagement');

  useEffect(() => {
    fetchProjects();
  }, [sortBy]);

  const fetchProjects = async () => {
    try {
      let orderBy = 'engagement_score';
      if (sortBy === 'likes') orderBy = 'likes_count';
      if (sortBy === 'recent') orderBy = 'created_at';

      const { data, error } = await supabase
        .from('project_leaderboard')
        .select('*')
        .eq('status', 'approved')
        .order(orderBy, { ascending: false })
        .limit(50);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching project leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tech_tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'featured' && project.engagement_score > 100) ||
                         (filter === 'popular' && project.likes_count > 10);
    
    return matchesSearch && matchesFilter;
  }).slice(0, displayCount);

  const getProjectBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-200 border-0 hover:shadow-xl transition-all duration-300 animate-pulse-soft';
      case 1:
        return 'bg-gradient-to-r from-slate-300 via-gray-400 to-slate-500 text-white shadow-lg shadow-slate-200 border-0 hover:shadow-xl transition-all duration-300';
      case 2:
        return 'bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-200 border-0 hover:shadow-xl transition-all duration-300';
      default:
        return index < 10 
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-200 border-0 hover:shadow-lg transition-all duration-200' 
          : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm border-0 hover:shadow-md transition-all duration-200';
    }
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 100) return { 
      label: 'Exceptional', 
      gradient: 'from-emerald-500 to-green-600', 
      bg: 'bg-gradient-to-r from-emerald-100 to-green-100',
      icon: Flame
    };
    if (score >= 50) return { 
      label: 'High', 
      gradient: 'from-blue-500 to-cyan-600', 
      bg: 'bg-gradient-to-r from-blue-100 to-cyan-100',
      icon: TrendingUp
    };
    if (score >= 20) return { 
      label: 'Good', 
      gradient: 'from-amber-500 to-yellow-600', 
      bg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
      icon: Zap
    };
    return { 
      label: 'Growing', 
      gradient: 'from-gray-500 to-slate-600', 
      bg: 'bg-gradient-to-r from-gray-100 to-slate-100',
      icon: Star
    };
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-blue-500" />
            <span>Enhanced Project Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl overflow-hidden bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold">Enhanced Project Leaderboard</span>
            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-3 py-1">
              <Star className="w-3 h-3 mr-1" />
              Innovation Hub
            </Badge>
          </CardTitle>
          
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex bg-white/90 rounded-lg border border-gray-300 shadow-sm backdrop-blur-sm">
              {[
                { key: 'engagement', label: 'Top Rated' },
                { key: 'likes', label: 'Most Liked' },
                { key: 'recent', label: 'Latest' }
              ].map((option) => (
                <Button
                  key={option.key}
                  variant={sortBy === option.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy(option.key as typeof sortBy)}
                  className={`rounded-none first:rounded-l-lg last:rounded-r-lg text-xs transition-all duration-200 ${
                    sortBy === option.key 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg' 
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          {filteredProjects.map((project, index) => {
            const engagement = getEngagementLevel(project.engagement_score);
            const EngagementIcon = engagement.icon;
            
            return (
              <div
                key={project.id}
                className={`border-b border-gray-100 p-6 transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50/30 ${
                  index < 3 ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${getProjectBadgeColor(index)} font-bold min-w-[60px] flex justify-center px-4 py-2 transform hover:scale-105`}>
                        #{index + 1}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {index < 3 && <Award className="w-5 h-5 text-amber-500" />}
                        <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      </div>
                      <Badge className={`${engagement.bg} border-0 shadow-sm hover:shadow-md transition-all duration-200 px-3 py-1`}>
                        <EngagementIcon className="w-3 h-3 mr-1" />
                        <span className={`font-medium bg-gradient-to-r ${engagement.gradient} bg-clip-text text-transparent`}>
                          {engagement.label}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">by {project.author_name}</p>
                    <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                  </div>
                  
                  {project.thumbnail_url && (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden ml-6 shadow-lg ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_tags?.slice(0, 6).map((tag, tagIndex) => (
                    <Badge key={tagIndex} className="text-xs bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200 hover:bg-gradient-to-r hover:from-slate-200 hover:to-gray-200 transition-all duration-200 px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                  {project.tech_tags?.length > 6 && (
                    <Badge className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200 hover:bg-gradient-to-r hover:from-blue-200 hover:to-cyan-200 transition-all duration-200 px-3 py-1">
                      +{project.tech_tags.length - 6} more
                    </Badge>
                  )}
                </div>

                {/* Stats and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-gradient-to-r from-red-400 to-pink-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-3 py-2">
                      <Heart className="w-4 h-4 mr-2" />
                      <span className="font-semibold">{project.likes_count}</span>
                    </Badge>
                    <Badge className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-3 py-2">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span className="font-semibold">{project.comments_count}</span>
                    </Badge>
                    <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-3 py-2">
                      <Star className="w-4 h-4 mr-2" />
                      <span className="font-semibold">{project.engagement_score} pts</span>
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    {project.github_url && (
                      <Button variant="outline" size="sm" asChild className="hover:bg-gray-100 border-gray-300 hover:border-gray-400 transition-all duration-200">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="hover:bg-blue-50 border-blue-300 text-blue-600 hover:border-blue-400 transition-all duration-200">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {filteredProjects.length < projects.length && (
          <div className="p-4 text-center border-t border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50/30">
            <Button 
              variant="outline" 
              onClick={() => setDisplayCount(prev => prev + 10)}
              className="bg-white/90 backdrop-blur-sm hover:bg-purple-50 border-gray-300 hover:border-purple-400 transition-all duration-200 px-6 py-2"
            >
              Load More Projects
            </Button>
          </div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-700">No projects found</p>
            <p className="text-sm">Try adjusting your search or filters to find amazing projects!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedProjectLeaderboard;
