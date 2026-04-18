import React from 'react';
import Snowfall from './components/Snowfall';
import BackgroundVideo from './components/BackgroundVideo';
import ShootingStars from './components/ShootingStars';
import Hero from './sections/Hero';
import Visuals from './sections/Visuals';
import ZunikEvent from './sections/ZunikEvent';
import VGGMarketing from './sections/VGGMarketing';
import PersonalProjects from './sections/PersonalProjects';
import Contact from './sections/Contact';

export default function App() {
  return (
    <main className="relative min-h-screen selection:bg-blue-500 selection:text-white">
      {/* Background Layer */}
      <BackgroundVideo />
      <Snowfall />
      <ShootingStars />

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/60 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full px-8 py-3 flex items-center gap-6 sm:gap-8 text-xs font-bold uppercase tracking-widest text-white/70 overflow-hidden">
        {/* Inner top highlight for 3D glassy depth */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
        
        {/* Ambient background glow inside nav */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-blue-400/10 blur-xl pointer-events-none" />

        {[ 
          { label: 'Intro', href: '#hero' }, 
          { label: 'Visuals', href: '#visuals' }, 
          { label: 'Event', href: '#zunik' }, 
          { label: 'Marketing', href: '#vgg' }, 
          { label: 'Projects', href: '#personal' },
          { label: 'Contact', href: '#contact' } 
        ].map((item) => (
          <a filter="drop-shadow" key={item.label} href={item.href} className="relative group hover:text-white transition-colors duration-300 py-1">
            <span className="relative z-10 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,1)] transition-all duration-300">{item.label}</span>
            {/* Animated Underline Glow */}
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </a>
        ))}
      </nav>

      {/* Content Sections */}
      <div className="relative z-10">
        <Hero />
        <Visuals />
        <ZunikEvent />
        <VGGMarketing />
        <PersonalProjects />
        <Contact />
      </div>

      {/* Global Ambient Glows */}
      <div className="fixed top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[10%] right-[-10%] w-[30%] h-[50%] bg-purple-600/5 blur-[150px] pointer-events-none rounded-full" />
    </main>
  );
}
