import React from 'react';
import { motion } from 'motion/react';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
}

const Marquee: React.FC<MarqueeProps> = ({ children, direction = 'left', speed = 40 }) => {
  return (
    <div className="flex overflow-hidden group select-none">
      <motion.div
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
        className="flex shrink-0 min-w-full items-center gap-12 py-4"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

export default Marquee;
