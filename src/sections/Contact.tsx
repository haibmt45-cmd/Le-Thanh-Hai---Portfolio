import React from 'react';
import { motion } from 'motion/react';
import { Facebook, Phone, Mail, Instagram, MessageCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../context/I18nContext';

const Contact: React.FC = () => {
  const { t } = useI18n();
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
      
      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center">
        
        {/* Let's Connect */}
        <div className="text-center mb-16">
           <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold block mb-2">{t('contact.network')}</span>
           <h2 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter leading-tight">
              {t('contact.lets_connect').split(' ')[0]} <span className="italic opacity-80">{t('contact.lets_connect').split(' ')[1] || 'Connect'}</span>
           </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
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

        <GlassCard className="mt-12 flex items-center justify-between p-8 border-white/10 w-full" glowColor="white">
           <div>
              <p className="text-[10px] text-white/40 mb-1 uppercase tracking-widest font-bold">{t('contact.location_label')}</p>
              <p className="font-bold tracking-tight">{t('contact.location')}</p>
           </div>
           <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           </div>
        </GlassCard>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-12 border-t border-white/10 w-full text-center">
         <p className="text-white/20 text-xs uppercase tracking-[0.5em]">{t('contact.footer')}</p>
      </footer>
    </section>
  );
};

export default Contact;
