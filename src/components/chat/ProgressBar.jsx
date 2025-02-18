import React from 'react';

export const ProgressBar = ({ currentStep }) => {
  const stepOrder = ['location', 'climate_details', 'soil_details', 'practices', 'economic', 'goals', 'system'];
  const currentIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentIndex + 1) / stepOrder.length) * 100;

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
      <div
        className="h-full bg-blue-500 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
