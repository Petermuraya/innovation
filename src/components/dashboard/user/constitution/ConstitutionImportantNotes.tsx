
import { Card, CardContent } from '@/components/ui/card';

const ConstitutionImportantNotes = () => {
  return (
    <Card className="bg-kic-green-50 border-kic-green-200">
      <CardContent className="p-6">
        <h3 className="font-semibold text-kic-green-800 mb-2">Important Notes</h3>
        <ul className="text-sm text-kic-green-700 space-y-1">
          <li>• The constitution is a living document and may be updated periodically</li>
          <li>• All members are expected to abide by the rules and guidelines outlined</li>
          <li>• For questions about the constitution, contact the club administrators</li>
          <li>• Constitutional amendments require proper procedures as outlined in the document</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default ConstitutionImportantNotes;
