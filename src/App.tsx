import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Snowfall from './components/Snowfall';
import BackgroundVideo from './components/BackgroundVideo';
import ShootingStars from './components/ShootingStars';
import LoadingScreen from './components/LoadingScreen';
import Hero from './sections/Hero';
import Visuals from './sections/Visuals';
import TechnicalWork from './sections/TechnicalWork';
import ZunikEvent from './sections/ZunikEvent';
import VGGMarketing from './sections/VGGMarketing';
import PersonalProjects from './sections/PersonalProjects';
import Contact from './sections/Contact';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'visuals', 'technical-work', 'zunik', 'vgg', 'personal', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen selection:bg-blue-500 selection:text-white">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {/* Background Layer */}
      <BackgroundVideo />
      <Snowfall />
      <ShootingStars />

      {/* Navigation (Animate from top) */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={!isLoading ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full px-4 py-2 sm:px-8 sm:py-3 flex items-center gap-3 sm:gap-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/70 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-blue-900/10 blur-xl pointer-events-none" />

        {[ 
          { label: 'Intro', href: '#hero', id: 'hero' }, 
          { label: 'Visuals', href: '#visuals', id: 'visuals' }, 
          { label: 'Mastery', href: '#technical-work', id: 'technical-work' },
          { label: 'Event', href: '#zunik', id: 'zunik' }, 
          { label: 'Marketing', href: '#vgg', id: 'vgg' }, 
          { label: 'Projects', href: '#personal', id: 'personal' },
          { label: 'Contact', href: '#contact', id: 'contact' } 
        ].map((item) => (
          <a key={item.label} href={item.href} className="relative group hover:text-white transition-colors duration-300 py-1 flex flex-col items-center gap-1">
            <span className={`relative z-10 transition-all duration-300 ${activeSection === item.id ? 'text-white' : ''}`}>
              {item.label}
            </span>
            <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.8)] ${activeSection === item.id ? 'w-full' : 'w-0'}`} />
          </a>
        ))}
      </motion.nav>

      {/* Content Sections (Animate from top/bottom) */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={!isLoading ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        <Hero />
        <Visuals />
        <TechnicalWork />
        <ZunikEvent />
        <VGGMarketing />
        <PersonalProjects />
        <Contact />
      </motion.div>

      {/* Global Ambient Glows */}
      <div className="fixed top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[10%] right-[-10%] w-[30%] h-[50%] bg-purple-600/5 blur-[150px] pointer-events-none rounded-full" />
    </main>
  );
}
