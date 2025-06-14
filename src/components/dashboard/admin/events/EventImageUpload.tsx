
import ImageUploader from '@/components/uploads/ImageUploader';

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
  return (
    <ImageUploader
      onImageSelect={onImageSelect}
      onImageRemove={onImageRemove}
      selectedImage={selectedImage}
      previewUrl={previewUrl}
      maxSize={5}
      className="mb-4"
    />
  );
};

export default EventImageUpload;
