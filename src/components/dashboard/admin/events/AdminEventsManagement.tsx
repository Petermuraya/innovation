
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useEventsManagement } from '@/hooks/useEventsManagement';
import EventFormFixed from './EventFormFixed';

const AdminEventsManagement = () => {
  const { events, loading, deleteEvent, togglePublishStatus } = useEventsManagement();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowCreateForm(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Events Management</CardTitle>
          <Button onClick={handleCreateEvent} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <Badge className={getStatusColor(event.is_published)}>
                        {event.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      {event.requires_registration && (
                        <Badge variant="outline">Registration Required</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      {event.max_attendees && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Max {event.max_attendees}
                        </div>
                      )}
                    </div>
                    
                    {event.price > 0 && (
                      <div className="text-sm font-medium text-green-600 mb-3">
                        Price: KSh {event.price}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishStatus(event.id, event.is_published)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {event.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {events.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-4">No events created yet.</p>
                <Button onClick={handleCreateEvent}>
                  Create Your First Event
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EventFormFixed
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        editingEvent={editingEvent}
        onEventSaved={() => {
          setShowCreateForm(false);
          setEditingEvent(null);
        }}
      />
    </div>
  );
};

export default AdminEventsManagement;
