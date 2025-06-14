
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ElectionsList from '@/components/elections/ElectionsList';
import VotingInterface from '@/components/elections/VotingInterface';
import CandidateApplication from '@/components/elections/CandidateApplication';
import ElectionResults from '@/components/elections/ElectionResults';
import { Vote, Users, Trophy, FileText } from 'lucide-react';

const DashboardElections = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-kic-green-600" />
            Club Elections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Participate in democratic leadership selection and apply for leadership positions.
          </p>
          
          <Tabs defaultValue="elections" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="elections" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Elections
              </TabsTrigger>
              <TabsTrigger value="vote" className="flex items-center gap-2">
                <Vote className="h-4 w-4" />
                Vote
              </TabsTrigger>
              <TabsTrigger value="apply" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Apply
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="elections">
              <ElectionsList />
            </TabsContent>

            <TabsContent value="vote">
              <VotingInterface />
            </TabsContent>

            <TabsContent value="apply">
              <CandidateApplication />
            </TabsContent>

            <TabsContent value="results">
              <ElectionResults />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardElections;
