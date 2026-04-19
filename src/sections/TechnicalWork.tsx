import React from 'react';
import { motion } from 'motion/react';
import GlassCard from '../components/GlassCard';

const TechnicalWork: React.FC = () => {
  const tools = [
    { name: 'Ps', color: 'text-blue-500' },
    { name: 'Ai', color: 'text-orange-500' },
    { name: 'Lr', color: 'text-blue-300' },
    { name: 'Pr', color: 'text-purple-500' },
    { name: 'CapCut', color: 'text-white' },
    { name: 'AI Stack', color: 'text-green-400' },
  ];

  const workHistory = [
    { year: '2025 - Present', position: 'Marketing Executive', company: 'VGG' },
    { year: '2023 - 2024', position: 'Account & Event Executive', company: 'Zunik' },
  ];

  return (
    <section id="technical-work" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        
        {/* Technical Mastery */}
        <div className="flex flex-col gap-6">
          <div className="mb-4">
             <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold block mb-2">My Stack</span>
             <h2 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-tight">
                Technical <br/><span className="italic opacity-80">Mastery</span>
             </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <GlassCard className="col-span-2 flex flex-col justify-center p-8 bg-blue-500/5 items-center text-center" glowColor="blue">
               <h3 className="text-xl font-bold mb-2">Creative Suite</h3>
               <p className="text-white/40 text-sm">Thông thạo bộ công cụ sáng tạo tối ưu nhất cho Event & Marketing.</p>
            </GlassCard>
            
            {tools.map((tool, i) => (
              <GlassCard key={i} className="flex items-center justify-center aspect-square" glowColor="white">
                 <span className={`text-2xl font-bold uppercase tracking-tighter ${tool.color}`}>{tool.name}</span>
              </GlassCard>
            ))}
            
            <GlassCard className="col-span-2 flex items-center p-8 bg-gradient-to-r from-green-500/10 to-transparent shadow-lg shadow-green-500/5 group" glowColor="green">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-green-400 font-bold mb-2 opacity-60">Strategic Edge</span>
                  <p className="text-2xl font-black italic tracking-tighter text-white">AI-POWERED WORKFLOW</p>
               </div>
            </GlassCard>
          </div>
        </div>

        {/* Work History */}
        <div className="flex flex-col gap-6">
           <div className="mb-4">
             <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold block mb-2">Timeline</span>
             <h2 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-tight">
                Work <br/><span className="italic opacity-80">History</span>
             </h2>
          </div>

          <div className="flex flex-col gap-6">
            {workHistory.map((work, i) => (
              <GlassCard key={i} className="p-8 border-l-4 border-purple-500" glowColor="purple">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-purple-400 font-bold text-sm tracking-widest uppercase">{work.year}</span>
                 </div>
                 <h3 className="text-2xl font-bold">{work.position}</h3>
                 <p className="text-white/60 text-lg">{work.company}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalWork;
