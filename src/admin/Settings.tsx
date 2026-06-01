import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, CheckCircle2, Copy, Search, Code, Palette, Settings as SettingsIcon, Save, RefreshCw, Layers } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('seo');
  const [domain, setDomain] = useState('lethanhhai.com');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [seo, setSeo] = useState({
    siteName: 'Lê Thanh Hải | Marketing Executive',
    metaDesc: 'Hồ sơ năng lực của Lê Thanh Hải - Marketing Executive tại TP.HCM.',
    keywords: 'marketing, executive, portfolio, Lê Thanh Hải, AI, marketing content',
    ogImage: 'https://drive.google.com/thumbnail?id=1oHO4kreco9ff_UzeniNEoXUf9JImcfsm&sz=w1200'
  });

  const [integrations, setIntegrations] = useState({
    gaId: 'G-XXXXXXXXXX',
    fbPixel: '',
    customHead: '',
    customBody: ''
  });

  const [appearance, setAppearance] = useState({
    primaryColor: '#3b82f6', // blue-500
    theme: 'dark',
    fontFamily: 'Inter'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.seo) setSeo(data.seo);
          if (data.integrations) setIntegrations(data.integrations);
          if (data.appearance) setAppearance(data.appearance);
          if (data.domain) setDomain(data.domain);
        }
      } catch (error) {
        console.error("Error fetching settings: ", error);
      }
    };
    fetchSettings();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'settings', 'global');
      await setDoc(docRef, {
        seo,
        integrations,
        appearance,
        domain
      }, { merge: true });
      alert('Cài đặt đã được lưu!');
    } catch (error) {
      console.error("Error saving settings: ", error);
      alert('Có lỗi xảy ra khi lưu cài đặt.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'seo', label: 'SEO & Metadata', icon: Search },
    { id: 'integrations', label: 'Integrations & Scripts', icon: Code },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'domain', label: 'DNS & Domains', icon: Globe },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2">Settings</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">System Configuration & Global Settings</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-8 py-3 rounded-2xl text-[10px] text-white font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] ${isSaving ? 'bg-blue-800' : 'bg-blue-500 hover:bg-blue-400'}`}
          >
            {isSaving ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <aside className="xl:col-span-1 border-b border-white/5 xl:border-none pb-4 xl:pb-0">
          <div className="flex xl:flex-col gap-2 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 scrollbar-hide xl:sticky xl:top-10 h-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 text-left p-4 xl:p-5 rounded-2xl transition-all border ${
                    activeTab === tab.id 
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                      : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] xl:text-xs font-black uppercase tracking-widest whitespace-nowrap">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="xl:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'seo' && (
                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Search className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight">SEO & Metadata</h2>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Search Engine Optimization</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Site Title / Name</label>
                      <input
                        type="text"
                        value={seo.siteName}
                        onChange={(e) => setSeo({...seo, siteName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Meta Description</label>
                      <textarea
                        value={seo.metaDesc}
                        onChange={(e) => setSeo({...seo, metaDesc: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors min-h-[100px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Keywords (comma separated)</label>
                      <input
                        type="text"
                        value={seo.keywords}
                        onChange={(e) => setSeo({...seo, keywords: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Social Sharing / OG Image URL</label>
                      <input
                        type="text"
                        value={seo.ogImage}
                        onChange={(e) => setSeo({...seo, ogImage: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                      {seo.ogImage && (
                        <div className="mt-4 rounded-xl overflow-hidden max-w-sm border border-white/10">
                          <img src={seo.ogImage} alt="OG Preview" className="w-full h-auto object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              )}

              {activeTab === 'integrations' && (
                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <Code className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight">Integrations & Scripts</h2>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Analytics and Custom Code</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Google Analytics ID</label>
                        <input
                          type="text"
                          value={integrations.gaId}
                          onChange={(e) => setIntegrations({...integrations, gaId: e.target.value})}
                          placeholder="G-..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Facebook Pixel ID</label>
                        <input
                          type="text"
                          value={integrations.fbPixel}
                          onChange={(e) => setIntegrations({...integrations, fbPixel: e.target.value})}
                          placeholder="Optional"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Custom Head Code</label>
                      <textarea
                        value={integrations.customHead}
                        onChange={(e) => setIntegrations({...integrations, customHead: e.target.value})}
                        placeholder="<!-- Scripts inside <head> -->"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors font-mono text-sm min-h-[150px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Custom Body Code</label>
                      <textarea
                        value={integrations.customBody}
                        onChange={(e) => setIntegrations({...integrations, customBody: e.target.value})}
                        placeholder="<!-- Scripts before </body> -->"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors font-mono text-sm min-h-[150px]"
                      />
                    </div>
                  </div>
                </GlassCard>
              )}

              {activeTab === 'appearance' && (
                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Palette className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight">Appearance Config</h2>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Theme, Colors and Layout</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Primary Theme Color</label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="color"
                          value={appearance.primaryColor}
                          onChange={(e) => setAppearance({...appearance, primaryColor: e.target.value})}
                          className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                        />
                        <input
                          type="text"
                          value={appearance.primaryColor}
                          onChange={(e) => setAppearance({...appearance, primaryColor: e.target.value})}
                          className="flex-1 max-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Base Theme</label>
                      <div className="flex gap-4">
                        <label className={`flex-1 p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${appearance.theme === 'dark' ? 'bg-orange-500/10 border-orange-500/50 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
                          <input type="radio" value="dark" checked={appearance.theme === 'dark'} onChange={() => setAppearance({...appearance, theme: 'dark'})} className="hidden" />
                          <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
                            {appearance.theme === 'dark' && <div className="w-3 h-3 bg-orange-500 rounded-full" />}
                          </div>
                          Dark Mode
                        </label>
                        <label className={`flex-1 p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${appearance.theme === 'light' ? 'bg-orange-500/10 border-orange-500/50 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
                          <input type="radio" value="light" checked={appearance.theme === 'light'} onChange={() => setAppearance({...appearance, theme: 'light'})} className="hidden" />
                          <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
                            {appearance.theme === 'light' && <div className="w-3 h-3 bg-orange-500 rounded-full" />}
                          </div>
                          Light Mode
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Font Family</label>
                      <select 
                        value={appearance.fontFamily}
                        onChange={(e) => setAppearance({...appearance, fontFamily: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      >
                        <option value="Inter">Inter (Sans Serif)</option>
                        <option value="Space Grotesk">Space Grotesk (Modern)</option>
                        <option value="JetBrains Mono">JetBrains Mono (Monospace)</option>
                        <option value="Playfair Display">Playfair Display (Serif)</option>
                      </select>
                    </div>
                  </div>
                </GlassCard>
              )}

              {activeTab === 'domain' && (
                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight">DNS & Domain Configuration</h2>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Manage your custom domain</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Primary Domain</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="text"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                          placeholder="e.g. example.com"
                        />
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-2xl p-4 sm:p-6 border border-white/5">
                      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Server className="w-4 h-4 text-white/40" />
                        Server Details
                      </h3>
                      <p className="text-xs text-white/60 mb-6 leading-relaxed">
                        Currently hosted on Cloud Run / Vercel. Edit DNS at your domain registrar.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;

