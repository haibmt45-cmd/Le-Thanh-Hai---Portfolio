import React from 'react';
import { motion } from 'motion/react';
import GlassCard from '../components/GlassCard';

const ZunikEvent: React.FC = () => {
  const projects = [
    { 
      title: 'Zunik 10 Years Anniversary', 
      image: 'https://zunikevent.vn/wp-content/uploads/2025/10/HUY00851.jpg', 
      desc: 'Lễ kỷ niệm 10 năm thành lập của Zunik',
      url: '#'
    },
    { 
      title: 'Kỷ niệm 35 năm Khoa QLCN - Trường Đại học Bách Khoa', 
      image: 'https://drive.google.com/thumbnail?id=1dUwnbAenHp7LNrHUu9D5I-tY9X37O6xz&sz=w1000', 
      desc: 'Lễ kỷ niệm truyền thống & Trang trọng',
      url: '#'
    },
    { 
      title: 'Thiên Mộc Hương Launching Aura Collection', 
      image: 'https://zunikevent.vn/wp-content/uploads/2026/04/612006996_919523067300799_6676736734415795302_n-2048x779.jpg', 
      desc: 'Ra mắt bộ sưu tập Aura và tranh Mosaic cao cấp',
      url: '#'
    },
    { 
      title: 'Luxe Clinic - Crown In Beauty', 
      image: 'https://zunikevent.vn/wp-content/uploads/2026/03/TT_9739-2048x1365.jpg', 
      desc: 'Private dinner cho các quý phu nhân',
      url: '#'
    },
  ];

  return (
    <section id="zunik" className="min-h-screen py-32 px-6 relative overflow-hidden">
      {/* Localized Light Beams (Hero Style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent rotate-[10deg] blur-[2px] opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-600/40 to-transparent -rotate-[10deg] blur-[2px] opacity-50" />
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-500/15 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-400/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center">
          <span className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-bold block mb-6 mx-auto">01. Experience</span>
          <h2 className="text-4xl lg:text-7xl font-black uppercase italic tracking-tighter leading-relaxed mb-8">
            <span className="italic opacity-80">Quản trị</span> & <span className="italic opacity-80">vận hành</span> sự kiện
          </h2>
          <p className="mt-10 text-white/60 text-xl max-w-5xl mx-auto leading-relaxed">
            Kinh nghiệm làm <span className="text-white font-bold">Account & Event Executive</span> đã rèn luyện cho em tư duy quản trị dự án khắt khe <br className="hidden md:block" />
            và khả năng điều phối nhân sự đa nhiệm. Em biết cách biến những ý tưởng trên proposal thành những <br className="hidden md:block" />
            trải nghiệm thực tế cho khách hàng, đồng thời tối ưu hóa việc sản xuất nội dung Media ngay tại sự kiện để tăng hiệu quả truyền thông.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <GlassCard key={idx} className="group cursor-default hover:-translate-y-2 hover:border-purple-400/40 hover:shadow-[0_20px_40px_-5px_rgba(168,85,247,0.3)] transition-all duration-500" glowColor="purple">
              <div className="aspect-video overflow-hidden rounded-xl mb-6 relative transform-gpu">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 relative z-0" 
                  referrerPolicy="no-referrer"
                />
                {/* Inner shadow overlay for depth */}
                <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] rounded-xl transition-opacity duration-500 group-hover:opacity-50" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">{project.title}</h3>
              <p className="text-white/40 group-hover:text-white/60 transition-colors duration-300">{project.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ZunikEvent;
