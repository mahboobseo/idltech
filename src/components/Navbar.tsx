import React from 'react';
import { 
  FileText, 
  Sparkles, 
  CreditCard, 
  Terminal, 
  BookOpen, 
  Layers, 
  User, 
  Sun, 
  Moon, 
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  onOpenGoogleSheets?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  darkMode,
  setDarkMode,
  onOpenAuth,
  onOpenPricing,
  onOpenGoogleSheets,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Photo to Text
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                AI Vision
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'home'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              OCR Studio
            </button>

            <button
              onClick={() => setCurrentTab('seo-pages')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'seo-pages'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              OCR Tools
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Dashboard
            </button>

            {onOpenGoogleSheets && (
              <button
                onClick={onOpenGoogleSheets}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Google Sheets
              </button>
            )}

            <button
              onClick={() => setCurrentTab('pricing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'pricing'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Pricing
            </button>

            <button
              onClick={() => setCurrentTab('api')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'api'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4" />
              API
            </button>

            <button
              onClick={() => setCurrentTab('blog')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'blog'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Plan Badge / Upgrade button */}
            <button
              onClick={onOpenPricing}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                user.plan === 'pro' || user.plan === 'business'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700'
                  : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800'
              }`}
            >
              {user.plan === 'pro' || user.plan === 'business' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="uppercase">{user.plan}</span> PLAN
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>Free Tier ({user.creditsRemaining}/10)</span>
                </>
              )}
            </button>

            {/* User Profile / Login */}
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 bg-white dark:bg-slate-800 transition-all text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
