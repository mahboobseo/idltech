import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Layers, 
  HelpCircle,
  FileCheck2,
  Receipt,
  PenTool,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import { SEO_LANDINGS } from '../data/mock-data';
import { SeoLandingConfig } from '../types';

interface SeoLandingPagesProps {
  onLaunchTool: (presetId: string, docType: string) => void;
}

export const SeoLandingPages: React.FC<SeoLandingPagesProps> = ({ onLaunchTool }) => {
  const [selectedLanding, setSelectedLanding] = useState<SeoLandingConfig>(SEO_LANDINGS[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: `How accurate is the ${selectedLanding.title}?`,
      a: `Our engine leverages multimodal AI Vision (Gemini 3.8 Flash), achieving over 99.4% accuracy even on skewed phone snapshots, tilted angles, low lighting, and handwritten notes.`,
    },
    {
      q: 'Which file formats can I upload?',
      a: `You can upload PNG, JPG, JPEG, WEBP, BMP, TIFF, GIF, and multi-page PDF documents up to 20MB.`,
    },
    {
      q: 'Is my uploaded document private and secure?',
      a: `Yes. All documents are processed over encrypted TLS 1.3 connections and are strictly processed on-demand without public exposure.`,
    },
    {
      q: 'Can I export the extracted text to Microsoft Word or Excel?',
      a: `Yes! You can instantly export to Word (.DOCX), plain text (.TXT), Adobe PDF (.PDF), and Excel/Spreadsheet (.CSV) with one click.`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Selector Grid of Long-tail Tools */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Dedicated OCR Utilities
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Specialized AI Text Extractors
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Optimized neural models tuned for specific document layouts, fonts, receipts, and scripts.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {SEO_LANDINGS.map((item) => {
            const isSelected = selectedLanding.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedLanding(item)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/60 shadow-sm ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300'
                }`}
              >
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {item.title}
                </span>
                <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Landing Page Showcase Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-3 inline-block">
            {selectedLanding.badge} Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {selectedLanding.h1}
          </h2>
          <p className="text-sky-100 text-sm sm:text-base leading-relaxed mb-6">
            {selectedLanding.metaDesc}
          </p>

          {/* Formats Supported */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs text-sky-300 font-semibold mr-1">Formats:</span>
            {selectedLanding.supportedFormats.map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-xs font-mono font-bold"
              >
                .{fmt}
              </span>
            ))}
          </div>

          <button
            onClick={() => onLaunchTool(selectedLanding.recommendedPreset, selectedLanding.slug)}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>Open in OCR Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Step Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold text-lg mx-auto mb-3">
            1
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
            Upload or Drag Image
          </h3>
          <p className="text-xs text-slate-500">
            Upload high-resolution scans, photos from your camera roll, or scanned multi-page PDFs.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold text-lg mx-auto mb-3">
            2
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
            AI Vision Extraction
          </h3>
          <p className="text-xs text-slate-500">
            Our neural model analyzes typography, orientation, and grammar in under 200 milliseconds.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold text-lg mx-auto mb-3">
            3
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
            Translate & Export
          </h3>
          <p className="text-xs text-slate-500">
            Download editable DOCX, TXT, PDF, or translate to 100+ languages instantly.
          </p>
        </div>
      </div>

      {/* SEO FAQ Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-sky-600" />
          Frequently Asked Questions
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-800 dark:text-slate-200"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-sky-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
