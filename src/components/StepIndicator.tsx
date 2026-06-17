import React from 'react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  className?: string;
}

const steps = [
  { id: 1, label: 'Framework' },
  { id: 2, label: 'Profile' },
  { id: 3, label: 'Assessment' },
  { id: 4, label: 'Report' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const isDone = currentStep === 4;

  return (
    <div className="w-full py-1">
      <div className="flex items-center gap-2 sm:gap-3">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id || isDone;
          const isActive = currentStep === step.id && !isDone;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1 flex-1">
                {/* Bar */}
                <div className={cn(
                  'h-0.5 w-full rounded-full transition-all duration-500',
                  isCompleted ? 'bg-violet-600' :
                    isActive  ? 'bg-violet-400' :
                                'bg-slate-200'
                )} />
                {/* Label */}
                <span className={cn(
                  'text-[8px] font-semibold uppercase tracking-widest hidden sm:block transition-colors duration-300',
                  isCompleted || isActive ? 'text-violet-600' : 'text-slate-400'
                )}>
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
