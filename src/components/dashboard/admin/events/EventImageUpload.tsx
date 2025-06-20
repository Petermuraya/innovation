import ImageUploader from '@/components/uploads/ImageUploader';
import { useToast } from '@/hooks/use-toast';

interface EventImageUploadProps {
  selectedImage: File | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  previewUrl?: string;
}

const EventImageUpload = ({ 
  selectedImage, 
  onImageSelect, 
  onImageRemove, 
  previewUrl 
}: EventImageUploadProps) => {
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    try {
      onImageSelect(file);
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to process the image",
        variant: "destructive"
      });
    }
  };

  const handleImageRemove = () => {
    try {
      onImageRemove();
    } catch (error) {
      toast({
        title: "Remove Error",
        description: "Failed to remove the image",
        variant: "destructive"
      });
    }
  };

  return (
    <ImageUploader
      onImageSelect={handleImageSelect}
      onImageRemove={handleImageRemove}
      selectedImage={selectedImage}
      previewUrl={previewUrl}
      maxSize={5}
      className="mb-4"
    />
  );
};

export default EventImageUpload;