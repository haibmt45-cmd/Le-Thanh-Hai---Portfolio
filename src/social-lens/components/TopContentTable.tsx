import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Flame, ThumbsUp, Minus } from 'lucide-react';
import { ComputedSocialPost, PerformanceTier } from '../types';
import {
  formatDateVN,
  formatPercent,
  formatShortTableNumber,
} from '../utils/analytics';

interface TopContentTableProps {
  posts: ComputedSocialPost[];
}

export const TopContentTable: React.FC<TopContentTableProps> = ({ posts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<'interactions' | 'views' | 'date'>('interactions');

  const formats = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.contentType)));
    return ['Tất cả', ...unique];
  }, [posts]);

  const filteredAndSorted = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return posts
      .filter((post) => {
        const matchesFormat =
          selectedFormat === 'Tất cả' || post.contentType === selectedFormat;
        const matchesSearch =
          !query ||
          post.title.toLowerCase().includes(query) ||
          post.caption.toLowerCase().includes(query);
        return matchesFormat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'views') {
          return (b.views ?? -1) - (a.views ?? -1);
        }
        if (sortBy === 'date') {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        return b.totalInteractions - a.totalInteractions;
      });
  }, [posts, searchTerm, selectedFormat, sortBy]);

  const renderTierBadge = (tier: PerformanceTier) => {
    if (tier === 'Viral') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold whitespace-nowrap">
          <Flame className="w-3 h-3 text-teal-600" />
          <span>Viral</span>
        </span>
      );
    }
    if (tier === 'Tốt') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium whitespace-nowrap">
          <ThumbsUp className="w-3 h-3 text-blue-600" />
          <span>Tốt</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium whitespace-nowrap">
        <Minus className="w-3 h-3 text-slate-500" />
        <span>Trung bình</span>
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2
              className="text-base font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-saas-display)' }}
            >
              Top nội dung hiệu quả nhất
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân hạng tự động theo trung vị mẫu (Viral &ge; 2&times; trung vị · Tốt &ge; 1&times; trung vị)
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="no-print flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tiêu đề / caption..."
                className="w-full sm:w-52 pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <select
              aria-label="Sắp xếp bảng nội dung"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="interactions">Sắp xếp: Tương tác cao nhất</option>
              <option value="views">Sắp xếp: Lượt xem cao nhất</option>
              <option value="date">Sắp xếp: Mới nhất</option>
            </select>
          </div>
        </div>

        {/* Format Filter Controls */}
        {formats.length > 2 && (
          <div className="no-print flex flex-wrap items-center gap-1.5 mt-4">
            {formats.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFormat === fmt
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 pl-5 pr-3">Nội dung</th>
              <th className="py-3 px-3 whitespace-nowrap">Định dạng</th>
              <th className="py-3 px-3 whitespace-nowrap">Ngày đăng</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">Views</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">Likes</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">Comments</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">Shares</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">ER %</th>
              <th className="py-3 pl-3 pr-5 text-right whitespace-nowrap">Hiệu suất</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-sm text-slate-500">
                  Không tìm thấy bài đăng nào khớp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((post, idx) => (
                <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 pl-5 pr-3 max-w-xs sm:max-w-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-mono text-slate-400 tabular-nums mt-0.5 shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        {post.url ? (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-900 hover:text-[#2563EB] line-clamp-2 inline-flex items-start gap-1 group"
                          >
                            <span>{post.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 mt-1 text-slate-400 group-hover:text-[#2563EB]" />
                          </a>
                        ) : (
                          <p className="font-medium text-slate-900 line-clamp-2">{post.title}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">
                    {post.contentType}
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-500 font-mono tabular-nums whitespace-nowrap">
                    {formatDateVN(post.publishedAt)}
                  </td>
                  <td className="py-3 px-3 text-right text-xs font-mono tabular-nums text-slate-800 whitespace-nowrap">
                    {formatShortTableNumber(post.views)}
                  </td>
                  <td className="py-3 px-3 text-right text-xs font-mono tabular-nums text-slate-800 whitespace-nowrap">
                    {formatShortTableNumber(post.likes)}
                  </td>
                  <td className="py-3 px-3 text-right text-xs font-mono tabular-nums text-slate-800 whitespace-nowrap">
                    {formatShortTableNumber(post.comments)}
                  </td>
                  <td className="py-3 px-3 text-right text-xs font-mono tabular-nums text-slate-500 whitespace-nowrap">
                    {formatShortTableNumber(post.shares)}
                  </td>
                  <td className="py-3 px-3 text-right text-xs font-mono tabular-nums font-semibold text-[#2563EB] whitespace-nowrap">
                    {formatPercent(post.engagementRate, 2)}
                  </td>
                  <td className="py-3 pl-3 pr-5 text-right whitespace-nowrap">
                    {renderTierBadge(post.performanceTier)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
