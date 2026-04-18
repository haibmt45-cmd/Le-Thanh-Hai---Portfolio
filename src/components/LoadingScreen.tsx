import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const texts = ['LÊ THANH HẢI'];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [percentage, setPercentage] = useState(50);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Show name for 1s
    const textTimer = setTimeout(() => {
      setIndex(1);
    }, 1000);

    return () => clearTimeout(textTimer);
  }, []);

  useEffect(() => {
    if (index === 1 && percentage < 100) {
      const interval = setInterval(() => {
        setPercentage(prev => Math.min(prev + 1, 100)); // Slower increment for smoothness
      }, 15); // Adjust speed
      return () => clearInterval(interval);
    } else if (percentage === 100 && index === 1) {
      // Immediate slide up and exit logic
      setIsExiting(true);
    }
  }, [index, percentage]);

  useEffect(() => {
    if (isExiting) {
      onComplete(); // Instant trigger
    }
  }, [isExiting, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div 
           className="fixed inset-0 z-[9999] bg-black flex items-center justify-center font-sans text-white px-4 text-center"
           exit={{ y: '-100%', transition: { duration: 0.5, ease: "easeInOut" } }}
        >
           <AnimatePresence mode="wait">
              {index === 0 ? (
                <motion.h1
                  key="name"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="text-4xl md:text-7xl font-bold uppercase italic tracking-wider"
                >
                  {texts[0]}
                </motion.h1>
              ) : (
                <motion.h1
                  key="percentage"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-6xl md:text-9xl font-bold tabular-nums"
                >
                  {percentage}%
                </motion.h1>
              )}
           </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
