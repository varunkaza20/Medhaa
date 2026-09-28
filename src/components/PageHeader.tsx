import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
}) => {
  return (
    <div className="mb-6 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-text-primary">
            {title}
          </h1>
          {badge && (
            <span className="text-[10px] font-mono uppercase bg-accent/15 text-accent-light px-2 py-0.5 rounded border border-accent/30 font-semibold">
              {badge}
            </span>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <p className="text-xs md:text-sm font-sans text-text-secondary leading-relaxed">
        {subtitle}
      </p>
      <hr className="border-border my-3" />
    </div>
  );
};
