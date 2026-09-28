import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { ExternalLink, Code2, Server, Database } from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="About Medhaa (మేధా)"
        subtitle="Telugu Language Intelligence Platform — Architecture, Motivation, and Research Stack."
        badge="Platform Specs"
      />

      {/* Motivation & Overview */}
      <div className="bg-card p-6 rounded-lg border border-border space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-telugu text-4xl font-bold text-text-primary">మేధా</span>
          <div className="h-6 w-px bg-border" />
          <p className="text-xs font-mono text-accent-light">
            [ /meː.dʞaː/ • Sanskrit/Telugu: intellect, intelligence, wisdom ]
          </p>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed font-sans">
          <strong>Medhaa (మేధా)</strong> is a portfolio-grade research platform built specifically to advance natural language processing for Telugu — a major Dravidian language spoken by over 96 million people. Low-resource Dravidian languages face distinct NLP challenges including complex agglutinative morphology, high script variability, and widespread code-switching with English.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed font-sans">
          This platform unifies sequence classification (Sentiment), token classification (NER), neural sequence transliteration (IndicXlit), and language identification (Code-Switching LID) into a single production-ready dashboard and API service.
        </p>
        <div className="p-3 rounded bg-panel border border-border text-xs font-mono text-text-muted leading-relaxed">
          <strong className="text-text-primary">Technical distinction:</strong> Three tasks (Sentiment, NER, Code-Switching) use fine-tuned Transformer models loaded via HuggingFace <code className="bg-card px-1 rounded text-accent-light">AutoModelForSequenceClassification</code> / <code className="bg-card px-1 rounded text-accent-light">TokenClassification</code> from the Hub. Transliteration uses the <code className="bg-card px-1 rounded text-accent-light">ai4bharat-transliteration</code> package (IndicXlit) — a pretrained transliteration engine used as-is, not a fine-tuned transformers model.
        </div>
      </div>

      {/* System Architecture Diagram */}
      <div className="bg-card p-6 rounded-lg border border-border space-y-4">
        <h3 className="text-sm font-mono font-bold text-text-primary uppercase tracking-wider">
          SYSTEM ARCHITECTURE DIAGRAM
        </h3>
        <p className="text-xs font-mono text-text-muted">
          End-to-end data flow from user interaction to FastAPI multi-model inference pipeline:
        </p>

        {/* Clean SVG Flowchart */}
        <div className="p-6 rounded bg-panel border border-border overflow-x-auto flex justify-center">
          <svg viewBox="0 0 800 320" className="w-full max-w-[750px] text-text-primary">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4C8DFF" />
              </marker>
            </defs>

            {/* Step 1: User Input */}
            <rect x="20" y="130" width="130" height="60" rx="6" fill="#12243A" stroke="#1D3553" strokeWidth="2" />
            <text x="85" y="158" textAnchor="middle" fill="#E8F0FA" fontSize="12" fontFamily="sans-serif" fontWeight="bold">User Input</text>
            <text x="85" y="174" textAnchor="middle" fill="#91A4BB" fontSize="10" fontFamily="monospace">Single / Batch Text</text>

            <line x1="150" y1="160" x2="200" y2="160" stroke="#4C8DFF" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Step 2: React Frontend */}
            <rect x="200" y="130" width="140" height="60" rx="6" fill="#0E1D31" stroke="#4C8DFF" strokeWidth="2" />
            <text x="270" y="158" textAnchor="middle" fill="#75B6FF" fontSize="12" fontFamily="sans-serif" fontWeight="bold">React Frontend</text>
            <text x="270" y="174" textAnchor="middle" fill="#91A4BB" fontSize="10" fontFamily="monospace">Vite + TS + Tailwind</text>

            <line x1="340" y1="160" x2="390" y2="160" stroke="#4C8DFF" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Step 3: FastAPI Backend */}
            <rect x="390" y="130" width="150" height="60" rx="6" fill="#12243A" stroke="#46D39A" strokeWidth="2" />
            <text x="465" y="158" textAnchor="middle" fill="#46D39A" fontSize="12" fontFamily="sans-serif" fontWeight="bold">FastAPI Backend</text>
            <text x="465" y="174" textAnchor="middle" fill="#91A4BB" fontSize="10" fontFamily="monospace">PyTorch + Uvicorn</text>

            {/* Arrows branching to 4 Models */}
            <line x1="540" y1="160" x2="600" y2="40" stroke="#4C8DFF" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <line x1="540" y1="160" x2="600" y2="120" stroke="#4C8DFF" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <line x1="540" y1="160" x2="600" y2="200" stroke="#4C8DFF" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <line x1="540" y1="160" x2="600" y2="280" stroke="#4C8DFF" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* Model 1: Sentiment */}
            <rect x="600" y="15" width="180" height="48" rx="4" fill="#0E1D31" stroke="#1D3553" />
            <text x="690" y="36" textAnchor="middle" fill="#E8F0FA" fontSize="11" fontFamily="monospace" fontWeight="bold">Sentiment Model</text>
            <text x="690" y="50" textAnchor="middle" fill="#91A4BB" fontSize="9" fontFamily="monospace">telugu-sentiment (BERT)</text>

            {/* Model 2: NER */}
            <rect x="600" y="95" width="180" height="48" rx="4" fill="#0E1D31" stroke="#1D3553" />
            <text x="690" y="116" textAnchor="middle" fill="#E8F0FA" fontSize="11" fontFamily="monospace" fontWeight="bold">NER Model</text>
            <text x="690" y="130" textAnchor="middle" fill="#91A4BB" fontSize="9" fontFamily="monospace">telugu-ner (XLM-R)</text>

            {/* Model 3: Code-Switching */}
            <rect x="600" y="175" width="180" height="48" rx="4" fill="#0E1D31" stroke="#1D3553" />
            <text x="690" y="196" textAnchor="middle" fill="#E8F0FA" fontSize="11" fontFamily="monospace" fontWeight="bold">Code-Switch LID</text>
            <text x="690" y="210" textAnchor="middle" fill="#91A4BB" fontSize="9" fontFamily="monospace">telugu-english-lid (mBERT)</text>

            {/* Model 4: Transliteration */}
            <rect x="600" y="255" width="180" height="48" rx="4" fill="#0E1D31" stroke="#1D3553" />
            <text x="690" y="276" textAnchor="middle" fill="#E8F0FA" fontSize="11" fontFamily="monospace" fontWeight="bold">Transliteration</text>
            <text x="690" y="290" textAnchor="middle" fill="#91A4BB" fontSize="9" fontFamily="monospace">ai4bharat / IndicXlit</text>
          </svg>
        </div>
      </div>

      {/* Tech Stack List */}
      <div className="bg-card p-6 rounded-lg border border-border space-y-4">
        <h3 className="text-sm font-mono font-bold text-text-primary uppercase tracking-wider">
          TECHNOLOGY STACK
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded bg-panel border border-border space-y-2">
            <div className="flex items-center gap-2 text-accent-light font-bold">
              <Server className="w-4 h-4" />
              <span>Backend & Inference Engine</span>
            </div>
            <ul className="space-y-1 text-text-secondary list-disc list-inside">
              <li>Python 3.10 (base runtime environment)</li>
              <li>FastAPI + Uvicorn (async REST endpoints)</li>
              <li>PyTorch 2.5.1 (pinned for fairseq load compatibility)</li>
              <li>Hugging Face Transformers 4.46.0</li>
              <li>AI4Bharat IndicXlit (Transliteration engine)</li>
            </ul>
          </div>

          <div className="p-4 rounded bg-panel border border-border space-y-2">
            <div className="flex items-center gap-2 text-success font-bold">
              <Code2 className="w-4 h-4" />
              <span>Frontend Application</span>
            </div>
            <ul className="space-y-1 text-text-secondary list-disc list-inside">
              <li>React 18+ with TypeScript</li>
              <li>Vite build toolchain</li>
              <li>React Router v6</li>
              <li>Tailwind CSS (custom technical token theme)</li>
              <li>lucide-react (icons)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* External Resource Links */}
      <div className="bg-card p-6 rounded-lg border border-border space-y-4">
        <h3 className="text-sm font-mono font-bold text-text-primary uppercase tracking-wider">
          REPOSITORIES & RESOURCES
        </h3>
        <div className="flex flex-wrap gap-4 text-xs font-mono">
          <a
            href="https://github.com/varunkaza20/Medhaa"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded bg-panel border border-border text-text-primary hover:border-accent hover:text-accent transition-all"
          >
            <GithubIcon className="w-4 h-4 text-text-secondary" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 text-text-muted" />
          </a>
          <a
            href="https://huggingface.co/varunkaza20"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded bg-panel border border-border text-text-primary hover:border-accent hover:text-accent transition-all"
          >
            <Database className="w-4 h-4 text-text-secondary" />
            <span>HuggingFace Models</span>
            <ExternalLink className="w-3 h-3 text-text-muted" />
          </a>
        </div>
      </div>
    </div>
  );
};
