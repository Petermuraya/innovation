
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import EventForm from './EventForm';
import EventsManagementHeader from './EventsManagementHeader';
import EventsList from './EventsList';
import { useEventManagement } from './useEventManagement';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  status: string;
  visibility: string;
  is_published: boolean;
  max_attendees?: number;
  requires_registration: boolean;
  created_at: string;
  image_url?: string;
}

const EventsManagementRefactored = () => {
  const { events, loading, fetchEvents, deleteEvent, togglePublishStatus } = useEventManagement();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingEvent(null);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowCreateForm(true);
  };

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && event.is_published) ||
                         (statusFilter === 'draft' && !event.is_published);
    
    const matchesVisibility = visibilityFilter === 'all' || event.visibility === visibilityFilter;
    
    return matchesSearch && matchesStatus && matchesVisibility;
  });

  // Get event stats
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.is_published).length;
  const draftEvents = events.filter(e => !e.is_published).length;
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kic-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <EventsManagementHeader onCreateEvent={handleCreateEvent} />
      
      <CardContent className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">Total Events</p>
                <p className="text-2xl font-bold text-blue-700">{totalEvents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Published</p>
                <p className="text-2xl font-bold text-green-700">{publishedEvents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-700">{draftEvents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-600">Upcoming</p>
                <p className="text-2xl font-bold text-purple-700">{upcomingEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visibility</SelectItem>
                <SelectItem value="everyone">Public</SelectItem>
                <SelectItem value="members">Members Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || statusFilter !== 'all' || visibilityFilter !== 'all') && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {filteredEvents.length} of {totalEvents} events
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setVisibilityFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Events List */}
        <EventsList
          events={filteredEvents}
          onEdit={handleEditEvent}
          onDelete={deleteEvent}
          onTogglePublish={togglePublishStatus}
        />
      </CardContent>
      
      <EventForm
        open={showCreateForm}
        onOpenChange={handleFormClose}
        editingEvent={editingEvent}
        onEventSaved={fetchEvents}
      />
    </Card>
  );
};

export default EventsManagementRefactored;
