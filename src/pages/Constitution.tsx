import { Helmet } from 'react-helmet-async';
import DashboardConstitution from '@/components/dashboard/user/DashboardConstitution';

const Constitution = () => {
  return (
    <>
      <Helmet>
        <title>Constitution - Karatina Innovation Club</title>
        <meta name="description" content="View the official constitution and governance documents of Karatina Innovation Club" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <DashboardConstitution />
        </div>
      </div>
    </>
  );
};

export default Constitution;