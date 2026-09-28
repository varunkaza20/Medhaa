import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Cpu } from 'lucide-react';

interface LoadingStateProps {
  variant?: 'simple' | 'staged';
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'simple',
  message = 'Analyzing text...',
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Initializing NLP pipelines & checking models...',
    'Running Sentiment Classification (XLMR / mBERT)...',
    'Extracting Named Entities & syntactic tags...',
    'Performing Code-Switching Script & LID Detection...',
    'Synthesizing unified evaluation output...',
  ];

  useEffect(() => {
    if (variant === 'staged') {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 350);
      return () => clearInterval(interval);
    }
  }, [variant, steps.length]);

  if (variant === 'simple') {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg border border-border text-center my-6 space-y-3">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm font-mono text-text-secondary">{message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg border border-border space-y-6 my-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-accent/15 rounded-lg text-accent-light">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-sm font-mono font-semibold text-text-primary">
            Unified Multitask Pipeline Execution
          </h4>
          <p className="text-xs text-text-muted mt-0.5">
            Waking up models — first request can take up to 30s if cold starting on server.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={idx} className="flex items-center gap-3 text-xs md:text-sm">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-accent animate-spin flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-border flex-shrink-0" />
              )}
              <span
                className={`font-mono transition-colors ${
                  isDone
                    ? 'text-text-secondary line-through opacity-70'
                    : isCurrent
                    ? 'text-accent-light font-semibold'
                    : 'text-text-muted'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
