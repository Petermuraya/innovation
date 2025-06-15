
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserX } from 'lucide-react';

interface DashboardErrorStatesProps {
  memberData: any;
  isApproved: boolean;
  hasAdminAccess: boolean;
}

const DashboardErrorStates = ({ memberData, isApproved, hasAdminAccess }: DashboardErrorStatesProps) => {
  // Check if user is not registered at all (no member record)
  if (!memberData) {
    return (
      <div className="min-h-screen bg-kic-lightGray">
        <div className="container mx-auto p-6">
          <Alert variant="destructive" className="max-w-2xl mx-auto border-red-500 bg-red-50">
            <UserX className="h-4 w-4" />
            <AlertDescription className="text-red-800 font-medium">
              You are not a registered member of KIC. Please complete your registration to access the dashboard.
            </AlertDescription>
          </Alert>
          
          <Card className="max-w-2xl mx-auto mt-6">
            <CardContent className="p-6 text-center">
              <UserX className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-600 mb-4">
                Your account is not registered with the Karatina Innovation Club. 
                To access the dashboard and participate in club activities, you need to:
              </p>
              <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Complete the member registration process</li>
                  <li>Wait for admin approval</li>
                  <li>Complete payment for registration and subscription</li>
                </ol>
              </div>
              <p className="text-sm text-gray-500">
                Please contact the club administrators for assistance with registration.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Regular users need approval, but admins can always access
  if (!isApproved && !hasAdminAccess) {
    return null; // This will trigger RegistrationPending in the parent
  }

  return null;
};

export default DashboardErrorStates;
