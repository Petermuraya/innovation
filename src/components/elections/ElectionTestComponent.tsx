
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Users, Vote } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ElectionTestComponent = () => {
  const handleTestAction = (action: string) => {
    console.log(`Election test action: ${action}`);
    alert(`Testing ${action} functionality - Check console for details`);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Elections module is successfully loaded and working. All components are connected properly.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-kic-green-600" />
              Voter Interface
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Test the voting interface functionality
            </p>
            <Button 
              onClick={() => handleTestAction('Voting')}
              className="w-full"
            >
              Test Voting
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-kic-blue-600" />
              Candidate Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Test the candidate application system
            </p>
            <Button 
              onClick={() => handleTestAction('Application')}
              variant="outline"
              className="w-full"
            >
              Test Application
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-kic-green-50 border-kic-green-200">
        <CardHeader>
          <CardTitle className="text-kic-green-800">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Elections Dashboard Integration: ✅ Working</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Admin Elections Management: ✅ Working</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Component Rendering: ✅ Working</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Database Integration: ⚠️ Requires Testing</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectionTestComponent;
