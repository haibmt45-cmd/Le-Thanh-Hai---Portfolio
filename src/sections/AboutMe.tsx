import React from 'react';
import { motion } from 'motion/react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../context/I18nContext';

const AboutMe: React.FC = () => {
  const { t } = useI18n();
  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <GlassCard className="!p-0 overflow-hidden border border-white/10" glowColor="purple">
              <img 
                src="https://drive.google.com/thumbnail?id=1sGp6gsRJ6TKIYHvdOsrgvAIphoyxupmL&sz=w1000" 
                alt="About Me" 
                className="w-full aspect-[4/5] object-cover" 
                referrerPolicy="no-referrer"
              />
            </GlassCard>
            {/* Ambient decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full -z-10" />
          </motion.div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold block">{t('about.section_title')}</span>
            <h2 className="text-4xl lg:text-7xl font-black uppercase italic tracking-tighter leading-tight">
               {t('about.main_title1')} <span className="italic opacity-80">{t('about.main_title2')}</span>
            </h2>
            
            <div className="flex items-center gap-4 text-white/50 text-sm font-bold uppercase tracking-widest">
              <span>{t('about.dob_label')} <span className="text-white bg-white/10 px-3 py-1 rounded-full border border-white/20">{t('about.dob_value')}</span></span>
            </div>
            
            <GlassCard className="p-8 border border-white/10" glowColor="purple">
              <p className="text-white/80 text-lg leading-relaxed">
                {t('about.desc_part1')}<strong className="text-white">{t('about.desc_role')}</strong>{t('about.desc_part2')} 
                <strong className="text-white">{t('about.desc_highlight1')}</strong>{t('about.desc_part3')} 
                <strong className="text-white">{t('about.desc_highlight2')}</strong>{t('about.desc_part4')}
                <strong className="text-white">{t('about.desc_highlight3')}</strong>{t('about.desc_part5')}
              </p>
            </GlassCard>

            <div className="flex gap-4 mt-4">
              <a 
                href="https://drive.google.com/uc?export=download&id=1lIwcIdSSMHDEaOvT_KiKY_XW8LZEsOHJ" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-black font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_20px_2px_rgba(255,255,255,0.6)] hover:scale-105"
              >
                {t('about.btn_cv')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
