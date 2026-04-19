import React from 'react';
import { motion } from 'motion/react';
import GlassCard from '../components/GlassCard';
import Marquee from '../components/Marquee';

const Hero: React.FC = () => {
  const aiLogos = [
    { name: 'Gemini', icon: 'https://pnglove.com/data/img/3519_VWHm.jpg' },
    { name: 'Sora', icon: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/sora-color.png' },
    { name: 'Midjourney', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAY1BMVEX////AwMB6eHn39/dlY2OJiIi3trewr6/s7OzMy8uQj4/e3t77+/vw8PBHREWAfn5VUlONjI1oZmepqKhta2utrKx3dXaYl5i+vr7Y19eGhYUPBgmenZ3j4+POzs5NS0s3NDWiicnfAAAAuUlEQVR4AdWQUwLEMBRFb+za3v8qx2z7OzhxTvjwPQhl2IcLuS+VNhTWbUtvEbiP6LaNT2cj4WFLpqcqQ0z1hsxPk1oYU2zI8iRRugrVWtYeJyrXELL1oBPSUawO9iku2DK0zZvMW9UdsW0cKpO9Ot0PI05MAqMbXuXIvG4novK67oSos/nJZbYeSjK1Y8AJYl/CXkxAGxtgopOjtpvuiokcsktzqE6UUIuVyDt2s+G04lGd5oPHv3EAAVkIwKf1rt4AAAAASUVORK5CYII' },
    { name: 'ChatGPT', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
    { name: 'Suno', icon: 'https://suno.com/favicon.ico' },
  ];

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Content */}
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="relative z-10"
        >
          <div className="relative inline-flex items-center gap-4 px-6 py-3 rounded-3xl bg-white/10 backdrop-blur-md border border-white/30 mb-8 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-shadow duration-500 cursor-default">
            {/* Animated glowing dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_#22d3ee]"></span>
            </span>
            {/* Gradient text */}
            <span className="text-[10px] sm:text-xs md:text-[11px] font-extrabold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 flex flex-col items-center gap-1 text-center">
              <span>Tân cử nhân khoa Quan hệ công chúng - Truyền thông</span>
              <span>Trường Đại học Văn Lang</span>
            </span>
          </div>
          <h1 className="leading-tight tracking-tight mb-8">
            <span className="relative inline-block text-5xl lg:text-6xl font-black italic uppercase tracking-tighter mb-10 group cursor-default">
              Lê Thanh Hải
              {/* Liquid Glass Underline Effect */}
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-white to-purple-500 rounded-full blur-[1px] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-2 left-0 w-full h-[4px] bg-white/10 backdrop-blur-md rounded-full border-t border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
            </span>
            <br />
            <span className="text-2xl lg:text-4xl font-bold text-white/90 block mb-2 italic">
              Kiến tạo trải nghiệm.
            </span>
            <span className="text-2xl lg:text-4xl font-bold text-white/90 block italic">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400">
                Duy mĩ trong truyền thông.
              </span>
            </span>
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-2xl leading-relaxed">
            Marketing Executive.<br className="hidden md:block" />
            Tối ưu <span className="text-white font-bold">30% hiệu suất</span> bằng <span className="whitespace-nowrap">giải pháp trí tuệ nhân tạo (AI Stack).</span>
          </p>
          
          <div className="flex gap-4">
            <a href="#contact" className="glass-3d px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform active:scale-95 glow-blue">
               Liên hệ ngay
            </a>
            <a href="#visuals" className="px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/10 transition-colors">
               Xem Portfolio
            </a>
          </div>
        </motion.div>

        {/* Right Side: Portrait */}
        <div className="relative">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-400/30 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-400/30 blur-[100px] rounded-full delay-1000 animate-pulse" />
          
          {/* Distinct Light Beams (Lines) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent rotate-[35deg] blur-[2px] z-0 opacity-80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent -rotate-[35deg] blur-[2px] z-0 opacity-80" />
          
          <GlassCard className="w-full max-w-[450px] mx-auto p-3 overflow-hidden hover:rotate-2 transition-transform duration-700 rounded-t-3xl rounded-b-[60px] border border-white/20 relative z-10" glowColor="blue" whileInView={false}>
            <div className="relative overflow-hidden rounded-t-2xl rounded-b-[48px]">
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src="https://drive.google.com/thumbnail?id=1oHO4kreco9ff_UzeniNEoXUf9JImcfsm&sz=w1200"
                alt="Lê Thanh Hải Portrait"
                className="w-full h-auto object-cover relative z-0"
                referrerPolicy="no-referrer"
              />
              {/* Inner Shadow Overlay for depth */}
              <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.4)] rounded-t-2xl rounded-b-[48px]" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Marquee AI Section */}
      <div className="w-full mt-24 relative py-8 bg-gradient-to-r from-transparent via-blue-900/10 to-transparent backdrop-blur-sm overflow-hidden">
        {/* Glow & High-tech borders */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-cyan-500/5 blur-[50px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.6)]" />

        <Marquee direction="left" speed={40}>
          {aiLogos.map((logo, idx) => (
            <div key={idx} className="group flex items-center gap-4 mx-4 px-6 py-3 rounded-full bg-white/5 border border-white/5 backdrop-blur-md opacity-80 hover:opacity-100 hover:bg-white/10 hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] transition-all duration-500 hover:-translate-y-1 cursor-default">
               <div className="relative">
                 <div className="absolute inset-0 bg-cyan-400/60 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <img src={logo.icon} alt={logo.name} className="h-8 w-auto rounded relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-all duration-500" referrerPolicy="no-referrer" />
               </div>
               <span className="text-xl font-black tracking-tighter uppercase text-white/70 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-200 transition-all duration-500">
                 {logo.name}
               </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Hero;
