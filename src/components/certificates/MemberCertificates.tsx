
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share2, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const MemberCertificates = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, [member]);

  const fetchCertificates = async () => {
    if (!member) return;

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', member.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateUrl: string, fileName: string) => {
    try {
      const response = await fetch(certificateUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast({
        title: "Error",
        description: "Failed to download certificate",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (certificate: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate: ${certificate.achievement_type}`,
          text: `Check out my certificate for ${certificate.achievement_type}!`,
          url: certificate.certificate_url,
        });
      } catch (error) {
        console.error('Error sharing certificate:', error);
      }
    } else {
      // Fallback to copying URL to clipboard
      try {
        await navigator.clipboard.writeText(certificate.certificate_url);
        toast({
          title: "Link Copied",
          description: "Certificate link copied to clipboard",
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kic-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-kic-gray">My Certificates</h2>
        <Badge variant="secondary" className="bg-kic-green-100 text-kic-green-800">
          {certificates.length} Certificate{certificates.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600">
              Participate in events and complete achievements to earn certificates!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate: any) => (
            <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-kic-green-600" />
                  {certificate.achievement_type || 'Certificate'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certificate.description && (
                  <p className="text-sm text-gray-600">{certificate.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Issued:</span>
                  <span>{new Date(certificate.issue_date).toLocaleDateString()}</span>
                </div>

                {certificate.verification_code && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Verification:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {certificate.verification_code.slice(0, 8)}...
                    </Badge>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(certificate.certificate_url, `certificate-${certificate.id}.pdf`)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  
                  {certificate.social_share_enabled && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(certificate)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberCertificates;
