'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <div className="mb-8 flex items-center justify-center gap-3">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const active = step === currentStep;
        const done = step < currentStep;
        return (
          <div key={step} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-colors
                  ${
                    active || done
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                      : 'border-white/15 text-white/40'
                  }`}
              >
                {step}
              </div>
              <span
                className={`text-[11px] tracking-wide ${
                  active ? 'text-amber-400' : 'text-white/40'
                }`}
              >
                {labels[i]}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`h-px w-10 ${
                  done ? 'bg-amber-400/60' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
