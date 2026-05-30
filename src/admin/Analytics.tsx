import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  TrendingUp, Users, MousePointer2, Clock, Globe, Laptop, Smartphone, LineChart, Network
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../context/I18nContext';

const Analytics: React.FC = () => {
  const { t } = useI18n();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  const [stats, setStats] = useState({
    visits: '0',
    duration: '0m 0s',
    rate: '0%',
    ctr: '0%'
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  
  const [deviceStats, setDeviceStats] = useState({ mobile: 0, desktop: 0, tablet: 0 });
  const [topIps, setTopIps] = useState<{ ip: string, count: number }[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
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

        const uniqueVisitors = devicesMap.size;
        
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

        const totalSessions = sessionsMap.size;
        
        const counts = {
          hero: views.filter(v => v.path === 'visit_site' || v.path === 'view_hero').length,
          about: views.filter(v => v.path === 'view_about' || v.path === 'view_technical-work').length,
          projects: views.filter(v => v.path === 'view_zunik' || v.path === 'view_vgg' || v.path === 'view_personal').length,
          visuals: views.filter(v => v.path === 'view_visuals').length,
          contact: views.filter(v => v.path === 'view_contact').length,
        };

        const totalViews = views.length || 1;
        const totalClicks = views.filter(v => v.path !== 'visit_site' && !v.path.startsWith('view_')).length;

        let estimatedClicks = totalClicks;
        if (totalClicks === 0) {
          estimatedClicks = uniqueVisitors;
        }
        
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

        const totalSectionViews = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        setCategoryData([
          { name: t('nav.intro'), value: Math.round((counts.hero / totalSectionViews) * 100) || 0, color: '#3b82f6' },
          { name: t('nav.about'), value: Math.round((counts.about / totalSectionViews) * 100) || 0, color: '#8b5cf6' },
          { name: t('nav.projects'), value: Math.round((counts.projects / totalSectionViews) * 100) || 0, color: '#ec4899' },
          { name: t('nav.visuals'), value: Math.round((counts.visuals / totalSectionViews) * 100) || 0, color: '#10b981' },
          { name: t('nav.contact'), value: Math.round((counts.contact / totalSectionViews) * 100) || 0, color: '#f59e0b' },
        ]);

        // Device logic
        let m = 0, d = 0, tb = 0;
        const seenSessionDevices = new Set();
        views.forEach(v => {
           if (!seenSessionDevices.has(v.sessionId)) {
             seenSessionDevices.add(v.sessionId);
             const ua = (v.userAgent || '').toLowerCase();
             if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) tb++;
             else if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua)) m++;
             else d++;
           }
        });
        const totalDev = m + d + tb || 1;
        setDeviceStats({
          mobile: Math.round((m / totalDev) * 100),
          desktop: Math.round((d / totalDev) * 100),
          tablet: Math.round((tb / totalDev) * 100)
        });

        // IP Logic
        const ipCounts = new Map<string, number>();
        views.forEach(v => {
          if (v.ip) ipCounts.set(v.ip, (ipCounts.get(v.ip) || 0) + 1);
        });
        const sortedIps = Array.from(ipCounts.entries()).sort((a,b) => b[1] - a[1]).slice(0, 4);
        setTopIps(sortedIps.map(([ip, count]) => ({ ip, count })));

        // Charts Logic
        const now = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(now.getDate() - (6 - i));
          return d.toLocaleDateString('en-US', { weekday: 'short' });
        });
        
        const viewsByDay7 = last7Days.reduce((acc, day) => {
          acc[day] = { name: day, views: 0, clicks: 0, bounces: 0, totalSessionsDay: 0 };
          return acc;
        }, {} as Record<string, any>);

        const sessionsByDay7: Record<string, Map<string, number[]>> = last7Days.reduce((acc, day) => {
          acc[day] = new Map();
          return acc;
        }, {} as Record<string, Map<string, number[]>>);

        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(now.getDate() - (29 - i));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const viewsByDay30 = last30Days.reduce((acc, day) => {
          acc[day] = { name: day, views: 0, clicks: 0, bounces: 0, totalSessionsDay: 0 };
          return acc;
        }, {} as Record<string, any>);

        const sessionsByDay30: Record<string, Map<string, number[]>> = last30Days.reduce((acc, day) => {
          acc[day] = new Map();
          return acc;
        }, {} as Record<string, Map<string, number[]>>);

        views.forEach(v => {
          const dDate = new Date(v.timestamp);
          const diffTime = now.getTime() - dDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
          const sid = v.deviceId || v.ip || v.sessionId || 'unknown';
          
          if(diffDays < 7) {
             const dayName = dDate.toLocaleDateString('en-US', { weekday: 'short' });
             if(viewsByDay7[dayName]) {
                 viewsByDay7[dayName].views += 1;
                 if (v.path !== 'visit_site' && !v.path.startsWith('view_')) {
                   viewsByDay7[dayName].clicks += 1;
                 }
                 if (!sessionsByDay7[dayName].has(sid)) sessionsByDay7[dayName].set(sid, []);
                 sessionsByDay7[dayName].get(sid)!.push(v.timestamp);
             }
          }

          if(diffDays < 30) {
             const dayName = dDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
             if(viewsByDay30[dayName]) {
                 viewsByDay30[dayName].views += 1;
                 if (v.path !== 'visit_site' && !v.path.startsWith('view_')) {
                   viewsByDay30[dayName].clicks += 1;
                 }
                 if (!sessionsByDay30[dayName].has(sid)) sessionsByDay30[dayName].set(sid, []);
                 sessionsByDay30[dayName].get(sid)!.push(v.timestamp);
             }
          }
        });
        
        Object.keys(viewsByDay7).forEach(day => {
          if (viewsByDay7[day].clicks === 0) {
             viewsByDay7[day].clicks = sessionsByDay7[day].size;
          }
          let dayBounces = 0;
          sessionsByDay7[day].forEach(times => {
             if (times.length <= 1) dayBounces++;
          });
          viewsByDay7[day].totalSessionsDay = sessionsByDay7[day].size;
          viewsByDay7[day].bounces = sessionsByDay7[day].size > 0 ? Math.round((dayBounces/sessionsByDay7[day].size)*100) : 0;
        });

        Object.keys(viewsByDay30).forEach(day => {
          if (viewsByDay30[day].clicks === 0) {
             viewsByDay30[day].clicks = sessionsByDay30[day].size;
          }
          let dayBounces = 0;
          sessionsByDay30[day].forEach(times => {
             if (times.length <= 1) dayBounces++;
          });
          viewsByDay30[day].totalSessionsDay = sessionsByDay30[day].size;
          viewsByDay30[day].bounces = sessionsByDay30[day].size > 0 ? Math.round((dayBounces/sessionsByDay30[day].size)*100) : 0;
        });

        setWeeklyData(Object.values(viewsByDay7));
        setMonthlyData(Object.values(viewsByDay30));
        setChartData(Object.values(viewsByDay7));

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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2">Analytics</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Traffic & Conversion Insights</p>
        </div>
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${timeRange === 'week' ? 'bg-purple-500/20 text-purple-400' : 'text-white/40 hover:text-white'}`}
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${timeRange === 'month' ? 'bg-purple-500/20 text-purple-400' : 'text-white/40 hover:text-white'}`}
          >
            Last 30 Days
          </button>
        </div>
      </header>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Main Traffic Area Chart */}
        <GlassCard className="lg:col-span-2 p-6 md:p-8" glowColor="purple">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <LineChart className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Traffic Overview</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Visits vs Conversions</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Page Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Interactions</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="views" name="Page Views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="clicks" name="Interactions" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Section Reach Bar Chart */}
        <GlassCard className="p-6 md:p-8" glowColor="cyan">
          <div className="mb-8">
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Section Reach</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Popularity by category</p>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                  formatter={(value) => [`${value}%`, 'Reach']}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6" glowColor="blue">
           <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6">Device Distribution</h4>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Smartphone className="w-4 h-4" /></div>
                   <span className="text-sm font-bold text-white">Mobile</span>
                 </div>
                 <div className="flex items-center gap-4 w-1/2">
                   <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full" style={{ width: `${deviceStats.mobile}%` }} />
                   </div>
                   <span className="text-xs font-bold text-white w-8">{deviceStats.mobile}%</span>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Laptop className="w-4 h-4" /></div>
                   <span className="text-sm font-bold text-white">Desktop</span>
                 </div>
                 <div className="flex items-center gap-4 w-1/2">
                   <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-purple-500 rounded-full" style={{ width: `${deviceStats.desktop}%` }} />
                   </div>
                   <span className="text-xs font-bold text-white w-8">{deviceStats.desktop}%</span>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Globe className="w-4 h-4" /></div>
                   <span className="text-sm font-bold text-white">Tablet</span>
                 </div>
                 <div className="flex items-center gap-4 w-1/2">
                   <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 rounded-full" style={{ width: `${deviceStats.tablet}%` }} />
                   </div>
                   <span className="text-xs font-bold text-white w-8">{deviceStats.tablet}%</span>
                 </div>
              </div>
           </div>
        </GlassCard>

        {/* Top IPs */}
        <GlassCard className="p-6" glowColor="cyan">
           <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6">Top Connecting IPs</h4>
           <div className="space-y-4">
              {topIps.map((loc, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                      <Network className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold font-mono text-white/80 group-hover:text-white transition-colors">{loc.ip}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{loc.count} <span className="text-[10px] font-normal text-white/40">views</span></p>
                  </div>
                </div>
              ))}
              {topIps.length === 0 && (
                <div className="text-center text-sm text-white/40">No IP data recorded</div>
              )}
           </div>
        </GlassCard>

        <GlassCard className="p-6" glowColor="orange">
           <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6">Daily Bounce Rate</h4>
           <div className="h-[180px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBounce" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Area type="monotone" dataKey="bounces" name="Bounce Rate %" stroke="#f59e0b" strokeWidth={2} fill="url(#colorBounce)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
           <p className="text-xs text-white/60 text-center mt-2 leading-relaxed">
             Track single-page sessions over time. Lower is better.
           </p>
        </GlassCard>
      </div>

    </div>
  );
};

export default Analytics;
