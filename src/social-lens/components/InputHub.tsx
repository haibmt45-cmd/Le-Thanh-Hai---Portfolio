import React, { useState, useRef } from 'react';
import {
  Youtube,
  FileSpreadsheet,
  BookOpenCheck,
  Search,
  Upload,
  Download,
  HelpCircle,
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Table2,
  Info,
  Globe,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { VERIFIED_CASE_STUDIES } from '../data/caseStudies';
import {
  downloadSampleCsv,
  exportDatasetToCsv,
  parseUploadedSocialData,
  ParsedFileResult,
} from '../utils/fileParser';
import { ChannelProfile, SocialPost, VerifiedCaseStudy } from '../types';
import { formatCompactNumber } from '../utils/analytics';

export type InputTab = 'youtube' | 'upload' | 'cases';

export interface CompetitorDataBundle {
  profile: ChannelProfile;
  posts: SocialPost[];
  csvContent: string;
}

interface InputHubProps {
  activeInputTab: InputTab;
  onChangeInputTab: (tab: InputTab) => void;
  youtubeApiKey: string;
  onSaveYoutubeApiKey: (key: string) => void;
  onAnalyzeYoutube: (channelInput: string, apiKey: string) => Promise<void>;
  onAnalyzeUploaded: (profile: ChannelProfile, posts: SocialPost[]) => void;
  onFetchCompetitorData: (profileUrl: string) => Promise<CompetitorDataBundle>;
  onSelectCaseStudy: (study: VerifiedCaseStudy) => void;
  errorMessage: string | null;
  onClearError: () => void;
}

export const InputHub: React.FC<InputHubProps> = ({
  activeInputTab,
  onChangeInputTab,
  youtubeApiKey,
  onSaveYoutubeApiKey,
  onAnalyzeYoutube,
  onAnalyzeUploaded,
  onFetchCompetitorData,
  onSelectCaseStudy,
  errorMessage,
  onClearError,
}) => {
  // Tab 1: YouTube Live API
  const [channelInput, setChannelInput] = useState('');
  const [localYtKey, setLocalYtKey] = useState(youtubeApiKey);
  const [showKeyGuide, setShowKeyGuide] = useState(false);

  // Tab 2: CSV / JSON Upload, Competitor Proxy Fetch, or Competitor Quick Audit
  const [uploadMode, setUploadMode] = useState<'file' | 'proxy' | 'manual'>('file');
  const [brandName, setBrandName] = useState('');
  const [platform, setPlatform] = useState<'TikTok' | 'Facebook' | 'Instagram' | 'Đa nền tảng'>('TikTok');
  const [followersInput, setFollowersInput] = useState('');
  const [rawDataText, setRawDataText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<ParsedFileResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab 2 Proxy Competitor Fetch state
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [isFetchingCompetitor, setIsFetchingCompetitor] = useState(false);
  const [competitorError, setCompetitorError] = useState<string | null>(null);
  const [competitorResult, setCompetitorResult] = useState<CompetitorDataBundle | null>(null);
  const [copiedCsv, setCopiedCsv] = useState(false);

  const [manualRows, setManualRows] = useState<
    {
      id: string;
      publishedAt: string;
      contentType: string;
      caption: string;
      views: string;
      likes: string;
      comments: string;
      shares: string;
    }[]
  >([
    {
      id: 'm-1',
      publishedAt: new Date().toISOString().slice(0, 10),
      contentType: 'Video ngắn',
      caption: '',
      views: '',
      likes: '',
      comments: '',
      shares: '',
    },
    {
      id: 'm-2',
      publishedAt: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
      contentType: 'Video ngắn',
      caption: '',
      views: '',
      likes: '',
      comments: '',
      shares: '',
    },
    {
      id: 'm-3',
      publishedAt: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10),
      contentType: 'Hình ảnh / Carousel',
      caption: '',
      views: '',
      likes: '',
      comments: '',
      shares: '',
    },
  ]);

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();
    if (localYtKey.trim()) {
      onSaveYoutubeApiKey(localYtKey.trim());
    }
    await onAnalyzeYoutube(channelInput, localYtKey);
  };

  const processRawUploadText = (text: string, filename?: string) => {
    setRawDataText(text);
    if (filename) setUploadedFileName(filename);
    setParseError(null);
    onClearError();
    if (!text.trim()) {
      setParsedPreview(null);
      return;
    }
    try {
      const result = parseUploadedSocialData(text);
      setParsedPreview(result);
    } catch (err: unknown) {
      setParsedPreview(null);
      setParseError(err instanceof Error ? err.message : 'Không thể đọc dữ liệu tải lên.');
    }
  };

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result ?? '');
      processRawUploadText(content, file.name);
    };
    reader.onerror = () => {
      setParseError('Lỗi khi đọc file từ thiết bị. Vui lòng thử lại.');
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleAnalyzeUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedPreview || parsedPreview.posts.length === 0) {
      setParseError('Vui lòng tải lên file CSV/JSON hợp lệ hoặc dán dữ liệu trước khi phân tích.');
      return;
    }

    const parsedFollowers = followersInput.trim()
      ? Number(followersInput.replace(/[,\s.]/g, ''))
      : null;

    const validFollowers =
      parsedFollowers !== null && Number.isFinite(parsedFollowers) && parsedFollowers >= 0
        ? parsedFollowers
        : null;

    const dates = parsedPreview.posts
      .map((p) => new Date(p.publishedAt).getTime())
      .filter((t) => !Number.isNaN(t));
    const minDate = dates.length ? new Date(Math.min(...dates)).toLocaleDateString('vi-VN') : '';
    const maxDate = dates.length ? new Date(Math.max(...dates)).toLocaleDateString('vi-VN') : '';

    const cleanName = brandName.trim() || 'Thương hiệu (Dữ liệu tải lên)';
    const profile: ChannelProfile = {
      name: cleanName,
      handle: uploadedFileName ? `File: ${uploadedFileName}` : 'Dữ liệu bảng thủ công',
      platform,
      followers: validFollowers,
      totalChannelViews: null,
      totalVideosCount: parsedPreview.posts.length,
      dataSource: 'uploaded_csv_json',
      sourceLabel: '[Uploaded Real Data]',
      collectedAt: new Date().toISOString(),
      samplePeriodLabel:
        minDate && maxDate
          ? `${parsedPreview.posts.length} bài đăng (${minDate} – ${maxDate})`
          : `${parsedPreview.posts.length} bài đăng`,
      verificationNote:
        validFollowers === null
          ? 'Dữ liệu từ file người dùng tải lên. Chỉ số Followers chưa được nhập nên hiển thị N/A (Dữ liệu riêng tư).'
          : 'Dữ liệu từ file thực tế người dùng tải lên từ Analytics.',
    };

    onAnalyzeUploaded(profile, parsedPreview.posts);
  };

  const parseManualNum = (val: string): number | null => {
    const clean = val.trim().replace(/[,\s.]/g, '');
    if (!clean) return null;
    const num = Number(clean);
    return Number.isFinite(num) && num >= 0 ? num : null;
  };

  const handleManualAddRow = () => {
    setManualRows((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        publishedAt: new Date().toISOString().slice(0, 10),
        contentType: 'Video ngắn',
        caption: '',
        views: '',
        likes: '',
        comments: '',
        shares: '',
      },
    ]);
  };

  const handleManualUpdateRow = (
    id: string,
    field: 'publishedAt' | 'contentType' | 'caption' | 'views' | 'likes' | 'comments' | 'shares',
    value: string
  ) => {
    setManualRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleManualRemoveRow = (id: string) => {
    setManualRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParseError(null);
    onClearError();

    const filledRows = manualRows.filter(
      (r) =>
        r.caption.trim() !== '' ||
        r.views.trim() !== '' ||
        r.likes.trim() !== '' ||
        r.comments.trim() !== '' ||
        r.shares.trim() !== ''
    );

    if (filledRows.length === 0) {
      setParseError(
        'Vui lòng nhập số liệu cho ít nhất 1 bài đăng công khai của đối thủ để phân tích.'
      );
      return;
    }

    const posts: SocialPost[] = filledRows.map((row, idx) => {
      const cap = row.caption.trim() || `Bài đăng công khai #${idx + 1}`;
      return {
        id: row.id,
        title: cap.length > 72 ? `${cap.slice(0, 72)}...` : cap,
        caption: cap,
        publishedAt: row.publishedAt || new Date().toISOString().slice(0, 10),
        hasExactTime: false,
        contentType: row.contentType || 'Chưa phân loại',
        views: parseManualNum(row.views),
        likes: parseManualNum(row.likes),
        comments: parseManualNum(row.comments),
        shares: parseManualNum(row.shares),
      };
    });

    const parsedFollowers = followersInput.trim()
      ? Number(followersInput.replace(/[,\s.]/g, ''))
      : null;
    const validFollowers =
      parsedFollowers !== null && Number.isFinite(parsedFollowers) && parsedFollowers >= 0
        ? parsedFollowers
        : null;

    const dates = posts
      .map((p) => new Date(p.publishedAt).getTime())
      .filter((t) => !Number.isNaN(t));
    const minDate = dates.length ? new Date(Math.min(...dates)).toLocaleDateString('vi-VN') : '';
    const maxDate = dates.length ? new Date(Math.max(...dates)).toLocaleDateString('vi-VN') : '';

    const profile: ChannelProfile = {
      name: brandName.trim() || 'Kênh đối thủ (Số liệu công khai)',
      handle: 'Kiểm toán công khai thủ công',
      platform,
      followers: validFollowers,
      totalChannelViews: null,
      totalVideosCount: posts.length,
      dataSource: 'uploaded_csv_json',
      sourceLabel: '[Uploaded Real Data]',
      collectedAt: new Date().toISOString(),
      samplePeriodLabel:
        minDate && maxDate
          ? `${posts.length} bài đăng (${minDate} – ${maxDate})`
          : `${posts.length} bài đăng`,
      verificationNote:
        'Dữ liệu công khai do người dùng ghi nhận trực tiếp từ trang kênh đối thủ. Các trường ẩn/riêng tư (để trống) hiển thị N/A (Dữ liệu riêng tư).',
    };

    onAnalyzeUploaded(profile, posts);
  };

  const handleFetchCompetitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompetitorError(null);
    setCompetitorResult(null);
    onClearError();
    setIsFetchingCompetitor(true);
    try {
      const result = await onFetchCompetitorData(competitorUrl);
      setCompetitorResult(result);
      // Sync into file tab state so user can also inspect/re-edit CSV directly if desired
      setBrandName(result.profile.name);
      if (
        result.profile.platform === 'TikTok' ||
        result.profile.platform === 'Facebook' ||
        result.profile.platform === 'Instagram'
      ) {
        setPlatform(result.profile.platform);
      }
      setFollowersInput(
        result.profile.followers !== null ? String(result.profile.followers) : ''
      );
      processRawUploadText(result.csvContent, `${result.profile.handle || 'competitor'}.csv`);
    } catch (err: unknown) {
      setCompetitorError(
        err instanceof Error
          ? err.message
          : 'Không thể thu thập dữ liệu công khai từ URL đối thủ.'
      );
    } finally {
      setIsFetchingCompetitor(false);
    }
  };

  const handleCopyCompetitorCsv = async () => {
    if (!competitorResult?.csvContent) return;
    try {
      await navigator.clipboard.writeText(competitorResult.csvContent);
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Intro Hero */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-2">
          <span>Brand Social Media Analyzer</span>
          <span aria-hidden="true">·</span>
          <span>100% Dữ liệu thực tế</span>
          <span aria-hidden="true">·</span>
          <span>Minh bạch nguồn gốc</span>
        </div>
        <h1
          className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight max-w-2xl"
          style={{ fontFamily: 'var(--font-saas-display)', textWrap: 'balance' }}
        >
          Phân tích hiệu suất mạng xã hội từ dữ liệu kiểm chứng
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2.5 max-w-2xl leading-relaxed">
          Quét trực tiếp kênh YouTube qua API v3, tải lên file xuất từ Meta Business Suite / TikTok Studio, hoặc trải nghiệm ngay với các báo cáo Case Study thực tế.
        </p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 flex items-start justify-between gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Không thể hoàn tất thu thập dữ liệu</p>
              <p className="mt-0.5 text-red-700">{errorMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearError}
            aria-label="Đóng thông báo lỗi"
            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Input Hub Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* 3 Source Selector Tabs */}
        <div
          role="tablist"
          aria-label="Chọn nguồn dữ liệu phân tích"
          className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-200 bg-slate-50/70"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeInputTab === 'youtube'}
            onClick={() => {
              onChangeInputTab('youtube');
              onClearError();
            }}
            className={`flex items-center justify-center sm:justify-start gap-2.5 px-5 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeInputTab === 'youtube'
                ? 'border-[#2563EB] bg-white text-[#2563EB]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Youtube className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Quét kênh YouTube thật</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeInputTab === 'upload'}
            onClick={() => {
              onChangeInputTab('upload');
              onClearError();
            }}
            className={`flex items-center justify-center sm:justify-start gap-2.5 px-5 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeInputTab === 'upload'
                ? 'border-[#0D9488] bg-white text-[#0D9488]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Nhập dữ liệu Meta / TikTok</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeInputTab === 'cases'}
            onClick={() => {
              onChangeInputTab('cases');
              onClearError();
            }}
            className={`flex items-center justify-center sm:justify-start gap-2.5 px-5 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeInputTab === 'cases'
                ? 'border-[#2563EB] bg-white text-[#2563EB]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <BookOpenCheck className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Xem Báo cáo mẫu</span>
          </button>
        </div>

        {/* Tab 1: Live YouTube API */}
        {activeInputTab === 'youtube' && (
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h2
                  className="text-lg font-bold text-slate-900"
                  style={{ fontFamily: 'var(--font-saas-display)' }}
                >
                  Kết nối trực tiếp YouTube Data API v3 (Kênh của bạn hoặc Đối thủ)
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Dán URL hoặc @handle của bất kỳ kênh YouTube công khai nào (kể cả kênh đối thủ) để quét Subscriber và 20 video gần nhất.
                </p>
              </div>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                [Live YouTube API]
              </span>
            </div>

            <form onSubmit={handleYoutubeSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="yt-channel-input"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  URL kênh YouTube, @Handle hoặc Channel ID
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="yt-channel-input"
                    type="text"
                    required
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    placeholder="Ví dụ: @F8VNOfficial hoặc https://www.youtube.com/@VCSLMHT"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                  <span>Gợi ý thử nhanh:</span>
                  {['@F8VNOfficial', '@Web5Ngay', '@VCSLMHT'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setChannelInput(preset)}
                      className="text-[#2563EB] hover:underline font-mono cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label
                    htmlFor="yt-api-key-input"
                    className="block text-sm font-medium text-slate-800"
                  >
                    YouTube Data API Key{' '}
                    <span className="text-xs font-normal text-slate-500">
                      (Tùy chọn — bỏ trống để quét nhanh công khai)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKeyGuide(!showKeyGuide)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Cách lấy Key miễn phí (để lấy thêm Comments)</span>
                  </button>
                </div>
                <input
                  id="yt-api-key-input"
                  type="password"
                  value={localYtKey}
                  onChange={(e) => setLocalYtKey(e.target.value)}
                  placeholder="Để trống để quét kênh đối thủ ngay lập tức, hoặc dán Key (AIzaSy...) để lấy đủ Comments"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                />
              </div>

              {showKeyGuide && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      Hướng dẫn tạo YouTube Data API v3 Key miễn phí
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowKeyGuide(false)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>
                      Mở{' '}
                      <a
                        href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563EB] hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        Google Cloud YouTube API Library
                        <ExternalLink className="w-3 h-3" />
                      </a>{' '}
                      và bấm <strong>Enable</strong>.
                    </li>
                    <li>
                      Vào <strong>Credentials &rarr; Create Credentials &rarr; API key</strong>.
                    </li>
                    <li>
                      Copy Key dán vào ô trên. Key chỉ lưu trong <code className="font-mono">localStorage</code> trên máy bạn.
                    </li>
                  </ol>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  Bỏ trống API Key sẽ quét trực tiếp từ trang công khai &amp; Atom RSS YouTube (15 video gần nhất). Có API Key sẽ lấy tối đa 20 video kèm Comments.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Phân tích ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: CSV / JSON Upload & Competitor Quick Audit */}
        {activeInputTab === 'upload' && (
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h2
                  className="text-lg font-bold text-slate-900"
                  style={{ fontFamily: 'var(--font-saas-display)' }}
                >
                  Dữ liệu Meta / TikTok (Nội bộ hoặc Công khai Đối thủ)
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Tải file xuất từ Meta/TikTok Studio, file từ công cụ thu thập công khai (Apify, Scraper), hoặc tự nhập nhanh số liệu nhìn thấy trên kênh đối thủ.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadSampleCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Tải file CSV mẫu</span>
              </button>
            </div>

            {/* Competitor guidance note */}
            <div className="mb-5 p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
              <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Phân tích đối thủ không cần nhập tay: </span>
                Dùng chế độ{' '}
                <button
                  type="button"
                  onClick={() => {
                    setUploadMode('proxy');
                    setParseError(null);
                  }}
                  className="font-semibold text-[#0D9488] hover:underline cursor-pointer"
                >
                  Quét URL đối thủ (Proxy)
                </button>{' '}
                để máy chủ tự trích xuất chỉ số công khai và xuất thành file CSV chuẩn. Lưu ý: nếu nền tảng (Meta/TikTok) bật tường đăng nhập chặn bot, bạn có thể xuất CSV bằng tiện ích trình duyệt và tải lên ở mục <strong>Tải file CSV / JSON</strong>.
              </div>
            </div>

            {/* Sub-mode Toggle */}
            <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg mb-5">
              <button
                type="button"
                onClick={() => {
                  setUploadMode('file');
                  setParseError(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  uploadMode === 'file'
                    ? 'bg-white text-[#0D9488] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải file CSV / JSON</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMode('proxy');
                  setParseError(null);
                  setCompetitorError(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  uploadMode === 'proxy'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Quét URL đối thủ (Proxy)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMode('manual');
                  setParseError(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  uploadMode === 'manual'
                    ? 'bg-white text-[#0D9488] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table2 className="w-3.5 h-3.5" />
                <span>Nhập nhanh số liệu công khai đối thủ</span>
              </button>
            </div>

            {/* Shared Optional Channel Metadata (for CSV upload & Manual audit) */}
            {uploadMode !== 'proxy' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div>
                  <label
                    htmlFor="upload-brand-name"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Tên thương hiệu / Kênh đối thủ
                  </label>
                  <input
                    id="upload-brand-name"
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="VD: Đối thủ A Official"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="upload-platform"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Nền tảng nguồn
                  </label>
                  <select
                    id="upload-platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="Facebook">Facebook (Meta)</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Đa nền tảng">Đa nền tảng</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="upload-followers"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Số Followers công khai (nếu có)
                  </label>
                  <input
                    id="upload-followers"
                    type="text"
                    value={followersInput}
                    onChange={(e) => setFollowersInput(e.target.value)}
                    placeholder="Để trống nếu ẩn (N/A)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                </div>
              </div>
            )}

            {uploadMode === 'proxy' ? (
              <div className="space-y-5">
                <form onSubmit={handleFetchCompetitorSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="competitor-proxy-url"
                      className="block text-xs font-medium text-slate-800 mb-1.5"
                    >
                      URL trang mạng xã hội công khai của đối thủ
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="competitor-proxy-url"
                          type="text"
                          required
                          value={competitorUrl}
                          onChange={(e) => setCompetitorUrl(e.target.value)}
                          placeholder="Ví dụ: https://www.youtube.com/@F8VNOfficial hoặc https://www.tiktok.com/@username"
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isFetchingCompetitor}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {isFetchingCompetitor ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang quét URL...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            <span>Lấy dữ liệu đối thủ</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>Thử nhanh URL công khai:</span>
                      {[
                        'https://www.youtube.com/@F8VNOfficial',
                        'https://www.youtube.com/@Web5Ngay',
                      ].map((presetUrl) => (
                        <button
                          key={presetUrl}
                          type="button"
                          onClick={() => setCompetitorUrl(presetUrl)}
                          className="text-[#2563EB] hover:underline font-mono cursor-pointer"
                        >
                          {presetUrl.replace('https://www.', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>

                {competitorError && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Không thể trích xuất dữ liệu tự động</p>
                      <p className="mt-0.5">{competitorError}</p>
                    </div>
                  </div>
                )}

                {competitorResult && (
                  <div className="border border-slate-200 rounded-xl bg-slate-50/70 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {competitorResult.profile.avatarUrl ? (
                          <img
                            src={competitorResult.profile.avatarUrl}
                            alt={competitorResult.profile.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-blue-100 text-[#2563EB] font-bold text-sm flex items-center justify-center shrink-0">
                            {competitorResult.profile.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 truncate">
                              {competitorResult.profile.name}
                            </h3>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {competitorResult.profile.platform}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-mono truncate mt-0.5">
                            {competitorResult.profile.handle} ·{' '}
                            {competitorResult.profile.followers !== null
                              ? `${formatCompactNumber(competitorResult.profile.followers)} Followers`
                              : 'N/A (Dữ liệu riêng tư)'}{' '}
                            · {competitorResult.posts.length} bài đăng
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyCompetitorCsv}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {copiedCsv ? (
                            <Check className="w-3.5 h-3.5 text-[#0D9488]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>{copiedCsv ? 'Đã chép CSV' : 'Sao chép CSV'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            exportDatasetToCsv(
                              competitorResult.profile.name,
                              competitorResult.posts
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-[#0D9488]" />
                          <span>Xuất file CSV chuẩn</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                        Xem trước dữ liệu CSV chuẩn (
                        <code className="font-mono">
                          post_date,content_type,caption,likes,comments,shares,views
                        </code>
                        ):
                      </p>
                      <pre className="p-3 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-700 overflow-x-auto max-h-40 leading-relaxed">
                        {competitorResult.csvContent}
                      </pre>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <p className="text-xs text-slate-500">
                        {competitorResult.profile.verificationNote}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          onAnalyzeUploaded(
                            competitorResult.profile,
                            competitorResult.posts
                          )
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0D9488] hover:bg-teal-700 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>Phân tích trên Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : uploadMode === 'file' ? (
              <form onSubmit={handleAnalyzeUploadSubmit} className="space-y-5">
                {/* Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    isDragging
                      ? 'border-[#0D9488] bg-teal-50/60'
                      : 'border-slate-300 bg-slate-50/50 hover:border-slate-400'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.txt"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                    className="hidden"
                  />
                  <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-800">
                    Kéo thả file <code className="font-mono text-xs">.csv</code> hoặc{' '}
                    <code className="font-mono text-xs">.json</code> vào đây
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Hỗ trợ cột chuẩn (<code className="font-mono">post_date, content_type, caption, likes, comments, shares, views</code>) và file xuất từ Apify / TikTok / Meta.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 px-4 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Chọn file từ máy tính
                  </button>
                  {uploadedFileName && (
                    <p className="mt-2 text-xs font-medium text-[#0D9488]">
                      Đã chọn: {uploadedFileName}
                    </p>
                  )}
                </div>

                {/* Paste Textarea */}
                <div>
                  <label
                    htmlFor="paste-data-area"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Hoặc dán trực tiếp nội dung CSV / JSON
                  </label>
                  <textarea
                    id="paste-data-area"
                    rows={5}
                    value={rawDataText}
                    onChange={(e) => processRawUploadText(e.target.value)}
                    placeholder={'post_date,content_type,caption,likes,comments,shares,views\n2026-03-01,Video ngắn,"Video giới thiệu sản phẩm mới",1250,84,112,28400'}
                    className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                </div>

                {parseError && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{parseError}</span>
                  </div>
                )}

                {parsedPreview && (
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>
                        Đã đọc hợp lệ <strong>{parsedPreview.posts.length} bài đăng</strong> · Cột nhận diện:{' '}
                        <span className="font-mono">{parsedPreview.detectedColumns.join(', ')}</span>
                      </span>
                    </div>
                    {parsedPreview.missingOptionalColumns.length > 0 && (
                      <span className="text-teal-700">
                        Cột thiếu ({parsedPreview.missingOptionalColumns.join(', ')}) sẽ hiển thị N/A
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={!parsedPreview}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0D9488] hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Phân tích dữ liệu tải lên</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
                        <th className="py-2.5 px-2.5 whitespace-nowrap">Ngày đăng</th>
                        <th className="py-2.5 px-2.5 whitespace-nowrap">Định dạng</th>
                        <th className="py-2.5 px-2.5 min-w-[200px]">Tiêu đề / Caption</th>
                        <th className="py-2.5 px-2.5 whitespace-nowrap">Views</th>
                        <th className="py-2.5 px-2.5 whitespace-nowrap">Likes</th>
                        <th className="py-2.5 px-2.5 whitespace-nowrap">Comments</th>
                        <th className="py-2.5 px-2.5 whitespace-nowrap">Shares</th>
                        <th className="py-2.5 px-2 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {manualRows.map((row, idx) => (
                        <tr key={row.id}>
                          <td className="p-2">
                            <input
                              type="date"
                              value={row.publishedAt}
                              onChange={(e) =>
                                handleManualUpdateRow(row.id, 'publishedAt', e.target.value)
                              }
                              className="px-2 py-1.5 rounded border border-slate-300 bg-white text-slate-900 font-mono text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={row.contentType}
                              onChange={(e) =>
                                handleManualUpdateRow(row.id, 'contentType', e.target.value)
                              }
                              className="px-2 py-1.5 rounded border border-slate-300 bg-white text-slate-900 text-xs"
                            >
                              <option value="Video ngắn">Video ngắn</option>
                              <option value="Video dài">Video dài</option>
                              <option value="Hình ảnh / Carousel">Hình ảnh / Carousel</option>
                              <option value="Bài viết">Bài viết</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.caption}
                              onChange={(e) =>
                                handleManualUpdateRow(row.id, 'caption', e.target.value)
                              }
                              placeholder={`Nội dung bài #${idx + 1}...`}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-900 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={row.views}
                              onChange={(e) =>
                                handleManualUpdateRow(row.id, 'views', e.target.value)
                              }
                              placeholder="N/A"
                              className="w-20 px-2 py-1.5 rounded border border-slate-300 bg-white text-slate-900 font-mono text-xs text-right"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={row.likes}
                              onChange={(e) =>
                                handleManualUpdateRow(row.id, 'likes', e.target.value)
                              }
                              placeholder="0"
                              className="w-16 px-2 py-1.5 rounded border border-slate-300 bg-white text-slate-900 font-mono text-xs text-right"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={row.comments}
                              onChange={(e) =>
                                handleManualUpdateRow(row.id, 'comments', e.target.value)
                              }
                              placeholder="0"
                              className="w-16 px-2 py-1.5 rounded border border-slate-300 bg-white text-slate-900 font-mono text-xs text-right"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={row.shares}
                              onChange={(e) =>
                                handleManualUpdateRow(row.id, 'shares', e.target.value)
                              }
                              placeholder="N/A"
                              className="w-16 px-2 py-1.5 rounded border border-slate-300 bg-white text-slate-900 font-mono text-xs text-right"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleManualRemoveRow(row.id)}
                              disabled={manualRows.length <= 1}
                              aria-label="Xóa dòng"
                              className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {parseError && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{parseError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleManualAddRow}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm bài đăng</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0D9488] hover:bg-teal-700 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Phân tích số liệu đối thủ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Verified Case Studies */}
        {activeInputTab === 'cases' && (
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h2
                  className="text-lg font-bold text-slate-900"
                  style={{ fontFamily: 'var(--font-saas-display)' }}
                >
                  Báo cáo mẫu từ dữ liệu thực tế đã kiểm chứng
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Chọn 1 bộ dữ liệu bên dưới để trải nghiệm đầy đủ Dashboard và AI Marketing Insights mà không cần nhập API Key.
                </p>
              </div>
              <span className="text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                [Verified Case Study]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {VERIFIED_CASE_STUDIES.map((study) => (
                <div
                  key={study.id}
                  className="border border-slate-200 rounded-xl p-5 bg-white hover:border-[#2563EB]/50 transition-colors flex flex-col justify-between gap-5"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <span className="font-medium text-[#2563EB]">{study.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{study.profile.platform}</span>
                      <span aria-hidden="true">·</span>
                      <span>{study.snapshotDate}</span>
                    </div>

                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 flex items-center justify-center">
                        {study.profile.avatarUrl ? (
                          <img
                            src={study.profile.avatarUrl}
                            alt={study.profile.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-slate-600">
                            {study.profile.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {study.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono truncate">
                          {study.profile.handle} · {formatCompactNumber(study.profile.followers)} Followers
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {study.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 font-mono tabular-nums">
                      Mẫu: {study.posts.length} bài đăng
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectCaseStudy(study)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Mở Dashboard phân tích</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
