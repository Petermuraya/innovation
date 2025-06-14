
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ElectionsList from '@/components/elections/ElectionsList';
import VotingInterface from '@/components/elections/VotingInterface';
import CandidateApplication from '@/components/elections/CandidateApplication';
import ElectionResults from '@/components/elections/ElectionResults';
import { Vote, Users, Trophy, FileText, Calendar, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DashboardElections = () => {
  console.log("DashboardElections component rendered");

  return (
    <div className="space-y-6">
      <Card className="border-kic-green-200 bg-gradient-to-r from-kic-green-50 to-kic-green-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-kic-green-700">
            <Vote className="h-6 w-6" />
            Club Elections & Governance
          </CardTitle>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Participate in democratic leadership selection, apply for positions, and view election results.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="elections" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white">
              <TabsTrigger value="elections" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Active Elections</span>
                <span className="sm:hidden">Elections</span>
              </TabsTrigger>
              <TabsTrigger value="vote" className="flex items-center gap-2">
                <Vote className="h-4 w-4" />
                <span className="hidden sm:inline">Cast Vote</span>
                <span className="sm:hidden">Vote</span>
              </TabsTrigger>
              <TabsTrigger value="apply" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Apply</span>
                <span className="sm:hidden">Apply</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Results</span>
                <span className="sm:hidden">Results</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="elections" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-kic-green-600" />
                <h3 className="text-lg font-semibold text-kic-gray">Current Elections</h3>
              </div>
              <ElectionsList />
            </TabsContent>

            <TabsContent value="vote" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Vote className="h-5 w-5 text-kic-green-600" />
                <h3 className="text-lg font-semibold text-kic-gray">Voting Portal</h3>
              </div>
              <VotingInterface />
            </TabsContent>

            <TabsContent value="apply" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-kic-green-600" />
                <h3 className="text-lg font-semibold text-kic-gray">Candidate Application</h3>
              </div>
              <CandidateApplication />
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-kic-green-600" />
                <h3 className="text-lg font-semibold text-kic-gray">Election Results</h3>
              </div>
              <ElectionResults />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardElections;
