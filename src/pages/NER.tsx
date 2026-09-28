import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { TextInput } from '../components/TextInput';
import { EntityHighlight } from '../components/EntityHighlight';
import { LanguageBadge } from '../components/LanguageBadge';
import { ModelCard } from '../components/ModelCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { analyzeNER } from '../services/api';
import type { NERResult } from '../services/api';
import { Tag, Sparkles, AlertTriangle, ChevronDown, ChevronUp, Database } from 'lucide-react';

export const NERPage: React.FC = () => {
  // Real Naamapadam-style sentence with PER + LOC entities
  const [text, setText] = useState('రాహుల్ గాంధీ న్యూఢిల్లీలో మాట్లాడారు.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<NERResult | null>(null);
  const [showDataInfo, setShowDataInfo] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await analyzeNER(text);
      setResult(res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Named Entity Recognition (NER)"
        subtitle="Extract and classify named entities (PERSON, LOCATION, ORGANIZATION) in Telugu text using a fine-tuned XLM-R model on the Naamapadam Telugu corpus."
        badge="Token Classification"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form + Output */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-5 rounded-lg border border-border space-y-4">
            <TextInput
              value={text}
              onChange={setText}
              placeholder="Enter Telugu sentence with names, places, or orgs..."
              label="INPUT TELUGU TEXT"
              onSubmit={handleAnalyze}
            />
            <div className="flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-accent hover:bg-accent-light text-white font-mono text-xs font-semibold transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Entities</span>
              </button>
            </div>
          </div>

          {loading && <LoadingState variant="simple" message="Extracting entity spans..." />}
          {error && <ErrorState onRetry={handleAnalyze} />}

          {!result && !loading && !error && (
            <EmptyState instruction="Enter Telugu text containing names, cities, or organizations to view inline highlights and results table." />
          )}

          {result && !loading && (
            <div className="space-y-6">
              {/* Highlighted Sentence Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider font-semibold">
                    INLINE ENTITY HIGHLIGHTS
                  </span>
                  <span className="text-xs font-mono text-accent-light font-semibold">
                    {result.entities.length} {result.entities.length === 1 ? 'Entity' : 'Entities'} Found
                  </span>
                </div>
                <EntityHighlight text={text} entities={result.entities} />
              </div>

              {/* Entity Count Summary Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded bg-card border border-accent/30 text-center space-y-1">
                  <span className="text-[10px] font-mono text-text-muted uppercase">PERSON</span>
                  <div className="text-lg font-bold text-accent-light">
                    {result.entities.filter((e) => e.type === 'PERSON').length}
                  </div>
                </div>
                <div className="p-3 rounded bg-card border border-success/30 text-center space-y-1">
                  <span className="text-[10px] font-mono text-text-muted uppercase">LOCATION</span>
                  <div className="text-lg font-bold text-success">
                    {result.entities.filter((e) => e.type === 'LOCATION').length}
                  </div>
                </div>
                <div className="p-3 rounded bg-card border border-warning/30 text-center space-y-1">
                  <span className="text-[10px] font-mono text-text-muted uppercase">ORGANIZATION</span>
                  <div className="text-lg font-bold text-warning">
                    {result.entities.filter((e) => e.type === 'ORGANIZATION').length}
                  </div>
                </div>
              </div>

              {/* Full Results Table */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-panel flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-text-primary">
                    EXTRACTION RESULTS TABLE
                  </span>
                  <Tag className="w-3.5 h-3.5 text-text-muted" />
                </div>
                {result.entities.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-text-muted">
                    No named entities detected in this input sequence.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-panel/50 text-text-muted border-b border-border">
                        <tr>
                          <th className="px-4 py-2.5 font-medium">ENTITY TEXT</th>
                          <th className="px-4 py-2.5 font-medium">
                            ENTITY TYPE
                            <span className="ml-1 text-text-muted font-normal">(model→display)</span>
                          </th>
                          <th className="px-4 py-2.5 font-medium">SPAN INDEX</th>
                          <th className="px-4 py-2.5 font-medium text-right">CONFIDENCE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-text-primary">
                        {result.entities.map((ent, idx) => (
                          <tr key={idx} className="hover:bg-panel/40 transition-colors">
                            <td className="px-4 py-3 font-sans font-semibold text-text-primary">
                              {ent.text}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-text-muted text-[10px] font-mono">
                                  {ent.type === 'PERSON' ? 'PER' : ent.type === 'LOCATION' ? 'LOC' : 'ORG'} →
                                </span>
                                <LanguageBadge label={ent.type} size="sm" />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-text-muted">
                              [{ent.start}, {ent.end}]
                            </td>
                            <td className="px-4 py-3 text-right text-success font-semibold">
                              {(ent.confidence * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Subword fragmentation caveat */}
              <div className="p-3 rounded bg-warning/10 border border-warning/30 text-warning text-xs font-mono flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Subword note:</strong> The backend uses word-level aggregation (first subword per word). Raw pipeline output can fragment tokens — e.g. "అన|సూయ" for "అనసూయః" with mismatched confidence per piece. Confidence shown reflects the first subword.
                </span>
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
                <p className="leading-relaxed font-sans text-xs text-text-secondary">
                  Dataset: <strong className="text-text-primary">Naamapadam Telugu</strong> (AI4Bharat), downloaded as{' '}
                  <code className="bg-panel px-1 rounded text-accent-light">te_IndicNER_v1.0.zip</code>.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded bg-card border border-border space-y-1">
                    <div className="text-text-muted uppercase text-[10px]">Train</div>
                    <div className="text-text-primary font-semibold">100,000 sentences</div>
                    <div className="text-text-muted text-[10px]">sampled from 507,741 (deliberate scope decision)</div>
                  </div>
                  <div className="p-3 rounded bg-card border border-border space-y-1">
                    <div className="text-text-muted uppercase text-[10px]">Validation</div>
                    <div className="text-text-primary font-semibold">2,700 sentences</div>
                    <div className="text-text-muted text-[10px]">machine-projected</div>
                  </div>
                  <div className="p-3 rounded bg-card border border-border space-y-1">
                    <div className="text-text-muted uppercase text-[10px]">Projected Test</div>
                    <div className="text-text-primary font-semibold">847 sentences</div>
                    <div className="text-text-muted text-[10px]">label-projected, not human-annotated</div>
                  </div>
                  <div className="p-3 rounded bg-card border border-accent/30 space-y-1">
                    <div className="text-accent-light uppercase text-[10px] font-semibold">Gold Test</div>
                    <div className="text-text-primary font-semibold">50 sentences</div>
                    <div className="text-text-muted text-[10px]">human-verified (te_test.tsv)</div>
                  </div>
                </div>
                <div className="p-3 rounded bg-warning/10 border border-warning/30 text-warning text-[11px] leading-relaxed">
                  <strong>Label set:</strong> Model outputs <code>LOC, ORG, PER</code> (not full words). The frontend maps these: LOC→LOCATION, ORG→ORGANIZATION, PER→PERSON.
                </div>
                <div className="p-3 rounded bg-warning/10 border border-warning/30 text-warning text-[11px] leading-relaxed">
                  <strong>Gold test caveat:</strong> 50 sentences is a small set — F1 figures carry run-to-run variance. The 847-sentence projected test is larger but carries label noise from translation alignment. Both are reported on the Models page.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Model Card */}
        <div className="space-y-4">
          <ModelCard
            modelName="varunkaza20/telugu-ner"
            task="Token Classification (BIO)"
            classes={['B-PER', 'I-PER', 'B-LOC', 'I-LOC', 'B-ORG', 'I-ORG', 'O']}
            hfRepo="varunkaza20/telugu-ner"
            metric="Best F1: 82.99% gold (XLM-R)"
          />

          {/* Benchmark Ranking — both projected + gold F1 */}
          <div className="p-4 rounded-lg bg-panel border border-border text-xs space-y-3">
            <h5 className="font-mono text-text-primary font-semibold">Benchmark Ranking</h5>
            <p className="text-text-muted text-[11px]">3 epochs · batch 32 · dynamic padding + mixed precision</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="text-text-muted border-b border-border">
                    <th className="text-left pb-1.5">Model</th>
                    <th className="text-right pb-1.5">Proj. F1</th>
                    <th className="text-right pb-1.5">Gold F1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr className="text-success font-semibold">
                    <td className="py-1.5">XLM-R (best)</td>
                    <td className="text-right">84.37%</td>
                    <td className="text-right">82.99%</td>
                  </tr>
                  <tr className="text-text-secondary">
                    <td className="py-1.5">IndicBERTv2</td>
                    <td className="text-right">83.84%</td>
                    <td className="text-right">79.73%</td>
                  </tr>
                  <tr className="text-text-secondary">
                    <td className="py-1.5">MuRIL</td>
                    <td className="text-right">84.00%</td>
                    <td className="text-right">77.55%</td>
                  </tr>
                  <tr className="text-text-muted">
                    <td className="py-1.5">mBERT</td>
                    <td className="text-right">81.65%</td>
                    <td className="text-right">80.00%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-text-muted text-[10px] leading-relaxed">
              Gold F1 is on 50 human-verified sentences. Projected F1 on 847 machine-aligned sentences.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
