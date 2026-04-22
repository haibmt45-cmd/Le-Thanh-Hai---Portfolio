import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface NavbarProps {
  activeSection: string;
  isLoading?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, isLoading }) => {
  const { t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const scrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('hero');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
    }
  };

  const navItems = [
    {
      id: 'about',
      label: t('nav.about_group'),
      children: [
        { id: 'about', label: t('nav.who_am_i') },
        { id: 'technical-work', label: t('nav.skills') },
      ]
    },
    {
      id: 'projects',
      label: t('nav.projects_group'),
      children: [
        { id: 'zunik', label: t('nav.event') },
        { id: 'vgg', label: t('nav.marketing') },
        { id: 'personal', label: t('nav.personal') },
      ]
    },
    {
      id: 'contact',
      label: t('nav.contact'),
      href: '#contact'
    }
  ];

  return (
    <>
      {/* Branding - Top Left (Home) */}
      <motion.a 
        initial={{ y: -50, opacity: 0 }}
        animate={!isLoading ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        href="#hero"
        onClick={scrollToHero}
        className="fixed top-6 left-6 z-[60] font-black tracking-[0.3em] uppercase text-base sm:text-lg transition-all duration-300 group cursor-pointer"
      >
        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.8)] transition-all">
          LÊ THANH HẢI
        </span>
        {/* Underglow Line */}
        <div className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-[1px] group-hover:via-cyan-300 transition-all duration-500" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-cyan-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
        
        {/* Subtle glow behind text */}
        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </motion.a>

      {/* Hamburger Menu - Top Right (Mobile Only) */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={!isLoading ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="fixed top-4 right-[72px] sm:hidden z-[70]"
      >
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] outline-none"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-white/90" /> : <Menu className="w-5 h-5 text-white/90" />}
        </button>
      </motion.div>

      {/* Desktop Navigation Center */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={!isLoading ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="hidden sm:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/50 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.05)] rounded-full px-8 py-2.5 items-center gap-10 text-xs font-bold uppercase tracking-widest text-white/80"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-cyan-900/20 blur-xl pointer-events-none" />

        {navItems.map(item => (
          <div 
            key={item.id} 
            className="relative group block"
            onMouseEnter={() => setActiveDropdown(item.id)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {item.children ? (
              <button className="flex items-center gap-1.5 hover:text-white transition-colors duration-300 py-3">
                <span className={item.children.some(c => c.id === activeSection) ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}>
                  {item.label}
                </span>
                <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-transform duration-300 group-hover:rotate-180" strokeWidth={1} />
              </button>
            ) : (
              <a 
                href={item.href} 
                onClick={(e) => handleScrollTo(e, item.id)}
                className="block hover:text-white transition-colors duration-300 py-3 relative"
              >
                <span className={activeSection === item.id ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}>{item.label}</span>
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.8)] ${activeSection === item.id ? 'w-full' : 'w-0'}`} />
              </a>
            )}

            {/* Desktop Dropdown */}
            {item.children && (
              <AnimatePresence>
                {activeDropdown === item.id && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-[100%] left-1/2 -translate-x-1/2 pt-1 w-56 flex flex-col"
                  >
                    <div className="p-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                      {item.children.map(child => (
                        <a 
                          key={child.id}
                          href={`#${child.id}`}
                          onClick={(e) => handleScrollTo(e, child.id)}
                          className="px-4 py-3 rounded-xl text-[11px] uppercase tracking-wider hover:bg-white/10 hover:text-cyan-300 transition-all duration-300 whitespace-nowrap text-left text-white/70"
                        >
                          <span className={activeSection === child.id ? 'text-cyan-400 font-black' : ''}>{child.label}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </motion.nav>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[65] bg-black/95 backdrop-blur-2xl sm:hidden flex flex-col items-center justify-center pt-20"
          >
            {/* Ambient Mobile background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black pointer-events-none" />

            <div className="flex flex-col gap-10 text-center text-white w-full px-8 overflow-y-auto pb-20 relative z-10">
              {navItems.map(item => (
                <div key={item.id} className="flex flex-col gap-5">
                  {item.children ? (
                    <>
                      <div className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-black border-b border-white/10 pb-3 w-full text-left flex items-center gap-2">
                        <ChevronDown className="w-3 h-3 -rotate-90" />
                        {item.label}
                      </div>
                      <div className="flex flex-col gap-6 text-left pl-6 border-l border-white/5">
                        {item.children.map(child => (
                          <a 
                            key={child.id}
                            href={`#${child.id}`}
                            onClick={(e) => handleScrollTo(e, child.id)}
                            className={`text-xl font-medium uppercase tracking-widest transition-colors ${activeSection === child.id ? 'text-cyan-400 font-bold' : 'text-white/80 hover:text-white'}`}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="mt-8 border-t border-white/10 pt-10 w-full text-center">
                       <a 
                          href={item.href}
                          onClick={(e) => handleScrollTo(e, item.id)}
                          className="inline-block py-4 px-12 rounded-full border border-white/20 bg-white/5 text-xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                        >
                          {item.label}
                        </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
