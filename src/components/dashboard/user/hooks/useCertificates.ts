import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  user_id: string;
  certificate_type: string;
  certificate_url: string;
  description?: string;
  achievement_type: string;
  verification_code: string;
  issue_date: string;
  event_id?: string;
  is_public: boolean;
  social_share_enabled: boolean;
  metadata?: any;
  created_at: string;
}

export const useCertificates = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    if (!member) return;
    
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', member.id)
        .order('issue_date', { ascending: false });

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

  const downloadCertificate = async (certificateUrl: string, fileName?: string) => {
    try {
      const response = await fetch(certificateUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `certificate-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Certificate downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast({
        title: "Error",
        description: "Failed to download certificate",
        variant: "destructive",
      });
    }
  };

  const shareCertificate = async (certificate: Certificate) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${certificate.description || 'Certificate'} - KIC`,
          text: `Check out my certificate from Kenya Innovation Club!`,
          url: certificate.certificate_url,
        });
      } catch (error) {
        console.error('Error sharing certificate:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(certificate.certificate_url);
      toast({
        title: "Link Copied",
        description: "Certificate link copied to clipboard",
      });
    }
  };

  const verifyCertificate = async (verificationCode: string) => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('verification_code', verificationCode)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [member]);

  return {
    certificates,
    loading,
    downloadCertificate,
    shareCertificate,
    verifyCertificate,
    refetch: fetchCertificates,
  };
};