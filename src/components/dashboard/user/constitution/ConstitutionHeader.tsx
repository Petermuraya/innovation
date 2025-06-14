
import { FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ConstitutionHeader = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6 text-kic-green-600" />
        <h2 className="text-2xl font-bold">KIC Constitution</h2>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          The constitution outlines the rules, governance structure, and guidelines for the Karatina Innovation Club. 
          All members should familiarize themselves with these documents.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ConstitutionHeader;
