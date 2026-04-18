import React, { useMemo } from 'react';

const ShootingStars: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      top: Math.random() * 50 - 20, // Start slightly above or in the top half
      left: Math.random() * 80 + 20, // Start from the mid-right side
      delay: Math.random() * 15, // Longer random delay between stars
      duration: Math.random() * 1 + 2, // 2-3s active animation duration
      size: Math.random() * 1.5 + 2.5, // 2.5-4px thickness (larger than snow)
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <style>{`
        @keyframes shooting-star-anim {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          20% {
            opacity: 0;
            transform: translateX(120vw);
          }
          100% {
            opacity: 0;
            transform: translateX(120vw);
          }
        }
      `}</style>
      
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            transform: 'rotate(145deg)', // Angle pointing down-left
          }}
        >
          <div
            className="relative bg-gradient-to-r from-transparent to-white rounded-full"
            style={{
              width: `${star.size * 60}px`, // Tail length
              height: `${star.size}px`,     // Thickness
              animation: `shooting-star-anim ${star.duration * 4}s linear infinite`,
              animationDelay: `${star.delay}s`,
              opacity: 0,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
            }}
          >
            {/* Star Head (Brighter/Thicker core) */}
            <div 
              className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-full"
              style={{
                width: `${star.size * 2}px`,
                height: `${star.size * 2}px`,
                boxShadow: '0 0 15px 3px rgba(255, 255, 255, 0.9)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShootingStars;
