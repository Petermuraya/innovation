
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const DashboardLoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-kic-lightGray">
      <Card>
        <CardContent className="p-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p>Loading dashboard...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardLoadingState;
