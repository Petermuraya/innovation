
import { useState } from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { User, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Member } from '../types/members';

interface MemberDetailsDialogProps {
  member: Member;
  onStatusUpdate: (memberId: string, status: string) => Promise<void>;
  onDeleteMember: (member: Member) => void;
  isLoading: string | null;
}

const MemberDetailsDialog = ({ member, onStatusUpdate, onDeleteMember, isLoading }: MemberDetailsDialogProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member.avatar_url} />
            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          {member.name}
          <Badge variant="outline" className="ml-2">
            ID: {member.id.slice(0, 8)}
          </Badge>
        </DialogTitle>
        <DialogDescription>
          Member details and registration information
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-kic-gray flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </h4>
              <div className="space-y-1 text-sm">
                <p><strong>Email:</strong> {member.email}</p>
                {member.phone && <p><strong>Phone:</strong> {member.phone}</p>}
                {member.course && <p><strong>Course:</strong> {member.course}</p>}
                {member.year_of_study && <p><strong>Year:</strong> {member.year_of_study}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-kic-gray">Registration</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Status:</strong> {getStatusBadge(member.registration_status)}</p>
                <p><strong>Registered:</strong> {new Date(member.created_at).toLocaleDateString()}</p>
                <p><strong>Time ago:</strong> {getTimeAgo(member.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {member.bio && (
            <div className="space-y-2">
              <h4 className="font-semibold text-kic-gray">Bio</h4>
              <p className="text-sm text-gray-600">{member.bio}</p>
            </div>
          )}

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-kic-gray">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-kic-gray">Links</h4>
            <div className="space-y-1 text-sm">
              {member.github_username && (
                <p>
                  <strong>GitHub:</strong> 
                  <a 
                    href={`https://github.com/${member.github_username}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {member.github_username}
                  </a>
                </p>
              )}
              {member.linkedin_url && (
                <p>
                  <strong>LinkedIn:</strong> 
                  <a 
                    href={member.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    View Profile
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {member.registration_status === 'pending' && (
              <>
                <Button
                  onClick={() => onStatusUpdate(member.id, 'approved')}
                  disabled={isLoading === member.id}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => onStatusUpdate(member.id, 'rejected')}
                  disabled={isLoading === member.id}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            <Button
              onClick={() => onDeleteMember(member)}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default MemberDetailsDialog;
