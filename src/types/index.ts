export interface OcrResult {
  id: string;
  title: string;
  text: string;
  detectedLanguage: string;
  confidence: number;
  wordCount: number;
  charCount: number;
  lineCount: number;
  readingTimeMinutes: number;
  documentType: string;
  imageUrl?: string;
  createdAt: string;
  keyDetails?: {
    total?: string;
    date?: string;
    invoiceNumber?: string;
    entities?: string[];
    [key: string]: unknown;
  };
}

export interface HistoryItem extends OcrResult {
  isFavorite?: boolean;
  isDeleted?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'free' | 'pro' | 'business';
  creditsRemaining: number;
  creditsTotal: number;
  todayUsage: number;
  apiKey?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'OCR' | 'AI' | 'PDF' | 'Business' | 'Scanning';
  readTime: string;
  date: string;
  author: string;
  content: string;
}

export interface SeoLandingConfig {
  id: string;
  slug: string;
  title: string;
  h1: string;
  metaDesc: string;
  badge: string;
  highlightText: string;
  supportedFormats: string[];
  recommendedPreset: string;
}
