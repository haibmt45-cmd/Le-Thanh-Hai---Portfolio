import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle2, Clock, Target, Info } from 'lucide-react';
import { AIMarketingInsights } from '../types';

interface AiInsightsPanelProps {
  insights: AIMarketingInsights | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({
  insights,
  isLoading,
  error,
  onRetry,
}) => {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#2563EB] mb-1">
            <span>AI Marketing Insights</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">Gemini Data Strategist</span>
          </div>
          <h2
            className="text-lg font-bold text-slate-900"
            style={{ fontFamily: 'var(--font-saas-display)' }}
          >
            Nhận định chiến lược từ dữ liệu thực tế
          </h2>
        </div>

        <button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="no-print inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Đang phân tích...' : 'Phân tích lại'}</span>
        </button>
      </div>

      {isLoading && (
        <div className="py-8 space-y-4">
          <p className="text-sm text-slate-600 font-medium">
            Gemini đang đối chiếu các chỉ số thật trong mẫu dữ liệu để tổng hợp nhận định...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-lg bg-slate-100 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-sm text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Không thể tải nhận định AI</p>
              <p className="text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !error && insights && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Strengths */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                <span>Điểm mạnh nổi bật về nội dung &amp; tương tác</span>
              </div>
              <ul className="space-y-2.5">
                {insights.strengths.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Best Format & Timing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <span>Khung giờ / Định dạng đang hoạt động hiệu quả nhất</span>
              </div>
              <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 space-y-2.5">
                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                  {insights.bestFormatAndTiming.summary}
                </p>
                <div className="pt-2 border-t border-blue-200/70 text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-[#2563EB]">Dẫn chứng số liệu: </span>
                  {insights.bestFormatAndTiming.evidence}
                </div>
              </div>
            </div>
          </div>

          {/* 3. 3 Actionable Recommendations */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Target className="w-4 h-4 text-[#2563EB]" />
              <span>3 đề xuất hành động cụ thể để tối ưu kênh</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-slate-200 bg-white flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-mono font-semibold text-slate-400">
                        0{idx + 1}
                      </span>
                      <span className="font-medium text-[#0D9488]">
                        Ưu tiên: {rec.priority}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                      {rec.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {rec.rationale}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Caveat Footer */}
          {insights.dataCaveats && (
            <div className="flex items-start gap-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{insights.dataCaveats}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
