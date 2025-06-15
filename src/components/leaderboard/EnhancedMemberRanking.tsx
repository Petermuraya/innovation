
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MemberRankingProps } from './types/memberRanking';
import { useMemberRankings } from './hooks/useMemberRankings';
import { filterRankings } from './utils/rankingUtils';
import MemberRankingHeader from './components/MemberRankingHeader';
import MemberRankingRow from './components/MemberRankingRow';
import MemberRankingLoading from './components/MemberRankingLoading';
import MemberRankingEmpty from './components/MemberRankingEmpty';

const EnhancedMemberRanking = ({ searchTerm = '', filter = 'all', timeFilter = 'all' }: MemberRankingProps) => {
  const { rankings, loading } = useMemberRankings(timeFilter);
  const [displayCount, setDisplayCount] = useState(10);

  const filteredRankings = filterRankings(rankings, searchTerm, filter).slice(0, displayCount);

  if (loading) {
    return <MemberRankingLoading />;
  }

  return (
    <Card className="border-0 shadow-xl overflow-hidden bg-white/95 backdrop-blur-sm">
      <MemberRankingHeader memberCount={filteredRankings.length} />
      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredRankings.map((member) => (
            <MemberRankingRow key={member.user_id} member={member} />
          ))}
        </div>

        {/* Load More Button */}
        {filteredRankings.length < rankings.length && (
          <div className="p-4 text-center border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <Button 
              variant="outline" 
              onClick={() => setDisplayCount(prev => prev + 10)}
              className="bg-white/90 backdrop-blur-sm hover:bg-blue-50 border-gray-300 hover:border-blue-400 transition-all duration-200 px-6 py-2"
            >
              Load More Members
            </Button>
          </div>
        )}
        
        {filteredRankings.length === 0 && !loading && (
          <MemberRankingEmpty />
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMemberRanking;
