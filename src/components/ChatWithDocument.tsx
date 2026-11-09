import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  X, 
  Trash2, 
  CornerDownLeft,
  Lightbulb
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatWithDocumentProps {
  documentText: string;
  documentTitle: string;
  onClose: () => void;
}

export const ChatWithDocument: React.FC<ChatWithDocumentProps> = ({
  documentText,
  documentTitle,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: `Hello! I've analyzed "${documentTitle}". You can ask me to find totals, explain clauses, extract phone numbers, or summarize specific sections. What would you like to know?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history,
          documentContext: documentText,
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: data.reply || 'I analyzed the text and found matching details.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'assistant',
          text: 'Unable to reach the document analysis engine. Please verify the document text.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Chat with Document
            </h3>
            <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
              {documentTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() =>
              setMessages([
                {
                  id: 'init',
                  sender: 'assistant',
                  text: 'Chat history cleared. How can I assist you with this document?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/40 dark:bg-slate-800/20 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <Lightbulb className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
        <span className="font-semibold text-indigo-900 dark:text-indigo-300 flex-shrink-0">Suggestions:</span>
        <button
          onClick={() => handleSend('What is the total amount or main figure?')}
          className="whitespace-nowrap px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50"
        >
          Find total amount
        </button>
        <button
          onClick={() => handleSend('Extract all dates, names, and contact info')}
          className="whitespace-nowrap px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50"
        >
          Extract contacts & dates
        </button>
        <button
          onClick={() => handleSend('Give me an executive 3-bullet summary')}
          className="whitespace-nowrap px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50"
        >
          3-bullet summary
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs ${
                  isUser ? 'bg-sky-600' : 'bg-indigo-600 shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1 text-right ${
                    isUser ? 'text-sky-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
            <span>Analyzing extracted document...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this document..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
