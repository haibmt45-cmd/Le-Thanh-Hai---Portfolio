import React, { useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { 
  LayoutDashboard, 
  FileEdit, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  Globe,
  Languages
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useI18n } from '../context/I18nContext';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const { lang, toggleLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard', label: t('admin.nav.dashboard'), path: '/admin', icon: LayoutDashboard },
    { id: 'content', label: t('admin.nav.content'), path: '/admin/content', icon: FileEdit },
    { id: 'analytics', label: t('admin.nav.analytics'), path: '/admin/analytics', icon: BarChart3 },
    { id: 'settings', label: t('admin.nav.settings'), path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <SEO title="Admin | Portfolio" />
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 bg-black/40 backdrop-blur-3xl flex flex-col fixed h-full z-50">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase italic tracking-tighter">Site CMS</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-white/40'}`} />
                  <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="active-indicator">
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={toggleLang}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 group"
          >
            <div className="flex items-center gap-4">
              <Languages className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-black uppercase tracking-widest">{lang === 'vi' ? 'Tiếng Việt' : 'English'}</span>
            </div>
            <div className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold">Switch</div>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">{t('admin.nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
