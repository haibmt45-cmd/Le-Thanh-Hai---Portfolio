import React from 'react';
import { motion } from 'motion/react';
import GlassCard from '../components/GlassCard';

const AboutMe: React.FC = () => {
  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <GlassCard className="!p-0 overflow-hidden border border-white/10" glowColor="purple">
              <img 
                src="https://drive.google.com/thumbnail?id=1oHO4kreco9ff_UzeniNEoXUf9JImcfsm&sz=w1000" 
                alt="About Me" 
                className="w-full aspect-[4/5] object-cover" 
                referrerPolicy="no-referrer"
              />
            </GlassCard>
            {/* Ambient decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full -z-10" />
          </motion.div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold block">About Me</span>
            <h2 className="text-4xl lg:text-7xl font-black uppercase italic tracking-tighter leading-tight">
               Who am <span className="italic opacity-80">I?</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Chào bạn, mình là Lê Thanh Hải - một người làm Marketing & Event với tư duy thẩm mỹ cao và đam mê ứng dụng công nghệ AI vào công việc. 
              Mình tin rằng sự kết hợp giữa tư duy sáng tạo truyền thống và sức mạnh của công nghệ là chìa khóa để tạo nên những trải nghiệm thương hiệu đột phá.
            </p>
            <p className="text-white/60 text-lg leading-relaxed">
              Với kinh nghiệm thực chiến từ các dự án sự kiện quy mô đến các chiến dịch Digital Marketing, mình luôn khao khát được học hỏi và chinh phục những thử thách mới.
            </p>

            <div className="flex gap-4 mt-4">
              <a href="#contact" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors">
                Liên hệ với mình
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
