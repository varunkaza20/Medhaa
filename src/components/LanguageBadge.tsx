import React from 'react';

export type BadgeType =
  | 'TELUGU'
  | 'ENGLISH'
  | 'OTHER'
  | 'PERSON'
  | 'LOCATION'
  | 'ORGANIZATION'
  | 'DATE'
  | 'MISC'
  | 'NAMED_ENTITY'
  | 'MIXED_TOKEN';

interface LanguageBadgeProps {
  label: string | BadgeType;
  type?: BadgeType;
  size?: 'sm' | 'md';
}

export const LanguageBadge: React.FC<LanguageBadgeProps> = ({
  label,
  type,
  size = 'md',
}) => {
  const badgeType = type || (label as BadgeType);

  const styleMap: Record<string, string> = {
    TELUGU: 'bg-accent/15 text-accent-light border-accent/30',
    ENGLISH: 'bg-success/15 text-success border-success/30',
    OTHER: 'bg-text-muted/15 text-text-secondary border-border',
    PERSON: 'bg-accent/20 text-accent-light border-accent/40',
    LOCATION: 'bg-success/20 text-success border-success/40',
    ORGANIZATION: 'bg-warning/20 text-warning border-warning/40',
    DATE: 'bg-error/20 text-error border-error/40',
    MISC: 'bg-text-muted/20 text-text-primary border-border',
    NAMED_ENTITY: 'bg-warning/15 text-warning border-warning/30',
    MIXED_TOKEN: 'bg-accent/20 text-accent border-accent/30',
  };

  const defaultStyle = 'bg-panel text-text-primary border-border';
  const sizeStyles = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-full border transition-all ${
        styleMap[badgeType] || defaultStyle
      } ${sizeStyles}`}
    >
      {label}
    </span>
  );
};
