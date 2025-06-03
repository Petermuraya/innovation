
import { Zap, Calendar, Users, BookOpen, LayoutGrid, Award } from 'lucide-react';

const MembershipBenefits = () => {
  const benefits = [
    { icon: <Zap className="h-5 w-5" />, text: 'Access to innovation workshops' },
    { icon: <Calendar className="h-5 w-5" />, text: 'Event participation' },
    { icon: <Users className="h-5 w-5" />, text: 'Networking opportunities' },
    { icon: <BookOpen className="h-5 w-5" />, text: 'Learning resources' },
    { icon: <LayoutGrid className="h-5 w-5" />, text: 'Project showcase' },
    { icon: <Award className="h-5 w-5" />, text: 'Membership certificate' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <h4 className="font-semibold mb-3">Membership Benefits</h4>
      <div className="grid grid-cols-2 gap-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="text-blue-500">{benefit.icon}</span>
            {benefit.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipBenefits;
