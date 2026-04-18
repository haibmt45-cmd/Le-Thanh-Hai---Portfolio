import React from 'react';
import { motion } from 'motion/react';
import { Guitar, AudioLines } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const PersonalProjects: React.FC = () => {
  const images = [
    { src: 'https://drive.google.com/thumbnail?id=1eNsJvGmiLgXHTjKqH7fksDTOeI7uNodO&sz=w1000', alt: 'Personal Project 1' },
    { src: 'https://drive.google.com/thumbnail?id=1w0dPAl8fHRcFgu5A5AieyoGjpafvHsX9&sz=w1000', alt: 'Personal Project 2' },
    { src: 'https://drive.google.com/thumbnail?id=1eAnwCmlNUyvu-m4xQYYZe5_ur0RDN1LF&sz=w1000', alt: 'Personal Project 3' },
    { src: 'https://drive.google.com/thumbnail?id=1dupEZWFkau0V58tQX-fK9yfLG1pYA3jw&sz=w1000', alt: 'Personal Project 4' },
    { src: 'https://drive.google.com/thumbnail?id=1rmjR1dY4_kAQ5SxDdYpxW-bSBB2Mnexq&sz=w1000', alt: 'Personal Project 5' },
    { src: 'https://drive.google.com/thumbnail?id=1m72VspU1fxT7uvVxlEOymCjQ3ClNhnJi&sz=w1000', alt: 'Personal Project 6' },
  ];

  return (
    <section id="personal" className="min-h-screen py-32 px-6 relative overflow-hidden">
      {/* Sound Wave Background Effect */}
      <div className="absolute bottom-0 left-0 w-full h-[60%] flex items-end justify-between px-[-5%] opacity-40 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-4 bg-gradient-to-t from-cyan-400/40 to-transparent rounded-t-full origin-bottom"
            animate={{
              height: [Math.random() * 80 + 30, Math.random() * 300 + 100, Math.random() * 80 + 30]
            }}
            transition={{
              duration: Math.random() * 1.5 + 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] pointer-events-none z-0">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 blur-[150px] rounded-full animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/5 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center">
          <span className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-bold block mb-4 mx-auto">03. Personal</span>
          <h2 className="text-4xl lg:text-7xl font-black uppercase italic tracking-tighter leading-tight mb-12">
            <span className="italic opacity-80">Personal</span> Projects
          </h2>

          <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold font-serif text-white flex items-center justify-center gap-3">
              <Guitar className="w-8 h-8 text-white/80" />
              Photography & Video & Bassist
              <AudioLines className="w-8 h-8 text-white/80" />
            </h3>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed text-center">
              Em không chỉ làm sự kiện, em sống cùng nghệ thuật. Nhiếp ảnh cho em sự tỉ mỉ, quay phim dạy em cách kể chuyện, còn những đêm chơi Bass trong ban nhạc mang lại cho em tư duy về nhịp điệu, cảm âm.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {['Photography & Retouch', 'Cinematic Video', 'Bassist (Musicality)'].map(tag => (
                <span 
                  key={tag} 
                  className="px-5 py-2.5 rounded-full border border-blue-400/30 bg-gradient-to-r from-blue-900/40 to-cyan-800/40 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)] text-sm font-bold tracking-widest uppercase hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:text-white transition-all duration-300 cursor-default backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Masonry Layout Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((item, i) => (
            <GlassCard 
              key={i} 
              delay={i * 0.15} 
              className="p-3 border-blue-400/30 break-inside-avoid group cursor-pointer hover:-translate-y-4 hover:border-blue-400 hover:shadow-[0_20px_50px_-5px_rgba(37,99,235,0.4)] transition-all duration-500" 
              glowColor="blue"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src={item.src} 
                  alt={item.alt} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
                  loading="lazy"
                />
                {/* Inner shadow overlay for premium depth */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] rounded-2xl transition-opacity duration-500 group-hover:opacity-70" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonalProjects;
