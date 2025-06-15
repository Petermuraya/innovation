
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Heart, MessageCircle, Eye, Trophy, Award, Star, Medal } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url?: string;
  thumbnail_url?: string;
  tech_tags?: string[];
  author_name?: string;
  engagement_score: number;
  likes_count: number;
  comments_count: number;
}

interface ProjectLeaderboardRowProps {
  project: Project;
  index: number;
}

const ProjectLeaderboardRow = ({ project, index }: ProjectLeaderboardRowProps) => {
  const rank = index + 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case 2:
        return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
      case 3:
        return <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />;
      default:
        return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return rank <= 10 ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' : 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-yellow-200 p-3 sm:p-4 lg:p-6 hover:shadow-xl hover:border-yellow-300 transition-all duration-300 hover:scale-[1.02] group">
      {/* Header with Rank and Title */}
      <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 flex-shrink-0">
          {getRankIcon(rank)}
          <Badge className={`${getRankBadgeColor(rank)} text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 shadow-lg`}>
            #{rank}
          </Badge>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 group-hover:text-yellow-600 transition-colors text-sm sm:text-base lg:text-lg line-clamp-2">
            {project.title}
          </h3>
          {project.author_name && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              by {project.author_name}
            </p>
          )}
        </div>
      </div>

      {/* Project Content - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Project Info */}
        <div className="lg:col-span-2 space-y-3">
          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
            {project.description}
          </p>

          {/* Tech Tags - Responsive */}
          {project.tech_tags && project.tech_tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {project.tech_tags.slice(0, 6).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs px-2 py-1 border-yellow-300 text-yellow-700 bg-yellow-50">
                  {tag}
                </Badge>
              ))}
              {project.tech_tags.length > 6 && (
                <Badge variant="outline" className="text-xs px-2 py-1 border-gray-300 text-gray-500">
                  +{project.tech_tags.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Stats and Actions */}
        <div className="space-y-3">
          {/* Engagement Stats - Mobile: Horizontal, Desktop: Vertical */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-1 text-xs sm:text-sm">
            <div className="flex items-center justify-center lg:justify-start space-x-1 text-red-500">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{project.likes_count}</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start space-x-1 text-blue-500">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{project.comments_count}</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start space-x-1 text-green-500">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{project.engagement_score}</span>
            </div>
          </div>

          {/* Action Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
            {project.github_url && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs sm:text-sm border-gray-300 hover:border-gray-400 flex-1 lg:flex-none"
                onClick={() => window.open(project.github_url, '_blank')}
              >
                <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Code</span>
                <span className="sm:hidden">View</span>
              </Button>
            )}
            <Button
              size="sm"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xs sm:text-sm flex-1 lg:flex-none"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">View Project</span>
              <span className="sm:hidden">View</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectLeaderboardRow;
