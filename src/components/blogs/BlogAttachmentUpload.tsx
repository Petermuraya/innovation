
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogAttachmentUploadProps {
  onAttachmentsChange: (files: File[]) => void;
  disabled?: boolean;
}

const BlogAttachmentUpload = ({ onAttachmentsChange, disabled }: BlogAttachmentUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

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

    const newAttachments = [...attachments, file];
    setAttachments(newAttachments);
    onAttachmentsChange(newAttachments);
    
    toast({
      title: "File added",
      description: "Your file has been added successfully",
    });
  };

  const removeAttachment = (indexToRemove: number) => {
    const newAttachments = attachments.filter((_, index) => index !== indexToRemove);
    setAttachments(newAttachments);
    onAttachmentsChange(newAttachments);
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
          <Label>Selected Files</Label>
          <div className="space-y-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                {attachment.type.startsWith('image/') ? (
                  <Image className="h-4 w-4 text-blue-500" />
                ) : (
                  <Video className="h-4 w-4 text-green-500" />
                )}
                <span className="flex-1 text-sm truncate">{attachment.name}</span>
                <span className="text-xs text-gray-500">
                  {(attachment.size / 1024 / 1024).toFixed(1)}MB
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
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
