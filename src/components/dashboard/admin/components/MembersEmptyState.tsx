
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';

interface MembersEmptyStateProps {
  onAddMember: () => void;
}

const MembersEmptyState = ({ onAddMember }: MembersEmptyStateProps) => {
  return (
    <Card className="border-kic-green-200">
      <CardHeader className="bg-gradient-to-r from-kic-green-50 to-kic-green-100 border-b border-kic-green-200">
        <CardTitle className="flex items-center gap-2 text-kic-green-800">
          <Users className="h-5 w-5" />
          Member Management
        </CardTitle>
        <CardDescription className="text-kic-green-600">
          No members found in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 text-center">
        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">
          There are currently no members in the system. This could be because:
        </p>
        <ul className="text-left text-gray-500 mb-6 space-y-2">
          <li>• No members have registered yet</li>
          <li>• There's a database connection issue</li>
          <li>• Member data is not being fetched properly</li>
        </ul>
        <Button
          onClick={onAddMember}
          className="bg-kic-green-600 hover:bg-kic-green-700 text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add First Member
        </Button>
      </CardContent>
    </Card>
  );
};

export default MembersEmptyState;
