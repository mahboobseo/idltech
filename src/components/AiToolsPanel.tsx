import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe, 
  FileText, 
  Check, 
  Copy, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  HelpCircle,
  Hash,
  X
} from 'lucide-react';
import { POPULAR_LANGUAGES } from '../data/mock-data';

interface AiToolsPanelProps {
  text: string;
  initialTool?: string;
  onClose: () => void;
  onApplyText: (newText: string) => void;
}

export const AiToolsPanel: React.FC<AiToolsPanelProps> = ({
  text,
  initialTool = 'summarize',
  onClose,
  onApplyText,
}) => {
  const [activeTool, setActiveTool] = useState(initialTool);
  const [targetLanguage, setTargetLanguage] = useState('Spanish (Español)');
  const [tone, setTone] = useState('professional');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAiAction = async (toolToRun = activeTool) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: toolToRun,
          text,
          targetLanguage,
          tone,
        }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data.result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Action failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                AI Document Assistant
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transform, summarize, translate, and enhance your extracted text
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Selectors */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto p-2 gap-1.5 bg-slate-100/50 dark:bg-slate-800/30">
          {[
            { id: 'summarize', label: 'Summarize', icon: FileText },
            { id: 'translate', label: 'Translate', icon: Globe },
            { id: 'rewrite', label: 'Rewrite', icon: Sliders },
            { id: 'grammar', label: 'Fix Grammar', icon: Check },
            { id: 'explain', label: 'Explain', icon: HelpCircle },
            { id: 'extract-data', label: 'Extract Entities', icon: Hash },
          ].map((item) => {
            const Icon = item.icon;
            const isSel = activeTool === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTool(item.id);
                  setResult('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Configuration Options */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {activeTool === 'translate' && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Target Language:</span>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-1 focus:ring-sky-500"
              >
                {POPULAR_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTool === 'rewrite' && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Tone & Style:</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-1 focus:ring-sky-500"
              >
                <option value="professional">Professional / Executive</option>
                <option value="concise">Ultra Concise</option>
                <option value="academic">Academic & Formal</option>
                <option value="casual">Friendly & Casual</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handleRunAiAction()}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run {activeTool.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs">
              {error}
            </div>
          )}

          {result ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  AI Output Result
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyResult}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 hover:border-sky-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onApplyText(result);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Apply to Editor</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 text-sm font-sans leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
              <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40 text-sky-500" />
              <p className="text-sm font-medium">
                Click <span className="font-bold text-sky-600">Run {activeTool}</span> to process the text with Gemini AI.
              </p>
              <p className="text-xs mt-1">Preserves dates, numbers, line breaks, and semantic context.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
