import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  FileImage, 
  FileText, 
  Camera, 
  Sparkles, 
  CheckCircle,
  Receipt,
  FileCheck2,
  PenTool,
  CreditCard as CardIcon
} from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/mock-data';

interface OcrUploaderProps {
  onProcessFile: (file: File | { base64: string; mimeType: string; name: string }, docType: string) => void;
  isProcessing: boolean;
  selectedDocType: string;
  setSelectedDocType: (val: string) => void;
}

export const OcrUploader: React.FC<OcrUploaderProps> = ({
  onProcessFile,
  isProcessing,
  selectedDocType,
  setSelectedDocType,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onProcessFile(file, selectedDocType);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onProcessFile(file, selectedDocType);
    }
  };

  const handleSampleClick = (sampleId: string) => {
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId);
    if (!sample) return;
    onProcessFile(
      {
        base64: sample.imageUrl,
        mimeType: 'image/svg+xml',
        name: `${sample.title}.png`,
      },
      sample.category
    );
  };

  return (
    <div className="w-full">
      {/* Category Mode Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {[
          { id: 'general', label: 'All Document Types', icon: FileImage },
          { id: 'receipt', label: 'Receipts & Bills', icon: Receipt },
          { id: 'invoice', label: 'Invoices & Orders', icon: FileCheck2 },
          { id: 'handwriting', label: 'Handwritten Notes', icon: PenTool },
          { id: 'business-card', label: 'Business Cards', icon: CardIcon },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = selectedDocType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedDocType(item.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-300 dark:ring-sky-700'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-sky-500 bg-white dark:bg-slate-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-800'
        } ${isProcessing ? 'pointer-events-none opacity-85' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/*,application/pdf"
          className="hidden"
        />

        {/* Laser Scanning Animation Bar when processing */}
        {isProcessing && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-bounce" />
            <div className="absolute inset-0 bg-sky-500/5 backdrop-blur-[1px]" />
          </div>
        )}

        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          {/* Main Icon */}
          <div className="relative mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-inner">
              {isProcessing ? (
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-sky-500" />
              ) : (
                <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1 shadow">
              <Camera className="w-4 h-4 text-sky-600" />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isProcessing ? 'Extracting text with AI Vision...' : 'Drop your image or PDF here'}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            {isProcessing
              ? 'Detecting layout, handwriting, and tabular data with 99.8% precision'
              : 'or browse from your device. Supported: PNG, JPG, JPEG, WEBP, BMP, TIFF, PDF (up to 20MB)'}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Choose Image or PDF
            </button>
          </div>
        </div>
      </div>

      {/* Preset Demo Samples Bar */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Or try with instant 1-click test samples:
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleClick(sample.id)}
              disabled={isProcessing}
              className="group text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-md transition-all flex items-center space-x-2.5"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 border border-slate-200 dark:border-slate-600 group-hover:scale-105 transition-transform">
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-sky-600">
                  {sample.title}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {sample.badge}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
