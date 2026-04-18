import React from 'react';
import GlassCard from '../components/GlassCard';

const VGGMarketing: React.FC = () => {
  const products = [
    { name: 'Professional Videography', img: 'https://drive.google.com/thumbnail?id=19Z-htGd1bV3WccKlDNT-oLEjc2XLIaD4&sz=w1000' },
    { name: 'Commercial Photography', img: 'https://drive.google.com/thumbnail?id=1atYMMV1TFxHU7SPLiuZGp-p6k7xILBwa&sz=w1000' },
    { name: 'AI-Powered Content', img: 'https://drive.google.com/thumbnail?id=16wl7PC_mJZIQy4crAcetUY_4QznBzXES&sz=w1000' },
    { name: 'Performance Marketing', img: 'https://drive.google.com/thumbnail?id=1h9Td0w1znHzsc8GImQxhsjHLy7uwvNQX&sz=w1000' },
  ];

  return (
    <section id="vgg" className="min-h-screen py-32 px-6 relative overflow-hidden">
      {/* Localized Light Beams (Hero Style - Red) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent rotate-[15deg] blur-[2px] opacity-70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent -rotate-[10deg] blur-[2px] opacity-70" />
        {/* Ambient Glows */}
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-red-600/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-red-500/10 blur-[130px] rounded-full animate-pulse delay-500" />
      </div>

      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[150px] rounded-full" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center">
          <span className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-bold block mb-4 mx-auto">02. Strategy</span>
          <h2 className="text-4xl lg:text-7xl font-black uppercase italic tracking-tighter leading-tight">
            <span className="italic opacity-80">Marketing</span> Executive
          </h2>
          <div className="flex flex-col items-center gap-12 mt-12 w-full">
            <div className="max-w-5xl text-center">
               <p className="text-white/60 text-xl leading-relaxed mb-8">
                  Trong vai trò Marketing Executive tại VGG, em đã trực tiếp vận hành hệ sinh thái nội dung đa nền tảng. 
                  Bằng cách ứng dụng công cụ AI để tối ưu hóa 30% quy trình sáng tạo và trực tiếp thực hiện quay dựng video chuyên nghiệp, 
                  em đã góp phần đưa doanh nghiệp đạt mốc tăng trưởng <span className="text-red-500 font-bold">25% doanh thu</span>. 
                  Bên cạnh đó, em thực hiện chụp ảnh sản phẩm bằng thiết bị kỹ thuật số chuyên dụng và phối hợp cùng đội ngũ IT để phát triển Website công ty.
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                  {['AI-Powered Content', 'Professional Videography', 'Performance Marketing', 'Commercial Photography'].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 text-sm font-semibold">
                      {tag}
                    </span>
                  ))}
               </div>
            </div>
            
            <GlassCard className="w-full max-w-4xl mx-auto border-red-500/20 text-center px-6 py-8 md:px-12" glowColor="red">
               <h4 className="text-red-500 font-bold mb-2 uppercase tracking-widest text-sm">Key Achievement</h4>
               <p className="text-2xl md:text-3xl font-bold mb-4">Tăng 25% Doanh thu qua kênh truyền thông</p>
               <p className="text-white/60 text-base md:text-lg leading-relaxed">
                  Con số 25% doanh thu này được em đo lường dựa trên sự tăng trưởng đơn hàng thực tế từ các chiến dịch Facebook Ads kết hợp với hệ thống nội dung Video &amp; Hình ảnh chuyên nghiệp. Đặc biệt, sau khi phối hợp cùng team IT tối ưu lại Website và ứng dụng công cụ AI để đẩy nhanh tốc độ phủ sóng nội dung, tỷ lệ chuyển đổi khách hàng đã có bước đột phá rõ rệt so với giai đoạn trước đó.
               </p>
            </GlassCard>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item, i) => (
            <GlassCard key={item.name} className="p-2 group cursor-pointer hover:-translate-y-2 hover:border-red-400/40 hover:shadow-[0_20px_40px_-5px_rgba(239,68,68,0.3)] transition-all duration-500" glowColor="red">
              <div className="relative overflow-hidden rounded-2xl transform-gpu">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full aspect-[2/3] object-cover transition-all duration-700 group-hover:scale-105 relative z-0" 
                />
                {/* Inner shadow overlay for depth */}
                <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] rounded-2xl transition-opacity duration-500 group-hover:opacity-50" />
              </div>
              <p className="mt-4 text-center font-bold text-white/60 group-hover:text-red-500 transition-colors duration-300 uppercase text-xs tracking-widest">{item.name}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VGGMarketing;
