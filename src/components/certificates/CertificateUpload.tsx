
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Upload, FileText } from 'lucide-react';

interface CertificateUploadProps {
  onSuccess?: () => void;
}

const CertificateUpload = ({ onSuccess }: CertificateUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    member_id: '',
    event_id: '',
    certificate_type: 'completion',
    custom_fields: {}
  });
  const [file, setFile] = useState<File | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useState(() => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
      } else {
        toast.error('Please select a PDF or image file');
      }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Certificate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="member">Select Member</Label>
            <Select value={formData.member_id} onValueChange={(value) => setFormData({...formData, member_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="event">Event (Optional)</Label>
            <Select value={formData.event_id} onValueChange={(value) => setFormData({...formData, event_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific event</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title} ({new Date(event.date).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="type">Certificate Type</Label>
          <Select value={formData.certificate_type} onValueChange={(value) => setFormData({...formData, certificate_type: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completion">Completion Certificate</SelectItem>
              <SelectItem value="participation">Participation Certificate</SelectItem>
              <SelectItem value="achievement">Achievement Award</SelectItem>
              <SelectItem value="membership">Membership Certificate</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
