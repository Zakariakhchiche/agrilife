import React from 'react';

export const StepIndicator = ({ currentStep }) => {
  const steps = {
    location: 'Localisation',
    climate_details: 'Climat',
    soil_details: 'Sol',
    practices: 'Pratiques',
    economic: 'Économie',
    goals: 'Objectifs',
    system: 'Système'
  };

  return (
    <div className="text-sm font-medium text-gray-500">
      Étape actuelle : {steps[currentStep] || currentStep}
    </div>
  );
};
