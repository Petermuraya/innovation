
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardCertificatesProps {
  certificates: any[];
}

const DashboardCertificates = ({ certificates }: DashboardCertificatesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Certificates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-medium text-kic-gray">{cert.events?.title}</h4>
                <p className="text-sm text-kic-gray/70">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
              </div>
              <Button variant="outline" asChild>
                <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                  Download
                </a>
              </Button>
            </div>
          ))}
          {certificates.length === 0 && (
            <p className="text-kic-gray/70">No certificates yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCertificates;
