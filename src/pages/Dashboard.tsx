import React, { useState } from 'react';
import { TextInput } from '../components/TextInput';
import { ResultCard } from '../components/ResultCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { analyzeAll } from '../services/api';
import type { AnalyzeAllResult } from '../services/api';
import { Sparkles, ArrowRight, Smile, Tag, Globe, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [text, setText] = useState('హైదరాబాద్లోని Microsoft ఆఫీస్లో విజయవంతంగా సమావేశం ముగిసింది.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<AnalyzeAllResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await analyzeAll(text);
      setResult(res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Hero Section */}
      <div className="text-center space-y-3 py-6">
        <h1 className="font-telugu text-6xl md:text-7xl font-bold text-text-primary tracking-tight">
          మేధా
        </h1>
        <h2 className="text-lg md:text-xl font-mono text-accent-light font-medium tracking-wide">
          Telugu Language Intelligence
        </h2>
        <p className="text-sm text-text-secondary font-sans max-w-xl mx-auto leading-relaxed">
          Medhaa is a Telugu NLP toolkit — four tools for sentiment analysis, named entity recognition, transliteration, and code-switching detection in Telugu text.
        </p>
      </div>

      {/* Input Block */}
      <div className="bg-card p-6 rounded-lg border border-border space-y-4 shadow-xl">
        <TextInput
          value={text}
          onChange={setText}
          placeholder="Enter Telugu script (e.g. హైదరాబాద్‌లో సమావేశం జరిగాయి) or Romanized text..."
          label="INPUT TEXT FOR ALL NLP TASKS"
          onSubmit={handleAnalyze}
          helperText="Unified evaluation across all 4 Telugu NLP models"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-accent hover:bg-accent-light text-white font-mono text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-accent/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Text</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && <LoadingState variant="simple" message="Evaluating multitask models..." />}

      {/* Error State */}
      {error && <ErrorState onRetry={handleAnalyze} />}

      {/* 4 Compact Result Cards */}
      {result && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider font-semibold">
              EVALUATION RESULTS
            </span>
            <Link
              to="/analyze"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
            >
              <span>View Full Unified Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              title="SENTIMENT"
              value={result.sentiment.label}
              subtitle={`${(result.sentiment.confidence * 100).toFixed(1)}% confidence`}
              variant={
                result.sentiment.label === 'POSITIVE'
                  ? 'success'
                  : result.sentiment.label === 'NEGATIVE'
                    ? 'error'
                    : 'warning'
              }
              icon={<Smile className="w-4 h-4" />}
            />

            <ResultCard
              title="NAMED ENTITIES"
              value={`${result.ner.entities.length} Detected`}
              subtitle={
                result.ner.entities.length > 0
                  ? result.ner.entities.map((e) => e.text).slice(0, 2).join(', ')
                  : 'No entities found'
              }
              variant="accent"
              icon={<Tag className="w-4 h-4" />}
            />

            <ResultCard
              title="SCRIPT / LANG"
              value={result.language}
              subtitle="Script detection"
              variant="default"
              icon={<Globe className="w-4 h-4 text-accent" />}
            />

            <ResultCard
              title="CODE-SWITCHING"
              value={`${result.codeSwitch.distribution.telugu_pct}% TE`}
              subtitle={`${result.codeSwitch.distribution.english_pct}% English`}
              variant="warning"
              icon={<ArrowRightLeft className="w-4 h-4" />}
            />
          </div>
        </div>
      )}
    </div>
  );
};
