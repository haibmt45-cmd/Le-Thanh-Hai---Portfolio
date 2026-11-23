import { ChannelProfile, SocialPost } from '../types';

export interface YouTubeFetchResult {
  profile: ChannelProfile;
  posts: SocialPost[];
}

export async function fetchYouTubePublicCompetitor(
  channelInput: string
): Promise<YouTubeFetchResult> {
  const res = await fetch('/api/social-lens/scan-youtube-public', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channelInput }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return {
    profile: data.profile as ChannelProfile,
    posts: data.posts as SocialPost[],
  };
}

interface YouTubeTarget {
  type: 'id' | 'handle' | 'query';
  value: string;
}

export function parseYouTubeChannelInput(rawInput: string): YouTubeTarget {
  const input = rawInput.trim();
  if (!input) {
    throw new Error('Vui lòng nhập URL kênh, @handle hoặc Channel ID.');
  }

  // Direct Channel ID (starts with UC and length ~24)
  if (/^UC[\w-]{20,}$/.test(input)) {
    return { type: 'id', value: input };
  }

  // Direct handle (@something)
  if (input.startsWith('@')) {
    return { type: 'handle', value: input };
  }

  try {
    const normalizedUrl = input.startsWith('http') ? input : `https://${input}`;
    const url = new URL(normalizedUrl);
    if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        if (segments[0].startsWith('@')) {
          return { type: 'handle', value: decodeURIComponent(segments[0]) };
        }
        if (segments[0] === 'channel' && segments[1]) {
          return { type: 'id', value: segments[1] };
        }
        if ((segments[0] === 'c' || segments[0] === 'user') && segments[1]) {
          return { type: 'query', value: decodeURIComponent(segments[1]) };
        }
        return { type: 'query', value: decodeURIComponent(segments[0]) };
      }
    }
  } catch {
    // Fall through to handle/query parsing
  }

  return { type: 'handle', value: `@${input.replace(/^@/, '')}` };
}

function parseIsoDurationSeconds(isoDuration?: string): number | null {
  if (!isoDuration) return null;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}

async function fetchYouTubeJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    const apiMsg = data?.error?.message || `HTTP ${res.status}`;
    if (res.status === 400 || res.status === 403) {
      throw new Error(
        `YouTube API từ chối truy cập (${apiMsg}). Hãy kiểm tra lại YouTube Data API Key hoặc hạn mức quota.`
      );
    }
    throw new Error(`Lỗi YouTube API: ${apiMsg}`);
  }
  return data as T;
}

