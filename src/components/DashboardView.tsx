import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  HardDrive, 
  Zap, 
  CreditCard,
  Key,
  Settings,
  Filter,
  Eye,
  RotateCcw
} from 'lucide-react';
import { HistoryItem, UserProfile } from '../types';
import { filterHistoryItems, generateDocxBlobContent } from '../utils/ocr-helpers';

interface DashboardViewProps {
  history: HistoryItem[];
  user: UserProfile;
  onSelectHistoryItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onOpenPricing: () => void;
  onOpenApi: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  user,
  onSelectHistoryItem,
  onDeleteItem,
  onOpenPricing,
  onOpenApi,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMenuTab, setActiveMenuTab] = useState<'overview' | 'history' | 'settings'>('overview');

  const filteredItems = filterHistoryItems(
    history.filter((h) => !h.isDeleted),
    searchQuery,
    selectedCategory
  );

  const handleDownloadTxt = (item: HistoryItem) => {
    const blob = new Blob([item.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadDocx = (item: HistoryItem) => {
    const content = generateDocxBlobContent(item.title, item.text);
    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & User Profile */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-bold uppercase shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-white/20 border border-white/30 text-sky-100">
                  {user.plan} tier
                </span>
              </div>
              <p className="text-sky-100 text-sm mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPricing}
              className="px-4 py-2 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{user.plan === 'free' ? 'Upgrade to Pro' : 'Manage Subscription'}</span>
            </button>
            <button
              onClick={onOpenApi}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>API Keys</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>DAILY CREDITS</span>
            <Zap className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {user.plan === 'pro' || user.plan === 'business' ? 'Unlimited' : `${user.creditsRemaining} / 10`}
          </div>
          <p className="text-xs text-slate-400 mt-1">Resets nightly at 00:00 UTC</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>TOTAL SCANNED</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {history.length + 14} Docs
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">99.6% AI accuracy average</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>STORAGE USED</span>
            <HardDrive className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            14.2 MB
          </div>
          <p className="text-xs text-slate-400 mt-1">of 500 MB Free Cloud storage</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>ACTIVE PLAN</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 capitalize">
            {user.plan}
          </div>
          <p className="text-xs text-slate-400 mt-1">Next invoice: Dec 01, 2026</p>
        </div>
      </div>

      {/* Main OCR History Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Toolbar & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              OCR History & Documents
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              {filteredItems.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoices, receipts..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-1 text-xs">
              {['all', 'receipt', 'invoice', 'handwriting'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items List / Table */}
        {filteredItems.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Left Thumbnail & Info */}
                <div className="flex items-start sm:items-center space-x-3.5 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold uppercase">
                        {item.confidence}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.text.slice(0, 100)}...
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{item.wordCount} words</span>
                      <span>•</span>
                      <span className="capitalize">{item.documentType}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onSelectHistoryItem(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100"
                    title="Open in OCR Studio"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>
                  <button
                    onClick={() => handleDownloadTxt(item)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    title="Download TXT"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownloadDocx(item)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Download DOCX"
                  >
                    DOCX
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <History className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-medium">No matching OCR scans found</p>
            <p className="text-xs mt-1">Upload an image or clear your search filter</p>
          </div>
        )}
      </div>
    </div>
  );
};
