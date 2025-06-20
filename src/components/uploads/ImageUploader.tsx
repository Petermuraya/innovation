import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  selectedImage?: File | null;
  previewUrl?: string;
  maxSize?: number; 
  accept?: string;
  className?: string;
}

const ImageUploader = ({ 
  onImageSelect, 
  onImageRemove, 
  selectedImage, 
  previewUrl,
  maxSize = 5,
  accept = "image/*",
  className = ""
}: ImageUploaderProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return false;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onImageSelect(file);
      toast({
        title: "Image selected",
        description: `${file.name} is ready to upload`,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset the input to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Featured Image</Label>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedImage || previewUrl ? (
        <div className="space-y-3">
          <div className="relative border rounded-lg overflow-hidden">
            <img
              src={previewUrl || (selectedImage ? URL.createObjectURL(selectedImage) : '')}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onImageRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            {selectedImage ? selectedImage.name : 'Current image'}
          </p>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? 'border-kic-green-500 bg-kic-green-50' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Drag and drop an image here, or</p>
          <Input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            id="image-upload"
            ref={fileInputRef}
          />
          <Label htmlFor="image-upload" asChild>
            <Button 
              type="button" 
              variant="outline" 
              className="cursor-pointer"
              onClick={triggerFileInput}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
          </Label>
          <p className="text-xs text-gray-500 mt-2">
            Maximum file size: {maxSize}MB
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;