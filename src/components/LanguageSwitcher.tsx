import React from 'react';
import { useI18n } from '../context/I18nContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { lang, toggleLang } = useI18n();

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 group">
      <button
        onClick={toggleLang}
        className="glass-3d px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] relative outline-none"
        aria-label="Toggle Language"
      >
        <Globe strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
        <span className="text-[10px] sm:text-xs font-bold tracking-widest text-white/90 uppercase">
          {lang === 'vi' ? 'EN' : 'VI'}
        </span>
        
        {/* Tooltip */}
        <span className="absolute top-[120%] right-0 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-bold tracking-widest text-white opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300 pointer-events-none whitespace-nowrap">
          {lang === 'vi' ? 'Translate to English' : 'Translate to Vietnamese'}
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
