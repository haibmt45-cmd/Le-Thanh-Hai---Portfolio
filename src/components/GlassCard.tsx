import React from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'green' | 'red' | 'purple' | 'white' | 'none';
  whileInView?: boolean;
  delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'none',
  whileInView = true,
  delay = 0
}) => {
  const glowClasses = {
    blue: 'hover:glow-blue',
    green: 'hover:glow-green',
    red: 'hover:glow-red',
    purple: 'hover:glow-purple',
    white: 'hover:glow-white',
    none: '',
  };

  return (
    <motion.div
      initial={whileInView ? { opacity: 0, scale: 0.9, y: 20 } : false}
      whileInView={whileInView ? { opacity: 1, scale: 1, y: 0 } : false}
      transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className={`glass-3d rounded-3xl p-6 transition-all duration-500 overflow-hidden relative group ${glowClasses[glowColor]} ${className}`}
    >
      {/* Subtle highlight sheen */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      {/* Background Glow */}
      {glowColor !== 'none' && (
        <div className={`absolute -z-10 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 -inset-10 bg-gradient-to-br ${
          glowColor === 'blue' ? 'from-blue-500 to-transparent' : 
          glowColor === 'green' ? 'from-green-500 to-transparent' : 
          glowColor === 'red' ? 'from-red-500 to-transparent' : 
          glowColor === 'purple' ? 'from-purple-500 to-transparent' : 
          'from-white/50 to-transparent'
        }`} />
      )}
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
