import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Users, 
  MousePointer2, 
  Clock, 
  TrendingUp,
  BrainCircuit,
  Eye,
  Languages
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../context/I18nContext';

const Dashboard: React.FC = () => {
  const { lang, toggleLang, t } = useI18n();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  const [stats, setStats] = useState({
    visits: '0',
    duration: '0m 0s',
    rate: '0%',
    ctr: '0%'
  });

  const [chartData, setChartData] = useState([
    { name: 'Mon', views: 0, clicks: 0 },
    { name: 'Tue', views: 0, clicks: 0 },
    { name: 'Wed', views: 0, clicks: 0 },
    { name: 'Thu', views: 0, clicks: 0 },
    { name: 'Fri', views: 0, clicks: 0 },
    { name: 'Sat', views: 0, clicks: 0 },
    { name: 'Sun', views: 0, clicks: 0 },
  ]);

  const [categoryData, setCategoryData] = useState([
    { name: 'Hero', value: 0, color: '#3b82f6' },
    { name: 'About', value: 0, color: '#8b5cf6' },
    { name: 'Projects', value: 0, color: '#ec4899' },
    { name: 'Visuals', value: 0, color: '#10b981' },
    { name: 'Contact', value: 0, color: '#f59e0b' },
  ]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'page_views'));
        const views = querySnapshot.docs.map(doc => doc.data() as { path: string, sessionId: string, timestamp: number, ip?: string, deviceId?: string });
        
        // Compute unique visitors based on IP, falling back to persistent deviceId or sessionId
        const uniqueSessions = new Set(views.map(v => v.ip || v.deviceId || v.sessionId)).size;
        
        // Count typical paths
        const counts = {
          hero: views.filter(v => v.path === 'visit_site' || v.path === 'view_hero').length,
          about: views.filter(v => v.path === 'view_about' || v.path === 'view_technical-work').length,
          projects: views.filter(v => v.path === 'view_zunik' || v.path === 'view_vgg' || v.path === 'view_personal').length,
          visuals: views.filter(v => v.path === 'view_visuals').length,
          contact: views.filter(v => v.path === 'view_contact').length,
        };

        const totalViews = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        const totalClicks = views.filter(v => v.path !== 'visit_site' && !v.path.startsWith('view_')).length;

        // Approximate CTR based on unique sessions having interactions, or using real clicks if available
        let estimatedClicks = totalClicks;
        const seenSessions = new Set(views.map(v => v.sessionId));
        if (totalClicks === 0) {
          estimatedClicks = seenSessions.size;
        }
        
        setStats(prev => ({
          ...prev,
          visits: uniqueSessions.toLocaleString(),
          rate: totalViews > 0 ? ((uniqueSessions / totalViews) * 100).toFixed(1) + '%' : '0%',
          ctr: totalViews > 0 ? ((estimatedClicks / totalViews) * 100).toFixed(1) + '%' : '0%'
        }));

        setCategoryData([
          { name: t('nav.intro'), value: Math.round((counts.hero / totalViews) * 100) || 0, color: '#3b82f6' },
          { name: t('nav.about'), value: Math.round((counts.about / totalViews) * 100) || 0, color: '#8b5cf6' },
          { name: t('nav.projects'), value: Math.round((counts.projects / totalViews) * 100) || 0, color: '#ec4899' },
          { name: t('nav.visuals'), value: Math.round((counts.visuals / totalViews) * 100) || 0, color: '#10b981' },
          { name: t('nav.contact'), value: Math.round((counts.contact / totalViews) * 100) || 0, color: '#f59e0b' },
        ]);

        // Calculate chart data for the last 7 days
        const now = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(now.getDate() - (6 - i));
          return d.toLocaleDateString('en-US', { weekday: 'short' });
        });
        
        const viewsByDay7 = last7Days.reduce((acc, day) => {
          acc[day] = { name: day, views: 0, clicks: 0 };
          return acc;
        }, {} as Record<string, { name: string, views: number, clicks: number }>);

        const seenSessionsByDay7: Record<string, Set<string>> = last7Days.reduce((acc, day) => {
          acc[day] = new Set();
          return acc;
        }, {} as Record<string, Set<string>>);

        // Calculate chart data for the last 30 days
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(now.getDate() - (29 - i));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const viewsByDay30 = last30Days.reduce((acc, day) => {
          acc[day] = { name: day, views: 0, clicks: 0 };
          return acc;
        }, {} as Record<string, { name: string, views: number, clicks: number }>);

        const seenSessionsByDay30: Record<string, Set<string>> = last30Days.reduce((acc, day) => {
          acc[day] = new Set();
          return acc;
        }, {} as Record<string, Set<string>>);

        views.forEach(v => {
          const d = new Date(v.timestamp);
          const diffTime = now.getTime() - d.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
          
          if(diffDays < 7) {
             const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
             if(viewsByDay7[dayName]) {
                 viewsByDay7[dayName].views += 1;
                 if (v.path !== 'visit_site' && !v.path.startsWith('view_')) {
                   viewsByDay7[dayName].clicks += 1;
                 }
                 seenSessionsByDay7[dayName].add(v.sessionId);
             }
          }

          if(diffDays < 30) {
             const dayName = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
             if(viewsByDay30[dayName]) {
                 viewsByDay30[dayName].views += 1;
                 if (v.path !== 'visit_site' && !v.path.startsWith('view_')) {
                   viewsByDay30[dayName].clicks += 1;
                 }
                 seenSessionsByDay30[dayName].add(v.sessionId);
             }
          }
        });
        
        Object.keys(viewsByDay7).forEach(day => {
          if (viewsByDay7[day].clicks === 0) {
             viewsByDay7[day].clicks = seenSessionsByDay7[day].size;
          }
        });

        Object.keys(viewsByDay30).forEach(day => {
          if (viewsByDay30[day].clicks === 0) {
             viewsByDay30[day].clicks = seenSessionsByDay30[day].size;
          }
        });

        const wData = Object.values(viewsByDay7);
        const mData = Object.values(viewsByDay30);
        
        setWeeklyData(wData);
        setMonthlyData(mData);
        setChartData(wData);

      } catch (err) {
        console.error('Failed to fetch analytics', err);
      }
    };

    fetchAnalytics();
  }, [t]);

  useEffect(() => {
    setChartData(timeRange === 'week' ? weeklyData : monthlyData);
  }, [timeRange, weeklyData, monthlyData]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t('admin.nav.analytics')}</h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.4em] font-bold mt-2">{t('admin.editor.subtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
          <button 
            onClick={toggleLang}
            className="hidden sm:flex bg-white/5 border border-white/10 rounded-2xl p-4 items-center gap-3 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest text-white/60"
          >
            <Languages className="w-4 h-4 text-blue-400" />
            {lang === 'vi' ? 'Tiếng Việt' : 'English'}
          </button>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between sm:justify-center gap-4 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{t('admin.stats.status')}</p>
              <p className="text-xs text-green-400 font-bold uppercase tracking-widest flex items-center gap-2 justify-start sm:justify-end mt-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                {t('admin.stats.optimal')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('admin.stats.visitors'), value: stats.visits, icon: Users, delay: 0.1, trend: '+1.2%' },
          { label: t('admin.stats.duration'), value: stats.duration, icon: Clock, delay: 0.2, trend: '+3.1%' },
          { label: 'Bounce Rate', value: stats.rate, icon: MousePointer2, delay: 0.3, trend: '-2.4%' },
          { label: 'CTR (Clicks/Views)', value: stats.ctr, icon: TrendingUp, delay: 0.4, trend: '+0.5%' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
          >
            <GlassCard className="p-6 border-white/5 hover:border-white/20 transition-all group" glowColor="blue">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 group-hover:text-blue-400 transition-colors">
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-black ${stat.trend.startsWith('-') ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20'} px-2 py-1 rounded-full border uppercase tracking-widest`}>{stat.trend}</span>
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter text-white mb-1">{stat.value}</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8 border-white/5" glowColor="purple">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">{t('admin.charts.traffic')}</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">{t('admin.charts.growth')}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-1 flex">
                <button 
                  onClick={() => setTimeRange('week')}
                  className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-md transition-colors ${timeRange === 'week' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-md transition-colors ${timeRange === 'month' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                  Month
                </button>
              </div>
              <div className="flex gap-4 sm:ml-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t('admin.charts.views')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{t('admin.charts.clicks')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="clicks" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8 border-white/5" glowColor="cyan">
          <div className="mb-10">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">{t('admin.charts.reach')}</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">{t('admin.charts.niche')}</p>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '10px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                <span className="text-white/40">{item.name}</span>
                <span className="text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* AI Insights Panel */}
      <GlassCard className="p-8 border-white/5" glowColor="blue">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <BrainCircuit className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">{t('admin.insights.title')}</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">{t('admin.insights.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: 'Content Optimization', 
              desc: 'High interaction detected on Visuals section. AI suggests increasing media density by 15% for better retention.',
              tag: 'Strategy'
            },
            { 
              title: 'Traffic Anomaly', 
              desc: 'Unexpected surge from referral sources. Node balance adjusted automatically to maintain 24ms latency.',
              tag: 'Infrastructure'
            },
            { 
              title: 'Conversion Forecast', 
              desc: 'Current trend predicts 4.2k conversions by month end. Recommendation: Deploy A/B Variant B for Hero tagline.',
              tag: 'Growth'
            }
          ].map((insight) => (
            <div key={insight.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group">
              <span className="text-[8px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-black mb-4 inline-block">{insight.tag}</span>
              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{insight.title}</h4>
              <p className="text-xs text-white/40 leading-relaxed">{insight.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
