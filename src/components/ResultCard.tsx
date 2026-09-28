import React from 'react';

interface ResultCardProps {
  title: string;
  value: string | React.ReactNode;
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent';
  icon?: React.ReactNode;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  subtitle,
  variant = 'default',
  icon,
  className = '',
}) => {
  const variantStyles = {
    default: 'border-border text-text-primary',
    success: 'border-success/30 bg-success/5 text-success',
    warning: 'border-warning/30 bg-warning/5 text-warning',
    error: 'border-error/30 bg-error/5 text-error',
    accent: 'border-accent/30 bg-accent/5 text-accent-light',
  };

  const badgeStyles = {
    default: 'text-text-secondary bg-panel',
    success: 'text-success bg-success/15',
    warning: 'text-warning bg-warning/15',
    error: 'text-error bg-error/15',
    accent: 'text-accent-light bg-accent/15',
  };

  return (
    <div
      className={`rounded-lg border bg-card p-5 transition-all shadow-sm ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-text-muted font-medium">
          {title}
        </span>
        {icon && <div className={`p-1.5 rounded ${badgeStyles[variant]}`}>{icon}</div>}
      </div>

      <div className="text-2xl md:text-3xl font-bold font-sans tracking-tight my-1">
        {value}
      </div>

      {subtitle && (
        <p className="text-xs font-mono text-text-secondary mt-2 border-t border-border/50 pt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};
