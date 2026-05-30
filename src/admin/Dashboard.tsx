import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MousePointer2, 
  Clock, 
  TrendingUp,
  Globe,
  ArrowUpRight,
  Activity,
  ArrowRight,
  MonitorPlay,
  Eye
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../context/I18nContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { lang, t } = useI18n();

  const [stats, setStats] = useState({
    visits: '0',
    duration: '0s',
    rate: '0%',
    ctr: '0%'
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const quickLinks = [
    { title: 'Chỉnh sửa Nội dung', desc: 'Quản lý text, i18n & translations', icon: Globe, path: '/admin/content', color: 'blue' },
    { title: 'Phân tích Dữ liệu', desc: 'Xem traffic & báo cáo chuyển đổi', icon: Activity, path: '/admin/analytics', color: 'purple' },
    { title: 'Cài đặt Hệ thống', desc: 'Tên miền & SEO Metadata', icon: MonitorPlay, path: '/admin/settings', color: 'orange' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch recent 20 activities for the stream
        const activitiesQuery = query(collection(db, 'page_views'), orderBy('timestamp', 'desc'), limit(20));
        const activitiesSnap = await getDocs(activitiesQuery);
        const activities = activitiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        setRecentActivities(activities);

        // Fetch all for stats
        const querySnapshot = await getDocs(collection(db, 'page_views'));
        const views = querySnapshot.docs.map(doc => doc.data() as any);
        
        const devicesMap = new Set<string>();
        const sessionsMap = new Map<string, number[]>();
        
        views.forEach(v => {
          const did = v.deviceId || v.sessionId || v.ip || 'unknown';
          devicesMap.add(did);

          const sid = v.sessionId || 'unknown';
          if (!sessionsMap.has(sid)) sessionsMap.set(sid, []);
          sessionsMap.get(sid)!.push(v.timestamp);
        });

        let totalDurationMs = 0;
        let bounces = 0;

        sessionsMap.forEach((times) => {
          if (times.length <= 1) {
            bounces++;
          } else {
            const min = Math.min(...times);
            const max = Math.max(...times);
            totalDurationMs += (max - min);
          }
        });

        const uniqueVisitors = devicesMap.size;
        const totalSessions = sessionsMap.size;
        
        const totalViews = views.length || 1;
        const totalClicks = views.filter(v => v.path !== 'visit_site' && !v.path.startsWith('view_')).length;

        let estimatedClicks = totalClicks;
        if (totalClicks === 0) estimatedClicks = uniqueVisitors; // fallback

        const avgDurationSec = totalSessions > 0 ? Math.floor((totalDurationMs / totalSessions) / 1000) : 0;
        const formatDuration = (sec: number) => {
          if (sec < 60) return `${sec}s`;
          return `${Math.floor(sec / 60)}m ${sec % 60}s`;
        };

        const bounceRate = totalSessions > 0 ? ((bounces / totalSessions) * 100).toFixed(1) + '%' : '0%';
        const ctr = totalViews > 0 ? ((estimatedClicks / totalViews) * 100).toFixed(1) + '%' : '0%';

        setStats({
          visits: uniqueVisitors.toLocaleString(),
          duration: formatDuration(avgDurationSec),
          rate: bounceRate,
          ctr: ctr
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };

    fetchStats();
  }, [t]);

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2">{t('admin.nav.dashboard')}</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Control Panel & Overview</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Link to="/" target="_blank" className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-2xl text-[10px] text-white font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <ArrowUpRight className="w-4 h-4" />
            View Live Site
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('admin.stats.visitors') || 'Unique Visitors', value: stats.visits, icon: Users, delay: 0.1, color: 'blue' },
          { label: t('admin.stats.duration') || 'Avg Session', value: stats.duration, icon: Clock, delay: 0.2, color: 'purple' },
          { label: 'Bounce Rate', value: stats.rate, icon: MousePointer2, delay: 0.3, color: 'cyan' },
          { label: 'CTR (Interactions)', value: stats.ctr, icon: TrendingUp, delay: 0.4, color: 'green' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
          >
            <GlassCard className="p-6 border-white/5 hover:border-white/20 transition-all group" glowColor={stat.color as any}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 text-${stat.color}-400 group-hover:text-white transition-colors`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-black italic tracking-tighter text-white mb-2">{stat.value}</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links / Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Quick Actions</h2>
          <div className="grid gap-4">
            {quickLinks.map((link) => {
               const Icon = link.icon;
               return (
                 <Link to={link.path} key={link.title}>
                   <GlassCard className="p-5 border-white/5 hover:border-white/20 transition-all group cursor-pointer" glowColor={link.color as any}>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-xl bg-${link.color}-500/10 border border-${link.color}-500/20 text-${link.color}-400 group-hover:scale-110 transition-transform`}>
                           <Icon className="w-5 h-5" />
                         </div>
                         <div>
                           <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{link.title}</h4>
                           <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{link.desc}</p>
                         </div>
                       </div>
                       <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                     </div>
                   </GlassCard>
                 </Link>
               )
            })}
          </div>
        </div>

        {/* Real Recent Activities */}
        <GlassCard className="lg:col-span-2 p-6 md:p-8" glowColor="cyan">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Realtime Activity</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Live data from Firebase</p>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                       Path: <span className="text-blue-400">{act.path}</span>
                    </h4>
                    <p className="text-xs text-white/60 mb-1 line-clamp-1">{act.userAgent}</p>
                    <p className="text-[10px] text-white/40 font-mono">IP: {act.ip || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-2 shrink-0">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">{getTimeAgo(act.timestamp)}</span>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center py-10 text-white/40 text-sm">No activity recorded yet.</div>
            )}
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default Dashboard;
