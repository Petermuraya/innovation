
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ExternalLink, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminRegistrationShare = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const adminRegisterUrl = `${window.location.origin}/admin-register`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(adminRegisterUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Admin registration link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const openInNewTab = () => {
    window.open(adminRegisterUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-primary" />
          <div>
            <CardTitle>Admin Registration Link</CardTitle>
            <CardDescription>
              Share this link with potential administrators to allow them to request admin access
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-register-url">Registration URL</Label>
          <div className="flex gap-2">
            <Input
              id="admin-register-url"
              value={adminRegisterUrl}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={copied}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={openInNewTab}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Users can register for admin access using this link</li>
            <li>• All requests require approval from existing administrators</li>
            <li>• Requests can be reviewed in the Admin Requests tab</li>
            <li>• Only approved users will receive admin privileges</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRegistrationShare;
