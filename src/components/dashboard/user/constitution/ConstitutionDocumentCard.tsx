
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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

interface ConstitutionDocumentCardProps {
  document: ConstitutionDocument;
}

const ConstitutionDocumentCard = ({ document }: ConstitutionDocumentCardProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('constitution-documents')
        .download(document.file_url);

      if (error) throw error;

      // Create download link using global document object
      const url = URL.createObjectURL(data);
      const a = globalThis.document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      globalThis.document.body.appendChild(a);
      a.click();
      globalThis.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `Downloaded ${document.title}`,
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

  return (
    <Card className="hover:shadow-md transition-shadow">
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
            onClick={handleDownload}
            className="bg-kic-green-600 hover:bg-kic-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConstitutionDocumentCard;
