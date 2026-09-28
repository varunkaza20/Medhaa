import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { TextInput } from '../components/TextInput';
import { ResultCard } from '../components/ResultCard';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { ModelCard } from '../components/ModelCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { analyzeSentiment } from '../services/api';
import type { SentimentResult } from '../services/api';
import { Smile, ChevronDown, ChevronUp, HelpCircle, Database } from 'lucide-react';

export const SentimentPage: React.FC = () => {
  // Real sanity-check sentence used in the training notebook
  const [text, setText] = useState('ఈ సినిమా చాలా బాగుంది');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showDataInfo, setShowDataInfo] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await analyzeSentiment(text);
      setResult(res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Mock token importance for explanation feature
  const renderTokenImportance = () => {
    const tokens = text.split(/\s+/);
    return (
      <div className="p-4 rounded-lg bg-panel border border-border space-y-3">
        <p className="text-xs text-text-muted font-mono">
          Token-level gradient attribution score (Saliency map):
        </p>
        <div className="flex flex-wrap gap-2 items-center text-sm font-sans">
          {tokens.map((tok, i) => {
            const isPosKey = /బాగుంది|మంచి|అద్భుతం|సంతోషం|good|great/i.test(tok);
            const isNegKey = /చెత్త|చెడు|బాగోలేదు|bad|worst/i.test(tok);

            let colorClass = 'bg-card text-text-primary border-border';
            if (isPosKey) colorClass = 'bg-success/20 text-success border-success/40 font-semibold';
            else if (isNegKey) colorClass = 'bg-error/20 text-error border-error/40 font-semibold';

            return (
              <span
                key={i}
                className={`px-2 py-1 rounded border text-xs font-mono transition-all ${colorClass}`}
              >
                {tok}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sentiment Analysis"
        subtitle="Detect emotional polarity in Telugu sentences using a fine-tuned IndicBERTv2 classifier trained on three merged Telugu sentiment datasets."
        badge="Text Classification"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form + Output */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-5 rounded-lg border border-border space-y-4">
            <TextInput
              value={text}
              onChange={setText}
              placeholder="Enter Telugu text to analyze sentiment..."
              label="TELUGU TEXT INPUT"
              onSubmit={handleAnalyze}
            />
            <div className="flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-accent hover:bg-accent-light text-white font-mono text-xs font-semibold transition-all disabled:opacity-50"
              >
                <Smile className="w-4 h-4" />
                <span>Analyze Sentiment</span>
              </button>
            </div>
          </div>

          {loading && <LoadingState variant="simple" message="Computing sentiment logits..." />}
          {error && <ErrorState onRetry={handleAnalyze} />}

          {!result && !loading && !error && (
            <EmptyState instruction="Enter Telugu text above to predict POSITIVE, NEUTRAL, or NEGATIVE sentiment." />
          )}

          {result && !loading && (
            <div className="space-y-6">
              {/* Primary Large Result Card */}
              <ResultCard
                title="PREDICTED SENTIMENT"
                value={result.label}
                subtitle={`Prediction confidence: ${(result.confidence * 100).toFixed(2)}%`}
                variant={
                  result.label === 'POSITIVE'
                    ? 'success'
                    : result.label === 'NEGATIVE'
                    ? 'error'
                    : 'warning'
                }
                icon={<Smile className="w-5 h-5" />}
              />

              {/* Class Probabilities */}
              <div className="p-5 rounded-lg bg-card border border-border space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted font-medium">
                  CLASS PROBABILITY DISTRIBUTION
                </h4>
                <div className="space-y-3">
                  <ConfidenceBar
                    label="POSITIVE"
                    value={result.probabilities.positive}
                    color="success"
                  />
                  <ConfidenceBar
                    label="NEUTRAL"
                    value={result.probabilities.neutral}
                    color="warning"
                  />
                  <ConfidenceBar
                    label="NEGATIVE"
                    value={result.probabilities.negative}
                    color="error"
                  />
                </div>
              </div>

              {/* Collapsed Secondary Explanation Section */}
              <div className="border border-border/70 rounded-lg bg-panel/40 overflow-hidden">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full p-4 flex items-center justify-between text-xs font-mono text-text-secondary hover:text-text-primary transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-accent" />
                    <span>Why this prediction? (Token Importance Saliency)</span>
                  </div>
                  {showExplanation ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {showExplanation && <div className="p-4 pt-0">{renderTokenImportance()}</div>}
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
              {showDataInfo ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {showDataInfo && (
              <div className="p-4 pt-0 space-y-3 text-xs font-mono text-text-secondary">
                <p className="leading-relaxed font-sans text-text-secondary text-xs">
                  The model was trained on <strong className="text-text-primary">three merged and deduplicated Telugu sentiment sources</strong>:
                </p>
                <div className="space-y-2">
                  <div className="p-3 rounded bg-card border border-border space-y-1">
                    <div className="text-text-primary font-semibold">ACTSA (indic_glue · actsa-sc.te)</div>
                    <div className="text-text-muted">4,328 train / 541 val / 541 test · binary (pos/neg only)</div>
                  </div>
                  <div className="p-3 rounded bg-card border border-border space-y-1">
                    <div className="text-text-primary font-semibold">Mounika Telugu Sentiment</div>
                    <div className="text-text-muted">24,599 train / 3,510 val / 7,033 test · 3-class</div>
                  </div>
                  <div className="p-3 rounded bg-card border border-border space-y-1">
                    <div className="text-text-primary font-semibold">AI4Bharat IndicSentiment (te)</div>
                    <div className="text-text-muted">1,000 test / 156 val only — no train split available</div>
                  </div>
                </div>
                <div className="p-3 rounded bg-card border border-border space-y-1">
                  <div className="text-text-primary font-semibold">Combined (after dedup)</div>
                  <div className="text-text-muted">28,798 train / 4,206 val / 8,562 test · 3-class</div>
                </div>
                <div className="p-3 rounded bg-warning/10 border border-warning/30 text-warning text-[11px] leading-relaxed">
                  <strong>Class imbalance note:</strong> Train label distribution — neutral 13,179 · positive 8,942 · negative 6,677. The dataset is skewed toward neutral, which the model reflects.
                </div>
                <div className="text-text-muted text-[11px] leading-relaxed">
                  Real model outputs from the notebook — <span className="text-text-primary">"ఈ సినిమా చాలా బాగుంది"</span> → POSITIVE (98.4%); <span className="text-text-primary">"ఈ సినిమా బాగోలేదు"</span> → NEGATIVE (98.9%).
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Model Info */}
        <div className="space-y-4">
          <ModelCard
            modelName="varunkaza20/telugu-sentiment"
            task="Text Classification"
            classes={['POSITIVE', 'NEUTRAL', 'NEGATIVE']}
            hfRepo="varunkaza20/telugu-sentiment"
            metric="Best Accuracy: 72.80% (IndicBERTv2)"
          />

          {/* Benchmark Ranking */}
          <div className="p-4 rounded-lg bg-panel border border-border text-xs space-y-3">
            <h5 className="font-mono text-text-primary font-semibold">Benchmark Ranking</h5>
            <p className="text-text-muted text-[11px]">5 epochs · batch 16 · max length 128</p>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-success font-semibold">
                <span>1. IndicBERTv2-MLM-only</span>
                <span>72.80% / 72.68%</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>2. MuRIL</span>
                <span>70.23% / 69.71%</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>3. XLM-R</span>
                <span>68.66% / 68.23%</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>4. mBERT</span>
                <span>64.51% / 63.04%</span>
              </div>
              <div className="text-text-muted text-[10px] pt-1 border-t border-border">Acc / Macro-F1</div>
            </div>
          </div>

          {/* Model Specs */}
          <div className="p-4 rounded-lg bg-panel border border-border text-xs text-text-secondary space-y-2">
            <h5 className="font-mono text-text-primary font-semibold">Model Specs</h5>
            <p className="leading-relaxed">
              Fine-tuned IndicBERTv2-MLM-only sequence classifier for 3-class Telugu sentiment polarity. Trained on three merged sources (ACTSA + Mounika + IndicSentiment), deduplicated to 28,798 training examples.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
