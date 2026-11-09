import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight, 
  Tag, 
  X,
  Share2,
  Sparkles
} from 'lucide-react';
import { BLOG_POSTS } from '../data/mock-data';
import { BlogPost } from '../types';

export const BlogView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const filteredPosts = BLOG_POSTS.filter((post) =>
    selectedCategory === 'all' ? true : post.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Blog Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-sky-500" />
          Photo to Text Academy & Blog
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          AI Vision & Document Intelligence
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Explore research, engineering deep dives, and practical tutorials on getting the best accuracy from your document scans.
        </p>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {['all', 'AI', 'Business', 'Scanning', 'OCR'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setActiveArticle(post)}
            className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-sky-500 dark:hover:border-sky-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">{post.author}</span>
              <span className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Article
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold">
                  {activeArticle.category}
                </span>
                <span>•</span>
                <span>{activeArticle.date}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {activeArticle.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4">
                <User className="w-3.5 h-3.5" />
                <span>Written by {activeArticle.author}</span>
              </div>

              <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-3">
                {activeArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
