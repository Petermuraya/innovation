
import MemberCertificates from '@/components/certificates/MemberCertificates';

interface DashboardCertificatesProps {
  certificates: any[];
}

const DashboardCertificates = ({ certificates }: DashboardCertificatesProps) => {
  return <MemberCertificates />;
};

export default DashboardCertificates;
