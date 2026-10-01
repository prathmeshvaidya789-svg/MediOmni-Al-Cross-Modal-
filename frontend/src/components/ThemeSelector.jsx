import React, { useState, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';

const THEMES = [
  {
    id: 'obsidian',
    name: 'Obsidian Cyan',
    label: 'Deep Sapphire & Cyan',
    dotColor: '#0EA5E9',
    secondaryDot: '#6366F1',
    ringClass: 'ring-sky-400',
  },
  {
    id: 'ice',
    name: 'Glacial Ice',
    label: 'Arctic Titanium & Azure',
    dotColor: '#38BDF8',
    secondaryDot: '#818CF8',
    ringClass: 'ring-cyan-400',
  },
  {
    id: 'emerald',
    name: 'BioTech Emerald',
    label: 'Life-Sciences Mint & Teal',
    dotColor: '#10B981',
    secondaryDot: '#14B8A6',
    ringClass: 'ring-emerald-400',
  },
  {
    id: 'violet',
    name: 'Quantum Violet',
    label: 'Nebula Amethyst & Iris',
    dotColor: '#A855F7',
    secondaryDot: '#6366F1',
    ringClass: 'ring-purple-400',
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    label: 'Radiant Gold & Coral',
    dotColor: '#F59E0B',
    secondaryDot: '#EF4444',
    ringClass: 'ring-amber-400',
  },
];

const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('omni_theme') || 'obsidian';
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('omni_theme', currentTheme);
  }, [currentTheme]);

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative">
      {/* Theme Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-dark-800/90 hover:bg-dark-700/90 border border-white/10 hover:border-brand-cyan/40 text-xs text-slate-300 hover:text-white transition-all shadow-sm group"
        title="Change Color Theme"
      >
        <div className="relative flex items-center">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/20 transition-transform group-hover:scale-110 shadow-sm"
            style={{ backgroundColor: activeThemeObj.dotColor }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/20 -ml-1 transition-transform group-hover:scale-110 shadow-sm"
            style={{ backgroundColor: activeThemeObj.secondaryDot }}
          />
        </div>
        <span className="hidden md:inline font-medium text-[11px] text-slate-300">
          {activeThemeObj.name}
        </span>
        <Palette className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-cyan transition-colors" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-2xl border border-white/15 shadow-2xl p-2.5 z-50 animate-scale-in">
            <div className="px-2 py-1.5 border-b border-white/10 mb-1.5 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand-cyan" />
                Select Color Theme
              </span>
              <span className="text-[10px] text-brand-cyan font-mono font-semibold">
                5 Palettes
              </span>
            </div>

            <div className="space-y-1">
              {THEMES.map((theme) => {
                const isSelected = theme.id === currentTheme;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setCurrentTheme(theme.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-brand-cyan/15 text-white border border-brand-cyan/30 shadow-sm'
                        : 'hover:bg-dark-700/60 text-slate-300 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="flex items-center">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: theme.dotColor }}
                        />
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20 -ml-1 shadow-sm"
                          style={{ backgroundColor: theme.secondaryDot }}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-tight">{theme.name}</p>
                        <p className="text-[10px] text-slate-400">{theme.label}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
