
import React from 'react';
import ElectionAdvertisements from '@/components/elections/ElectionAdvertisements';
import RealTimeVoteTracker from '@/components/elections/RealTimeVoteTracker';

const ElectionBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ElectionAdvertisements maxAds={2} />
          <RealTimeVoteTracker compact showTitle={false} />
        </div>
      </div>
    </div>
  );
};

export default ElectionBanner;
