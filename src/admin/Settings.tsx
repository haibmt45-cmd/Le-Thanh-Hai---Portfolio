import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Server, CheckCircle2, Copy } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Settings: React.FC = () => {
  const [domain, setDomain] = useState('lethanhhai.com');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Settings</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">System Configuration & Domains</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <GlassCard className="p-8">
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
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors">
                  Save
                </button>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 sm:p-6 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Server className="w-4 h-4 text-white/40" />
                Vercel DNS Records
              </h3>
              <p className="text-xs text-white/60 mb-6 leading-relaxed">
                To connect your domain, please add the following records to your domain provider's DNS settings.
              </p>

              <div className="space-y-4 overflow-x-auto">
                <div className="bg-white/5 rounded-xl border border-white/10 min-w-[500px]">
                  <div className="grid grid-cols-4 text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 p-3">
                    <div>Type</div>
                    <div>Name</div>
                    <div className="col-span-2">Value</div>
                  </div>
                  <div className="p-3 grid grid-cols-4 text-sm font-mono text-white/80 items-center border-b border-white/5">
                    <div>A</div>
                    <div>@</div>
                    <div className="col-span-2 flex justify-between items-center pr-2">
                      <span>76.76.21.21</span>
                      <button onClick={() => handleCopy('76.76.21.21')} className="text-white/40 hover:text-white transition-colors">
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 grid grid-cols-4 text-sm font-mono text-white/80 items-center">
                    <div>CNAME</div>
                    <div>www</div>
                    <div className="col-span-2 flex justify-between items-center pr-2">
                      <span>cname.vercel-dns.com</span>
                      <button onClick={() => handleCopy('cname.vercel-dns.com')} className="text-white/40 hover:text-white transition-colors">
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Settings;
