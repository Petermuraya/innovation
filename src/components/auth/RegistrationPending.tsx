
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Mail } from 'lucide-react';

const RegistrationPending = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-kic-lightGray py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-kic-gray">
            Registration Pending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-kic-gray/70">
            <p className="mb-4">
              Your registration has been submitted successfully and is currently under review by our administrators.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm bg-blue-50 p-3 rounded-lg">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>You'll receive an email notification once your account is approved</span>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPending;
