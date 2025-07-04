
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, BookOpen, Calendar, Award } from 'lucide-react';

interface DashboardOverviewProps {
  memberProfile: any;
  loading: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ memberProfile, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div>Loading member profile...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!memberProfile) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div>No member profile found.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Member Profile
          </CardTitle>
          <CardDescription>Your personal information and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Name:</span>
              <span>{memberProfile.name || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{memberProfile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Phone:</span>
              <span>{memberProfile.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Course:</span>
              <span>{memberProfile.course || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Member Since:</span>
              <span>{new Date(memberProfile.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge variant={
              memberProfile.registration_status === 'approved' ? 'default' :
              memberProfile.registration_status === 'rejected' ? 'destructive' : 'secondary'
            }>
              {memberProfile.registration_status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-kic-green-600">0</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-kic-green-600">0</div>
              <div className="text-sm text-muted-foreground">Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-kic-green-600">0</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-kic-green-600">0</div>
              <div className="text-sm text-muted-foreground">Certificates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
