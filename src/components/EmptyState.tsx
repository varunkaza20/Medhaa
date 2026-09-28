import React from 'react';
import { Terminal } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  instruction?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Enter Telugu text to begin',
  instruction = 'Type or paste Telugu script or Romanized Telugu text above, then click Analyze.',
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-panel/50 rounded-lg border border-dashed border-border text-center my-6 space-y-3">
      <div className="p-3 bg-card rounded-full text-text-muted border border-border">
        {icon || <Terminal className="w-6 h-6 stroke-[1.5]" />}
      </div>
      <h3 className="text-sm font-mono font-semibold text-text-secondary">{title}</h3>
      <p className="text-xs text-text-muted max-w-md font-sans">{instruction}</p>
    </div>
  );
};
