import React, { useState, useEffect, useCallback } from 'react';
import { Printer, RotateCcw, Info, FileDown, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { AIMarketingInsights, AnalysisDataset } from '../types';
import { SourceBadge } from './SourceBadge';
import { KpiCards } from './KpiCards';
import { ChartsSection } from './ChartsSection';
import { TopContentTable } from './TopContentTable';
import { AiInsightsPanel } from './AiInsightsPanel';
import { formatCompactNumber } from '../utils/analytics';
import { exportAnalysisSummaryToPdf } from '../utils/pdfExport';
import { exportDatasetToCsv } from '../utils/fileParser';

interface AnalyticsDashboardProps {
  dataset: AnalysisDataset;
  onReset: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  dataset,
  onReset,
}) => {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [insights, setInsights] = useState<AIMarketingInsights | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfFeedback, setPdfFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const buildAiPayload = useCallback(() => {
    const { profile, posts, kpis, formatBreakdown } = dataset;

    const sortedByInteractions = [...posts].sort(
      (a, b) => b.totalInteractions - a.totalInteractions
    );

    const hasExactTimes = posts.some((p) => p.hasExactTime);

    return {
      profile: {
        name: profile.name,
        handle: profile.handle,
        platform: profile.platform,
        sourceLabel: profile.sourceLabel,
        followers: profile.followers,
        totalChannelViews: profile.totalChannelViews,
        samplePeriodLabel: profile.samplePeriodLabel,
      },
      kpis: {
        followers: kpis.followers,
        engagementRatePercent:
          kpis.engagementRate !== null ? Number(kpis.engagementRate.toFixed(2)) : null,
        engagementRateFormula: kpis.engagementRateFormula,
        postsPerWeek: kpis.postsPerWeek,
        dateSpanDays: kpis.dateSpanDays,
        totalPostsAnalyzed: posts.length,
        totalViewsInSample: kpis.totalViewsInSample,
        totalInteractionsInSample: kpis.totalInteractionsInSample,
        totalLikesInSample: kpis.totalLikesInSample,
        totalCommentsInSample: kpis.totalCommentsInSample,
        totalSharesInSample: kpis.totalSharesInSample,
      },
      hasExactTimestampsWithHours: hasExactTimes,
      formatBreakdown,
      topPosts: sortedByInteractions.slice(0, 5).map((p) => ({
        title: p.title,
        contentType: p.contentType,
        publishedAt: p.publishedAt,
        views: p.views,
        likes: p.likes,
        comments: p.comments,
        shares: p.shares,
        engagementRatePercent:
          p.engagementRate !== null ? Number(p.engagementRate.toFixed(2)) : null,
        performanceTier: p.performanceTier,
      })),
      lowestPosts: sortedByInteractions.slice(-3).map((p) => ({
        title: p.title,
        contentType: p.contentType,
        publishedAt: p.publishedAt,
        views: p.views,
        totalInteractions: p.totalInteractions,
      })),
    };
  }, [dataset]);

  const fetchInsights = useCallback(async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch('/api/social-lens/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analyticsPayload: buildAiPayload() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || `HTTP ${response.status}`);
      }
      if (!data?.insights) {
        throw new Error('Phản hồi từ server không chứa dữ liệu nhận định.');
      }
      setInsights(data.insights as AIMarketingInsights);
    } catch (err: unknown) {
      setAiError(
        err instanceof Error ? err.message : 'Không thể kết nối máy chủ phân tích AI.'
      );
    } finally {
      setIsAiLoading(false);
    }
  }, [buildAiPayload]);

  useEffect(() => {
    setAvatarFailed(false);
    setInsights(null);
    setPdfFeedback(null);
    fetchInsights();
  }, [dataset, fetchInsights]);

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setPdfFeedback(null);
    try {
      const filename = await exportAnalysisSummaryToPdf(dataset, insights);
      setPdfFeedback({
        type: 'success',
        message: `Đã xuất file PDF thành công: ${filename}`,
      });
      setTimeout(() => setPdfFeedback(null), 4000);
    } catch (err: unknown) {
      setPdfFeedback({
        type: 'error',
        message:
          err instanceof Error
            ? `Không thể tạo file PDF: ${err.message}`
            : 'Không thể tạo file PDF.',
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportCsv = () => {
    const filename = exportDatasetToCsv(dataset.profile.name, dataset.posts);
    setPdfFeedback({
      type: 'success',
      message: `Đã tải xuống file CSV dữ liệu: ${filename}`,
    });
    setTimeout(() => setPdfFeedback(null), 4000);
  };

  const { profile, posts, kpis, formatBreakdown } = dataset;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* 1. Profile Summary Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 flex items-center justify-center">
              {profile.avatarUrl && !avatarFailed ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="text-lg font-bold text-[#2563EB]"
                  style={{ fontFamily: 'var(--font-saas-display)' }}
                >
                  {profile.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h1
                  className="text-xl sm:text-2xl font-bold text-slate-900 truncate"
                  style={{ fontFamily: 'var(--font-saas-display)' }}
                >
                  {profile.name}
                </h1>
                <SourceBadge
                  dataSource={profile.dataSource}
                  label={profile.sourceLabel}
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-600">
                <span className="font-mono text-slate-700">{profile.handle}</span>
                <span aria-hidden="true">·</span>
                <span>Nền tảng: {profile.platform}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.samplePeriodLabel}</span>
                {profile.totalChannelViews !== null && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      Tổng view toàn kênh: {formatCompactNumber(profile.totalChannelViews)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Phân tích nguồn khác</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>Tải CSV</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In trang</span>
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileDown className={`w-3.5 h-3.5 ${isExportingPdf ? 'animate-bounce' : ''}`} />
              <span>{isExportingPdf ? 'Đang xuất PDF...' : 'Xuất báo cáo PDF'}</span>
            </button>
          </div>
        </div>

        {pdfFeedback && (
          <div
            role="status"
            className={`no-print mt-4 flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs border ${
              pdfFeedback.type === 'success'
                ? 'bg-teal-50 border-teal-200 text-teal-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {pdfFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{pdfFeedback.message}</span>
          </div>
        )}

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>{profile.verificationNote}</span>
        </div>
      </section>

      {/* 2. 4 Main KPI Cards */}
      <KpiCards kpis={kpis} postCount={posts.length} />

      {/* 3. Visual Charts */}
      <ChartsSection
        posts={posts}
        formatBreakdown={formatBreakdown}
        hasAnyViews={kpis.hasAnyViews}
      />

      {/* 4. Top Performing Content Table */}
      <TopContentTable posts={posts} />

      {/* 5. AI Marketing Insights */}
      <AiInsightsPanel
        insights={insights}
        isLoading={isAiLoading}
        error={aiError}
        onRetry={fetchInsights}
      />
    </div>
  );
};
