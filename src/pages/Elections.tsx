
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ElectionsList from '@/components/elections/ElectionsList';
import VotingInterface from '@/components/elections/VotingInterface';
import CandidateApplication from '@/components/elections/CandidateApplication';
import ElectionResults from '@/components/elections/ElectionResults';
import AdminElectionManagement from '@/components/elections/AdminElectionManagement';
import RoleGuard from '@/components/security/RoleGuard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

const Elections = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Innovation Club Elections
            </h1>
            <p className="text-xl text-gray-600">
              Participate in democratic leadership selection for our community
            </p>
          </div>
        </AnimatedSection>

        <Tabs defaultValue="elections" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 lg:max-w-2xl lg:grid-cols-4">
              <TabsTrigger value="elections">Elections</TabsTrigger>
              <TabsTrigger value="vote">Vote</TabsTrigger>
              <TabsTrigger value="apply">Apply</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="elections">
            <AnimatedSection delay={200}>
              <ElectionsList />
            </AnimatedSection>
          </TabsContent>

          <TabsContent value="vote">
            <AnimatedSection delay={200}>
              <VotingInterface />
            </AnimatedSection>
          </TabsContent>

          <TabsContent value="apply">
            <AnimatedSection delay={200}>
              <CandidateApplication />
            </AnimatedSection>
          </TabsContent>

          <TabsContent value="results">
            <AnimatedSection delay={200}>
              <ElectionResults />
            </AnimatedSection>
          </TabsContent>
        </Tabs>

        <RoleGuard requiredRole="admin">
          <AnimatedSection delay={400} className="mt-12">
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Management</h2>
              <AdminElectionManagement />
            </div>
          </AnimatedSection>
        </RoleGuard>
      </div>
    </div>
  );
};

export default Elections;
