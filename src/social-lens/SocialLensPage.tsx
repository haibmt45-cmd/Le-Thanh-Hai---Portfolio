import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header, HeaderTab } from './components/Header';
import { InputHub, InputTab } from './components/InputHub';
import { ApiSettingsPanel } from './components/ApiSettingsPanel';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import {
  AnalysisDataset,
  ChannelProfile,
  SocialPost,
  VerifiedCaseStudy,
} from './types';
import { computeDatasetAnalytics } from './utils/analytics';
import { buildStandardCsvContent } from './utils/fileParser';
import {
  fetchYouTubeChannelData,
  fetchYouTubePublicCompetitor,
} from './services/youtubeApi';

const YT_API_KEY_STORAGE = 'social_lens_yt_api_key';

export interface CompetitorFetchResult {
  profile: ChannelProfile;
  posts: SocialPost[];
  csvContent: string;
}

export async function fetchCompetitorData(
  profileUrl: string
): Promise<CompetitorFetchResult> {
  const cleanUrl = profileUrl.trim();
  if (!cleanUrl) {
    throw new Error('Vui lòng nhập URL trang mạng xã hội công khai của đối thủ.');
  }

  const response = await fetch('/api/social-lens/fetch-competitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileUrl: cleanUrl }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      payload?.error ||
        `Không thể thu thập dữ liệu công khai từ URL này (HTTP ${response.status}).`
    );
  }

  const profile = payload?.profile as ChannelProfile | undefined;
  const posts = Array.isArray(payload?.posts) ? (payload.posts as SocialPost[]) : [];

  if (!profile || posts.length === 0) {
    throw new Error(
      'Máy chủ không trích xuất được bài đăng công khai nào từ đường dẫn đã cung cấp.'
    );
  }

  const csvContent = buildStandardCsvContent(posts);
  return { profile, posts, csvContent };
}

export const SocialLensPage: React.FC = () => {
  const [headerTab, setHeaderTab] = useState<HeaderTab>('analyze');
  const [inputTab, setInputTab] = useState<InputTab>('youtube');
  const [youtubeApiKey, setYoutubeApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem(YT_API_KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    'Đang tổng hợp và phân tích dữ liệu thật...'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dataset, setDataset] = useState<AnalysisDataset | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [dataset, headerTab]);

  const handleSaveYoutubeApiKey = (key: string) => {
    setYoutubeApiKey(key);
    try {
      if (key) {
        localStorage.setItem(YT_API_KEY_STORAGE, key);
      } else {
        localStorage.removeItem(YT_API_KEY_STORAGE);
      }
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleSelectHeaderTab = (tab: HeaderTab) => {
    setHeaderTab(tab);
    setErrorMessage(null);
    if (tab === 'samples') {
      setInputTab('cases');
    } else if (tab === 'analyze' && inputTab === 'cases') {
      setInputTab('youtube');
    }
  };

  const handleAnalyzeYoutube = async (channelInput: string, apiKey: string) => {
    setIsAnalyzing(true);
    const hasKey = Boolean(apiKey.trim());
    setLoadingMessage(
      hasKey
        ? 'Đang kết nối YouTube Data API v3 và tổng hợp dữ liệu thật...'
        : 'Đang quét trực tiếp trang công khai & RSS kênh đối thủ (không cần API Key)...'
    );
    setErrorMessage(null);
    try {
      const { profile, posts } = hasKey
        ? await fetchYouTubeChannelData(channelInput, apiKey, 20)
        : await fetchYouTubePublicCompetitor(channelInput);
      const computed = computeDatasetAnalytics(profile, posts);
      setDataset(computed);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Không thể lấy dữ liệu từ kênh YouTube này.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeUploaded = (profile: ChannelProfile, posts: SocialPost[]) => {
    setIsAnalyzing(true);
    setLoadingMessage('Đang tổng hợp và phân tích dữ liệu thật từ file tải lên...');
    setErrorMessage(null);
    setTimeout(() => {
      const computed = computeDatasetAnalytics(profile, posts);
      setDataset(computed);
      setIsAnalyzing(false);
    }, 350);
  };

  const handleFetchCompetitorData = async (
    profileUrl: string
  ): Promise<CompetitorFetchResult> => {
    setErrorMessage(null);
    return fetchCompetitorData(profileUrl);
  };

  const handleSelectCaseStudy = (study: VerifiedCaseStudy) => {
    setIsAnalyzing(true);
    setLoadingMessage('Đang tổng hợp và phân tích dữ liệu thật...');
    setErrorMessage(null);
    setTimeout(() => {
      const computed = computeDatasetAnalytics(study.profile, study.posts);
      setDataset(computed);
      setHeaderTab('analyze');
      setIsAnalyzing(false);
    }, 450);
  };

  const handleResetToInput = () => {
    setDataset(null);
    setErrorMessage(null);
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased"
      style={{ fontFamily: 'var(--font-saas-body)' }}
    >
      <Helmet>
        <title>Social Lens — Brand Social Media Analyzer | Lê Thanh Hải</title>
        <meta
          name="description"
          content="Công cụ đo lường và phân tích hiệu suất Social Media từ dữ liệu thật (YouTube Data API v3, Meta/TikTok CSV/JSON, Case Study kiểm chứng)."
        />
      </Helmet>

      <Header
        activeTab={headerTab}
        onSelectTab={handleSelectHeaderTab}
        hasDataset={Boolean(dataset)}
        onResetToInput={handleResetToInput}
      />

      <main className="pb-16">
        {headerTab === 'settings' ? (
          <ApiSettingsPanel
            youtubeApiKey={youtubeApiKey}
            onSaveApiKey={handleSaveYoutubeApiKey}
            onBackToAnalyze={() => setHeaderTab('analyze')}
          />
        ) : isAnalyzing ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
            <div className="bg-white border border-slate-200 rounded-xl p-10 space-y-5">
              <div className="w-10 h-10 border-3 border-slate-200 border-t-[#2563EB] rounded-full animate-spin mx-auto" />
              <div>
                <h2
                  className="text-lg font-bold text-slate-900"
                  style={{ fontFamily: 'var(--font-saas-display)' }}
                >
                  {loadingMessage}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Đang chuẩn hóa chỉ số tương tác, tần suất đăng bài và phân bổ định dạng.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : dataset ? (
          <AnalyticsDashboard dataset={dataset} onReset={handleResetToInput} />
        ) : (
          <InputHub
            activeInputTab={inputTab}
            onChangeInputTab={(tab) => {
              setInputTab(tab);
              setHeaderTab(tab === 'cases' ? 'samples' : 'analyze');
            }}
            youtubeApiKey={youtubeApiKey}
            onSaveYoutubeApiKey={handleSaveYoutubeApiKey}
            onAnalyzeYoutube={handleAnalyzeYoutube}
            onAnalyzeUploaded={handleAnalyzeUploaded}
            onFetchCompetitorData={handleFetchCompetitorData}
            onSelectCaseStudy={handleSelectCaseStudy}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
          />
        )}
      </main>
    </div>
  );
};

export default SocialLensPage;
