
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateElectionForm } from './CreateElectionForm';
import { ElectionManagementList } from './ElectionManagementList';
import { CandidateReviewList } from './CandidateReviewList';

const AdminElectionTabs = () => {
  return (
    <Tabs defaultValue="create" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="create">Create Election</TabsTrigger>
        <TabsTrigger value="manage">Manage Elections</TabsTrigger>
        <TabsTrigger value="candidates">Review Candidates</TabsTrigger>
      </TabsList>

      <TabsContent value="create">
        <CreateElectionForm />
      </TabsContent>

      <TabsContent value="manage">
        <ElectionManagementList />
      </TabsContent>

      <TabsContent value="candidates">
        <CandidateReviewList />
      </TabsContent>
    </Tabs>
  );
};

export default AdminElectionTabs;
