import React from 'react';
import { FileText, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs transition-colors mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white shadow-sm">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Photo to Text
              </span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              State-of-the-art AI Optical Character Recognition platform. Extract text from photos, receipts, invoices, books, handwriting, and PDFs with 99.8% precision.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>TLS 1.3 Bank-grade encryption • GDPR & CCPA compliant</span>
            </div>
          </div>

          {/* Tools & OCR Types */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3">
              OCR Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('seo-pages')} className="hover:text-sky-600 text-left">
                  Image to Text
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('seo-pages')} className="hover:text-sky-600 text-left">
                  Receipt OCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('seo-pages')} className="hover:text-sky-600 text-left">
                  Invoice OCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('seo-pages')} className="hover:text-sky-600 text-left">
                  Handwriting OCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('seo-pages')} className="hover:text-sky-600 text-left">
                  Business Card OCR
                </button>
              </li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3">
              AI Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-sky-600 text-left">
                  AI Summarizer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-sky-600 text-left">
                  100+ Language Translator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-sky-600 text-left">
                  Grammar Corrector
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-sky-600 text-left">
                  Chat with Document
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-sky-600 text-left">
                  DOCX & PDF Export
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-600 text-left text-emerald-600 dark:text-emerald-400 font-medium">
                  Google Sheets Export
                </button>
              </li>
            </ul>
          </div>

          {/* Developers & Company */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-sky-600 text-left">
                  Pricing & Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('api')} className="hover:text-sky-600 text-left">
                  Developer REST API
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-sky-600 text-left">
                  Research Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-sky-600 text-left">
                  User Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-sky-600 text-left">
                  Admin Analytics
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Formats banner */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="font-semibold text-slate-500">Supported Formats:</span>
            {['PNG', 'JPG', 'JPEG', 'WEBP', 'PDF', 'TIFF', 'BMP', 'GIF', 'HEIC'].map((f) => (
              <span
                key={f}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono text-[10px]"
              >
                .{f}
              </span>
            ))}
          </div>

          <div className="text-[11px] text-slate-400">
            © 2026 Photo to Text AI Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
