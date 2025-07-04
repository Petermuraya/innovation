
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface MemberSearchAndFiltersProps {
  searchEmail: string;
  onSearchChange: (value: string) => void;
}

const MemberSearchAndFilters = ({ searchEmail, onSearchChange }: MemberSearchAndFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Label htmlFor="search" className="text-sm font-medium">
          Search Members
        </Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            type="text"
            placeholder="Search by email address..."
            value={searchEmail}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default MemberSearchAndFilters;
