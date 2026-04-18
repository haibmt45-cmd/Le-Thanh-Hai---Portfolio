import React, { useMemo } from 'react';
import { motion } from 'motion/react';

const Snowfall: React.FC = () => {
  // Memoize the random properties to prevent re-generation on each re-render
  const snowflakes = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 1.5, // Larger size
      left: Math.random() * 100,
      initialY: Math.random() * -100 - 10,
      fallDuration: Math.random() * 15 + 25,
      swayDuration: Math.random() * 4 + 4,
      swayDistance: Math.random() * 30 + 10,
      opacity: Math.random() * 0.4 + 0.1, // Increased opacity for visibility
      blur: Math.random() * 0.8,
      delay: Math.random() * 30,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {snowflakes.map((snowflake) => (
        <motion.div
          key={snowflake.id}
          className="absolute"
          initial={{ 
            left: `${snowflake.left}%`, 
            top: `${snowflake.initialY}%` 
          }}
          animate={{
            top: ["0%", "110%"],
          }}
          transition={{
            duration: snowflake.fallDuration,
            ease: "linear",
            repeat: Infinity,
            delay: -snowflake.delay, // Use negative delay so particles are already spread
          }}
        >
          <motion.div
            animate={{
              x: [-snowflake.swayDistance, snowflake.swayDistance, -snowflake.swayDistance],
            }}
            transition={{
              duration: snowflake.swayDuration,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{
              width: `${snowflake.size}px`,
              height: `${snowflake.size}px`,
              opacity: snowflake.opacity,
              filter: `blur(${snowflake.blur}px)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Snowfall;
