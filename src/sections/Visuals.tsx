import React from 'react';
import Marquee from '../components/Marquee';
import GlassCard from '../components/GlassCard';

const Visuals: React.FC = () => {
  const row1 = [
    'https://drive.google.com/thumbnail?id=1rJqzbmyYkFNe-XYW9bm36UOLFWsYe6ni&sz=w1000',
    'https://drive.google.com/thumbnail?id=1rKYhu6co_OEf_-phScRn3Sbq411Tiuef&sz=w1000',
    'https://drive.google.com/thumbnail?id=1dupEZWFkau0V58tQX-fK9yfLG1pYA3jw&sz=w1000',
    'https://drive.google.com/thumbnail?id=1c8aagPFIJw_mNUOta3CPVh7ExruARStS&sz=w1000',
    'https://drive.google.com/thumbnail?id=1Svbr3ZJGgD980Ryfz3fmgmr8ayom9_Bz&sz=w1000',
  ];

  const row2 = [
    'https://drive.google.com/thumbnail?id=1ssoyEcu2VqmgX2mU7sHFXQydr7lpRVpz&sz=w1000',
    'https://drive.google.com/thumbnail?id=16V-ICFYFke7EjlrPcVQ97AmnzdncMaAl&sz=w1000',
    'https://drive.google.com/thumbnail?id=1sGp6gsRJ6TKIYHvdOsrgvAIphoyxupmL&sz=w1000',
    'https://drive.google.com/thumbnail?id=19PS6iU-tPO3pqM2GaBNV3QpsJrI3NzdY&sz=w1000',
    'https://drive.google.com/thumbnail?id=1-F4y_BwFoAtPpB-4TPr-zQNFr0X8WdZ4&sz=w1000',
  ];

  return (
    <section id="visuals" className="py-24 overflow-hidden relative">
      {/* Localized Light Beams (Hero Style) */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent rotate-[15deg] blur-[2px] opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent -rotate-[15deg] blur-[2px] opacity-60" />
        {/* Glows */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="px-6 mb-20 text-center relative z-10">
        <span className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">Portfolio</span>
        <h2 className="text-5xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none">
          <span className="italic opacity-80">Vision</span> <br/> <span className="italic opacity-80">Visual</span> Me
        </h2>
      </div>

      {/* Row 1: Left to Right */}
      <div className="mb-12">
        <Marquee direction="right" speed={40}>
          {row1.map((src, i) => (
            <div key={i} className="group relative w-[450px] h-[300px] shrink-0 mx-4 cursor-default rounded-[24px]">
              {/* Soft Border Glow - Wraps outside the image precisely */}
              <div className="absolute -inset-[2px] rounded-[24px] bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-400/50 group-hover:to-blue-500/50 blur-[8px] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
              
              <GlassCard className="w-full h-full !p-0 !rounded-[24px] overflow-hidden border border-white/10 group-hover:border-cyan-300/40 relative z-10 hover:-translate-y-2 transition-all duration-500" glowColor="none">
                <div className="relative w-full h-full rounded-[24px] overflow-hidden transform-gpu">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500 z-10 pointer-events-none" />
                  <img 
                    src={src} 
                    alt={`Experience ${i}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 border border-white/10 group-hover:border-cyan-200/50 rounded-[24px] z-20 pointer-events-none transition-colors duration-500" />
                </div>
              </GlassCard>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Row 2: Right to Left */}
      <div>
        <Marquee direction="left" speed={35}>
          {row2.map((src, i) => (
            <div key={i} className="group relative w-[300px] h-[450px] shrink-0 mx-4 cursor-default rounded-[24px]">
              {/* Soft Border Glow - Wraps outside the image precisely */}
              <div className="absolute -inset-[2px] rounded-[24px] bg-gradient-to-r from-purple-500/0 to-fuchsia-500/0 group-hover:from-purple-400/50 group-hover:to-fuchsia-500/50 blur-[8px] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
              
              <GlassCard className="w-full h-full !p-0 !rounded-[24px] overflow-hidden border border-white/10 group-hover:border-purple-300/40 relative z-10 hover:-translate-y-2 transition-all duration-500" glowColor="none">
                <div className="relative w-full h-full rounded-[24px] overflow-hidden transform-gpu">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500 z-10 pointer-events-none" />
                  <img 
                    src={src} 
                    alt={`Technology ${i}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 border border-white/10 group-hover:border-purple-200/50 rounded-[24px] z-20 pointer-events-none transition-colors duration-500" />
                </div>
              </GlassCard>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Visuals;
