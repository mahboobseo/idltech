/**
 * Photo to Text - AI-Powered Image & PDF Text Extractor
 * SaaS Frontend Entry
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Eye, 
  Layers, 
  FileCheck2,
  Receipt,
  PenTool,
  CreditCard as CardIcon,
  HelpCircle,
  Clock,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { HistoryItem, OcrResult, UserProfile } from './types';
import { INITIAL_HISTORY, SAMPLE_DOCUMENTS } from './data/mock-data';
import { computeTextMetrics, estimateOcrConfidence, canPerformOcr } from './utils/ocr-helpers';

import { Navbar } from './components/Navbar';
import { OcrUploader } from './components/OcrUploader';
import { OcrResultViewer } from './components/OcrResultViewer';
import { AiToolsPanel } from './components/AiToolsPanel';
import { ChatWithDocument } from './components/ChatWithDocument';
import { DashboardView } from './components/DashboardView';
import { PricingModal } from './components/PricingModal';
import { ApiPortal } from './components/ApiPortal';
import { AdminPanel } from './components/AdminPanel';
import { BlogView } from './components/BlogView';
import { SeoLandingPages } from './components/SeoLandingPages';
import { AuthModal } from './components/AuthModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('general');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User state
  const [user, setUser] = useState<UserProfile>({
    id: 'usr_default',
    name: 'Alex Vance',
    email: 'alex.vance@company.com',
    avatarUrl: '',
    plan: 'free',
    creditsRemaining: 10,
    creditsTotal: 10,
    todayUsage: 0,
    apiKey: 'pt_live_99482b810d29481aa019',
    createdAt: '2026-11-09T08:00:00Z',
  });

  // History & active result
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY);
  const [currentResult, setCurrentResult] = useState<OcrResult | null>(INITIAL_HISTORY[0]);

  // Modals state
  const [activeAiTool, setActiveAiTool] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Process image or PDF upload
  const handleProcessFile = async (
    fileInput: File | { base64: string; mimeType: string; name: string },
    docType: string
  ) => {
    // Check limits
    const check = canPerformOcr(user.plan, user.todayUsage);
    if (!check.allowed) {
      showToast('Daily free limit reached (10/10). Upgrade to Pro for unlimited OCR!');
      setIsPricingOpen(true);
      return;
    }

    setIsProcessing(true);

    try {
      let base64 = '';
      let mimeType = 'image/jpeg';
      let fileName = 'Uploaded Document';

      if ('base64' in fileInput) {
        base64 = fileInput.base64;
        mimeType = fileInput.mimeType;
        fileName = fileInput.name;
      } else {
        fileName = fileInput.name;
        mimeType = fileInput.type || 'image/jpeg';
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileInput);
        });
      }

      // Call server endpoint
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          options: { documentType: docType },
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const extractedText = data.text || '';
      const metrics = computeTextMetrics(extractedText);
      const confidence = data.confidence || estimateOcrConfidence(extractedText);

      const newResult: OcrResult = {
        id: 'ocr_' + Date.now(),
        title: fileName.replace(/\.[^/.]+$/, ''),
        text: extractedText,
        detectedLanguage: data.detectedLanguage || 'English',
        confidence,
        wordCount: metrics.wordCount,
        charCount: metrics.charCount,
        lineCount: metrics.lineCount,
        readingTimeMinutes: metrics.readingTimeMinutes,
        documentType: docType,
        imageUrl: base64,
        createdAt: new Date().toISOString(),
        keyDetails: data.keyDetails,
      };

      setCurrentResult(newResult);
      setHistory((prev) => [newResult, ...prev]);

      // Deduct credit
      setUser((prev) => ({
        ...prev,
        todayUsage: prev.todayUsage + 1,
        creditsRemaining: prev.plan === 'free' ? Math.max(0, prev.creditsRemaining - 1) : prev.creditsRemaining,
      }));

      showToast(`Text extracted successfully (${metrics.wordCount} words)`);
    } catch (err: unknown) {
      console.error('OCR Processing error:', err);
      showToast('OCR extraction failed. Please try another image or preset.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Update text in result
  const handleUpdateText = (newText: string) => {
    if (!currentResult) return;
    const metrics = computeTextMetrics(newText);
    const updated: OcrResult = {
      ...currentResult,
      text: newText,
      wordCount: metrics.wordCount,
      charCount: metrics.charCount,
      lineCount: metrics.lineCount,
      readingTimeMinutes: metrics.readingTimeMinutes,
    };
    setCurrentResult(updated);
    setHistory((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  // Launch from SEO landing page
  const handleLaunchSeoTool = (presetId: string, docType: string) => {
    setCurrentTab('home');
    setSelectedDocType(docType);
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === presetId) || SAMPLE_DOCUMENTS[0];
    handleProcessFile(
      {
        base64: sample.imageUrl,
        mimeType: 'image/svg+xml',
        name: sample.title,
      },
      docType
    );
  };

  // Plan Upgrade
  const handleUpgradePlan = (plan: 'free' | 'pro' | 'business') => {
    setUser((prev) => ({
      ...prev,
      plan,
      creditsRemaining: plan === 'free' ? 10 : 9999,
      creditsTotal: plan === 'free' ? 10 : 9999,
    }));
    showToast(`Upgraded to ${plan.toUpperCase()}! Unlimited OCR activated.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-sky-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
      />

      {/* Main App Content Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Next-Gen AI Vision OCR & Document Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                Extract Text From Images Instantly
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Upload any photo, receipt, invoice, handwritten note, or scanned PDF and convert it into clean, editable text with 99.8% AI accuracy.
              </p>
            </div>

            {/* OCR Uploader Area */}
            <div className="max-w-4xl mx-auto">
              <OcrUploader
                onProcessFile={handleProcessFile}
                isProcessing={isProcessing}
                selectedDocType={selectedDocType}
                setSelectedDocType={setSelectedDocType}
              />
            </div>

            {/* OCR Result Dual Pane Studio */}
            {currentResult && (
              <div className="pt-4">
                <OcrResultViewer
                  result={currentResult}
                  onUpdateText={handleUpdateText}
                  onOpenAiTools={(tool) => setActiveAiTool(tool)}
                  onOpenChat={() => setIsChatOpen(true)}
                  onNewScan={() => setCurrentResult(null)}
                  onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
                />
              </div>
            )}

            {/* Feature Highlights Grid */}
            <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Engineered for Every Document Type
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  From crumpled restaurant receipts to legal contracts and cursive cursive handwriting.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center mb-3">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Receipts & Invoices</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Extracts totals, taxes, vendor details, and itemized lists into clean CSV and TXT.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-sky-600 mt-3 inline-block">Table Detection →</span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-3">
                      <PenTool className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Handwriting & Notes</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Translates complex cursive, whiteboard scribbles, and class notes into readable prose.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 mt-3 inline-block">Cursive Neural OCR →</span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mb-3">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">100+ Languages</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Recognizes Arabic, Japanese, Chinese, Hindi, Urdu, Spanish, French, and Latin scripts.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 mt-3 inline-block">Polyglot Engine →</span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-3">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">DOCX & PDF Export</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Export directly into Microsoft Word (.docx), Adobe Acrobat (.pdf), or spreadsheets.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-3 inline-block">Office Compatible →</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'seo-pages' && (
          <SeoLandingPages onLaunchTool={handleLaunchSeoTool} />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            history={history}
            user={user}
            onSelectHistoryItem={(item) => {
              setCurrentResult(item);
              setCurrentTab('home');
            }}
            onDeleteItem={(id) => {
              setHistory((prev) => prev.filter((h) => h.id !== id));
              showToast('Item deleted from history');
            }}
            onOpenPricing={() => setIsPricingOpen(true)}
            onOpenApi={() => setCurrentTab('api')}
          />
        )}

        {currentTab === 'pricing' && (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <PricingModal
              user={user}
              isOpen={true}
              onClose={() => setCurrentTab('home')}
              onUpgradePlan={handleUpgradePlan}
            />
          </div>
        )}

        {currentTab === 'api' && (
          <ApiPortal
            user={user}
            onUpdateApiKey={(newKey) => {
              setUser((prev) => ({ ...prev, apiKey: newKey }));
              showToast('New API Key rolled successfully');
            }}
          />
        )}

        {currentTab === 'blog' && <BlogView />}

        {currentTab === 'admin' && <AdminPanel />}
      </main>

      {/* Global AI Tools Modal */}
      {activeAiTool && currentResult && (
        <AiToolsPanel
          text={currentResult.text}
          initialTool={activeAiTool}
          onClose={() => setActiveAiTool(null)}
          onApplyText={handleUpdateText}
        />
      )}

      {/* Global Chat with Document Drawer */}
      {isChatOpen && currentResult && (
        <ChatWithDocument
          documentText={currentResult.text}
          documentTitle={currentResult.title}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* Pricing Modal (Triggered from anywhere) */}
      <PricingModal
        user={user}
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onUpgradePlan={handleUpgradePlan}
      />

      {/* Auth & Profile Modal */}
      <AuthModal
        user={user}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onUpdateUser={(updated) => {
          setUser((prev) => ({ ...prev, ...updated }));
          showToast('Profile updated');
        }}
      />

      {/* Google Sheets Workspace Integration Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
        rawText={currentResult?.text || ''}
        documentTitle={currentResult?.title || 'OCR Document'}
        onImportToEditor={(importedText, title) => {
          handleUpdateText(importedText);
          showToast(`Imported ${title} to OCR Studio`);
        }}
      />

      {/* Site Footer */}
      <Footer onNavigate={(tab) => setCurrentTab(tab)} />
    </div>
  );
}
