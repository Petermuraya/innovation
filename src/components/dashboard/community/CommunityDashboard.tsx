
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, FolderOpen, MessageSquare, UserPlus, Bell } from 'lucide-react';
import { useCommunityAdminData } from '@/hooks/useCommunityAdminData';
import CommunityMembersTab from './CommunityMembersTab';
import CommunityEventsTab from './CommunityEventsTab';
import CommunityProjectsTab from './CommunityProjectsTab';
import CommunityAttendanceTab from './CommunityAttendanceTab';
import CommunityRemindersTab from './CommunityRemindersTab';
import BackToDashboard from './BackToDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCommunityPointTracking } from '@/hooks/useCommunityPointTracking';

const CommunityDashboard = () => {
  const { communities, selectedCommunity, loading, stats, selectCommunity } = useCommunityAdminData();
  
  // Track community dashboard visit when a community is selected
  useCommunityPointTracking(selectedCommunity?.id);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray">
        <Card>
          <CardContent className="p-6">
            <p>Loading community dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="min-h-screen bg-kic-lightGray">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <BackToDashboard />
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Communities Assigned</h2>
              <p className="text-gray-600">
                You are not assigned as an admin for any communities. Contact the main administrator to get assigned.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kic-lightGray">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-kic-gray">Community Dashboard</h1>
            <BackToDashboard />
          </div>
          
          {/* Community Selector */}
          <div className="flex items-center gap-4 mb-4">
            <Select value={selectedCommunity?.id} onValueChange={(value) => {
              const community = communities.find(c => c.id === value);
              if (community) selectCommunity(community);
            }}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a community" />
              </SelectTrigger>
              <SelectContent>
                {communities.map((community) => (
                  <SelectItem key={community.id} value={community.id}>
                    {community.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Community Info */}
          {selectedCommunity && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedCommunity.name}</span>
                  <Badge variant="secondary">Admin</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{selectedCommunity.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Meeting Schedule:</strong> {selectedCommunity.meeting_schedule}
                  </div>
                  {selectedCommunity.meeting_time && (
                    <div>
                      <strong>Meeting Time:</strong> {selectedCommunity.meeting_time}
                    </div>
                  )}
                  {selectedCommunity.meeting_location && (
                    <div>
                      <strong>Location:</strong> {selectedCommunity.meeting_location}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-kic-gray">{stats.total_members || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-kic-blue" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-kic-gray">{stats.total_events || 0}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-kic-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-kic-gray">{stats.total_projects || 0}</p>
                  </div>
                  <FolderOpen className="h-8 w-8 text-kic-orange" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Meeting</p>
                    <p className="text-2xl font-bold text-kic-gray">{stats.attended_last_meeting || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-kic-purple" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        {selectedCommunity && (
          <Tabs defaultValue="members" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 h-auto p-1">
              <TabsTrigger value="members" className="text-xs sm:text-sm flex items-center gap-1">
                <Users className="w-4 h-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs sm:text-sm flex items-center gap-1">
                <FolderOpen className="w-4 h-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="attendance" className="text-xs sm:text-sm flex items-center gap-1">
                <UserPlus className="w-4 h-4" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="reminders" className="text-xs sm:text-sm flex items-center gap-1">
                <Bell className="w-4 h-4" />
                Reminders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              <CommunityMembersTab communityId={selectedCommunity.id} />
            </TabsContent>

            <TabsContent value="events">
              <CommunityEventsTab communityId={selectedCommunity.id} />
            </TabsContent>

            <TabsContent value="projects">
              <CommunityProjectsTab communityId={selectedCommunity.id} />
            </TabsContent>

            <TabsContent value="attendance">
              <CommunityAttendanceTab communityId={selectedCommunity.id} />
            </TabsContent>

            <TabsContent value="reminders">
              <CommunityRemindersTab communityId={selectedCommunity.id} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default CommunityDashboard;
