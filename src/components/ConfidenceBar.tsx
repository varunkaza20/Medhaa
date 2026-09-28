import React from 'react';

interface ConfidenceBarProps {
  label: string;
  value: number; // 0 to 1 or 0 to 100
  color?: 'accent' | 'success' | 'warning' | 'error' | 'muted';
  showPercentage?: boolean;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  label,
  value,
  color = 'accent',
  showPercentage = true,
}) => {
  // Normalize value to percentage string
  const pct = value <= 1 ? Math.round(value * 100) : Math.round(value);

  const barColors = {
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    muted: 'bg-text-muted',
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-text-primary uppercase tracking-wide">{label}</span>
        {showPercentage && <span className="text-text-secondary font-semibold">{pct}%</span>}
      </div>
      <div className="h-2 w-full rounded-full bg-panel overflow-hidden border border-border/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColors[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
};
