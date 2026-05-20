import React from 'react';
import { motion } from 'motion/react';
import { FolderKanban, ExternalLink } from 'lucide-react';
import GlassCard from './GlassCard';
import { useI18n } from '../context/I18nContext';

const OtherProjectsCTA: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="w-full py-20 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <GlassCard 
          className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative group border-cyan-500/20 hover:border-cyan-400/30 transition-all duration-500" 
          glowColor="cyan"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              <FolderKanban className="w-8 h-8 text-white/60 group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white mb-2 group-hover:text-cyan-100 transition-colors duration-300">
                {t('zunik.additional_text').replace(' ↗', '')}
              </h4>
              <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold">Discover more works on cloud storage</p>
            </div>
          </div>
          
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://drive.google.com/drive/folders/123WdKj4xkReDNx_WXVDK9m7KsisAS-tj?usp=drive_link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-black uppercase tracking-widest hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 backdrop-blur-md group-hover:text-white"
          >
            <span>Google Drive</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </GlassCard>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent rotate-[-5deg] blur-sm pointer-events-none opacity-50" />
    </div>
  );
};

export default OtherProjectsCTA;
