
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Star, Github, ExternalLink, Award } from 'lucide-react';
import { ProjectRank } from '../types/projectLeaderboard';
import { getProjectBadgeColor, getEngagementLevel } from '../utils/projectUtils';

interface ProjectLeaderboardRowProps {
  project: ProjectRank;
  index: number;
}

const ProjectLeaderboardRow = ({ project, index }: ProjectLeaderboardRowProps) => {
  const engagement = getEngagementLevel(project.engagement_score);
  const EngagementIcon = engagement.icon;

  return (
    <div
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
};

export default ProjectLeaderboardRow;
