import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AIMarketingInsights, AnalysisDataset } from '../types';
import {
  formatCompactNumber,
  formatDateVN,
  formatFullNumber,
  formatPercent,
  formatShortTableNumber,
  PRIVATE_NA_LABEL,
} from './analytics';

let cachedRegularFontBase64: string | null = null;
let cachedBoldFontBase64: string | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

async function loadVietnameseFonts(doc: jsPDF): Promise<string> {
  try {
    if (!cachedRegularFontBase64) {
      const regRes = await fetch('/fonts/DejaVuSans.ttf');
      if (!regRes.ok) throw new Error('Font regular not found');
      cachedRegularFontBase64 = arrayBufferToBase64(await regRes.arrayBuffer());
    }
    if (!cachedBoldFontBase64) {
      const boldRes = await fetch('/fonts/DejaVuSans-Bold.ttf');
      if (!boldRes.ok) throw new Error('Font bold not found');
      cachedBoldFontBase64 = arrayBufferToBase64(await boldRes.arrayBuffer());
    }

    doc.addFileToVFS('DejaVuSans.ttf', cachedRegularFontBase64);
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');

    doc.addFileToVFS('DejaVuSans-Bold.ttf', cachedBoldFontBase64);
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold');

    doc.setFont('DejaVuSans', 'normal');
    return 'DejaVuSans';
  } catch (err) {
    console.warn('Could not load DejaVuSans TTF font, falling back to helvetica:', err);
    doc.setFont('helvetica', 'normal');
    return 'helvetica';
  }
}

function sanitizeFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export async function exportAnalysisSummaryToPdf(
  dataset: AnalysisDataset,
  insights: AIMarketingInsights | null
): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const fontFamily = await loadVietnameseFonts(doc);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const { profile, posts, kpis, formatBreakdown } = dataset;

  const ensurePageSpace = (neededHeight: number, currentY: number): number => {
    if (currentY + neededHeight > pageHeight - 18) {
      doc.addPage();
      return 18;
    }
    return currentY;
  };

  // Top Header Strip
  doc.setFillColor(37, 99, 235); // #2563EB
  doc.rect(0, 0, pageWidth, 3, 'F');

  let y = 14;

  // Report Header
  doc.setFont(fontFamily, 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text('Social Lens — Báo cáo Phân tích Kênh', margin, y);

  doc.setFont(fontFamily, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const exportDateStr = new Date().toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Xuất lúc: ${exportDateStr}`, pageWidth - margin, y, { align: 'right' });

  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // Channel Profile Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 27, 2, 2, 'FD');

  doc.setFont(fontFamily, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(profile.name, margin + 4, y + 7);

  // Source Badge Text on right of box
  doc.setFont(fontFamily, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(37, 99, 235);
  doc.text(profile.sourceLabel, pageWidth - margin - 4, y + 7, { align: 'right' });

  doc.setFont(fontFamily, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const metaParts = [
    profile.handle,
    `Nền tảng: ${profile.platform}`,
    profile.samplePeriodLabel,
    profile.totalChannelViews !== null
      ? `Tổng view kênh: ${formatCompactNumber(profile.totalChannelViews)}`
      : null,
  ].filter(Boolean);
  doc.text(metaParts.join('  ·  '), margin + 4, y + 13.5);

  const noteLines = doc.splitTextToSize(profile.verificationNote, contentWidth - 8);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(noteLines.slice(0, 2), margin + 4, y + 19.5);

  y += 33;

  // Section 1: 4 KPI Summary Cards
  doc.setFont(fontFamily, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Chỉ số hiệu suất tổng quan (KPIs)', margin, y);
  y += 4;

  const kpiGap = 3;
  const kpiWidth = (contentWidth - kpiGap * 3) / 4;
  const kpiHeight = 22;

  const kpiItems = [
    {
      label: 'Tổng theo dõi',
      value: kpis.followers !== null ? formatCompactNumber(kpis.followers) : 'N/A (Riêng tư)',
      sub:
        kpis.followers !== null
          ? `${formatFullNumber(kpis.followers)} subs`
          : 'Không công khai',
      color: [15, 23, 42] as [number, number, number],
    },
    {
      label: 'Tỷ lệ tương tác TB',
      value: kpis.engagementRate !== null ? formatPercent(kpis.engagementRate, 2) : 'N/A',
      sub:
        kpis.engagementRateType === 'by_views'
          ? 'Theo Views mẫu'
          : kpis.engagementRateType === 'by_followers'
          ? 'Theo Followers'
          : 'Thiếu dữ liệu',
      color: [37, 99, 235] as [number, number, number],
    },
    {
      label: 'Tần suất đăng bài',
      value: kpis.postsPerWeek !== null ? `${kpis.postsPerWeek} bài/tuần` : PRIVATE_NA_LABEL,
      sub: `${posts.length} bài · ${kpis.dateSpanDays} ngày`,
      color: [15, 23, 42] as [number, number, number],
    },
    {
      label: 'Tổng tương tác mẫu',
      value: formatCompactNumber(kpis.totalInteractionsInSample),
      sub: `${formatCompactNumber(kpis.totalLikesInSample)} Like · ${formatCompactNumber(
        kpis.totalCommentsInSample
      )} Cmt`,
      color: [13, 148, 136] as [number, number, number],
    },
  ];

  kpiItems.forEach((item, index) => {
    const x = margin + index * (kpiWidth + kpiGap);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, kpiWidth, kpiHeight, 1.5, 1.5, 'FD');

    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, x + 3, y + 5.5);

    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...item.color);
    doc.text(item.value, x + 3, y + 12.5);

    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(item.sub, x + 3, y + 18.5);
  });

  y += kpiHeight + 4;
  doc.setFont(fontFamily, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Công thức ER: ${kpis.engagementRateFormula}`, margin, y);
  y += 7;

  // Section 2: Content Format Breakdown Table
  y = ensurePageSpace(35, y);
  doc.setFont(fontFamily, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Phân bổ định dạng nội dung', margin, y);
  y += 2.5;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    styles: {
      font: fontFamily,
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [51, 65, 85],
      fontStyle: 'bold',
    },
    head: [['Định dạng', 'Số bài', 'Tỷ trọng', 'Tổng Views', 'Tổng tương tác', 'ER TB']],
    body: formatBreakdown.map((item) => [
      item.format,
      String(item.count),
      `${item.percentage}%`,
      item.totalViews !== null ? formatFullNumber(item.totalViews) : 'N/A (Riêng tư)',
      formatFullNumber(item.totalInteractions),
      formatPercent(item.avgEngagementRate, 2),
    ]),
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
    },
  });

  y = ((doc as any).lastAutoTable?.finalY ?? y + 20) + 8;

  // Section 3: Top Performing Content Table
  y = ensurePageSpace(45, y);
  doc.setFont(fontFamily, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Top nội dung hiệu quả nhất (Sắp xếp theo tổng tương tác)', margin, y);
  y += 2.5;

  const sortedPosts = [...posts].sort(
    (a, b) => b.totalInteractions - a.totalInteractions
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    styles: {
      font: fontFamily,
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [51, 65, 85],
      fontStyle: 'bold',
    },
    head: [
      ['#', 'Tiêu đề / Caption', 'Định dạng', 'Ngày', 'Views', 'Likes', 'Cmt', 'Share', 'ER %', 'Hạng'],
    ],
    body: sortedPosts.slice(0, 20).map((post, idx) => [
      String(idx + 1),
      post.title.length > 56 ? `${post.title.slice(0, 53)}...` : post.title,
      post.contentType,
      formatDateVN(post.publishedAt),
      formatShortTableNumber(post.views),
      formatShortTableNumber(post.likes),
      formatShortTableNumber(post.comments),
      post.shares !== null ? formatShortTableNumber(post.shares) : 'N/A',
      formatPercent(post.engagementRate, 2),
      post.performanceTier,
    ]),
    columnStyles: {
      0: { cellWidth: 7, halign: 'center' },
      1: { cellWidth: 50 },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'center' },
    },
  });

  y = ((doc as any).lastAutoTable?.finalY ?? y + 30) + 8;

  // Section 4: AI Marketing Insights
  y = ensurePageSpace(45, y);
  doc.setFont(fontFamily, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Nhận định chiến lược (AI Marketing Insights)', margin, y);
  y += 5;

  if (!insights) {
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Chưa có dữ liệu AI Marketing Insights tại thời điểm xuất PDF.',
      margin,
      y
    );
  } else {
    // Strengths
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(13, 148, 136);
    doc.text('Điểm mạnh nổi bật:', margin, y);
    y += 4.5;

    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    for (const s of insights.strengths) {
      const lines = doc.splitTextToSize(`• ${s}`, contentWidth - 4);
      y = ensurePageSpace(lines.length * 4 + 2, y);
      doc.text(lines, margin + 2, y);
      y += lines.length * 4 + 1.5;
    }

    y += 2;
    // Best Format & Timing
    y = ensurePageSpace(20, y);
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    doc.text('Định dạng & Thời điểm hiệu quả nhất:', margin, y);
    y += 4.5;

    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const summaryLines = doc.splitTextToSize(
      insights.bestFormatAndTiming.summary,
      contentWidth - 4
    );
    y = ensurePageSpace(summaryLines.length * 4 + 2, y);
    doc.text(summaryLines, margin + 2, y);
    y += summaryLines.length * 4 + 1.5;

    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const evidenceLines = doc.splitTextToSize(
      `Dẫn chứng: ${insights.bestFormatAndTiming.evidence}`,
      contentWidth - 4
    );
    y = ensurePageSpace(evidenceLines.length * 3.8 + 2, y);
    doc.text(evidenceLines, margin + 2, y);
    y += evidenceLines.length * 3.8 + 3;

    // 3 Recommendations
    y = ensurePageSpace(20, y);
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('Đề xuất hành động tối ưu kênh:', margin, y);
    y += 4.5;

    insights.recommendations.forEach((rec, idx) => {
      const titleText = `${idx + 1}. ${rec.title} (Ưu tiên: ${rec.priority})`;
      const titleLines = doc.splitTextToSize(titleText, contentWidth - 4);
      const ratLines = doc.splitTextToSize(rec.rationale, contentWidth - 6);
      y = ensurePageSpace((titleLines.length + ratLines.length) * 4 + 4, y);

      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(titleLines, margin + 2, y);
      y += titleLines.length * 4;

      doc.setFont(fontFamily, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(ratLines, margin + 4, y);
      y += ratLines.length * 3.8 + 2.5;
    });

    if (insights.dataCaveats) {
      const cavLines = doc.splitTextToSize(
        `Lưu ý dữ liệu: ${insights.dataCaveats}`,
        contentWidth
      );
      y = ensurePageSpace(cavLines.length * 3.8 + 4, y);
      doc.setFont(fontFamily, 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(cavLines, margin, y + 2);
    }
  }

  // Page numbers footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Social Lens — Brand Social Media Analyzer · Báo cáo dữ liệu kiểm chứng',
      margin,
      pageHeight - 7
    );
    doc.text(`Trang ${p} / ${totalPages}`, pageWidth - margin, pageHeight - 7, {
      align: 'right',
    });
  }

  const dateSlug = new Date().toISOString().slice(0, 10);
  const nameSlug = sanitizeFilename(profile.name) || 'report';
  const filename = `social-lens-${nameSlug}-${dateSlug}.pdf`;
  doc.save(filename);
  return filename;
}
