import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Snowfall from './components/Snowfall';
import BackgroundVideo from './components/BackgroundVideo';
import ShootingStars from './components/ShootingStars';
import LoadingScreen from './components/LoadingScreen';
import Hero from './sections/Hero';
import Visuals from './sections/Visuals';
import AboutMe from './sections/AboutMe';
import TechnicalWork from './sections/TechnicalWork';
import ZunikEvent from './sections/ZunikEvent';
import VGGMarketing from './sections/VGGMarketing';
import PersonalProjects from './sections/PersonalProjects';
import Contact from './sections/Contact';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useI18n } from './context/I18nContext';

import Navbar from './components/Navbar';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const { t, lang } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'technical-work', 'zunik', 'vgg', 'personal', 'contact'];
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
      
      {!isLoading && <LanguageSwitcher />}
      
      {/* Navigation Layer */}
      <Navbar activeSection={activeSection} isLoading={isLoading} />

      {/* Content Sections (Animate from top/bottom) */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={!isLoading ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hero />
            <AboutMe />
            <TechnicalWork />
            <ZunikEvent />
            <VGGMarketing />
            <PersonalProjects />
            <Contact />
            <Visuals />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Global Ambient Glows */}
      <div className="fixed top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[10%] right-[-10%] w-[30%] h-[50%] bg-purple-600/5 blur-[150px] pointer-events-none rounded-full" />
    </main>
  );
}
