import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { TextInput } from '../components/TextInput';
import { EntityHighlight } from '../components/EntityHighlight';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { ModelCard } from '../components/ModelCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { detectCodeSwitching } from '../services/api';
import type { CodeSwitchResult } from '../services/api';
import { ArrowRightLeft, HelpCircle, Database, ChevronDown, ChevronUp } from 'lucide-react';

export const CodeSwitchingPage: React.FC = () => {
  const [mode, setMode] = useState<'native' | 'romanized'>('native');

  // Real demo outputs confirmed working from the notebook
  const [text, setText] = useState(
    'నాకు ఈ movie చాలా interesting గా అనిపించింది.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<CodeSwitchResult | null>(null);
  const [showDataInfo, setShowDataInfo] = useState(false);

  const handleModeChange = (newMode: 'native' | 'romanized') => {
    setMode(newMode);
    setResult(null);
    if (newMode === 'romanized') {
      setText('nenu office ki veltanu today');
    } else {
      setText('నాకు ఈ movie చాలా interesting గా అనిపించింది.');
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await detectCodeSwitching(text, mode);
      setResult(res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Per-class F1 for mBERT (chosen model) — real notebook results
  const perClassF1 = [
    { label: 'en (English)', f1: 0.945, support: 2879, color: 'success' as const },
    { label: 'te (Telugu)', f1: 0.859, support: 1612, color: 'accent' as const },
    { label: 'univ (Universal)', f1: 0.735, support: 1268, color: 'warning' as const },
    { label: 'ne (Named Entity)', f1: 0.342, support: 112, color: 'error' as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telugu-English Code-Switching (LID)"
        subtitle="Detect word-level language identity in mixed Telugu-English sequences using a fine-tuned mBERT token classifier."
        badge="Language Identification"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form + Output */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mode Segmented Control + Explanation */}
          <div className="bg-card p-5 rounded-lg border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <span className="text-xs font-mono font-semibold text-text-secondary uppercase">
                SELECT INPUT MODE
              </span>
              <div className="flex items-center bg-panel p-1 rounded-lg border border-border">
                <button
                  onClick={() => handleModeChange('native')}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                    mode === 'native'
                      ? 'bg-accent text-white shadow-sm font-semibold'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Native Script (తెలుగు)
                </button>
                <button
                  onClick={() => handleModeChange('romanized')}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                    mode === 'romanized'
                      ? 'bg-accent text-white shadow-sm font-semibold'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Romanized (Tanglish/Latin)
                </button>
              </div>
            </div>

            {/* Mode explanation */}
            <div className="p-3 rounded bg-panel/70 border border-border/80 text-xs font-mono text-text-muted flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {mode === 'romanized' ? (
                  <span className="text-warning">
                    <strong>Why Romanized LID is harder:</strong> Romanized Telugu shares the Latin script (ASCII) with English. Distinguishing Romanized Telugu tokens (e.g., "velthanu") from English tokens requires deep contextual language modeling rather than a simple Unicode range check.
                  </span>
                ) : (
                  <span>
                    <strong>Native Script Mode:</strong> Uses a Unicode range check (U+0C00–U+0C7F) for native Telugu tokens. No model is invoked for pure native-script identification — only the mBERT classifier handles Romanized input.
                  </span>
                )}
              </p>
            </div>

            <TextInput
              value={text}
              onChange={setText}
              placeholder={
                mode === 'native'
                  ? 'Enter mixed Telugu + English text...'
                  : 'Enter romanized Telugu + English text...'
              }
              label={`${mode.toUpperCase()} MODE INPUT`}
              onSubmit={handleAnalyze}
            />

            <div className="flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-accent hover:bg-accent-light text-white font-mono text-xs font-semibold transition-all disabled:opacity-50"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Analyze Code-Switching</span>
              </button>
            </div>
          </div>

          {loading && <LoadingState variant="simple" message="Classifying token language tags..." />}
          {error && <ErrorState onRetry={handleAnalyze} />}

          {!result && !loading && !error && (
            <EmptyState instruction="Enter mixed Telugu and English text above to analyze token-level code-switching." />
          )}

          {result && !loading && (
            <div className="space-y-6">
              {/* Token Highlights */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider font-semibold">
                  TOKEN-LEVEL LANGUAGE TAGGING
                </span>
                <EntityHighlight tokens={result.tokens} />
              </div>

              {/* Language Distribution Bar */}
              <div className="p-5 rounded-lg bg-card border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-text-muted font-medium">
                    COMPUTED LANGUAGE DISTRIBUTION
                  </span>
                  <span className="text-xs font-mono text-text-secondary">
                    Telugu {result.distribution.telugu_pct}% / English {result.distribution.english_pct}%
                  </span>
                </div>

                <div className="space-y-3">
                  <ConfidenceBar
                    label="TELUGU TOKENS"
                    value={result.distribution.telugu_pct}
                    color="accent"
                  />
                  <ConfidenceBar
                    label="ENGLISH TOKENS"
                    value={result.distribution.english_pct}
                    color="success"
                  />
                </div>
              </div>
            </div>
          )}

          {/* About the Data — collapsible */}
          <div className="border border-border/70 rounded-lg bg-panel/40 overflow-hidden">
            <button
              onClick={() => setShowDataInfo(!showDataInfo)}
              className="w-full p-4 flex items-center justify-between text-xs font-mono text-text-secondary hover:text-text-primary transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-accent" />
                <span>About the Training Data</span>
              </div>
              {showDataInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showDataInfo && (
              <div className="p-4 pt-0 space-y-3 text-xs font-mono text-text-secondary">
                <p className="font-sans text-xs text-text-secondary leading-relaxed">
                  The Romanized LID model was trained on a <strong className="text-text-primary">small Tanglish code-switching dataset</strong> — 1,585 sentences parsed from the training file (1,584 after dropping one unlearnable <code className="bg-panel px-1 rounded text-accent-light">mix</code>-tagged sentence). This is a small dataset; results should be interpreted accordingly.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded bg-card border border-border text-center space-y-1">
                    <div className="text-text-muted uppercase text-[10px]">Train</div>
                    <div className="text-text-primary font-semibold">1,426</div>
                    <div className="text-text-muted text-[10px]">sentences</div>
                  </div>
                  <div className="p-3 rounded bg-card border border-border text-center space-y-1">
                    <div className="text-text-muted uppercase text-[10px]">Validation</div>
                    <div className="text-text-primary font-semibold">158</div>
                    <div className="text-text-muted text-[10px]">sentences</div>
                  </div>
                  <div className="p-3 rounded bg-card border border-accent/30 text-center space-y-1">
                    <div className="text-accent-light uppercase text-[10px] font-semibold">Test</div>
                    <div className="text-text-primary font-semibold">393</div>
                    <div className="text-text-muted text-[10px]">separate file</div>
                  </div>
                </div>
                <div className="p-3 rounded bg-card border border-border space-y-1">
                  <div className="text-text-primary font-semibold mb-1">Label Set</div>
                  <div className="flex flex-wrap gap-2">
                    {['en (English)', 'te (Telugu)', 'univ (punct/emoticons)', 'ne (named entity)'].map((l) => (
                      <span key={l} className="px-2 py-0.5 rounded bg-panel border border-border text-text-secondary text-[11px]">{l}</span>
                    ))}
                  </div>
                  <div className="text-text-muted text-[10px] mt-1">
                    A <code className="bg-panel px-1 rounded">mix</code> label existed but occurred exactly once and was dropped.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Model Info */}
        <div className="space-y-4">
          <ModelCard
            modelName="varunkaza20/telugu-english-code-switch-lid"
            task="Token Classification (LID)"
            classes={['en', 'te', 'univ', 'ne']}
            hfRepo="varunkaza20/telugu-english-code-switch-lid"
            metric="Accuracy: 86.99% | Macro-F1: 72.04% (mBERT)"
          />

          {/* Per-Class F1 breakdown */}
          <div className="p-4 rounded-lg bg-panel border border-border text-xs space-y-3">
            <h5 className="font-mono text-text-primary font-semibold">Per-Class F1 (mBERT)</h5>
            <div className="space-y-2.5">
              {perClassF1.map((cls) => (
                <div key={cls.label} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-text-secondary">{cls.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted text-[10px]">n={cls.support.toLocaleString()}</span>
                      <span className={`font-semibold ${cls.color === 'error' ? 'text-error' : cls.color === 'warning' ? 'text-warning' : cls.color === 'success' ? 'text-success' : 'text-accent-light'}`}>
                        {(cls.f1 * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-card rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cls.color === 'error' ? 'bg-error' : cls.color === 'warning' ? 'bg-warning' : cls.color === 'success' ? 'bg-success' : 'bg-accent'}`}
                      style={{ width: `${cls.f1 * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2.5 rounded bg-warning/10 border border-warning/30 text-warning text-[11px] font-mono leading-normal">
              <strong>Caveat:</strong> Macro-F1 is dragged down by the <code>ne</code> class — only 112 test instances, not a modeling flaw but a data scarcity issue.
            </div>
          </div>

          {/* Benchmark ranking */}
          <div className="p-4 rounded-lg bg-panel border border-border text-xs space-y-2">
            <h5 className="font-mono text-text-primary font-semibold">Model Comparison</h5>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-success font-semibold">
                <span>mBERT (best)</span><span>86.99% / 72.04%</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>XLM-R</span><span>87.46% / 69.01%</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>IndicBERTv2</span><span>84.50% / 61.38%</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>MuRIL</span><span>84.65% / 60.80%</span>
              </div>
              <div className="text-text-muted text-[10px] pt-1 border-t border-border">Acc / Macro-F1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
