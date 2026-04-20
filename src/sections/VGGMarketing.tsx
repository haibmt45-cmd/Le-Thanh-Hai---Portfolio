import React from 'react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../context/I18nContext';

const VGGMarketing: React.FC = () => {
  const { t } = useI18n();
  
  // Safe default fallback if array not fully loaded
  const defaultTags = ['AI-Powered Content', 'Professional Videography', 'Performance Marketing', 'Commercial Photography'];
  const tags = (t('vgg.tags') as unknown as string[]) || defaultTags;
  
  const products = [
    { name: tags[1] || 'Professional Videography', img: 'https://drive.google.com/thumbnail?id=19Z-htGd1bV3WccKlDNT-oLEjc2XLIaD4&sz=w1000' },
    { name: tags[3] || 'Commercial Photography', img: 'https://drive.google.com/thumbnail?id=1atYMMV1TFxHU7SPLiuZGp-p6k7xILBwa&sz=w1000' },
    { name: tags[0] || 'AI-Powered Content', img: 'https://drive.google.com/thumbnail?id=16wl7PC_mJZIQy4crAcetUY_4QznBzXES&sz=w1000' },
    { name: tags[2] || 'Performance Marketing', img: 'https://drive.google.com/thumbnail?id=1h9Td0w1znHzsc8GImQxhsjHLy7uwvNQX&sz=w1000' },
  ];

  return (
    <section id="vgg" className="min-h-screen py-40 px-6 relative overflow-hidden">
      {/* Localized Light Beams (Hero Style - Red) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent rotate-[15deg] blur-[2px] opacity-70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent -rotate-[10deg] blur-[2px] opacity-70" />
        {/* Ambient Glows */}
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-red-600/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-red-500/10 blur-[130px] rounded-full animate-pulse delay-500" />
      </div>

      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[150px] rounded-full" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-28 text-center">
          <span className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-bold block mb-8 mx-auto">{t('vgg.section_title')}</span>
          <h2 className="text-4xl lg:text-7xl font-black uppercase italic tracking-tighter leading-tight">
            <span className="italic opacity-80">{t('vgg.main_title1')}</span> {t('vgg.main_title2')}
          </h2>
          <div className="flex flex-col items-center gap-16 mt-16 w-full">
            <div className="max-w-5xl text-center">
               <p className="text-white/60 text-xl leading-relaxed mb-10">
                  {t('vgg.desc_part1')}<span className="text-red-500 font-bold">{t('vgg.desc_highlight')}</span>{t('vgg.desc_part2')}
               </p>
               <div className="flex flex-wrap justify-center gap-6">
                  {(Array.isArray(tags) ? tags : defaultTags).map(tag => (
                    <span key={tag} className="px-6 py-3 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 text-sm font-semibold">
                      {tag}
                    </span>
                  ))}
               </div>
            </div>
            
            <GlassCard className="w-full max-w-4xl mx-auto border-red-500/20 text-center px-8 py-10 md:px-16" glowColor="red">
               <h4 className="text-red-500 font-bold mb-4 uppercase tracking-widest text-sm">{t('vgg.achievement_label')}</h4>
               <p className="text-2xl md:text-3xl font-bold mb-6">{t('vgg.achievement_title')}</p>
               <p className="text-white/60 text-base md:text-lg leading-relaxed">
                  {t('vgg.achievement_desc')}
               </p>
            </GlassCard>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((item, i) => (
            <GlassCard key={item.name} className="p-2 group cursor-default hover:-translate-y-2 hover:border-red-400/40 hover:shadow-[0_20px_40px_-5px_rgba(239,68,68,0.3)] transition-all duration-500" glowColor="red">
              <div className="relative overflow-hidden rounded-2xl transform-gpu">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full aspect-[2/3] object-cover transition-all duration-700 group-hover:scale-105 relative z-0" 
                />
                {/* Inner shadow overlay for depth */}
                <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] rounded-2xl transition-opacity duration-500 group-hover:opacity-50" />
              </div>
              <p className="mt-4 text-center font-bold text-white/60 group-hover:text-red-500 transition-colors duration-300 uppercase text-xs tracking-widest">{item.name}</p>
              <div className="pt-4 mt-4 border-t border-white/10">
                 <p className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    {t('vgg.key_result_label')}
                 </p>
                 <p className="text-white/90 text-sm mt-1 leading-relaxed font-medium">{t('vgg.key_result_text')}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VGGMarketing;
