import React from 'react';
import { FileText, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-border bg-background-secondary py-8 px-4 md:px-8 text-xs font-mono text-text-muted">
      <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <span className="font-telugu text-2xl font-bold text-text-primary">
            మేధా
          </span>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <span className="text-text-secondary text-[11px]">
            Telugu Language Intelligence & Multi-Task Evaluation Platform
          </span>
        </div>

        <div className="flex items-center gap-2 text-text-muted text-[11px]">
          <Code2 className="w-3.5 h-3.5 text-accent" />
          <span>Python 3.10 • PyTorch • HuggingFace Transformers • React • FastAPI</span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-accent flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Docs</span>
          </Link>
          <a
            href="https://github.com/varunkaza20/Medhaa"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent flex items-center gap-1"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
