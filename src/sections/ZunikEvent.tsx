import React from 'react';
import { motion } from 'motion/react';
import { Quote, Sparkles, ExternalLink, FolderKanban } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../context/I18nContext';

const ZunikEvent: React.FC = () => {
  const { t } = useI18n();

  const projects = [
    { 
      title: t('zunik.projects.p1.title'), 
      images: ['https://zunikevent.vn/wp-content/uploads/2025/10/HUY00851.jpg', 'https://zunikevent.vn/wp-content/uploads/2025/10/HUY00851.jpg', 'https://zunikevent.vn/wp-content/uploads/2025/10/HUY00851.jpg'], 
      desc: t('zunik.projects.p1.desc'),
      role: t('zunik.projects.p1.role'),
      result: t('zunik.projects.p1.result'),
    },
    { 
      title: t('zunik.projects.p2.title'), 
      images: ['https://drive.google.com/thumbnail?id=1dUwnbAenHp7LNrHUu9D5I-tY9X37O6xz&sz=w1000', 'https://drive.google.com/thumbnail?id=1dUwnbAenHp7LNrHUu9D5I-tY9X37O6xz&sz=w1000', 'https://drive.google.com/thumbnail?id=1dUwnbAenHp7LNrHUu9D5I-tY9X37O6xz&sz=w1000'], 
      desc: t('zunik.projects.p2.desc'),
      role: t('zunik.projects.p2.role'),
      result: t('zunik.projects.p2.result'),
    },
    { 
      title: t('zunik.projects.p3.title'), 
      images: ['https://zunikevent.vn/wp-content/uploads/2026/04/612006996_919523067300799_6676736734415795302_n-2048x779.jpg', 'https://zunikevent.vn/wp-content/uploads/2026/04/612006996_919523067300799_6676736734415795302_n-2048x779.jpg', 'https://zunikevent.vn/wp-content/uploads/2026/04/612006996_919523067300799_6676736734415795302_n-2048x779.jpg'], 
      desc: t('zunik.projects.p3.desc'),
      role: t('zunik.projects.p3.role'),
      result: t('zunik.projects.p3.result'),
    },
    { 
      title: t('zunik.projects.p4.title'), 
      images: ['https://zunikevent.vn/wp-content/uploads/2026/03/TT_9739-2048x1365.jpg', 'https://zunikevent.vn/wp-content/uploads/2026/03/TT_9739-2048x1365.jpg', 'https://zunikevent.vn/wp-content/uploads/2026/03/TT_9739-2048x1365.jpg'], 
      desc: t('zunik.projects.p4.desc'),
      role: t('zunik.projects.p4.role'),
      result: t('zunik.projects.p4.result'),
    },
  ];

  return (
    <section id="zunik" className="min-h-screen py-40 px-6 relative overflow-hidden">
      {/* Localized Light Beams (Hero Style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent rotate-[10deg] blur-[2px] opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-600/40 to-transparent -rotate-[10deg] blur-[2px] opacity-50" />
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-500/15 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-400/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-28 text-center">
          <span className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-bold block mb-8 mx-auto">{t('zunik.section_title')}</span>
          <h2 className="text-4xl lg:text-7xl font-black uppercase italic tracking-tighter leading-relaxed mb-10">
            <span className="italic opacity-80">{t('zunik.main_title1')}</span> {t('zunik.main_title_amp')} <span className="italic opacity-80">{t('zunik.main_title2')}</span> {t('zunik.main_title3')}
          </h2>
          <p className="mt-12 text-white/60 text-xl max-w-5xl mx-auto leading-relaxed">
            {t('zunik.description1')}<span className="text-white font-bold">{t('zunik.desc_highlight')}</span>{t('zunik.description2')} {t('zunik.description3')} {t('zunik.description4')}
          </p>
        </div>

        <div className="space-y-32">
          {projects.map((project, idx) => (
            <GlassCard key={idx} className="group cursor-default hover:border-purple-400/40 hover:shadow-[0_20px_40px_-5px_rgba(168,85,247,0.3)] transition-all duration-500" glowColor="purple">
              <div className={`grid md:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${idx % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                  {project.images.map((img, i) => (
                    <div key={i} className={`relative overflow-hidden rounded-xl transform-gpu ${i === 0 ? 'md:col-span-2' : ''}`}>
                      <img 
                      src={img} 
                      alt={`${project.title} - ${i + 1}`} 
                      className="w-full aspect-video object-cover object-center transition-transform duration-700 group-hover:scale-105 relative z-0" 
                      referrerPolicy="no-referrer"
                      />
                      {/* Image Container with subtle border glow effect */}
                      <div className="absolute inset-0 z-10 pointer-events-none rounded-xl border border-white/10 shadow-[inner_0_0_15px_rgba(255,255,255,0.03)]" />
                    </div>
                  ))}
                </div>
                <div className={`${idx % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                    <h3 className="text-3xl font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">{project.title}</h3>
                    <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300 mb-6 text-lg">{project.desc}</p>
                    
                    <div className="space-y-6 pt-6 border-t border-white/10">
                        {/* Key Role */}
                        <div>
                            <p className="text-purple-400 text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                                {t('zunik.key_role')}
                            </p>
                            <p className="text-white/80 font-medium">{project.role}</p>
                        </div>
                        
                        {/* Key Achievement */}
                        <div>
                            <p className="text-purple-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                                {t('zunik.key_achievement')}
                            </p>
                            <ul className="text-white/90 leading-relaxed font-medium space-y-2 list-none p-0">
                                {project.result.split('. ').map((item, index) => {
                                  if (!item) return null;
                                  return (
                                    <li key={index} className="flex gap-2 items-start">
                                      <span className="text-cyan-400 text-lg leading-none mt-0.5 shrink-0 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">✦</span>
                                      <span>{item}{!item.endsWith('.') ? '.' : ''}</span>
                                    </li>
                                  )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* --- SUPPLEMENTARY CONTENT --- */}
        <div className="mt-40 pt-10 relative">
          {/* Subtle separator with glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-purple-500/10 blur-[100px] pointer-events-none" />

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Key Learnings Card (Larger) */}
            <GlassCard className="md:col-span-3 p-8 md:p-12 relative overflow-hidden group border-purple-500/20" glowColor="purple">
              {/* Floating gradient line on the left */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 md:left-4 w-1.5 h-full md:h-[80%] md:rounded-full bg-gradient-to-b from-purple-400 to-cyan-400 opacity-90 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              <Quote className="absolute -top-4 -right-4 w-40 h-40 text-white/5 transform -rotate-12 group-hover:scale-110 group-hover:text-purple-500/10 transition-all duration-700 pointer-events-none" />
              
              <div className="relative z-10 w-full h-full flex flex-col justify-center pl-6 md:pl-10">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <span className="p-2 md:p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] group-hover:bg-purple-500/20 transition-all duration-500">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                  </span>
                  <h4 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {t('zunik.learnings_title')}
                  </h4>
                </div>
                <p className="text-white/80 text-[15px] md:text-[17px] leading-[1.8] md:leading-[2] text-left font-sans italic drop-shadow-md">
                  "{t('zunik.learnings_desc')}"
                </p>
              </div>
            </GlassCard>

            {/* Additional Projects CTA (Smaller) */}
            <GlassCard className="md:col-span-2 p-8 md:p-10 flex flex-col justify-between relative group border-cyan-500/20 hover:border-cyan-400/30" glowColor="cyan">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />
              
              <div className="relative z-10 flex justify-between items-start mb-8 md:mb-12">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                  <FolderKanban className="w-7 h-7 text-white/60 group-hover:text-cyan-400 transition-colors duration-300" />
                </div>
                <ExternalLink className="w-5 h-5 text-white/20 group-hover:text-cyan-400 transition-colors duration-300" />
              </div>
              
              <div className="relative z-10 mt-auto">
                <h4 className="text-xl md:text-2xl font-bold text-white mb-6 group-hover:text-cyan-100 transition-colors duration-300">
                  {t('zunik.additional_text').replace(' ↗', '')}
                </h4>
                
                <a 
                  href="https://drive.google.com/drive/folders/123WdKj4xkReDNx_WXVDK9m7KsisAS-tj?usp=drive_link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs md:text-sm font-semibold uppercase tracking-widest hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 backdrop-blur-md"
                >
                  <span>Google Drive</span>
                </a>
              </div>
            </GlassCard>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZunikEvent;
