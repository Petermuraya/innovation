
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Award } from 'lucide-react';

interface CommunitiesHeaderProps {
  userMembershipCount: number;
}

const CommunitiesHeader = ({ userMembershipCount }: CommunitiesHeaderProps) => {
  return (
    <Card className="bg-gradient-to-r from-kic-green-500 to-kic-green-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Innovation Communities</h2>
            <p className="text-kic-green-100">
              Join specialized communities to collaborate, learn, and build amazing projects together.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">{userMembershipCount}</div>
              <div className="text-sm text-kic-green-100">Joined</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-kic-green-100">Max Limit</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-kic-green-100">Available</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunitiesHeader;
