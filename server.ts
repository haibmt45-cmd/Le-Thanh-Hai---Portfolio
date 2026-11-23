import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Helper: Scrape public YouTube channel + Atom RSS feed
  async function scrapePublicYouTubeChannel(rawInput: string) {
    let targetUrl = '';
    if (/^UC[\w-]{20,}$/.test(rawInput)) {
      targetUrl = `https://www.youtube.com/channel/${rawInput}/videos`;
    } else if (rawInput.startsWith('@')) {
      targetUrl = `https://www.youtube.com/${encodeURIComponent(rawInput)}/videos`;
    } else if (rawInput.includes('youtube.com') || rawInput.includes('youtu.be')) {
      const normalized = rawInput.startsWith('http') ? rawInput : `https://${rawInput}`;
      const parsed = new URL(normalized);
      const segs = parsed.pathname.split('/').filter(Boolean);
      if (segs.length === 0) {
        throw new Error('URL kênh YouTube không hợp lệ.');
      }
      if (segs[0].startsWith('@')) {
        targetUrl = `https://www.youtube.com/${segs[0]}/videos`;
      } else if (segs[0] === 'channel' && segs[1]) {
        targetUrl = `https://www.youtube.com/channel/${segs[1]}/videos`;
      } else {
        targetUrl = `https://www.youtube.com/${segs.slice(0, 2).join('/')}/videos`;
      }
    } else {
      targetUrl = `https://www.youtube.com/@${encodeURIComponent(rawInput.replace(/^@/, ''))}/videos`;
    }

    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    const pageRes = await fetch(targetUrl, { headers });
    if (!pageRes.ok) {
      throw new Error(`Không thể truy cập trang kênh YouTube (HTTP ${pageRes.status}).`);
    }

    const html = await pageRes.text();
    const dataMatch = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
    if (!dataMatch) {
      throw new Error('Không tìm thấy dữ liệu công khai trên trang kênh YouTube này.');
    }

    const ytData = JSON.parse(dataMatch[1]);
    const meta = ytData?.metadata?.channelMetadataRenderer;
    const channelId: string | undefined = meta?.externalId;

    if (!channelId) {
      throw new Error('Không tìm thấy Channel ID công khai từ đường dẫn đã nhập.');
    }

    const headerStr = JSON.stringify(ytData?.header ?? {});
    const subMatch = headerStr.match(/"content":"([\d.,]+\s*[KMB]?\s*subscribers?)"/i);
    const vidMatch = headerStr.match(/"content":"([\d.,]+\s*[KMB]?\s*videos?)"/i);

    const parseAbbrev = (str?: string): number | null => {
      if (!str) return null;
      const m = str.match(/([\d.,]+)\s*([KMB])?/i);
      if (!m) return null;
      const num = parseFloat(m[1].replace(/,/g, ''));
      if (!Number.isFinite(num)) return null;
      const unit = (m[2] ?? '').toUpperCase();
      if (unit === 'K') return Math.round(num * 1_000);
      if (unit === 'M') return Math.round(num * 1_000_000);
      if (unit === 'B') return Math.round(num * 1_000_000_000);
      return Math.round(num);
    };

    const shortsUrl = targetUrl.replace(/\/videos$/, '/shorts');
    const [rssRes, shortsRes] = await Promise.all([
      fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`, { headers }),
      fetch(shortsUrl, { headers }).catch(() => null),
    ]);

    if (!rssRes.ok) {
      throw new Error('Không thể tải nguồn cấp RSS công khai của kênh.');
    }

    const xml = await rssRes.text();
    const shortsHtml = shortsRes && shortsRes.ok ? await shortsRes.text() : '';
    const shortIds = new Set<string>();
    const shortRegex = /"videoId":"([\w-]{11})"/g;
    let sm: RegExpExecArray | null;
    while ((sm = shortRegex.exec(shortsHtml)) !== null) {
      shortIds.add(sm[1]);
    }

    const decodeXml = (s: string) =>
      s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
    if (entries.length === 0) {
      throw new Error('Kênh này chưa có video công khai trong nguồn RSS.');
    }

    const posts = entries.map((entry) => {
      const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? '';
      const titleRaw = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? 'Video không tiêu đề';
      const title = decodeXml(titleRaw.trim());
      const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? new Date().toISOString();
      const viewsMatch = entry.match(/<media:statistics\s+views="(\d+)"/);
      const likesMatch = entry.match(/<media:starRating\s+count="(\d+)"/);

      const isShort = shortIds.has(videoId) || /#shorts?\b/i.test(title);

      return {
        id: videoId || `yt-${Math.random().toString(36).slice(2)}`,
        title,
        caption: title,
        publishedAt,
        hasExactTime: publishedAt.includes('T'),
        contentType: isShort ? 'Video ngắn' : 'Video dài',
        views: viewsMatch ? Number(viewsMatch[1]) : null,
        likes: likesMatch ? Number(likesMatch[1]) : null,
        comments: null,
        shares: null,
        url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined,
      };
    });

    const handleMatch = String(meta?.vanityChannelUrl ?? '').match(/(@[^/?#]+)/);
    const dates = posts.map((p) => new Date(p.publishedAt).getTime()).filter((t) => !Number.isNaN(t));
    const minDate = dates.length ? new Date(Math.min(...dates)).toLocaleDateString('vi-VN') : '';
    const maxDate = dates.length ? new Date(Math.max(...dates)).toLocaleDateString('vi-VN') : '';

    const profile = {
      name: meta?.title || rawInput,
      handle: handleMatch ? handleMatch[1] : channelId,
      platform: 'YouTube',
      avatarUrl: meta?.avatar?.thumbnails?.[0]?.url,
      followers: parseAbbrev(subMatch?.[1]),
      totalChannelViews: null,
      totalVideosCount: parseAbbrev(vidMatch?.[1]),
      dataSource: 'youtube_live',
      sourceLabel: '[Live YouTube API]',
      collectedAt: new Date().toISOString(),
      samplePeriodLabel:
        minDate && maxDate
          ? `${posts.length} video gần nhất (${minDate} – ${maxDate})`
          : `${posts.length} video gần nhất`,
      verificationNote:
        'Quét trực tiếp từ trang công khai & Atom RSS chính thức của YouTube (không cần API Key). Comments & Shares hiển thị N/A do không có trong nguồn RSS công khai.',
    };

    return { profile, posts };
  }

  // Social Lens: Public YouTube Competitor Scanner (No API Key required)
  app.post('/api/social-lens/scan-youtube-public', async (req, res) => {
    const rawInput = String(req.body?.channelInput ?? '').trim();
    if (!rawInput) {
      return res.status(400).json({ error: 'Vui lòng nhập URL kênh YouTube, @handle hoặc Channel ID đối thủ.' });
    }
    try {
      const result = await scrapePublicYouTubeChannel(rawInput);
      return res.json(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định.';
      return res.status(422).json({ error: msg });
    }
  });

  // Social Lens: Universal Server-Side Competitor Profile Proxy
  app.post('/api/social-lens/fetch-competitor', async (req, res) => {
    const rawUrl = String(req.body?.profileUrl ?? '').trim();
    if (!rawUrl) {
      return res.status(400).json({ error: 'Vui lòng nhập URL trang mạng xã hội công khai của đối thủ.' });
    }

    try {
      const normalizedUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(normalizedUrl);
      } catch {
        return res.status(400).json({ error: 'URL không hợp lệ. Vui lòng nhập đầy đủ dạng https://...' });
      }

      const host = parsedUrl.hostname.toLowerCase();

      // 1. YouTube public profile & RSS extraction
      if (host.includes('youtube.com') || host.includes('youtu.be')) {
        const result = await scrapePublicYouTubeChannel(normalizedUrl);
        return res.json(result);
      }

      // 2. Other public social profiles (TikTok / Instagram / Facebook / public web)
      const response = await fetch(normalizedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
      });

      if (!response.ok) {
        return res.status(422).json({
          error: `Máy chủ nền tảng từ chối truy cập công khai (HTTP ${response.status}). Đối với Meta/TikTok có bảo mật chống bot, bạn có thể xuất CSV qua tiện ích trình duyệt và tải lên ở Tab 2.`,
        });
      }

      const html = await response.text();
      const lowerHost = host;
      const platform = lowerHost.includes('tiktok')
        ? 'TikTok'
        : lowerHost.includes('instagram')
        ? 'Instagram'
        : lowerHost.includes('facebook') || lowerHost.includes('fb.com')
        ? 'Facebook'
        : 'Đa nền tảng';

      const parseAbbrevNum = (val?: string | null): number | null => {
        if (!val) return null;
        const m = val.match(/([\d.,]+)\s*([KMB])?/i);
        if (!m) return null;
        const num = parseFloat(m[1].replace(/,/g, ''));
        if (!Number.isFinite(num)) return null;
        const unit = (m[2] ?? '').toUpperCase();
        if (unit === 'K') return Math.round(num * 1_000);
        if (unit === 'M') return Math.round(num * 1_000_000);
        if (unit === 'B') return Math.round(num * 1_000_000_000);
        return Math.round(num);
      };

      const extractMeta = (attr: string, key: string): string | null => {
        const re = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i');
        const reRev = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${key}["']`, 'i');
        return html.match(re)?.[1] ?? html.match(reRev)?.[1] ?? null;
      };

      const ogTitle = extractMeta('property', 'og:title') ?? extractMeta('name', 'title');
      const ogDesc = extractMeta('property', 'og:description') ?? extractMeta('name', 'description');
      const ogImage = extractMeta('property', 'og:image');

      let followers: number | null = null;
      const followerJsonMatch =
        html.match(/"followerCount"\s*:\s*(\d+)/) ??
        html.match(/"edge_followed_by"\s*:\s*\{\s*"count"\s*:\s*(\d+)/);
      if (followerJsonMatch) {
        followers = Number(followerJsonMatch[1]);
      } else if (ogDesc) {
        const descFollowMatch = ogDesc.match(/([\d.,]+\s*[KMB]?)\s+Followers/i);
        if (descFollowMatch) {
          followers = parseAbbrevNum(descFollowMatch[1]);
        }
      }

      // Extract embedded TikTok itemList if present in SSR JSON
      const extractedPosts: Array<{
        id: string;
        title: string;
        caption: string;
        publishedAt: string;
        hasExactTime: boolean;
        contentType: string;
        views: number | null;
        likes: number | null;
        comments: number | null;
        shares: number | null;
        url?: string;
      }> = [];

      const univMatch = html.match(
        /<script[^>]+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
      );
      if (univMatch) {
        try {
          const parsedJson = JSON.parse(univMatch[1]);
          const jsonStr = JSON.stringify(parsedJson);
          const itemMatches = jsonStr.matchAll(
            /"id":"(\d{10,})"[^}]*?"desc":"([^"]*)"[^}]*?"createTime":(\d{10})[^}]*?"stats":\{([^}]+)\}/g
          );
          for (const m of itemMatches) {
            const statsStr = m[4];
            const viewsM = statsStr.match(/"playCount":(\d+)/);
            const likesM = statsStr.match(/"diggCount":(\d+)/);
            const commentsM = statsStr.match(/"commentCount":(\d+)/);
            const sharesM = statsStr.match(/"shareCount":(\d+)/);
            const cap = m[2] || `Video ${m[1]}`;
            extractedPosts.push({
              id: m[1],
              title: cap.length > 72 ? `${cap.slice(0, 72)}...` : cap,
              caption: cap,
              publishedAt: new Date(Number(m[3]) * 1000).toISOString(),
              hasExactTime: true,
              contentType: 'Video ngắn',
              views: viewsM ? Number(viewsM[1]) : null,
              likes: likesM ? Number(likesM[1]) : null,
              comments: commentsM ? Number(commentsM[1]) : null,
              shares: sharesM ? Number(sharesM[1]) : null,
              url: normalizedUrl,
            });
            if (extractedPosts.length >= 20) break;
          }
        } catch {
          // Ignore malformed JSON
        }
      }

      if (extractedPosts.length === 0) {
        return res.status(422).json({
          error: `${platform} đang bật tường đăng nhập hoặc xác thực JS nên không trả về danh sách bài đăng công khai qua HTTP proxy${
            followers !== null
              ? ` (chỉ đọc được Followers công khai: ${followers.toLocaleString('vi-VN')})`
              : ''
          }. Để phân tích đầy đủ từng bài đăng ${platform} mà không cần nhập tay, hãy xuất file từ tiện ích Instant Data Scraper / Apify và tải lên ở Tab 2, hoặc quét trực tiếp kênh YouTube của đối thủ.`,
        });
      }

      const handleSlug = parsedUrl.pathname.split('/').filter(Boolean)[0] || parsedUrl.hostname;
      const dates = extractedPosts
        .map((p) => new Date(p.publishedAt).getTime())
        .filter((t) => !Number.isNaN(t));
      const minDate = dates.length ? new Date(Math.min(...dates)).toLocaleDateString('vi-VN') : '';
      const maxDate = dates.length ? new Date(Math.max(...dates)).toLocaleDateString('vi-VN') : '';

      return res.json({
        profile: {
          name: ogTitle || handleSlug,
          handle: handleSlug.startsWith('@') ? handleSlug : `@${handleSlug}`,
          platform,
          avatarUrl: ogImage || undefined,
          followers,
          totalChannelViews: null,
          totalVideosCount: extractedPosts.length,
          dataSource: 'uploaded_csv_json',
          sourceLabel: '[Uploaded Real Data]',
          collectedAt: new Date().toISOString(),
          samplePeriodLabel:
            minDate && maxDate
              ? `${extractedPosts.length} bài đăng công khai (${minDate} – ${maxDate})`
              : `${extractedPosts.length} bài đăng công khai`,
          verificationNote: `Dữ liệu công khai trích xuất qua server-side proxy từ ${normalizedUrl}. Chỉ số không công khai được giữ nguyên N/A.`,
        },
        posts: extractedPosts,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định.';
      return res.status(500).json({ error: `Không thể truy xuất dữ liệu từ URL đối thủ: ${msg}` });
    }
  });

  // Social Lens: AI Marketing Insights powered by Gemini (server-side only)
  app.post('/api/social-lens/insights', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra Settings > Secrets.',
      });
    }

    const { analyticsPayload } = req.body ?? {};
    if (!analyticsPayload || typeof analyticsPayload !== 'object') {
      return res.status(400).json({
        error: 'Thiếu dữ liệu phân tích đầu vào để tổng hợp nhận định.',
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = [
        'Bạn là Senior Marketing Strategist & Social Media Data Analyst chuyên nghiệp.',
        'Nhiệm vụ: Phân tích dữ liệu JSON thực tế của một kênh/thương hiệu mạng xã hội và viết nhận định sắc bén, thực tế bằng tiếng Việt.',
        'QUY TẮC CHỐNG BỊA ĐẶT (ANTI-HALLUCINATION) TUYỆT ĐỐI:',
        '1. CHỈ được trích dẫn các con số, ngày tháng, tên bài viết và định dạng có mặt chính xác trong JSON đầu vào.',
        '2. TUYỆT ĐỐI KHÔNG tự ước đoán hoặc bịa đặt bất kỳ số liệu nào (như Reach, CTR, tuổi tác khán giả, hay khung giờ cụ thể nếu dữ liệu ngày chỉ có YYYY-MM-DD mà không có giờ).',
        '3. Nếu một chỉ số là null hoặc N/A (ví dụ: shares trên YouTube không có trong API, hoặc followers chưa được cung cấp), hãy nêu rõ là dữ liệu đó không có sẵn/riêng tư, không suy diễn.',
        '4. Mọi nhận định phải kèm dẫn chứng số liệu cụ thể từ JSON (ví dụ: "Video ngắn đạt trung bình X lượt xem..." hoặc "Bài đăng ngày ... đạt Y lượt tương tác").',
        '5. Văn phong súc tích, chuyên nghiệp, đi thẳng vào insight chiến lược.',
      ].join('\n');

      const prompt = `Hãy phân tích bộ dữ liệu thực tế sau đây và trả về kết quả JSON theo đúng schema yêu cầu:\n\n${JSON.stringify(analyticsPayload, null, 2)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  '2 đến 3 điểm mạnh nổi bật về nội dung và tương tác, mỗi ý phải trích dẫn số liệu cụ thể từ JSON.',
              },
              bestFormatAndTiming: {
                type: Type.OBJECT,
                properties: {
                  summary: {
                    type: Type.STRING,
                    description:
                      'Nhận định về định dạng nội dung và ngày/khung giờ hoạt động hiệu quả nhất (nêu rõ nếu dữ liệu chỉ có ngày mà không có giờ).',
                  },
                  evidence: {
                    type: Type.STRING,
                    description:
                      'Dẫn chứng số liệu cụ thể (tên định dạng, số bài, lượt xem/tương tác trung bình hoặc ngày đăng nổi bật).',
                  },
                },
                required: ['summary', 'evidence'],
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: {
                      type: Type.STRING,
                      description: 'Tiêu đề hành động cụ thể, ngắn gọn.',
                    },
                    rationale: {
                      type: Type.STRING,
                      description: 'Cơ sở dữ liệu thực tế và cách triển khai chi tiết.',
                    },
                    priority: {
                      type: Type.STRING,
                      description: 'Mức độ ưu tiên: Cao, Trung bình hoặc Ngắn hạn.',
                    },
                  },
                  required: ['title', 'rationale', 'priority'],
                },
                description: 'Đúng 3 đề xuất hành động cụ thể để tối ưu kênh dựa trên dữ liệu đã phân tích.',
              },
              dataCaveats: {
                type: Type.STRING,
                description:
                  'Ghi chú ngắn gọn về phạm vi mẫu dữ liệu và các chỉ số còn thiếu/riêng tư (N/A) nếu có.',
              },
            },
            required: ['strengths', 'bestFormatAndTiming', 'recommendations', 'dataCaveats'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        return res.status(502).json({
          error: 'Gemini API không trả về nội dung phân tích.',
        });
      }

      const parsed = JSON.parse(rawText);
      return res.json({ insights: parsed });
    } catch (err: unknown) {
      console.error('Gemini API error:', err);
      const message = err instanceof Error ? err.message : 'Lỗi không xác định khi gọi Gemini API.';
      return res.status(500).json({
        error: `Không thể tạo AI Marketing Insights: ${message}`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
