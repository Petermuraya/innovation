
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackToDashboard = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleBackToDashboard}
      className="flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Dashboard
    </Button>
  );
};

export default BackToDashboard;
