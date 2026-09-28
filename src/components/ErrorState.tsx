import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  onRetry?: () => void;
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  onRetry,
  message = 'Unable to analyze this text. The model service may be temporarily unavailable.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-error/5 rounded-lg border border-error/30 text-center my-6 space-y-4">
      <div className="p-3 bg-error/15 rounded-full text-error">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-sm font-mono font-semibold text-error">Analysis Error</h3>
        <p className="text-xs text-text-secondary font-sans leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-panel border border-border text-xs font-mono font-medium text-text-primary hover:border-error hover:text-error transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
