
import { Trophy } from 'lucide-react';

const MemberRankingEmpty = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p className="text-lg font-medium text-gray-700">No members found</p>
      <p className="text-sm">Try adjusting your search or filters</p>
    </div>
  );
};

export default MemberRankingEmpty;
