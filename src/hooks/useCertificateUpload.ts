
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CertificateFormData {
  member_id: string;
  event_id: string;
  certificate_type: string;
  custom_fields: {};
}

export const useCertificateUpload = (onSuccess?: () => void) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<CertificateFormData>({
    member_id: '',
    event_id: '',
    certificate_type: 'completion',
    custom_fields: {}
  });
  const [file, setFile] = useState<File | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchMembersAndEvents();
  }, []);

  const fetchMembersAndEvents = async () => {
    try {
      const [membersResult, eventsResult] = await Promise.all([
        supabase.from('members').select('id, name, email').eq('registration_status', 'approved'),
        supabase.from('events').select('id, title, date')
      ]);

      if (membersResult.data) setMembers(membersResult.data);
      if (eventsResult.data) setEvents(eventsResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load members and events');
    }
  };

  const uploadCertificate = async () => {
    if (!file || !formData.member_id) {
      toast.error('Please select a file and member');
      return;
    }

    setUploading(true);

    try {
      // Upload file to storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName);

      // Save certificate record
      const { error: insertError } = await supabase
        .from('certificates')
        .insert({
          user_id: formData.member_id,
          event_id: formData.event_id || null,
          certificate_url: urlData.publicUrl,
          certificate_type: formData.certificate_type,
          created_by: user?.id,
          issue_date: new Date().toISOString(),
          metadata: formData.custom_fields
        });

      if (insertError) throw insertError;

      toast.success('Certificate uploaded successfully!');
      setFile(null);
      setFormData({
        member_id: '',
        event_id: '',
        certificate_type: 'completion',
        custom_fields: {}
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error uploading certificate:', error);
      toast.error('Failed to upload certificate');
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    formData,
    setFormData,
    file,
    setFile,
    members,
    events,
    uploadCertificate
  };
};
