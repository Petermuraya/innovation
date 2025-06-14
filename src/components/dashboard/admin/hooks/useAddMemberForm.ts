
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AddMemberFormData {
  name: string;
  email: string;
  phone: string;
  course: string;
  year_of_study: string;
  bio: string;
  github_username: string;
  linkedin_url: string;
  skills: string;
}

export const useAddMemberForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AddMemberFormData>({
    name: '',
    email: '',
    phone: '',
    course: '',
    year_of_study: '',
    bio: '',
    github_username: '',
    linkedin_url: '',
    skills: '',
  });

  const handleInputChange = (field: keyof AddMemberFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      year_of_study: '',
      bio: '',
      github_username: '',
      linkedin_url: '',
      skills: '',
    });
  };

  const submitForm = async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Here you would typically call your API to add the member
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Member Added",
        description: `${formData.name} has been successfully added to the system.`,
      });
      
      resetForm();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name.trim() !== '' && formData.email.trim() !== '';

  return {
    formData,
    isLoading,
    isFormValid,
    handleInputChange,
    resetForm,
    submitForm,
  };
};
