import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { ComputedKPIs } from '../types';
import {
  formatCompactNumber,
  formatFullNumber,
  formatPercent,
  PRIVATE_NA_LABEL,
} from '../utils/analytics';

interface KpiCardsProps {
  kpis: ComputedKPIs;
  postCount: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis, postCount }) => {
  const [showFormula, setShowFormula] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Followers / Subscribers */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
        <div className="text-xs font-medium text-slate-500">
          Tổng lượng theo dõi
        </div>
        <div className="mt-2.5">
          {kpis.followers !== null ? (
            <div
              className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums tracking-tight"
              title={formatFullNumber(kpis.followers)}
            >
              {formatCompactNumber(kpis.followers)}
            </div>
          ) : (
            <div className="text-base font-semibold text-slate-500">
              {PRIVATE_NA_LABEL}
            </div>
          )}
        </div>
        <div className="mt-2 text-xs text-slate-500 font-mono tabular-nums">
          {kpis.followers !== null
            ? `${formatFullNumber(kpis.followers)} Followers / Subs`
            : 'Chưa cung cấp hoặc ẩn công khai'}
        </div>
      </div>

      {/* KPI 2: Average Engagement Rate % with formula hover */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between relative">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-500">
            Tỷ lệ tương tác TB (ER)
          </span>
          <div
            className="relative"
            onMouseEnter={() => setShowFormula(true)}
            onMouseLeave={() => setShowFormula(false)}
          >
            <button
              type="button"
              onClick={() => setShowFormula((v) => !v)}
              onFocus={() => setShowFormula(true)}
              onBlur={() => setShowFormula(false)}
              aria-label="Xem công thức tính tỷ lệ tương tác"
              className="text-slate-400 hover:text-[#2563EB] p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] cursor-pointer"
            >
              <Info className="w-4 h-4" />
            </button>
            {showFormula && (
              <div
                role="tooltip"
                className="absolute right-0 top-6 z-30 w-72 p-3 rounded-lg bg-slate-900 text-white text-xs leading-relaxed shadow-lg"
              >
                <p className="font-semibold text-blue-300 mb-1">Công thức áp dụng:</p>
                <p>{kpis.engagementRateFormula}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2.5">
          {kpis.engagementRate !== null ? (
            <div className="text-2xl sm:text-3xl font-bold text-[#2563EB] font-mono tabular-nums tracking-tight">
              {formatPercent(kpis.engagementRate, 2)}
            </div>
          ) : (
            <div className="text-base font-semibold text-slate-500">
              {PRIVATE_NA_LABEL}
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-slate-500">
          {kpis.engagementRateType === 'by_views'
            ? 'Tính trên tổng Views mẫu (rê chuột xem công thức)'
            : kpis.engagementRateType === 'by_followers'
            ? 'Tính trên Followers (rê chuột xem công thức)'
            : 'Thiếu dữ liệu Views & Followers'}
        </div>
      </div>

      {/* KPI 3: Posting Frequency */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
        <div className="text-xs font-medium text-slate-500">
          Tần suất đăng bài TB
        </div>
        <div className="mt-2.5">
          {kpis.postsPerWeek !== null ? (
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
              {kpis.postsPerWeek} <span className="text-sm font-medium text-slate-500">bài / tuần</span>
            </div>
          ) : (
            <div className="text-base font-semibold text-slate-500">
              {PRIVATE_NA_LABEL}
            </div>
          )}
        </div>
        <div className="mt-2 text-xs text-slate-500 font-mono tabular-nums">
          Mẫu {postCount} bài · Khoảng {kpis.dateSpanDays} ngày
        </div>
      </div>

      {/* KPI 4: Total Interactions in Sample */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
        <div className="text-xs font-medium text-slate-500">
          Tổng tương tác mẫu phân tích
        </div>
        <div className="mt-2.5">
          <div
            className="text-2xl sm:text-3xl font-bold text-[#0D9488] font-mono tabular-nums tracking-tight"
            title={formatFullNumber(kpis.totalInteractionsInSample)}
          >
            {formatCompactNumber(kpis.totalInteractionsInSample)}
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500 font-mono tabular-nums truncate">
          {formatCompactNumber(kpis.totalLikesInSample)} Likes ·{' '}
          {formatCompactNumber(kpis.totalCommentsInSample)} Cmt ·{' '}
          {kpis.totalSharesInSample !== null
            ? `${formatCompactNumber(kpis.totalSharesInSample)} Share`
            : 'Share: N/A'}
        </div>
      </div>
    </div>
  );
};
