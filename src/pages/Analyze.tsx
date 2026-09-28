import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { TextInput } from '../components/TextInput';
import { ResultCard } from '../components/ResultCard';
import { EntityHighlight } from '../components/EntityHighlight';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { analyzeAll } from '../services/api';
import type { AnalyzeAllResult } from '../services/api';
import { Sparkles, Download, Smile, Tag, ArrowRightLeft, Globe } from 'lucide-react';

export const AnalyzePage: React.FC = () => {
  const [text, setText] = useState(
    'హైదరాబాద్‌లోని Microsoft కంపెనీలో వెంకటేష్ కొత్త ప్రాజెక్ట్ ప్రారంభించారు. It was an amazing experience!'
  );
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

  const handleExportJSON = () => {
    if (!result) return;
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medhaa_analysis_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified Multitask Analysis"
        subtitle="Single-pass pipeline evaluation executing Sentiment, NER, Code-Switching, and Script Identification concurrently."
        badge="Unified Pipeline"
        action={
          result && (
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-panel border border-border text-xs font-mono font-semibold text-text-primary hover:border-accent hover:text-accent transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-accent" />
              <span>Export as JSON</span>
            </button>
          )
        }
      />

      {/* Input Card */}
      <div className="bg-card p-6 rounded-lg border border-border space-y-4 shadow-lg">
        <TextInput
          value={text}
          onChange={setText}
          placeholder="Enter Telugu script, Romanized Telugu, or mixed code-switched text..."
          label="INPUT TEXT FOR ALL 4 NLP MODELS"
          onSubmit={handleAnalyze}
          helperText="Triggers Sentiment, NER, LID, and Language Script pipeline"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-accent hover:bg-accent-light text-white font-mono text-sm font-semibold transition-all disabled:opacity-50 shadow-md shadow-accent/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Unified Pipeline</span>
          </button>
        </div>
      </div>

      {/* Staged Loading State */}
      {loading && <LoadingState variant="staged" />}

      {/* Error State */}
      {error && <ErrorState onRetry={handleAnalyze} />}

      {!result && !loading && !error && (
        <EmptyState instruction="Enter text above to evaluate all 4 NLP tasks concurrently in a single pass." />
      )}

      {/* Results Sections */}
      {result && !loading && (
        <div className="space-y-8 animate-fadeIn">
          {/* SECTION 1: SENTIMENT ANALYSIS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-accent-light uppercase border-b border-border pb-2">
              <Smile className="w-4 h-4" />
              <span>1. SENTIMENT ANALYSIS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard
                title="PREDICTED CLASS"
                value={result.sentiment.label}
                subtitle={`Confidence: ${(result.sentiment.confidence * 100).toFixed(1)}%`}
                variant={
                  result.sentiment.label === 'POSITIVE'
                    ? 'success'
                    : result.sentiment.label === 'NEGATIVE'
                    ? 'error'
                    : 'warning'
                }
              />
              <div className="md:col-span-2 p-5 rounded-lg bg-card border border-border space-y-3">
                <span className="text-xs font-mono uppercase text-text-muted">
                  Logit Probabilities
                </span>
                <ConfidenceBar label="POSITIVE" value={result.sentiment.probabilities.positive} color="success" />
                <ConfidenceBar label="NEUTRAL" value={result.sentiment.probabilities.neutral} color="warning" />
                <ConfidenceBar label="NEGATIVE" value={result.sentiment.probabilities.negative} color="error" />
              </div>
            </div>
          </section>

          <hr className="border-border" />

          {/* SECTION 2: NAMED ENTITIES */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-success uppercase">
                <Tag className="w-4 h-4" />
                <span>2. NAMED ENTITY RECOGNITION (NER)</span>
              </div>
              <span className="text-xs font-mono text-text-muted">
                {result.ner.entities.length} entities extracted
              </span>
            </div>

            <EntityHighlight text={text} entities={result.ner.entities} />

            {result.ner.entities.length > 0 && (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-panel text-text-muted">
                    <tr>
                      <th className="px-4 py-2 font-medium">ENTITY</th>
                      <th className="px-4 py-2 font-medium">TYPE</th>
                      <th className="px-4 py-2 font-medium text-right">CONFIDENCE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {result.ner.entities.map((ent, idx) => (
                      <tr key={idx} className="hover:bg-panel/40">
                        <td className="px-4 py-2.5 font-sans font-semibold text-text-primary">{ent.text}</td>
                        <td className="px-4 py-2.5 text-accent-light">{ent.type}</td>
                        <td className="px-4 py-2.5 text-right text-success">{(ent.confidence * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <hr className="border-border" />

          {/* SECTION 3: CODE-SWITCHING */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-warning uppercase">
                <ArrowRightLeft className="w-4 h-4" />
                <span>3. TELUGU-ENGLISH CODE-SWITCHING (LID)</span>
              </div>
              <span className="text-xs font-mono text-text-muted">
                Telugu {result.codeSwitch.distribution.telugu_pct}% / English {result.codeSwitch.distribution.english_pct}%
              </span>
            </div>

            <EntityHighlight tokens={result.codeSwitch.tokens} />

            <div className="p-4 rounded-lg bg-card border border-border space-y-2">
              <ConfidenceBar label="TELUGU SCRIPT/TOKENS" value={result.codeSwitch.distribution.telugu_pct} color="accent" />
              <ConfidenceBar label="ENGLISH TOKENS" value={result.codeSwitch.distribution.english_pct} color="success" />
            </div>
          </section>

          <hr className="border-border" />

          {/* SECTION 4: LANGUAGE & SCRIPT IDENTIFICATION */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-text-primary uppercase border-b border-border pb-2">
              <Globe className="w-4 h-4 text-accent" />
              <span>4. LANGUAGE & SCRIPT IDENTIFICATION</span>
            </div>

            <div className="p-5 rounded-lg bg-card border border-border flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-text-muted uppercase">DETECTED LANGUAGE MIX</span>
                <div className="text-xl font-bold font-mono text-accent-light mt-1">
                  {result.language}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-text-muted uppercase">PIPELINE EXECUTION</span>
                <div className="text-xs font-mono text-success font-semibold mt-1">
                  Passed all 4 neural models
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
