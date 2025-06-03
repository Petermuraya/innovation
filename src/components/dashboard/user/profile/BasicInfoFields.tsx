
import { Input } from '@/components/ui/input';

interface BasicInfoFieldsProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  phone: string;
  setPhone: (phone: string) => void;
  course: string;
  setCourse: (course: string) => void;
}

const BasicInfoFields = ({ 
  name, 
  setName, 
  email, 
  phone, 
  setPhone, 
  course, 
  setCourse 
}: BasicInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input
          value={email}
          disabled
          className="bg-gray-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your phone number"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Course</label>
        <Input
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Your course/program"
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
