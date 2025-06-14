
import { useConstitutionDocuments } from './constitution/useConstitutionDocuments';
import ConstitutionHeader from './constitution/ConstitutionHeader';
import ConstitutionDocumentCard from './constitution/ConstitutionDocumentCard';
import ConstitutionEmptyState from './constitution/ConstitutionEmptyState';
import ConstitutionImportantNotes from './constitution/ConstitutionImportantNotes';
import ConstitutionLoadingState from './constitution/ConstitutionLoadingState';

const DashboardConstitution = () => {
  const { documents, loading } = useConstitutionDocuments();

  if (loading) {
    return <ConstitutionLoadingState />;
  }

  return (
    <div className="space-y-6">
      <ConstitutionHeader />

      {documents.length === 0 ? (
        <ConstitutionEmptyState />
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <ConstitutionDocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}

      <ConstitutionImportantNotes />
    </div>
  );
};

export default DashboardConstitution;
