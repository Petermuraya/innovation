
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SubmissionForm from './submissions/SubmissionForm';
import SubmissionsList from './submissions/SubmissionsList';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const DashboardSubmissions = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmissionCreated = () => {
    setShowCreateForm(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submissions</h2>
          <p className="text-gray-600">Submit complaints, recommendations, or share your thoughts</p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Submission
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Submission</DialogTitle>
            </DialogHeader>
            <SubmissionForm onSuccess={handleSubmissionCreated} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="complaint">Complaints</TabsTrigger>
          <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
          <TabsTrigger value="thought">Thoughts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <SubmissionsList key={refreshKey} filterType={null} />
        </TabsContent>
        <TabsContent value="complaint" className="mt-6">
          <SubmissionsList key={refreshKey} filterType="complaint" />
        </TabsContent>
        <TabsContent value="recommendation" className="mt-6">
          <SubmissionsList key={refreshKey} filterType="recommendation" />
        </TabsContent>
        <TabsContent value="thought" className="mt-6">
          <SubmissionsList key={refreshKey} filterType="thought" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSubmissions;
