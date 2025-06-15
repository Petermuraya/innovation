
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface UserSearchAndFiltersProps {
  searchEmail: string;
  onSearchChange: (value: string) => void;
}

const UserSearchAndFilters = ({ searchEmail, onSearchChange }: UserSearchAndFiltersProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Label htmlFor="search">Search Users</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Search by email or name..."
            value={searchEmail}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
};

export default UserSearchAndFilters;
