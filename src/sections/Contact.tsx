import React from 'react';
import { motion } from 'motion/react';
import { Facebook, Phone, Mail, Instagram, MessageCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Contact: React.FC = () => {
  const tools = [
    { name: 'Ps', color: 'text-blue-500' },
    { name: 'Ai', color: 'text-orange-500' },
    { name: 'Lr', color: 'text-blue-300' },
    { name: 'Pr', color: 'text-purple-500' },
    { name: 'CapCut', color: 'text-white' },
    { name: 'AI Stack', color: 'text-green-400' },
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: <Facebook className="w-8 h-8" />, 
      url: 'https://www.facebook.com/Lethanhhai2110', 
      glow: 'glow-blue',
      color: 'hover:text-blue-400',
      bgGlow: 'bg-blue-500/20'
    },
    { 
      name: 'Hotline', 
      icon: <Phone className="w-8 h-8" />, 
      url: 'tel:+84912436564', 
      glow: 'glow-white',
      color: 'hover:text-white',
      bgGlow: 'bg-white/10'
    },
    { 
      name: 'Zalo', 
      icon: <MessageCircle className="w-8 h-8" />, 
      url: 'https://zalo.me/84912436564', 
      glow: 'glow-green',
      color: 'hover:text-green-400',
      bgGlow: 'bg-green-500/20'
    },
    { 
      name: 'Email', 
      icon: <Mail className="w-8 h-8" />, 
      url: 'mailto:haibmt45@gmail.com', 
      glow: 'glow-red',
      color: 'hover:text-red-400',
      bgGlow: 'bg-red-500/20'
    },
  ];

  return (
    <section id="contact" className="min-h-screen py-24 px-6 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Localized Light Beams (Hero Style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent rotate-[35deg] blur-[3px] opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent -rotate-[35deg] blur-[3px] opacity-80" />
        {/* Glows */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-[150px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
      
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">
        
        {/* Left Column: Technical Mastery */}
        <div className="flex flex-col gap-6">
          <div className="mb-4">
             <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold block mb-2">Capabilities</span>
             <h2 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter leading-tight">
                <span className="italic opacity-80">Technical</span> <br/>Mastery
             </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <GlassCard className="col-span-2 flex flex-col justify-center p-8 bg-blue-500/5" glowColor="blue">
               <h3 className="text-xl font-bold mb-2">Creative Suite</h3>
               <p className="text-white/40 text-sm">Thông thạo bộ công cụ sáng tạo tối ưu nhất cho Event & Marketing.</p>
            </GlassCard>
            
            {tools.slice(0, 1).map((tool, i) => (
              <GlassCard key={i} className="flex items-center justify-center aspect-square" glowColor="white">
                 <span className={`text-4xl font-bold uppercase tracking-tighter ${tool.color}`}>{tool.name}</span>
              </GlassCard>
            ))}

            {tools.slice(1).map((tool, i) => (
              <GlassCard key={i} className="flex items-center justify-center aspect-square" glowColor="white">
                 <span className={`text-3xl font-bold uppercase tracking-tighter ${tool.color}`}>{tool.name}</span>
              </GlassCard>
            ))}
            
            <GlassCard className="col-span-2 flex items-center p-8 bg-gradient-to-r from-green-500/10 to-transparent shadow-lg shadow-green-500/5 group" glowColor="green">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-green-400 font-bold mb-2 opacity-60">Strategic Edge</span>
                  <p className="text-3xl font-black italic tracking-tighter text-white">AI-POWERED WORKFLOW</p>
               </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Let's Connect */}
        <div className="flex flex-col gap-6">
          <div className="mb-4 lg:text-right">
             <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold block mb-2">Network</span>
             <h2 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter leading-tight">
                Let's <br/><span className="italic opacity-80">Connect</span>
             </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-grow">
             {socialLinks.map((social, i) => (
               <a 
                key={i} 
                href={social.url} 
                target="_blank" 
                rel="noreferrer"
                className={`glass-3d rounded-3xl p-10 flex flex-col items-center justify-center gap-6 transition-all duration-500 hover:scale-[1.03] active:scale-95 group overflow-hidden relative ${social.glow}`}
               >
                  {/* Pulsing Background Glow */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-3xl animate-pulse -z-10 ${social.bgGlow}`} />
                  
                  <div className={`transition-all duration-500 group-hover:scale-125 relative z-10 ${social.color}`}>
                     {social.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 group-hover:opacity-100 transition-all group-hover:tracking-[0.4em] relative z-10">{social.name}</span>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               </a>
             ))}
          </div>

          <GlassCard className="mt-4 flex items-center justify-between p-8 border-white/10" glowColor="white">
             <div>
                <p className="text-[10px] text-white/40 mb-1 uppercase tracking-widest font-bold">Location</p>
                <p className="font-bold tracking-tight">Vietnam — Ho Chi Minh City</p>
             </div>
             <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             </div>
          </GlassCard>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-24 pt-12 border-t border-white/10 w-full text-center">
         <p className="text-white/20 text-xs uppercase tracking-[0.5em]">&copy; 2026 Created by Lê Thanh Hải.</p>
      </footer>
    </section>
  );
};

export default Contact;
