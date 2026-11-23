import {
  AnalysisDataset,
  ChannelProfile,
  ComputedKPIs,
  ComputedSocialPost,
  FormatBreakdownItem,
  PerformanceTier,
  SocialPost,
} from '../types';

export const PRIVATE_NA_LABEL = 'N/A (Dữ liệu riêng tư)';

export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return PRIVATE_NA_LABEL;
  }
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2).replace(/\.00$/, '')}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return value.toLocaleString('vi-VN');
}

export function formatFullNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return PRIVATE_NA_LABEL;
  }
  return value.toLocaleString('vi-VN');
}

export function formatShortTableNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'N/A (Riêng tư)';
  }
  return value.toLocaleString('vi-VN');
}

export function formatPercent(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'N/A';
  }
  return `${value.toFixed(digits)}%`;
}

export function formatDateVN(dateStr: string, includeTime = false): string {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return dateStr;
  }
  if (includeTime) {
    return parsed.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return parsed.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function computeDatasetAnalytics(
  profile: ChannelProfile,
  rawPosts: SocialPost[]
): AnalysisDataset {
  const sortedPosts = [...rawPosts].sort((a, b) => {
    const tA = new Date(a.publishedAt).getTime();
    const tB = new Date(b.publishedAt).getTime();
    if (Number.isNaN(tA) || Number.isNaN(tB)) return 0;
    return tB - tA;
  });

  const hasAnyViews = sortedPosts.some((p) => p.views !== null && p.views > 0);
  const hasAnyShares = sortedPosts.some((p) => p.shares !== null);

  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  let totalViews = 0;
  let totalInteractions = 0;

  const baseScores: number[] = [];

  const preComputed = sortedPosts.map((post) => {
    const likes = post.likes ?? 0;
    const comments = post.comments ?? 0;
    const shares = post.shares ?? 0;
    const postInteractions = likes + comments + shares;

    totalLikes += likes;
    totalComments += comments;
    if (post.shares !== null) {
      totalShares += post.shares;
    }
    if (post.views !== null) {
      totalViews += post.views;
    }
    totalInteractions += postInteractions;

    const scoreForTier =
      post.views !== null && post.views > 0 ? post.views : postInteractions;
    baseScores.push(scoreForTier);

    const engagementRate =
      post.views !== null && post.views > 0
        ? (postInteractions / post.views) * 100
        : null;

    return {
      ...post,
      totalInteractions: postInteractions,
      engagementRate,
      _scoreForTier: scoreForTier,
    };
  });

  const medianScore = getMedian(baseScores);

  const posts: ComputedSocialPost[] = preComputed.map(({ _scoreForTier, ...rest }) => {
    let performanceTier: PerformanceTier = 'Trung bình';
    if (medianScore > 0) {
      if (_scoreForTier >= medianScore * 2) {
        performanceTier = 'Viral';
      } else if (_scoreForTier >= medianScore) {
        performanceTier = 'Tốt';
      }
    } else if (rest.totalInteractions > 0) {
      performanceTier = 'Tốt';
    }
    return {
      ...rest,
      performanceTier,
    };
  });

  // Engagement Rate computation (strictly grounded in available data)
  let engagementRate: number | null = null;
  let engagementRateType: ComputedKPIs['engagementRateType'] = 'unavailable';
  let engagementRateFormula =
    'Không đủ dữ liệu Views hoặc Followers để tính tỷ lệ tương tác.';

  if (hasAnyViews && totalViews > 0) {
    engagementRate = (totalInteractions / totalViews) * 100;
    engagementRateType = 'by_views';
    engagementRateFormula =
      'ER (theo Views) = (Tổng Likes + Comments + Shares) / Tổng Views × 100%';
  } else if (profile.followers !== null && profile.followers > 0 && posts.length > 0) {
    const avgInteractionsPerPost = totalInteractions / posts.length;
    engagementRate = (avgInteractionsPerPost / profile.followers) * 100;
    engagementRateType = 'by_followers';
    engagementRateFormula =
      'ER (theo Followers) = (Trung bình tương tác mỗi bài / Tổng Followers) × 100%';
  }

  // Posting frequency (posts/week) based on actual date span
  const validTimestamps = posts
    .map((p) => new Date(p.publishedAt).getTime())
    .filter((t) => !Number.isNaN(t));

  let dateSpanDays = 0;
  let postsPerWeek: number | null = null;

  if (validTimestamps.length >= 2) {
    const maxT = Math.max(...validTimestamps);
    const minT = Math.min(...validTimestamps);
    dateSpanDays = Math.max(1, Math.round((maxT - minT) / (1000 * 60 * 60 * 24)));
    const weeks = Math.max(dateSpanDays / 7, 1);
    postsPerWeek = Number((posts.length / weeks).toFixed(1));
  } else if (validTimestamps.length === 1) {
    dateSpanDays = 1;
    postsPerWeek = posts.length;
  }

  const kpis: ComputedKPIs = {
    followers: profile.followers,
    engagementRate,
    engagementRateType,
    engagementRateFormula,
    postsPerWeek,
    dateSpanDays,
    totalInteractionsInSample: totalInteractions,
    totalLikesInSample: totalLikes,
    totalCommentsInSample: totalComments,
    totalSharesInSample: hasAnyShares ? totalShares : null,
    totalViewsInSample: hasAnyViews ? totalViews : null,
    hasAnyViews,
    hasAnyShares,
    medianScore,
  };

  // Format breakdown
  const formatMap = new Map<
    string,
    { count: number; totalViews: number; hasViews: boolean; totalInteractions: number }
  >();

  for (const p of posts) {
    const key = p.contentType || 'Chưa phân loại';
    const current = formatMap.get(key) ?? {
      count: 0,
      totalViews: 0,
      hasViews: false,
      totalInteractions: 0,
    };
    current.count += 1;
    current.totalInteractions += p.totalInteractions;
    if (p.views !== null) {
      current.totalViews += p.views;
      current.hasViews = true;
    }
    formatMap.set(key, current);
  }

  const formatBreakdown: FormatBreakdownItem[] = Array.from(formatMap.entries())
    .map(([format, stats]) => ({
      format,
      count: stats.count,
      percentage: posts.length > 0 ? Number(((stats.count / posts.length) * 100).toFixed(1)) : 0,
      totalViews: stats.hasViews ? stats.totalViews : null,
      totalInteractions: stats.totalInteractions,
      avgEngagementRate:
        stats.hasViews && stats.totalViews > 0
          ? (stats.totalInteractions / stats.totalViews) * 100
          : null,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    profile,
    posts,
    kpis,
    formatBreakdown,
  };
}
