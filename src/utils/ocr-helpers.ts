/**
 * Pure helper utilities for Photo to Text
 * Decoupled from UI for testing and reliability
 */

export interface TextMetrics {
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
  lineCount: number;
}

export function computeTextMetrics(text: string): TextMetrics {
  if (!text || text.trim() === '') {
    return { wordCount: 0, charCount: 0, readingTimeMinutes: 0, lineCount: 0 };
  }

  const cleanText = text.trim();
  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = text.length;
  const lineCount = text.split(/\r\n|\r|\n/).length;
  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    wordCount,
    charCount,
    readingTimeMinutes,
    lineCount,
  };
}

export function filterHistoryItems<T extends { title: string; text: string; category?: string }>(
  items: T[],
  query: string,
  categoryFilter?: string
): T[] {
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesCategory =
      !categoryFilter || categoryFilter === 'all' || item.category === categoryFilter;
    if (!matchesCategory) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.text.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });
}

export function generateCsvFromText(text: string): string {
  const lines = text.split(/\r\n|\r|\n/).filter((l) => l.trim().length > 0);
  return lines
    .map((line, idx) => {
      // Escape quotes
      const escaped = line.replace(/"/g, '""');
      return `"${idx + 1}","${escaped}"`;
    })
    .join('\n');
}

export function generateDocxBlobContent(title: string, text: string): string {
  // Generates Word-compatible XML document format (.doc / .docx compatible HTML-Word envelope)
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>${title}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; }
h1 { color: #0284c7; font-size: 18pt; margin-bottom: 8pt; }
p { margin-bottom: 6pt; }
.meta { color: #64748b; font-size: 9pt; margin-bottom: 16pt; border-bottom: 1px solid #e2e8f0; padding-bottom: 6pt; }
</style>
</head>
<body>
<h1>${title}</h1>
<div class="meta">Extracted with Photo to Text AI OCR - ${new Date().toLocaleDateString()}</div>
<p>${escapedText}</p>
</body>
</html>`;
}

export function canPerformOcr(tier: 'free' | 'pro' | 'business', currentUsageToday: number): {
  allowed: boolean;
  limit: number;
  remaining: number;
} {
  const limits: Record<'free' | 'pro' | 'business', number> = {
    free: 10,
    pro: 9999,
    business: 99999,
  };

  const limit = limits[tier] || 10;
  const remaining = Math.max(0, limit - currentUsageToday);
  return {
    allowed: remaining > 0 || tier !== 'free',
    limit,
    remaining,
  };
}

export function estimateOcrConfidence(text: string): number {
  if (!text || text.trim().length < 5) return 85.0;
  // Heuristic based on character balance, punctuation and word formations
  const letters = (text.match(/[a-zA-Z0-9\u0600-\u06FF\u4e00-\u9fa5]/g) || []).length;
  const total = text.replace(/\s/g, '').length;
  if (total === 0) return 90.0;
  const ratio = letters / total;
  const score = 92 + Math.min(7.8, ratio * 7);
  return Math.min(99.8, parseFloat(score.toFixed(1)));
}
