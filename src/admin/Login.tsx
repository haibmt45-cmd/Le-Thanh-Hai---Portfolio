import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';
import { Lock, User, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../context/I18nContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/admin');
    } else {
      setError(t('admin.invalid'));
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-10 border-white/10" glowColor="blue">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">{t('admin.login_title')}</h1>
            <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold mt-2">{t('admin.login_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white/60 text-[10px] uppercase tracking-widest font-bold block ml-4">{t('admin.username')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  placeholder="..."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/60 text-[10px] uppercase tracking-widest font-bold block ml-4">{t('admin.password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  placeholder="..."
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-white text-black font-black uppercase tracking-widest text-sm py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-400 transition-all active:scale-95"
            >
              {t('admin.sign_in')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
