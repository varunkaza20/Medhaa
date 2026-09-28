import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Smile,
  Tag,
  Languages,
  ArrowRightLeft,
  Sparkles,
  Layers,
  Info,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'NLP TASKS',
      items: [
        { name: 'Sentiment', path: '/sentiment', icon: Smile },
        { name: 'NER', path: '/ner', icon: Tag },
        { name: 'Transliteration', path: '/transliteration', icon: Languages },
        { name: 'Code-Switching', path: '/code-switch', icon: ArrowRightLeft },
        {
          name: 'Analyze (Unified)',
          path: '/analyze',
          icon: Sparkles,
          featured: true,
        },
      ],
    },
    {
      title: 'PROJECT',
      items: [
        { name: 'Models', path: '/models', icon: Layers },
        { name: 'About', path: '/about', icon: Info },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[250px] bg-background-secondary border-r border-border flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Header & Mobile Close */}
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div>
              {/* "మేధా" Display Font - Google Font Anek Telugu */}
              <h1 className="font-telugu text-3xl font-bold tracking-normal text-text-primary">
                మేధా
              </h1>
              <p className="text-[11px] font-mono text-accent-light tracking-tight mt-0.5">
                Telugu Language Intelligence
              </p>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav groups */}
          <nav className="space-y-6">
            {navSections.map((sec, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-[10px] font-mono font-bold tracking-widest text-text-muted uppercase px-2">
                  {sec.title}
                </h3>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-mono transition-all ${item.featured
                            ? isActive
                              ? 'bg-accent text-white font-semibold shadow-md shadow-accent/20'
                              : 'bg-accent/15 text-accent-light hover:bg-accent/25 border border-accent/30 font-semibold'
                            : isActive
                              ? 'bg-panel text-accent-light font-semibold border-l-2 border-accent'
                              : 'text-text-secondary hover:text-text-primary hover:bg-panel/60'
                          }`
                        }
                      >
                        <Icon
                          className={`w-4 h-4 ${item.featured ? 'text-accent-light' : 'text-text-muted'
                            }`}
                        />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-border bg-panel/30 text-xs font-mono text-text-muted flex items-center justify-between">
          <span>v1.0.0 (Research)</span>
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
      </aside>
    </>
  );
};
