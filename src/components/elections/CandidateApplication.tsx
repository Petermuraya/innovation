
import React from 'react';
import { useCandidateApplication } from './candidate/useCandidateApplication';
import { EmptyNominationState } from './candidate/EmptyNominationState';
import { CandidateApplicationHeader } from './candidate/CandidateApplicationHeader';
import { UserApplicationsList } from './candidate/UserApplicationsList';
import { ApplicationForm } from './candidate/ApplicationForm';
import { AllPositionsAppliedState } from './candidate/AllPositionsAppliedState';

const CandidateApplication = () => {
  const {
    activeElection,
    userApplications,
    selectedPosition,
    setSelectedPosition,
    manifesto,
    setManifesto,
    handleSubmit,
    applyForPosition,
    availablePositions,
  } = useCandidateApplication();

  if (!activeElection) {
    return <EmptyNominationState />;
  }

  return (
    <div className="space-y-6">
      <CandidateApplicationHeader electionTitle={activeElection.title} />

      {userApplications && userApplications.length > 0 && (
        <UserApplicationsList applications={userApplications} />
      )}

      {availablePositions.length > 0 && (
        <ApplicationForm
          availablePositions={availablePositions}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          manifesto={manifesto}
          setManifesto={setManifesto}
          onSubmit={handleSubmit}
          isSubmitting={applyForPosition.isPending}
        />
      )}

      {availablePositions.length === 0 && userApplications && userApplications.length > 0 && (
        <AllPositionsAppliedState />
      )}
    </div>
  );
};

export default CandidateApplication;
