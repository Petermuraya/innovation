import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar, User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface ConstitutionDocument {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  version: string;
  is_active: boolean;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

const DashboardConstitution = () => {
  const [documents, setDocuments] = useState<ConstitutionDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConstitutionDocuments();
  }, []);

  const fetchConstitutionDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('constitution_documents')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching constitution documents:', error);
      toast({
        title: "Error",
        description: "Failed to load constitution documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (constitutionDoc: ConstitutionDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('constitution-documents')
        .download(constitutionDoc.file_url);

      if (error) throw error;

      // Create download link using global document object
      const url = URL.createObjectURL(data);
      const a = globalThis.document.createElement('a');
      a.href = url;
      a.download = constitutionDoc.file_name;
      globalThis.document.body.appendChild(a);
      a.click();
      globalThis.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `Downloaded ${constitutionDoc.title}`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / 1048576) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-kic-green-600" />
          <h2 className="text-2xl font-bold">Constitution</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Loading constitution documents...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6 text-kic-green-600" />
        <h2 className="text-2xl font-bold">KIC Constitution</h2>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          The constitution outlines the rules, governance structure, and guidelines for the Karatina Innovation Club. 
          All members should familiarize themselves with these documents.
        </AlertDescription>
      </Alert>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Constitution Documents Available</h3>
            <p className="text-gray-600">
              Constitution documents have not been uploaded yet. Please check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-kic-green-600" />
                      {document.title}
                    </CardTitle>
                    {document.description && (
                      <p className="text-gray-600 text-sm">{document.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-2">
                    v{document.version}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Uploaded: {formatDate(document.created_at)}</span>
                  </div>
                  {document.file_size && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Size: {formatFileSize(document.file_size)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Official Document</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    File: {document.file_name}
                  </div>
                  <Button 
                    onClick={() => handleDownload(document)}
                    className="bg-kic-green-600 hover:bg-kic-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-kic-green-50 border-kic-green-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-kic-green-800 mb-2">Important Notes</h3>
          <ul className="text-sm text-kic-green-700 space-y-1">
            <li>• The constitution is a living document and may be updated periodically</li>
            <li>• All members are expected to abide by the rules and guidelines outlined</li>
            <li>• For questions about the constitution, contact the club administrators</li>
            <li>• Constitutional amendments require proper procedures as outlined in the document</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardConstitution;
