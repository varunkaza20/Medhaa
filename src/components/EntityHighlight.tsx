import React from 'react';
import type { EntityItem, CodeSwitchToken } from '../services/api';
import { LanguageBadge } from './LanguageBadge';

interface EntityHighlightProps {
  text?: string;
  entities?: EntityItem[];
  tokens?: CodeSwitchToken[];
  showBadgesInline?: boolean;
}

export const EntityHighlight: React.FC<EntityHighlightProps> = ({
  text,
  entities,
  tokens,
  showBadgesInline = true,
}) => {
  // Option 1: Rendering code-switching tokens
  if (tokens && tokens.length > 0) {
    return (
      <div className="p-4 rounded-lg bg-panel border border-border flex flex-wrap gap-2 items-center leading-relaxed text-sm md:text-base">
        {tokens.map((token, idx) => {
          const isTelugu = token.tag === 'TELUGU';
          const isEnglish = token.tag === 'ENGLISH';
          const isNE = token.tag === 'NAMED_ENTITY';

          let bgClass = 'bg-card text-text-primary border-border';
          if (isTelugu) bgClass = 'bg-accent/10 border-accent/30 text-text-primary';
          else if (isEnglish) bgClass = 'bg-success/10 border-success/30 text-text-primary';
          else if (isNE) bgClass = 'bg-warning/10 border-warning/30 text-text-primary';

          return (
            <span
              key={idx}
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border transition-all ${bgClass}`}
            >
              <span className="font-sans font-medium">{token.text}</span>
              {showBadgesInline && (
                <LanguageBadge label={token.tag} size="sm" />
              )}
            </span>
          );
        })}
      </div>
    );
  }

  // Option 2: Rendering sentence with highlighted Entity Spans
  if (text && entities) {
    if (entities.length === 0) {
      return (
        <div className="p-4 rounded-lg bg-panel border border-border text-text-primary text-sm md:text-base leading-relaxed">
          {text}
        </div>
      );
    }

    // Build segments by start/end index
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    const sortedEntities = [...entities].sort((a, b) => a.start - b.start);

    sortedEntities.forEach((ent, i) => {
      // Unhighlighted text before this entity
      if (ent.start > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`} className="text-text-primary">
            {text.slice(lastIndex, ent.start)}
          </span>
        );
      }

      // Entity span
      const entText = text.slice(ent.start, ent.end);
      const styleMap: Record<string, string> = {
        PERSON: 'bg-accent/20 border-accent/40 text-accent-light',
        LOCATION: 'bg-success/20 border-success/40 text-success',
        ORGANIZATION: 'bg-warning/20 border-warning/40 text-warning',
        DATE: 'bg-error/20 border-error/40 text-error',
        MISC: 'bg-text-muted/20 border-border text-text-primary',
      };

      const highlightClass = styleMap[ent.type] || 'bg-accent/20 border-accent/40 text-accent-light';

      segments.push(
        <mark
          key={`ent-${i}-${ent.start}`}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 mx-0.5 rounded border font-normal ${highlightClass}`}
        >
          <span className="font-medium">{entText}</span>
          <LanguageBadge label={ent.type} size="sm" />
        </mark>
      );

      lastIndex = ent.end;
    });

    if (lastIndex < text.length) {
      segments.push(
        <span key={`text-${lastIndex}`} className="text-text-primary">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return (
      <div className="p-4 rounded-lg bg-panel border border-border leading-relaxed text-sm md:text-base">
        {segments}
      </div>
    );
  }

  return null;
};
