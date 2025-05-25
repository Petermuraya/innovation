
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useCertificateUpload } from '@/hooks/useCertificateUpload';
import CertificateFormFields from './CertificateFormFields';
import CertificateFileUpload from './CertificateFileUpload';

interface CertificateUploadProps {
  onSuccess?: () => void;
}

const CertificateUpload = ({ onSuccess }: CertificateUploadProps) => {
  const {
    uploading,
    formData,
    setFormData,
    file,
    setFile,
    members,
    events,
    uploadCertificate
  } = useCertificateUpload(onSuccess);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Certificate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CertificateFormFields 
          formData={formData}
          members={members}
          events={events}
          onFormDataChange={setFormData}
        />

        <CertificateFileUpload 
          file={file}
          onFileChange={setFile}
        />

        <Button 
          onClick={uploadCertificate} 
          disabled={uploading || !file || !formData.member_id}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Certificate'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CertificateUpload;
