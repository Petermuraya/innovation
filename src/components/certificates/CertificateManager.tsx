
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download, Trash2, Search, Eye } from 'lucide-react';
import CertificateUpload from './CertificateUpload';

const CertificateManager = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          members (name, email),
          events (title, date)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (id: string, certificateUrl: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const fileName = certificateUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('certificates')
          .remove([fileName]);
      }
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Certificate deleted successfully');
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error('Failed to delete certificate');
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.members?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.events?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificate_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CertificateUpload onSuccess={fetchCertificates} />

      <Card>
        <CardHeader>
          <CardTitle>Certificate Management</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCertificates.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No certificates found</p>
            ) : (
              filteredCertificates.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-kic-gray">{cert.members?.name}</h4>
                        <Badge variant="outline">{cert.certificate_type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{cert.members?.email}</p>
                      {cert.events && (
                        <p className="text-sm text-gray-600">Event: {cert.events.title}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Issued: {new Date(cert.issue_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(cert.certificate_url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a
                          href={cert.certificate_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCertificate(cert.id, cert.certificate_url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateManager;
