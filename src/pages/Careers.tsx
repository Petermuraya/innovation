
import CareerBoard from '@/components/careers/CareerBoard';
import ProtectedRoute from '@/components/security/ProtectedRoute';

const Careers = () => {
  return (
    <ProtectedRoute requireApproval={true}>
      <div className="min-h-screen bg-kic-lightGray">
        <div className="container mx-auto p-6">
          <CareerBoard />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Careers;
