
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CertificateFileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const CertificateFileUpload = ({ file, onFileChange }: CertificateFileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        onFileChange(selectedFile);
      } else {
        toast.error('Please select a PDF or image file');
      }
    }
  };

  return (
    <div>
      <Label htmlFor="file">Certificate File</Label>
      <Input
        type="file"
        accept=".pdf,image/*"
        onChange={handleFileChange}
        className="cursor-pointer"
      />
      {file && (
        <p className="text-sm text-gray-600 mt-1">
          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
};

export default CertificateFileUpload;
