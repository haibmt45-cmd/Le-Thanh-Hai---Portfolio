export type DataSourceType =
  | 'youtube_live'
  | 'uploaded_csv_json'
  | 'verified_case_study';

export type PerformanceTier = 'Viral' | 'Tốt' | 'Trung bình';

export interface SocialPost {
  id: string;
  title: string;
  caption: string;
  publishedAt: string; // ISO date or YYYY-MM-DD
  hasExactTime: boolean;
  contentType: string;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  url?: string;
  durationSeconds?: number | null;
}

export interface ComputedSocialPost extends SocialPost {
  totalInteractions: number;
  engagementRate: number | null; // By views if views > 0, else null
  performanceTier: PerformanceTier;
}

export interface ChannelProfile {
  name: string;
  handle: string;
  platform: 'YouTube' | 'TikTok' | 'Facebook' | 'Instagram' | 'Đa nền tảng' | string;
  avatarUrl?: string;
  followers: number | null;
  totalChannelViews: number | null;
  totalVideosCount: number | null;
  dataSource: DataSourceType;
  sourceLabel: '[Live YouTube API]' | '[Uploaded Real Data]' | '[Verified Case Study]';
  collectedAt: string;
  samplePeriodLabel: string;
  verificationNote: string;
}

export interface ComputedKPIs {
  followers: number | null;
  engagementRate: number | null;
  engagementRateType: 'by_views' | 'by_followers' | 'unavailable';
  engagementRateFormula: string;
  postsPerWeek: number | null;
  dateSpanDays: number;
  totalInteractionsInSample: number;
  totalLikesInSample: number;
  totalCommentsInSample: number;
  totalSharesInSample: number | null;
  totalViewsInSample: number | null;
  hasAnyViews: boolean;
  hasAnyShares: boolean;
  medianScore: number;
}

export interface FormatBreakdownItem {
  format: string;
  count: number;
  percentage: number;
  totalViews: number | null;
  totalInteractions: number;
  avgEngagementRate: number | null;
}

export interface AnalysisDataset {
  profile: ChannelProfile;
  posts: ComputedSocialPost[];
  kpis: ComputedKPIs;
  formatBreakdown: FormatBreakdownItem[];
}

export interface AIMarketingInsights {
  strengths: string[];
  bestFormatAndTiming: {
    summary: string;
    evidence: string;
  };
  recommendations: {
    title: string;
    rationale: string;
    priority: string;
  }[];
  dataCaveats: string;
}

export interface VerifiedCaseStudy {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  snapshotDate: string;
  profile: ChannelProfile;
  posts: SocialPost[];
}
