import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ComputedSocialPost, FormatBreakdownItem } from '../types';
import { formatCompactNumber, formatDateVN, formatPercent } from '../utils/analytics';

interface ChartsSectionProps {
  posts: ComputedSocialPost[];
  formatBreakdown: FormatBreakdownItem[];
  hasAnyViews: boolean;
}

const FORMAT_COLORS = ['#2563EB', '#0D9488', '#6366F1', '#F59E0B', '#64748B'];

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  posts,
  formatBreakdown,
  hasAnyViews,
}) => {
  const [chartMode, setChartMode] = useState<'overview' | 'breakdown'>(
    hasAnyViews ? 'overview' : 'breakdown'
  );

  // Chronological order (oldest -> newest) for timeline clarity
  const chartData = useMemo(() => {
    return [...posts]
      .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
      .map((post, idx) => ({
        shortLabel: formatDateVN(post.publishedAt).slice(0, 5) || `#${idx + 1}`,
        fullDate: formatDateVN(post.publishedAt, post.hasExactTime),
        title: post.title,
        views: post.views ?? 0,
        hasViews: post.views !== null,
        interactions: post.totalInteractions,
        likes: post.likes ?? 0,
        comments: post.comments ?? 0,
        shares: post.shares ?? 0,
      }));
  }, [posts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left 8 cols: Performance Over Recent Posts */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2
              className="text-base font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-saas-display)' }}
            >
              Hiệu suất qua các bài đăng gần nhất
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sắp xếp theo thứ tự thời gian đăng tải ({chartData.length} bài mẫu)
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {hasAnyViews && (
              <button
                type="button"
                onClick={() => setChartMode('overview')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  chartMode === 'overview'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Views &amp; Tương tác
              </button>
            )}
            <button
              type="button"
              onClick={() => setChartMode('breakdown')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                chartMode === 'breakdown'
                  ? 'bg-white text-[#0D9488] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Likes &amp; Comments
            </button>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="shortLabel"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              {chartMode === 'overview' && hasAnyViews ? (
                <>
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v) => formatCompactNumber(v)}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(v) => formatCompactNumber(v)}
                    tick={{ fontSize: 11, fill: '#0D9488' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-md max-w-xs text-xs">
                          <p className="font-semibold text-slate-900 line-clamp-2 mb-1">{d.title}</p>
                          <p className="text-slate-500 mb-2">{d.fullDate}</p>
                          <div className="space-y-1 font-mono tabular-nums">
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-600">Lượt xem:</span>
                              <span className="font-semibold text-[#2563EB]">
                                {d.hasViews ? d.views.toLocaleString('vi-VN') : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-600">Tổng tương tác:</span>
                              <span className="font-semibold text-[#0D9488]">
                                {d.interactions.toLocaleString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="views"
                    name="Lượt xem"
                    fill="#2563EB"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="interactions"
                    name="Tổng tương tác"
                    stroke="#0D9488"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#0D9488', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </>
              ) : (
                <>
                  <YAxis
                    tickFormatter={(v) => formatCompactNumber(v)}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-md max-w-xs text-xs">
                          <p className="font-semibold text-slate-900 line-clamp-2 mb-1">{d.title}</p>
                          <p className="text-slate-500 mb-2">{d.fullDate}</p>
                          <div className="space-y-1 font-mono tabular-nums">
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-600">Likes:</span>
                              <span className="font-semibold text-[#2563EB]">
                                {d.likes.toLocaleString('vi-VN')}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-600">Comments:</span>
                              <span className="font-semibold text-[#0D9488]">
                                {d.comments.toLocaleString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="likes"
                    name="Likes"
                    fill="#2563EB"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="comments"
                    name="Comments"
                    fill="#0D9488"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right 4 cols: Content Format Doughnut Chart */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <h2
            className="text-base font-bold text-slate-900"
            style={{ fontFamily: 'var(--font-saas-display)' }}
          >
            Phân bổ định dạng nội dung
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tỷ trọng số bài viết theo từng định dạng
          </p>
        </div>

        <div className="w-full h-48 my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formatBreakdown}
                dataKey="count"
                nameKey="format"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={78}
                paddingAngle={2}
              >
                {formatBreakdown.map((entry, idx) => (
                  <Cell
                    key={entry.format}
                    fill={FORMAT_COLORS[idx % FORMAT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload as FormatBreakdownItem;
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-md text-xs">
                      <p className="font-semibold text-slate-900">{item.format}</p>
                      <p className="text-slate-600 font-mono tabular-nums mt-0.5">
                        {item.count} bài ({item.percentage}%)
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          {formatBreakdown.map((item, idx) => (
            <div
              key={item.format}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: FORMAT_COLORS[idx % FORMAT_COLORS.length] }}
                />
                <span className="text-slate-700 font-medium truncate">{item.format}</span>
              </div>
              <div className="flex items-center gap-2.5 font-mono tabular-nums shrink-0 text-slate-600">
                <span>
                  {item.count} ({item.percentage}%)
                </span>
                {item.avgEngagementRate !== null && (
                  <span className="text-[#2563EB] font-medium">
                    ER {formatPercent(item.avgEngagementRate, 1)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
