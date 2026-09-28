import React from 'react';
import { Cpu, Tag } from 'lucide-react';

interface ModelCardProps {
  modelName: string;
  task: string;
  classes: string[];
  hfRepo?: string;
  metric?: string;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  modelName,
  task,
  classes,
  hfRepo,
  metric,
}) => {
  return (
    <div className="p-4 rounded-lg bg-card border border-border space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-accent" />
          <span className="text-xs font-mono font-bold text-accent-light tracking-wide">
            {modelName}
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-panel px-2 py-0.5 rounded text-text-secondary border border-border/60">
          {task}
        </span>
      </div>

      {metric && (
        <div className="text-xs font-mono text-success flex items-center justify-between">
          <span className="text-text-muted">Benchmark Metric:</span>
          <span className="font-semibold">{metric}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted">
          <Tag className="w-3 h-3" />
          <span>Output Classes / Labels ({classes.length}):</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {classes.map((cls, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono bg-panel px-2 py-0.5 rounded border border-border text-text-secondary"
            >
              {cls}
            </span>
          ))}
        </div>
      </div>

      {hfRepo && (
        <div className="pt-1 text-[11px] font-mono text-text-muted truncate">
          Repo:{' '}
          <a
            href={`https://huggingface.co/${hfRepo}`}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            {hfRepo}
          </a>
        </div>
      )}
    </div>
  );
};
