
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MapPin, Briefcase, Calendar } from 'lucide-react';

interface CareerOpportunityCardProps {
  opportunity: any;
  onEdit: (opportunity: any) => void;
  onDelete: (opportunityId: string) => void;
  onStatusToggle: (opportunityId: string, currentStatus: string) => void;
}

const CareerOpportunityCard = ({ 
  opportunity, 
  onEdit, 
  onDelete, 
  onStatusToggle 
}: CareerOpportunityCardProps) => {
  const getTypeColor = (type: string) => {
    const colors = {
      internship: 'bg-blue-100 text-blue-800',
      full_time: 'bg-green-100 text-green-800',
      part_time: 'bg-yellow-100 text-yellow-800',
      contract: 'bg-purple-100 text-purple-800',
      volunteer: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{opportunity.title}</CardTitle>
            <p className="text-gray-600">{opportunity.company_name}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getTypeColor(opportunity.type)}>
              {opportunity.type.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(opportunity.status)}>
              {opportunity.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">{opportunity.description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {opportunity.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {opportunity.location}
              {opportunity.remote && ' (Remote)'}
            </div>
          )}
          {opportunity.salary_range && (
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {opportunity.salary_range}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Posted {new Date(opportunity.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(opportunity)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusToggle(opportunity.id, opportunity.status)}
            className={opportunity.status === 'active' ? 'text-red-600' : 'text-green-600'}
          >
            {opportunity.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(opportunity.id)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Posted by {opportunity.members?.name || 'Unknown'}
        </p>
      </CardContent>
    </Card>
  );
};

export default CareerOpportunityCard;
