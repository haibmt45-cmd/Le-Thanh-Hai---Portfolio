import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Save, RefreshCw, Type, Image as ImageIcon, Link as LinkIcon, Plus, CheckCircle, ChevronRight, Languages } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../context/I18nContext';

const ContentEditor: React.FC = () => {
  const { translations, updateTranslation, lang, toggleLang, t } = useI18n();
  const [activeTab, setActiveTab] = useState('hero');
  const [formState, setFormState] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormState(JSON.parse(JSON.stringify(translations)));
  }, [translations]);

  const handleInputChange = (path: string, value: string) => {
    const keys = path.split('.');
    const newState = { ...formState };
    let current = newState[lang];
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setFormState(newState);
  };

  const handleSave = () => {
    setIsSaving(true);
    updateTranslation(formState);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleReset = () => {
    setFormState(JSON.parse(JSON.stringify(translations)));
  };

  const tabs = [
    { id: 'hero', label: t('nav.about_group') + ': Hero' },
    { id: 'about', label: t('nav.who_am_i') },
    { id: 'vgg', label: t('nav.marketing') },
    { id: 'zunik', label: t('nav.event') },
    { id: 'personal', label: t('nav.personal') },
    { id: 'visuals', label: t('nav.vision') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const renderField = (key: string, value: any, path: string) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div key={path} className="space-y-6 pt-6 mt-6 border-t border-white/5">
          <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]">{key.replace(/_/g, ' ')} GROUP</h4>
          <div className="grid grid-cols-1 gap-6 pl-4 border-l border-white/5">
            {Object.entries(value).map(([childKey, childValue]) => renderField(childKey, childValue, `${path}.${childKey}`))}
          </div>
        </div>
      );
    }

    if (typeof value !== 'string') return null;

    const isImage = key.startsWith('img') || key.includes('icon') || key.includes('src') || value.includes('drive.google.com') || value.includes('zunikevent.vn');
    const isLargeText = value.length > 80 || key.includes('desc') || key.includes('result') || key.includes('desc');

    return (
      <div key={path} className="space-y-2">
        <div className="flex items-center justify-between ml-2">
           <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{key.replace(/_/g, ' ')}</label>
           {isImage && <span className="text-[8px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1"><ImageIcon className="w-2 h-2" /> Media URL</span>}
        </div>
        
        {isLargeText ? (
          <textarea 
            rows={value.length > 200 ? 6 : 3}
            value={value}
            onChange={(e) => handleInputChange(path, e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-none leading-relaxed"
          />
        ) : (
          <div className="relative">
            <input 
              type="text" 
              value={value}
              onChange={(e) => handleInputChange(path, e.target.value)}
              className={`w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all ${isImage ? 'pr-20' : ''}`}
            />
            {isImage && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-white/5 p-1">
                <img src={value} alt="Preview" className="w-full h-full object-cover rounded-lg" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/111/444?text=NA')} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFields = () => {
    const section = formState[lang]?.[activeTab];
    if (!section) return null;

    const allKeys = Object.keys(section);
    
    // Categorize fields
    const headerKeys = allKeys.filter(k => (k.includes('title') || k.includes('tagline') || k.includes('subtitle') || k.includes('role') || k.includes('position')) && typeof section[k] === 'string');
    const imageKeys = allKeys.filter(k => (k.includes('img') || k.includes('image') || k.includes('src') || k.includes('icon') || (typeof section[k] === 'string' && (section[k].includes('http') || section[k].includes('drive.google.com') || section[k].includes('zunikevent.vn')))) && !headerKeys.includes(k) && typeof section[k] === 'string');
    const objectKeys = allKeys.filter(k => typeof section[k] === 'object' && section[k] !== null && !Array.isArray(section[k]));
    const otherKeys = allKeys.filter(k => !headerKeys.includes(k) && !imageKeys.includes(k) && !objectKeys.includes(k) && typeof section[k] === 'string');

    return (
      <div className="space-y-12">
        {headerKeys.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] flex items-center gap-2"><Type className="w-3 h-3"/> Headers & Titles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              {headerKeys.map(k => renderField(k, section[k], `${activeTab}.${k}`))}
            </div>
          </div>
        )}

        {otherKeys.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] flex items-center gap-2"><Type className="w-3 h-3"/> Content & Descriptions</h4>
            <div className="grid grid-cols-1 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              {otherKeys.map(k => renderField(k, section[k], `${activeTab}.${k}`))}
            </div>
          </div>
        )}

        {imageKeys.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] flex items-center gap-2"><ImageIcon className="w-3 h-3"/> Media & Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              {imageKeys.map(k => renderField(k, section[k], `${activeTab}.${k}`))}
            </div>
          </div>
        )}

        {objectKeys.length > 0 && (
          <div className="space-y-4">
            {objectKeys.map(k => renderField(k, section[k], `${activeTab}.${k}`))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t('admin.editor.title')}</h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.4em] font-bold mt-2">{t('admin.editor.subtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <button 
            onClick={toggleLang}
            className="flex justify-center items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-white/60 font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <Languages className="w-4 h-4 text-blue-400" />
            {lang === 'vi' ? 'Tiếng Việt' : 'English'}
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn Khôi phục dữ liệu gốc không? Các nội dung bạn đã chỉnh sửa trong Admin sẽ bị xoá.')) {
                localStorage.removeItem('site_content');
                window.location.reload();
              }
            }}
            className="flex justify-center items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all"
          >
            Khôi phục gốc
          </button>
          <button 
            onClick={handleReset}
            className="flex justify-center items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            {t('admin.editor.reset')}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex justify-center items-center gap-2 px-8 py-3 rounded-2xl text-[10px] text-white font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] ${isSaving ? 'bg-blue-800' : 'bg-blue-500 hover:bg-blue-400'}`}
          >
            {isSaving ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : showSuccess ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {showSuccess ? t('admin.editor.saved') : isSaving ? t('admin.editor.saving') : t('admin.editor.publish')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        {/* Navigation Rail */}
        <aside className="xl:col-span-1 border-b border-white/5 xl:border-none pb-4 xl:pb-0">
          <div className="flex xl:flex-col gap-2 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 scrollbar-hide xl:sticky xl:top-10 h-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 text-left p-4 xl:p-5 rounded-2xl transition-all border ${
                  activeTab === tab.id 
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                    : 'bg-white/5 border-white/5 text-white/40 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[10px] xl:text-xs font-black uppercase tracking-widest whitespace-nowrap">{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight className="hidden xl:block w-4 h-4" />}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Editor Area */}
        <div className="xl:col-span-3 space-y-8">
          <GlassCard className="p-10 border-white/5" glowColor="blue">
            <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Type className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">{t('admin.editor.writing')} {tabs.find(t => t.id === activeTab)?.label}</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{t('admin.editor.editing_mode')}: {lang.toUpperCase()}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {renderFields()}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
