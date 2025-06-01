
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Save, Eye, EyeOff } from 'lucide-react';

const MPesaConfigManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [config, setConfig] = useState({
    business_short_code: '',
    consumer_key: '',
    consumer_secret: '',
    passkey: '',
    callback_url: '',
  });

  useEffect(() => {
    fetchMPesaConfig();
  }, []);

  const fetchMPesaConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('mpesa_configurations')
        .select('*')
        .eq('is_active', true)
        .single();

      if (data) {
        setConfig({
          business_short_code: data.business_short_code,
          consumer_key: data.consumer_key,
          consumer_secret: data.consumer_secret,
          passkey: data.passkey,
          callback_url: data.callback_url,
        });
      }
    } catch (error) {
      console.error('Error fetching M-Pesa config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update the existing configuration
      const { error } = await supabase
        .from('mpesa_configurations')
        .update({
          business_short_code: config.business_short_code,
          consumer_key: config.consumer_key,
          consumer_secret: config.consumer_secret,
          passkey: config.passkey,
          callback_url: config.callback_url,
          updated_at: new Date().toISOString(),
        })
        .eq('is_active', true);

      if (error) throw error;

      toast({
        title: "Success",
        description: "M-Pesa configuration updated successfully",
      });
    } catch (error) {
      console.error('Error updating M-Pesa config:', error);
      toast({
        title: "Error",
        description: "Failed to update M-Pesa configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          M-Pesa Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertDescription>
            Configure your M-Pesa Daraja API credentials. These settings are required for payment processing.
            Get your credentials from the Safaricom Developer Portal.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="business_short_code">Business Short Code</Label>
            <Input
              id="business_short_code"
              value={config.business_short_code}
              onChange={(e) => handleInputChange('business_short_code', e.target.value)}
              placeholder="174379"
              required
            />
          </div>

          <div>
            <Label htmlFor="consumer_key">Consumer Key</Label>
            <div className="relative">
              <Input
                id="consumer_key"
                type={showSecrets ? 'text' : 'password'}
                value={config.consumer_key}
                onChange={(e) => handleInputChange('consumer_key', e.target.value)}
                placeholder="Your consumer key"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowSecrets(!showSecrets)}
              >
                {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="consumer_secret">Consumer Secret</Label>
            <Input
              id="consumer_secret"
              type={showSecrets ? 'text' : 'password'}
              value={config.consumer_secret}
              onChange={(e) => handleInputChange('consumer_secret', e.target.value)}
              placeholder="Your consumer secret"
              required
            />
          </div>

          <div>
            <Label htmlFor="passkey">Passkey</Label>
            <Input
              id="passkey"
              type={showSecrets ? 'text' : 'password'}
              value={config.passkey}
              onChange={(e) => handleInputChange('passkey', e.target.value)}
              placeholder="Your passkey"
              required
            />
          </div>

          <div>
            <Label htmlFor="callback_url">Callback URL</Label>
            <Input
              id="callback_url"
              value={config.callback_url}
              onChange={(e) => handleInputChange('callback_url', e.target.value)}
              placeholder="https://your-domain.com/api/mpesa-callback"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MPesaConfigManager;
