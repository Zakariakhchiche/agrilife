import React from 'react';

export const StepProgress = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div 
            className={`flex flex-col items-center cursor-pointer ${
              step.id === currentStep ? 'text-green-700' : 'text-gray-500'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${step.id === currentStep 
                ? 'bg-green-700 text-white' 
                : step.id < currentStep 
                  ? 'bg-green-200 text-green-700' 
                  : 'bg-gray-200'
              }
            `}>
              {step.id}
            </div>
            <span className="mt-2 text-sm font-medium">{step.title}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`
              flex-1 h-1 mx-4
              ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
