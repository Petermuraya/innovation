
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Save, Eye, EyeOff, Plus, Trash2, History, AlertTriangle } from 'lucide-react';

interface MPesaConfig {
  id: string;
  configuration_name: string;
  business_short_code: string;
  consumer_key: string;
  consumer_secret: string;
  passkey: string;
  callback_url: string;
  environment: string;
  is_sandbox: boolean;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface AuditLog {
  id: string;
  action: string;
  changed_by: string;
  changed_at: string;
  change_description: string;
  old_values: any;
  new_values: any;
}

const MPesaConfigManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [configs, setConfigs] = useState<MPesaConfig[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState({
    configuration_name: '',
    business_short_code: '',
    consumer_key: '',
    consumer_secret: '',
    passkey: '',
    callback_url: '',
    environment: 'sandbox',
    is_sandbox: true,
  });

  useEffect(() => {
    fetchConfigurations();
    fetchAuditLogs();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('mpesa_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigs(data || []);
      
      // Set the active configuration as selected by default
      const activeConfig = data?.find(c => c.is_active);
      if (activeConfig && !selectedConfigId) {
        setSelectedConfigId(activeConfig.id);
        loadConfiguration(activeConfig);
      }
    } catch (error) {
      console.error('Error fetching configurations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch M-Pesa configurations",
        variant: "destructive",
      });
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('mpesa_configuration_audit')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const loadConfiguration = (selectedConfig: MPesaConfig) => {
    setConfig({
      configuration_name: selectedConfig.configuration_name,
      business_short_code: selectedConfig.business_short_code,
      consumer_key: selectedConfig.consumer_key,
      consumer_secret: selectedConfig.consumer_secret,
      passkey: selectedConfig.passkey,
      callback_url: selectedConfig.callback_url,
      environment: selectedConfig.environment,
      is_sandbox: selectedConfig.is_sandbox,
    });
  };

  const handleConfigurationSelect = (configId: string) => {
    setSelectedConfigId(configId);
    const selectedConfig = configs.find(c => c.id === configId);
    if (selectedConfig) {
      loadConfiguration(selectedConfig);
      setIsCreating(false);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedConfigId('');
    setConfig({
      configuration_name: '',
      business_short_code: '',
      consumer_key: '',
      consumer_secret: '',
      passkey: '',
      callback_url: '',
      environment: 'sandbox',
      is_sandbox: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isCreating) {
        // Create new configuration
        const { data, error } = await supabase
          .from('mpesa_configurations')
          .insert([{
            ...config,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          }])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "M-Pesa configuration created successfully",
        });

        await fetchConfigurations();
        setSelectedConfigId(data.id);
        setIsCreating(false);
      } else {
        // Update existing configuration
        const { error } = await supabase
          .from('mpesa_configurations')
          .update(config)
          .eq('id', selectedConfigId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "M-Pesa configuration updated successfully",
        });

        await fetchConfigurations();
      }
      
      await fetchAuditLogs();
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save M-Pesa configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateConfiguration = async (configId: string) => {
    try {
      // Deactivate all configurations first
      await supabase
        .from('mpesa_configurations')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // Activate the selected configuration
      const { error } = await supabase
        .from('mpesa_configurations')
        .update({ is_active: true })
        .eq('id', configId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration activated successfully",
      });

      await fetchConfigurations();
      await fetchAuditLogs();
    } catch (error) {
      console.error('Error activating configuration:', error);
      toast({
        title: "Error",
        description: "Failed to activate configuration",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfiguration = async (configId: string) => {
    if (!confirm('Are you sure you want to delete this configuration? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('mpesa_configurations')
        .delete()
        .eq('id', configId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration deleted successfully",
      });

      await fetchConfigurations();
      await fetchAuditLogs();
      
      if (selectedConfigId === configId) {
        setSelectedConfigId('');
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast({
        title: "Error",
        description: "Failed to delete configuration",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setConfig(prev => ({ 
      ...prev, 
      [field]: value,
      ...(field === 'environment' && { is_sandbox: value === 'sandbox' })
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manage">Manage Configurations</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Configurations
                  </CardTitle>
                  <Button onClick={handleCreateNew} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {configs.map((conf) => (
                  <div
                    key={conf.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedConfigId === conf.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleConfigurationSelect(conf.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{conf.configuration_name}</p>
                        <p className="text-sm text-gray-500">{conf.environment}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {conf.is_active && (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConfiguration(conf.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {configs.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No configurations found</p>
                )}
              </CardContent>
            </Card>

            {/* Configuration Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {isCreating ? 'Create New Configuration' : 'Edit Configuration'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    Configure your M-Pesa Daraja API credentials. These settings are required for payment processing.
                    Get your credentials from the Safaricom Developer Portal.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="configuration_name">Configuration Name</Label>
                    <Input
                      id="configuration_name"
                      value={config.configuration_name}
                      onChange={(e) => handleInputChange('configuration_name', e.target.value)}
                      placeholder="e.g., Production Config, Test Config"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="environment">Environment</Label>
                    <Select 
                      value={config.environment} 
                      onValueChange={(value) => handleInputChange('environment', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Sandbox</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : (isCreating ? 'Create Configuration' : 'Update Configuration')}
                    </Button>
                    
                    {!isCreating && selectedConfigId && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => handleActivateConfiguration(selectedConfigId)}
                      >
                        Activate Configuration
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Configuration Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        log.action === 'created' ? 'default' :
                        log.action === 'updated' ? 'secondary' :
                        log.action === 'deleted' ? 'destructive' : 'outline'
                      }>
                        {log.action.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(log.changed_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{log.change_description}</p>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No audit logs found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MPesaConfigManager;
