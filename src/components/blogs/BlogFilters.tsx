
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface BlogFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  allTags: string[];
}

const BlogFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedTag, 
  setSelectedTag, 
  allTags 
}: BlogFiltersProps) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {Array.isArray(allTags) && allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BlogFilters;
