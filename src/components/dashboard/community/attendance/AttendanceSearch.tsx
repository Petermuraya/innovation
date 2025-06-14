
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AttendanceSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const AttendanceSearch = ({ searchTerm, onSearchChange }: AttendanceSearchProps) => {
  return (
    <div className="flex items-center gap-2">
      <Search className="h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search by member name or activity..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};

export default AttendanceSearch;
