import { SocialPost } from '../types';

export interface ParsedFileResult {
  posts: SocialPost[];
  detectedColumns: string[];
  missingOptionalColumns: string[];
}

function parseNullableNumber(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const str = String(raw).trim();
  if (!str || /^n\/a$/i.test(str) || str === '-' || str === '--') {
    return null;
  }
  const cleaned = str.replace(/[,\s]/g, '');
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function normalizeContentType(raw: unknown): string {
  const value = String(raw ?? '').trim().toLowerCase();
  if (!value) return 'Chưa phân loại';
  if (
    value.includes('short') ||
    value.includes('reel') ||
    value.includes('tiktok') ||
    value.includes('ngắn')
  ) {
    return 'Video ngắn';
  }
  if (value.includes('video') || value.includes('dài') || value.includes('watch')) {
    return 'Video dài';
  }
  if (
    value.includes('carousel') ||
    value.includes('album') ||
    value.includes('photo') ||
    value.includes('image') ||
    value.includes('ảnh')
  ) {
    return 'Hình ảnh / Carousel';
  }
  if (value.includes('text') || value.includes('status') || value.includes('bài viết')) {
    return 'Bài viết';
  }
  return String(raw).trim();
}

function splitCsvRows(text: string): string[][] {
  const cleanText = text.replace(/^\uFEFF/, '').trim();
  if (!cleanText) return [];

  // Detect delimiter from first line outside quotes
  const firstLine = cleanText.split(/\r?\n/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  let delimiter = ',';
  if (tabCount > commaCount && tabCount >= semiCount) delimiter = '\t';
  else if (semiCount > commaCount) delimiter = ';';

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const ch = cleanText[i];
    const nextCh = cleanText[i + 1];

    if (inQuotes) {
      if (ch === '"' && nextCh === '"') {
        currentField += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentField += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (ch === '\r' && nextCh === '\n') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
      } else if (ch === '\n' || ch === '\r') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += ch;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows.filter((r) => r.some((cell) => cell !== ''));
}

const COLUMN_ALIASES: Record<string, string[]> = {
  post_date: [
    'post_date',
    'date',
    'publish time',
    'published_at',
    'created_time',
    'createtimeiso',
    'createtime',
    'timestamp',
    'time',
    'ngay_dang',
    'ngày đăng',
  ],
  content_type: [
    'content_type',
    'post type',
    'type',
    'format',
    'mediatype',
    'producttype',
    'loai_noi_dung',
    'định dạng',
  ],
  caption: [
    'caption',
    'title',
    'description',
    'message',
    'post',
    'text',
    'desc',
    'noi_dung',
    'tiêu đề',
  ],
  likes: [
    'likes',
    'reactions',
    'like_count',
    'likescount',
    'reactionscount',
    'diggcount',
    'luot_thich',
    'lượt thích',
  ],
  comments: [
    'comments',
    'comment_count',
    'commentscount',
    'commentcount',
    'binh_luan',
    'bình luận',
  ],
  shares: [
    'shares',
    'share_count',
    'sharescount',
    'sharecount',
    'chia_se',
    'chia sẻ',
  ],
  views: [
    'views',
    'video views',
    'total views',
    'impressions',
    'reach',
    'playcount',
    'playscount',
    'videoviewcount',
    'viewcount',
    'viewscount',
    'luot_xem',
    'lượt xem',
  ],
  url: ['url', 'permalink', 'link', 'post_url', 'webvideourl', 'posturl'],
};

function findColumnKey(header: string): string | null {
  const normalized = header.trim().toLowerCase();
  for (const [canonical, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.includes(normalized)) {
      return canonical;
    }
  }
  return null;
}

export function parseUploadedSocialData(rawText: string): ParsedFileResult {
  const trimmed = rawText.replace(/^\uFEFF/, '').trim();
  if (!trimmed) {
    throw new Error('Nội dung file hoặc dữ liệu dán vào đang trống.');
  }

  // Try JSON first if starts with [ or {
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(trimmed);
    } catch {
      throw new Error('Định dạng JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp dấu ngoặc và dấu phẩy.');
    }

    const rawArray = Array.isArray(parsedJson)
      ? parsedJson
      : (parsedJson as Record<string, unknown>)?.posts ??
        (parsedJson as Record<string, unknown>)?.data ??
        null;

    if (!Array.isArray(rawArray) || rawArray.length === 0) {
      throw new Error('File JSON phải là một mảng các bài đăng hoặc object có trường "posts".');
    }

    const detectedSet = new Set<string>();
    const posts: SocialPost[] = rawArray.map((item: any, idx: number) => {
      const mapped: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(item ?? {})) {
        const canonical = findColumnKey(k) ?? k;
        mapped[canonical] = v;
        detectedSet.add(canonical);
      }

      const dateVal = String(mapped.post_date ?? '').trim() || new Date().toISOString().slice(0, 10);
      const caption = String(mapped.caption ?? `Bài đăng #${idx + 1}`).trim();

      return {
        id: String(item?.id ?? `json-${idx + 1}`),
        title: caption.length > 72 ? `${caption.slice(0, 72)}...` : caption,
        caption,
        publishedAt: dateVal,
        hasExactTime: dateVal.includes('T') || /\d{2}:\d{2}/.test(dateVal),
        contentType: normalizeContentType(mapped.content_type),
        views: parseNullableNumber(mapped.views),
        likes: parseNullableNumber(mapped.likes),
        comments: parseNullableNumber(mapped.comments),
        shares: parseNullableNumber(mapped.shares),
        url: mapped.url ? String(mapped.url) : undefined,
      };
    });

    const missingOptional = ['views', 'likes', 'comments', 'shares'].filter(
      (col) => !detectedSet.has(col)
    );

    return {
      posts,
      detectedColumns: Array.from(detectedSet),
      missingOptionalColumns: missingOptional,
    };
  }

  // Otherwise parse CSV / TSV
  const rows = splitCsvRows(trimmed);
  if (rows.length < 2) {
    throw new Error(
      'File CSV cần có ít nhất 1 dòng tiêu đề cột (header) và 1 dòng dữ liệu bài đăng.'
    );
  }

  const rawHeaders = rows[0];
  const headerMapping = rawHeaders.map((h) => findColumnKey(h));
  const detectedColumns = headerMapping.filter((h): h is string => h !== null);

  if (!detectedColumns.includes('post_date') && !detectedColumns.includes('caption')) {
    throw new Error(
      'Không nhận diện được các cột chuẩn (post_date, content_type, caption, likes, comments, shares, views). Hãy tải file CSV mẫu để xem định dạng đúng.'
    );
  }

  const posts: SocialPost[] = rows.slice(1).map((row, idx) => {
    const record: Record<string, string> = {};
    headerMapping.forEach((canonical, colIndex) => {
      if (canonical && row[colIndex] !== undefined) {
        record[canonical] = row[colIndex];
      }
    });

    const dateVal = (record.post_date ?? '').trim() || new Date().toISOString().slice(0, 10);
    const caption = (record.caption ?? '').trim() || `Bài đăng #${idx + 1}`;

    return {
      id: `csv-${idx + 1}`,
      title: caption.length > 72 ? `${caption.slice(0, 72)}...` : caption,
      caption,
      publishedAt: dateVal,
      hasExactTime: dateVal.includes('T') || /\d{2}:\d{2}/.test(dateVal),
      contentType: normalizeContentType(record.content_type),
      views: parseNullableNumber(record.views),
      likes: parseNullableNumber(record.likes),
      comments: parseNullableNumber(record.comments),
      shares: parseNullableNumber(record.shares),
      url: record.url ? record.url.trim() : undefined,
    };
  });

  const missingOptionalColumns = ['views', 'likes', 'comments', 'shares'].filter(
    (col) => !detectedColumns.includes(col)
  );

  return {
    posts,
    detectedColumns,
    missingOptionalColumns,
  };
}

