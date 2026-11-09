import React, { useState } from 'react';
import { 
  Terminal, 
  Key, 
  Copy, 
  Check, 
  Play, 
  Code2, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { UserProfile } from '../types';

interface ApiPortalProps {
  user: UserProfile;
  onUpdateApiKey: (newKey: string) => void;
}

export const ApiPortal: React.FC<ApiPortalProps> = ({ user, onUpdateApiKey }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);

  const currentApiKey = user.apiKey || 'pt_live_99482b810d29481aa019';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(currentApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = 'pt_live_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
    onUpdateApiKey(newKey);
  };

  const codeSnippets = {
    curl: `curl -X POST https://yourdomain.com/api/v1/ocr \\
  -H "Authorization: Bearer ${currentApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "documentType": "receipt"
  }'`,
    js: `const response = await fetch("https://yourdomain.com/api/v1/ocr", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${currentApiKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    image: base64ImageString,
    documentType: "invoice"
  })
});

const data = await response.json();
console.log(data.text);`,
    python: `import requests

url = "https://yourdomain.com/api/v1/ocr"
headers = {
    "Authorization": "Bearer ${currentApiKey}",
    "Content-Type": "application/json"
}
payload = {
    "image": base64_image_string,
    "documentType": "general"
}

response = requests.post(url, json=payload, headers=headers)
result = response.json()
print("Extracted text:", result.get("text"))`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleTestApi = async () => {
    setIsTesting(true);
    try {
      const res = await fetch('/api/v1/ocr', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: 'data:image/jpeg;base64,sample-test-image-data',
          documentType: 'receipt',
        }),
      });
      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch {
      setTestResponse(JSON.stringify({ error: 'Network error or endpoint unreachable' }, null, 2));
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Terminal className="w-4 h-4" />
          <span>Developer Ecosystem</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Photo to Text REST API
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-2xl">
          Integrate high-speed, sub-200ms AI Vision OCR into your backend, mobile applications, or automation pipelines with our developer-friendly endpoints.
        </p>
      </div>

      {/* API Key Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Your Secret API Key
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pass this key as a Bearer token in the <code className="font-mono text-sky-600">Authorization</code> header. Keep it secret!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-200 select-all">
              {currentApiKey}
            </div>
            <button
              onClick={handleCopyKey}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-500 text-slate-600 dark:text-slate-300 shadow-xs"
              title="Copy API Key"
            >
              {apiKeyCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRegenerateKey}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-500 text-slate-600 dark:text-slate-300 shadow-xs"
              title="Roll / Regenerate Key"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Code Snippets & Interactive Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Code Snippets */}
        <div className="rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
          <div>
            {/* Snippet Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-2">
                {(['curl', 'js', 'python'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveCodeTab(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeCodeTab === lang
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {lang === 'js' ? 'Node / JS' : lang}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
              >
                {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{codeCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 font-mono text-xs leading-relaxed text-sky-200 overflow-x-auto">
              <pre>{codeSnippets[activeCodeTab]}</pre>
            </div>
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Rate limit: 120 req/min</span>
            <span className="text-emerald-400">Status: Operational (99.98%)</span>
          </div>
        </div>

        {/* Right: Interactive API Tester */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Live API Playground
                </h3>
                <p className="text-xs text-slate-500">
                  Send a live request to <code className="font-mono text-sky-600">POST /api/v1/ocr</code>
                </p>
              </div>

              <button
                onClick={handleTestApi}
                disabled={isTesting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isTesting ? 'Sending...' : 'Test Request'}</span>
              </button>
            </div>

            {/* Response Viewer */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-auto max-h-[280px]">
              {testResponse ? (
                <pre>{testResponse}</pre>
              ) : (
                <div className="text-slate-500 text-center py-10 font-sans">
                  Click <span className="text-sky-400 font-semibold">Test Request</span> to simulate an instant OCR API call.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>HTTP Protocol: TLS 1.3</span>
            <span>Response Format: application/json</span>
          </div>
        </div>
      </div>
    </div>
  );
};
