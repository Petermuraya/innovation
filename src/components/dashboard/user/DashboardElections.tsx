
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ElectionsList from '@/components/elections/ElectionsList';
import VotingInterface from '@/components/elections/VotingInterface';
import CandidateApplication from '@/components/elections/CandidateApplication';
import ElectionResults from '@/components/elections/ElectionResults';
import CandidateAdManager from '@/components/elections/CandidateAdManager';
import RealTimeVoteTracker from '@/components/elections/RealTimeVoteTracker';
import { Vote, Users, Trophy, FileText, Calendar, CheckCircle, Megaphone, TrendingUp } from 'lucide-react';
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
              Participate in democratic leadership selection, apply for positions, manage campaigns, and view real-time results.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="elections" className="space-y-6">
            {/* Mobile: Scrollable horizontal tabs */}
            <div className="block lg:hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <TabsList className="inline-flex h-12 items-center justify-start rounded-md bg-white p-1 min-w-max">
                  <TabsTrigger value="elections" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Elections</span>
                  </TabsTrigger>
                  <TabsTrigger value="vote" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
                    <Vote className="h-4 w-4" />
                    <span className="text-sm">Vote</span>
                  </TabsTrigger>
                  <TabsTrigger value="apply" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Apply</span>
                  </TabsTrigger>
                  <TabsTrigger value="campaigns" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
                    <Megaphone className="h-4 w-4" />
                    <span className="text-sm">Campaigns</span>
                  </TabsTrigger>
                  <TabsTrigger value="tracker" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Live</span>
                  </TabsTrigger>
                  <TabsTrigger value="results" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm">Results</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden lg:block">
              <TabsList className="grid w-full grid-cols-6 bg-white h-12">
                <TabsTrigger value="elections" className="flex items-center gap-2 px-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden xl:inline text-sm">Active Elections</span>
                  <span className="xl:hidden text-sm">Elections</span>
                </TabsTrigger>
                <TabsTrigger value="vote" className="flex items-center gap-2 px-2">
                  <Vote className="h-4 w-4" />
                  <span className="hidden xl:inline text-sm">Cast Vote</span>
                  <span className="xl:hidden text-sm">Vote</span>
                </TabsTrigger>
                <TabsTrigger value="apply" className="flex items-center gap-2 px-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Apply</span>
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="flex items-center gap-2 px-2">
                  <Megaphone className="h-4 w-4" />
                  <span className="hidden xl:inline text-sm">Campaigns</span>
                  <span className="xl:hidden text-sm">Ads</span>
                </TabsTrigger>
                <TabsTrigger value="tracker" className="flex items-center gap-2 px-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden xl:inline text-sm">Live Results</span>
                  <span className="xl:hidden text-sm">Live</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2 px-2">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm">Results</span>
                </TabsTrigger>
              </TabsList>
            </div>

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

            <TabsContent value="campaigns" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="h-5 w-5 text-kic-green-600" />
                <h3 className="text-lg font-semibold text-kic-gray">Campaign Management</h3>
              </div>
              <CandidateAdManager />
            </TabsContent>

            <TabsContent value="tracker" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-kic-green-600" />
                <h3 className="text-lg font-semibold text-kic-gray">Real-Time Vote Tracking</h3>
              </div>
              <RealTimeVoteTracker />
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