export async function fetchYouTubeChannelData(
  channelInput: string,
  apiKey: string,
  maxVideos = 20
): Promise<YouTubeFetchResult> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw new Error('Vui lòng nhập YouTube Data API Key để quét dữ liệu kênh thật.');
  }

  const target = parseYouTubeChannelInput(channelInput);
  const base = 'https://www.googleapis.com/youtube/v3';

  let channelData: any = null;

  if (target.type === 'id') {
    const resp = await fetchYouTubeJson<any>(
      `${base}/channels?part=snippet,statistics,contentDetails&id=${encodeURIComponent(target.value)}&key=${encodeURIComponent(cleanKey)}`
    );
    channelData = resp.items?.[0];
  } else if (target.type === 'handle') {
    const resp = await fetchYouTubeJson<any>(
      `${base}/channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(target.value)}&key=${encodeURIComponent(cleanKey)}`
    );
    channelData = resp.items?.[0];
  }

  // Fallback via search API if custom /c/ URL or handle didn't match directly
  if (!channelData) {
    const queryStr = target.value.replace(/^@/, '');
    const searchResp = await fetchYouTubeJson<any>(
      `${base}/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(queryStr)}&key=${encodeURIComponent(cleanKey)}`
    );
    const foundId = searchResp.items?.[0]?.snippet?.channelId;
    if (foundId) {
      const resp = await fetchYouTubeJson<any>(
        `${base}/channels?part=snippet,statistics,contentDetails&id=${encodeURIComponent(foundId)}&key=${encodeURIComponent(cleanKey)}`
      );
      channelData = resp.items?.[0];
    }
  }

  if (!channelData) {
    throw new Error(
      `Không tìm thấy kênh YouTube khớp với "${channelInput}". Thử nhập chính xác @handle hoặc Channel ID (UC...).`
    );
  }

  const snippet = channelData.snippet ?? {};
  const stats = channelData.statistics ?? {};
  const uploadsPlaylistId = channelData.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    throw new Error('Kênh này không có danh sách video công khai để phân tích.');
  }

  const playlistResp = await fetchYouTubeJson<any>(
    `${base}/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=${Math.min(maxVideos, 25)}&key=${encodeURIComponent(cleanKey)}`
  );

  const videoIds: string[] = (playlistResp.items ?? [])
    .map((item: any) => item.contentDetails?.videoId)
    .filter(Boolean);

  if (videoIds.length === 0) {
    throw new Error('Kênh này chưa có video công khai nào.');
  }

  const videosResp = await fetchYouTubeJson<any>(
    `${base}/videos?part=snippet,statistics,contentDetails&id=${encodeURIComponent(videoIds.join(','))}&key=${encodeURIComponent(cleanKey)}`
  );

  const posts: SocialPost[] = (videosResp.items ?? []).map((video: any) => {
    const vSnippet = video.snippet ?? {};
    const vStats = video.statistics ?? {};
    const durationSeconds = parseIsoDurationSeconds(video.contentDetails?.duration);
    const isShort = durationSeconds !== null && durationSeconds <= 60;

    return {
      id: video.id,
      title: vSnippet.title || 'Video không tiêu đề',
      caption: vSnippet.title || '',
      publishedAt: vSnippet.publishedAt || new Date().toISOString(),
      hasExactTime: Boolean(vSnippet.publishedAt && vSnippet.publishedAt.includes('T')),
      contentType: isShort ? 'Video ngắn' : 'Video dài',
      views: vStats.viewCount !== undefined ? Number(vStats.viewCount) : null,
      likes: vStats.likeCount !== undefined ? Number(vStats.likeCount) : null,
      comments: vStats.commentCount !== undefined ? Number(vStats.commentCount) : null,
      // YouTube Data API v3 never exposes video share counts publicly
      shares: null,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      durationSeconds,
    };
  });

  const subscribersHidden = stats.hiddenSubscriberCount === true;
  const followers =
    !subscribersHidden && stats.subscriberCount !== undefined
      ? Number(stats.subscriberCount)
      : null;

  const dates = posts
    .map((p) => new Date(p.publishedAt).getTime())
    .filter((t) => !Number.isNaN(t));
  const minDate = dates.length ? new Date(Math.min(...dates)).toLocaleDateString('vi-VN') : '';
  const maxDate = dates.length ? new Date(Math.max(...dates)).toLocaleDateString('vi-VN') : '';

  const profile: ChannelProfile = {
    name: snippet.title || channelInput,
    handle: snippet.customUrl || channelData.id,
    platform: 'YouTube',
    avatarUrl:
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url,
    followers,
    totalChannelViews: stats.viewCount !== undefined ? Number(stats.viewCount) : null,
    totalVideosCount: stats.videoCount !== undefined ? Number(stats.videoCount) : null,
    dataSource: 'youtube_live',
    sourceLabel: '[Live YouTube API]',
    collectedAt: new Date().toISOString(),
    samplePeriodLabel:
      minDate && maxDate
        ? `${posts.length} video gần nhất (${minDate} – ${maxDate})`
        : `${posts.length} video gần nhất`,
    verificationNote:
      'Dữ liệu truy xuất trực tiếp từ YouTube Data API v3. Chỉ số Shares để N/A vì YouTube API không công khai lượt chia sẻ.',
  };

  return { profile, posts };
}
