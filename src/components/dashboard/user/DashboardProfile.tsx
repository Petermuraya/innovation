
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ProfileEditForm from './ProfileEditForm';

interface DashboardProfileProps {
  memberData: any;
  onUpdate: () => void;
}

const DashboardProfile: React.FC<DashboardProfileProps> = ({ memberData, onUpdate }) => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={memberData?.avatar_url} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{memberData?.name || 'Member'}</CardTitle>
                <CardDescription>{memberData?.email}</CardDescription>
              </div>
            </div>
            
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile information below.
                  </DialogDescription>
                </DialogHeader>
                <ProfileEditForm 
                  memberData={memberData} 
                  onUpdate={() => {
                    onUpdate();
                    setIsEditOpen(false);
                  }} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Bio</h4>
              <p className="text-muted-foreground">
                {memberData?.bio || 'No bio provided'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Course</h4>
                <p className="text-muted-foreground">
                  {memberData?.course || 'Not specified'}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Year of Study</h4>
                <p className="text-muted-foreground">
                  {memberData?.year_of_study || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfile;
