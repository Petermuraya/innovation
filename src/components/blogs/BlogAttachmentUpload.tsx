
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogAttachment {
  id: string;
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string;
  file_size: number;
}

interface BlogAttachmentUploadProps {
  attachments: BlogAttachment[];
  onAttachmentsChange: (attachments: BlogAttachment[]) => void;
  disabled?: boolean;
}

const BlogAttachmentUpload = ({ attachments, onAttachmentsChange, disabled }: BlogAttachmentUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or video file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-attachments')
        .getPublicUrl(filePath);

      const newAttachment: BlogAttachment = {
        id: Date.now().toString(),
        file_url: data.publicUrl,
        file_type: isImage ? 'image' : 'video',
        file_name: file.name,
        file_size: file.size,
      };

      onAttachmentsChange([...attachments, newAttachment]);
      
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (attachmentId: string) => {
    onAttachmentsChange(attachments.filter(att => att.id !== attachmentId));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="attachment-upload">Upload Images or Videos</Label>
        <Input
          id="attachment-upload"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          disabled={disabled || uploading}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: 10MB. Supported formats: JPG, PNG, GIF, MP4, WebM
        </p>
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <Label>Uploaded Files</Label>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-3 p-2 border rounded-lg">
                {attachment.file_type === 'image' ? (
                  <Image className="h-4 w-4 text-blue-500" />
                ) : (
                  <Video className="h-4 w-4 text-green-500" />
                )}
                <span className="flex-1 text-sm truncate">{attachment.file_name}</span>
                <span className="text-xs text-gray-500">
                  {(attachment.file_size / 1024 / 1024).toFixed(1)}MB
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Upload className="h-4 w-4 animate-spin" />
          Uploading...
        </div>
      )}
    </div>
  );
};

export default BlogAttachmentUpload;
