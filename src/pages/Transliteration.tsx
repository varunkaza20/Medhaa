import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { transliterate } from '../services/api';
import { ArrowRight, Copy, Trash2, Check, Languages, Info } from 'lucide-react';

const EXAMPLES = [
  { roman: 'naku ee cinema chala bagundi', telugu: 'నాకు ఈ సినిమా చాలా బాగుంది', tag: 'correct' },
  { roman: 'nenu Hyderabad lo untunnanu', telugu: 'నేను హైదరాబాద్ లో ఉంటున్నాను', tag: 'correct' },
  { roman: 'gajanna', telugu: 'గజన్న', tag: 'correct' },
  { roman: 'manasuku', telugu: 'మనసుకు', tag: 'correct' },
  { roman: 'au', telugu: 'ఏయూ', gold: 'ఔ', tag: 'near-miss' },
] as const;

export const TransliterationPage: React.FC = () => {
  // Real sentence-level demo output from the notebook
  const [inputText, setInputText] = useState('naku ee cinema chala bagundi');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await transliterate(inputText);
      setOutputText(res.output);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roman-Telugu Transliteration"
        subtitle="Convert Latin/Roman script phonetics into native Telugu script using AI4Bharat's pretrained IndicXlit model — evaluated as-is, without fine-tuning."
        badge="Sequence-to-Sequence"
      />

      <div className="space-y-6">
        {/* Pretrained framing notice */}
        <div className="p-3 rounded bg-panel border border-border/80 text-xs font-mono text-text-secondary flex items-start gap-2">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-text-primary">Pretrained, evaluated as-is.</strong> IndicXlit (11M params) is AI4Bharat's multilingual transliteration engine. No fine-tuning was performed on project-specific data — this model is integrated and benchmarked off-the-shelf on the Aksharantar Telugu test split (3,000-word sample of 10,260 pairs).
          </span>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch relative">
          {/* Left Panel: Input */}
          <div className="bg-card p-5 rounded-lg border border-border flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-mono font-semibold text-text-secondary uppercase">
                ROMAN TELUGU (LATIN SCRIPT)
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                {inputText.length} / 500
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, 500))}
              placeholder="Type Romanized Telugu words (e.g. naku ee cinema chala bagundi)..."
              rows={6}
              className="w-full bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none resize-none font-mono text-sm leading-relaxed"
            />
            <div className="flex justify-between items-center pt-2 border-t border-border/40">
              <span className="text-[10px] font-mono text-text-muted">Phonetic English input</span>
              <button
                onClick={handleClear}
                className="text-xs font-mono text-text-muted hover:text-error flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Desktop Convert Button */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              onClick={handleConvert}
              disabled={loading || !inputText.trim()}
              className="p-3 rounded-full bg-accent hover:bg-accent-light text-white shadow-lg border-2 border-background-main transition-transform active:scale-95 disabled:opacity-50"
              title="Convert to Telugu Script"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Panel: Output */}
          <div className="bg-card p-5 rounded-lg border border-border flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-mono font-semibold text-accent-light uppercase">
                TELUGU (NATIVE SCRIPT)
              </span>
              <span className="text-[10px] font-mono text-text-muted">READ-ONLY OUTPUT</span>
            </div>
            <div className="w-full min-h-[140px] text-text-primary font-telugu text-lg md:text-xl leading-relaxed py-1">
              {outputText ? (
                outputText
              ) : (
                <span className="text-text-muted font-sans text-xs italic">
                  Converted Telugu text will appear here...
                </span>
              )}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/40">
              <span className="text-[10px] font-mono text-text-muted">Unicode Telugu Script</span>
              <button
                onClick={handleCopy}
                disabled={!outputText}
                className="text-xs font-mono px-3 py-1.5 rounded bg-panel border border-border text-text-primary hover:border-accent hover:text-accent disabled:opacity-40 flex items-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span className="text-success">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-text-secondary" />
                    <span>Copy Output</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Convert Button */}
        <div className="flex justify-center">
          <button
            onClick={handleConvert}
            disabled={loading || !inputText.trim()}
            className="w-full md:w-auto px-8 py-3 rounded-md bg-accent hover:bg-accent-light text-white font-mono text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-accent/20 transition-all disabled:opacity-50"
          >
            <Languages className="w-4 h-4" />
            <span>Convert Transliteration</span>
          </button>
        </div>

        {loading && <LoadingState variant="simple" message="Executing IndicXlit beam search..." />}
        {error && <ErrorState onRetry={handleConvert} />}

        {/* Evaluation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border text-center space-y-1">
            <span className="text-[10px] font-mono text-text-muted uppercase">TOP-1 WORD ACCURACY</span>
            <div className="text-2xl font-bold font-mono text-accent-light">66.03%</div>
            <div className="text-[10px] font-mono text-text-muted">Aksharantar · 3k sample</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center space-y-1">
            <span className="text-[10px] font-mono text-text-muted uppercase">TOP-5 WORD ACCURACY</span>
            <div className="text-2xl font-bold font-mono text-success">72.17%</div>
            <div className="text-[10px] font-mono text-text-muted">Aksharantar · 3k sample</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center space-y-1">
            <span className="text-[10px] font-mono text-text-muted uppercase">MEAN CHAR ERROR RATE</span>
            <div className="text-2xl font-bold font-mono text-warning">8.74%</div>
            <div className="text-[10px] font-mono text-text-muted">lower is better</div>
          </div>
        </div>

        {/* Real examples: correct + near-miss */}
        <div className="bg-card p-5 rounded-lg border border-border space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted font-semibold">
              REAL MODEL OUTPUTS
            </h4>
            <span className="text-[10px] font-mono text-text-muted">from Aksharantar evaluation</span>
          </div>
          <div className="space-y-2">
            {EXAMPLES.map((ex, i) => (
              <div
                key={i}
                className={`p-3 rounded border flex items-center justify-between gap-4 text-xs font-mono ${
                  ex.tag === 'near-miss'
                    ? 'bg-warning/5 border-warning/30'
                    : 'bg-panel border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ex.tag === 'near-miss'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-success/20 text-success'
                    }`}
                  >
                    {ex.tag === 'near-miss' ? 'NEAR-MISS' : 'CORRECT'}
                  </span>
                  <span className="text-text-secondary">{ex.roman}</span>
                  <span className="text-text-muted">→</span>
                  <span className={`font-telugu text-base ${ex.tag === 'near-miss' ? 'text-warning' : 'text-success'}`}>
                    {ex.telugu}
                  </span>
                </div>
                {ex.tag === 'near-miss' && 'gold' in ex && (
                  <span className="text-text-muted text-[11px]">
                    gold: <span className="font-telugu text-text-primary">{ex.gold}</span>
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="p-3 rounded bg-panel border border-border/80 text-[11px] font-mono text-text-muted leading-relaxed">
            <strong className="text-text-secondary">CER note:</strong> The worst-scoring cases cluster on very short words (1–3 chars, e.g. "au"→ఏయూ vs. gold ఔ) where CER is extremely sensitive to a single missed character. This inflates apparent error without indicating poor performance on realistic sentence-length text.
          </div>
        </div>

        {/* Powered by */}
        <div className="p-4 rounded-lg bg-panel border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-card border border-border text-accent-light font-bold">
              Powered by IndicXlit
            </span>
            <span className="text-text-muted">• AI4Bharat Multilingual Transliteration Engine</span>
          </div>
          <p className="text-text-muted italic text-[11px]">
            "Transliteration changes the script, not the underlying language."
          </p>
        </div>
      </div>
    </div>
  );
};