export function getSampleCsvContent(): string {
  return [
    'post_date,content_type,caption,likes,comments,shares,views',
    '2026-03-01,Video ngắn,"Teaser ra mắt bộ sưu tập Thu-Đông 2026 (15s)",4820,312,640,98500',
    '2026-03-04,Hình ảnh / Carousel,"5 mẹo phối đồ tối giản cho môi trường Agency",1940,145,280,32400',
    '2026-03-07,Video ngắn,"Behind the scenes buổi chụp Lookbook tại Studio",6150,428,890,142000',
    '2026-03-10,Video dài,"Talkshow: Hành trình xây dựng thương hiệu thời trang bền vững",1320,186,195,28900',
    '2026-03-14,Hình ảnh / Carousel,"Infographic chất liệu vải tái chế và quy trình sản xuất",2180,94,410,36800',
    '2026-03-18,Video ngắn,"Biến hóa 3 outfit chỉ với 1 chiếc áo Blazer",8420,560,1240,196500',
    '2026-03-21,Bài viết,"Thông báo ưu đãi thành viên thân thiết tháng 3",680,62,45,14200',
    '2026-03-25,Video ngắn,"Unboxing hộp quà phiên bản giới hạn 2026",5390,390,715,118400',
  ].join('\n');
}

export function downloadSampleCsv(): void {
  const csv = getSampleCsvContent();
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'social_lens_sample_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function buildStandardCsvContent(posts: SocialPost[]): string {
  const escapeCsv = (val: string) => {
    if (/[",\n\r]/.test(val)) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const header = 'post_date,content_type,caption,likes,comments,shares,views';
  const rows = posts.map((p) =>
    [
      escapeCsv(p.publishedAt),
      escapeCsv(p.contentType),
      escapeCsv(p.caption || p.title),
      p.likes !== null ? String(p.likes) : '',
      p.comments !== null ? String(p.comments) : '',
      p.shares !== null ? String(p.shares) : '',
      p.views !== null ? String(p.views) : '',
    ].join(',')
  );

  return [header, ...rows].join('\n');
}

export function exportDatasetToCsv(
  channelName: string,
  posts: SocialPost[]
): string {
  const csvContent = buildStandardCsvContent(posts);
  const slug = channelName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'channel';

  const filename = `social-lens-${slug}-${new Date().toISOString().slice(0, 10)}.csv`;
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return filename;
}
