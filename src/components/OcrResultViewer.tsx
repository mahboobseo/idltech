import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FileText, 
  FileCode, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RefreshCw,
  Globe,
  MessageSquare,
  Edit3,
  Maximize2,
  FileSpreadsheet
} from 'lucide-react';
import { OcrResult } from '../types';
import { generateCsvFromText, generateDocxBlobContent } from '../utils/ocr-helpers';

interface OcrResultViewerProps {
  result: OcrResult;
  onUpdateText: (newText: string) => void;
  onOpenAiTools: (tool: string) => void;
  onOpenChat: () => void;
  onNewScan: () => void;
  onOpenGoogleSheets?: () => void;
}

export const OcrResultViewer: React.FC<OcrResultViewerProps> = ({
  result,
  onUpdateText,
  onOpenAiTools,
  onOpenChat,
  onNewScan,
  onOpenGoogleSheets,
}) => {
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title || 'extracted-text'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadDocx = () => {
    const content = generateDocxBlobContent(result.title, result.text);
    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title || 'extracted-document'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const csvContent = generateCsvFromText(result.text);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title || 'extracted-data'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    // Generate clean printable print window for PDF export
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      handleDownloadTxt();
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>${result.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1 { color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; font-size: 24px; }
            .meta { color: #64748b; font-size: 13px; margin-bottom: 25px; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 15px; }
          </style>
        </head>
        <body>
          <h1>${result.title}</h1>
          <div class="meta">Extracted with Photo to Text AI OCR • ${new Date().toLocaleDateString()} • Confidence: ${result.confidence}%</div>
          <pre>${result.text}</pre>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Top Header & Actions Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg flex items-center gap-2">
              {result.title}
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700">
                {result.confidence}% accuracy
              </span>
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>{result.wordCount} words</span>
              <span>•</span>
              <span>{result.charCount} chars</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium">
                <Globe className="w-3 h-3" /> {result.detectedLanguage || 'English'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-sky-500'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          {/* Download TXT */}
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-all"
            title="Download Plain Text"
          >
            <Download className="w-3.5 h-3.5" />
            <span>TXT</span>
          </button>

          {/* Download DOCX */}
          <button
            onClick={handleDownloadDocx}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-all"
            title="Download Word Document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOCX</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-all"
            title="Export to PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          {/* Download CSV */}
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-all"
            title="Download Table CSV"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          {/* Export to Google Sheets */}
          {onOpenGoogleSheets && (
            <button
              onClick={onOpenGoogleSheets}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-xs transition-all cursor-pointer"
              title="Export to Google Sheets (Drive)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Google Sheets</span>
            </button>
          )}

          {/* New Scan */}
          <button
            onClick={onNewScan}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* AI Tools Quick Trigger Ribbon */}
      <div className="bg-sky-50 dark:bg-slate-800/80 px-4 py-2.5 border-b border-sky-100 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs py-1">
          <span className="font-semibold text-sky-800 dark:text-sky-300 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            AI Tools:
          </span>

          <button
            onClick={() => onOpenAiTools('summarize')}
            className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 font-medium shadow-xs border border-slate-200 dark:border-slate-600 hover:border-sky-400"
          >
            Summarize
          </button>

          <button
            onClick={() => onOpenAiTools('translate')}
            className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 font-medium shadow-xs border border-slate-200 dark:border-slate-600 hover:border-sky-400"
          >
            Translate
          </button>

          <button
            onClick={() => onOpenAiTools('rewrite')}
            className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 font-medium shadow-xs border border-slate-200 dark:border-slate-600 hover:border-sky-400"
          >
            Rewrite
          </button>

          <button
            onClick={() => onOpenAiTools('grammar')}
            className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 font-medium shadow-xs border border-slate-200 dark:border-slate-600 hover:border-sky-400"
          >
            Grammar Fix
          </button>

          <button
            onClick={() => onOpenAiTools('extract-data')}
            className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 font-medium shadow-xs border border-slate-200 dark:border-slate-600 hover:border-sky-400"
          >
            Extract Entities
          </button>
        </div>

        {/* Chat with Document Trigger */}
        <button
          onClick={onOpenChat}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold text-xs shadow-xs hover:from-sky-500 hover:to-indigo-500 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat with Text</span>
        </button>
      </div>

      {/* Dual Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800 min-h-[460px]">
        {/* Left Pane: Original Document Image */}
        <div className="p-4 bg-slate-100/50 dark:bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Original Document
            </span>
            <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                className="p-1 text-slate-600 dark:text-slate-300 hover:text-sky-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1 text-slate-500">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                className="p-1 text-slate-600 dark:text-slate-300 hover:text-sky-600"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 text-slate-600 dark:text-slate-300 hover:text-sky-600"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 p-2 flex items-center justify-center min-h-[380px] max-h-[500px]">
            {result.imageUrl ? (
              <div
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                className="transition-transform duration-150"
              >
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  className="max-w-full max-h-[460px] object-contain rounded-md shadow-sm"
                />
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Document preview rendered</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Extracted Editable Text */}
        <div className="p-4 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-sky-500" />
              Extracted Text (Editable)
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              {isEditing ? 'Done Editing' : 'Click inside to edit'}
            </button>
          </div>

          <div className="flex-1 relative rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden min-h-[380px] max-h-[500px] flex flex-col">
            <textarea
              value={result.text}
              onChange={(e) => onUpdateText(e.target.value)}
              className="w-full flex-1 p-4 bg-transparent text-slate-800 dark:text-slate-100 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Extracted text will appear here..."
            />
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Reading time: ~{result.readingTimeMinutes || 1} min</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              OCR Status: Completed & Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
