import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Upload, Trash2, Folder, Search, Filter, Plus, FileVideo, FileAudio, ExternalLink } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../context/I18nContext';

const MediaManager: React.FC = () => {
  const { translations, lang } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const allMedia = useMemo(() => {
    const extractMedia = (obj: any, path: string = ''): any[] => {
      let images: any[] = [];
      if (!obj) return images;
      Object.keys(obj).forEach(key => {
        const val = obj[key];
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof val === 'string' && (key.includes('img') || key.includes('image') || key.includes('src') || key.includes('icon') || val.includes('drive.google.com') || val.includes('http'))) {
          images.push({ 
            id: currentPath, 
            type: 'image', 
            url: val, 
            name: `${currentPath.split('.').pop()}`, 
            size: 'Linked Asset', 
            date: 'Active' 
          });
        } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          images = [...images, ...extractMedia(val, currentPath)];
        }
      });
      return images;
    };
    return extractMedia(translations?.[lang] || {});
  }, [translations, lang]);

  const filtered = allMedia.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2">Media Library</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Manage Assets & Files</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-400 rounded-2xl text-[10px] text-white font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Upload className="w-4 h-4" />
            Upload New
          </button>
        </div>
      </header>

      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
              />
            </div>
            <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">Images</button>
            <button className="flex-1 md:flex-none px-6 py-2 rounded-lg text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Videos</button>
            <button className="flex-1 md:flex-none px-6 py-2 rounded-lg text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Docs</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filtered.map(item => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all ${
                selectedItem === item.id 
                  ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-2 ring-blue-500/50 ring-offset-2 ring-offset-[#050505]' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="aspect-square relative bg-white/5 flex items-center justify-center p-4">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button className="p-2 bg-blue-500 rounded-full text-white hover:scale-110 transition-transform">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-500 rounded-full text-white hover:scale-110 transition-transform">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-white/5 border-t border-white/10">
                <p className="text-xs font-bold text-white truncate mb-1">{item.name}</p>
                <div className="flex justify-between items-center text-[10px] text-white/40 uppercase tracking-widest">
                  <span>{item.size}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="aspect-square rounded-2xl border border-dashed border-white/20 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer text-white/40 hover:text-blue-400">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Upload File</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default MediaManager;
