
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: number;
  highlight?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

const AdminStatCard = ({ 
  title, 
  value, 
  highlight = false, 
  icon: Icon,
  trend = 'neutral',
  description 
}: AdminStatCardProps) => {
  const baseClasses = "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1";
  const highlightClasses = highlight 
    ? "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 shadow-md" 
    : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-kic-green-300";

  const valueColor = highlight ? 'text-red-600' : 'text-kic-gray';
  const titleColor = highlight ? 'text-red-700' : 'text-kic-gray/70';

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
    return null;
  };

  const getTrendText = () => {
    if (trend === 'up') return 'Increasing';
    if (trend === 'down') return 'Decreasing';
    return value > 0 ? 'Active' : 'No data';
  };

  return (
    <Card className={`${baseClasses} ${highlightClasses} relative overflow-hidden`}>
      {highlight && (
        <>
          <Badge className="absolute top-2 right-2 bg-red-500 text-white animate-pulse text-xs px-2 py-1">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Alert
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
        </>
      )}
      
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              {Icon && (
                <div className={`p-2 rounded-lg ${highlight ? 'bg-red-100' : 'bg-kic-green-50'} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${highlight ? 'text-red-600' : 'text-kic-green-600'}`} />
                </div>
              )}
              <div>
                <h3 className={`text-xs sm:text-sm font-medium ${titleColor} leading-tight`}>
                  {title}
                </h3>
                {description && (
                  <p className="text-xs text-gray-500 mt-1">{description}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className={`text-2xl sm:text-3xl font-bold ${valueColor} leading-none`}>
                {value.toLocaleString()}
              </p>
              
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={`text-xs font-medium ${
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {getTrendText()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom border */}
        <div className={`
          absolute bottom-0 left-0 right-0 h-1 
          ${highlight ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-kic-green-500 to-kic-green-600'}
          transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left
        `} />
      </CardContent>
    </Card>
  );
};

export default AdminStatCard;
