
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Clock, Mail, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminRequestPending = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-kic-lightGray py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-kic-gray">
            Admin Request Pending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-kic-gray/70">
            <p className="mb-4">
              Your admin registration request has been submitted successfully and is currently under review by our administrators.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm bg-blue-50 p-3 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Review typically takes 1-3 business days</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm bg-green-50 p-3 rounded-lg">
                <Mail className="w-4 h-4 text-green-600" />
                <span>You'll receive an email notification once reviewed</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Admin requests are logged and monitored for security</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t space-y-2">
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full"
            >
              Sign Out
            </Button>
            <Button 
              asChild
              variant="ghost" 
              className="w-full"
            >
              <Link to="/login">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRequestPending;
