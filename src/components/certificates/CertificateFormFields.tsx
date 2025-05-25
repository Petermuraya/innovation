
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CertificateFormFieldsProps {
  formData: {
    member_id: string;
    event_id: string;
    certificate_type: string;
    custom_fields: {};
  };
  members: any[];
  events: any[];
  onFormDataChange: (data: any) => void;
}

const CertificateFormFields = ({ formData, members, events, onFormDataChange }: CertificateFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="member">Select Member</Label>
          <Select value={formData.member_id} onValueChange={(value) => onFormDataChange({...formData, member_id: value})}>
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
          <Select value={formData.event_id} onValueChange={(value) => onFormDataChange({...formData, event_id: value})}>
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
        <Select value={formData.certificate_type} onValueChange={(value) => onFormDataChange({...formData, certificate_type: value})}>
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
    </>
  );
};

export default CertificateFormFields;
