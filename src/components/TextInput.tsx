import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  maxLength?: number;
  onSubmit?: () => void;
  helperText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter Telugu text or Romanized Telugu here...',
  label = 'INPUT TEXT',
  disabled = false,
  maxLength = 500,
  onSubmit,
  helperText,
}) => {
  const count = value.length;
  const isNearLimit = count > maxLength * 0.9;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-mono tracking-wider font-semibold text-text-secondary uppercase">
            {label}
          </label>
        )}
        <span
          className={`text-xs font-mono ${
            isNearLimit ? 'text-warning font-semibold' : 'text-text-muted'
          }`}
        >
          {count} / {maxLength}
        </span>
      </div>

      <div className="relative rounded-lg border border-border bg-panel p-1 focus-within:border-accent transition-colors">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={4}
          className="w-full bg-transparent px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none resize-none font-sans text-sm md:text-base leading-relaxed"
        />
        {helperText && (
          <div className="px-3 pb-2 text-xs text-text-muted flex justify-between items-center">
            <span>{helperText}</span>
            <span className="text-[10px] font-mono text-text-muted/70">Press Ctrl+Enter to submit</span>
          </div>
        )}
      </div>
    </div>
  );
};
