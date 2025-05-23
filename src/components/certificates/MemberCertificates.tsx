
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Download, Award, Calendar, Eye } from 'lucide-react';

const MemberCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          events (title, date, location)
        `)
        .eq('user_id', user?.id)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const getCertificateTypeIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return '🎓';
      case 'participation':
        return '🏆';
      case 'achievement':
        return '🥇';
      case 'membership':
        return '📜';
      default:
        return '🏅';
    }
  };

  const getCertificateTypeColor = (type: string) => {
    switch (type) {
      case 'completion':
        return 'bg-green-100 text-green-800';
      case 'participation':
        return 'bg-blue-100 text-blue-800';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800';
      case 'membership':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-kic-green-500" />
          My Certificates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No certificates yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Complete events and workshops to earn certificates
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {getCertificateTypeIcon(cert.certificate_type)}
                      </span>
                      <div>
                        <h4 className="font-medium text-kic-gray">
                          {cert.events?.title || 'General Certificate'}
                        </h4>
                        <Badge className={getCertificateTypeColor(cert.certificate_type)}>
                          {cert.certificate_type.charAt(0).toUpperCase() + cert.certificate_type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                      </div>
                      {cert.events?.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Event Date: {new Date(cert.events.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {cert.events?.location && (
                        <p>Location: {cert.events.location}</p>
                      )}
                    </div>
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
                      className="bg-kic-green-500 hover:bg-kic-green-600"
                      asChild
                    >
                      <a
                        href={cert.certificate_url}
                        download={`certificate_${cert.id}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberCertificates;
