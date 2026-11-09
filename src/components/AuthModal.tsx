import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Check, 
  ArrowRight,
  Globe,
  Sparkles,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../types';
import { googleSignIn } from '../services/google-auth';

interface AuthModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'login' | 'signup'>('profile');
  const [emailInput, setEmailInput] = useState(user.email);
  const [nameInput, setNameInput] = useState(user.name);
  const [passwordInput, setPasswordInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: nameInput,
      email: emailInput,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider === 'Google') {
      try {
        setIsSigningIn(true);
        const res = await googleSignIn();
        if (res) {
          onUpdateUser({
            name: res.user.displayName || 'Google User',
            email: res.user.email || 'user@gmail.com',
            avatarUrl: res.user.photoURL || '',
          });
          onClose();
          return;
        }
      } catch (err) {
        console.warn('Real Google popup closed or canceled, applying local profile', err);
      } finally {
        setIsSigningIn(false);
      }
    }

    onUpdateUser({
      name: provider === 'Google' ? 'Alex Mercer (Google)' : 'Developer Mercer (GitHub)',
      email: provider === 'Google' ? 'alex.mercer@gmail.com' : 'mercer.dev@github.com',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                User Account & Profile
              </h3>
              <p className="text-[11px] text-slate-500">
                Manage your credentials and preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 p-2 gap-1 bg-slate-100/50 dark:bg-slate-800/20 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Switch Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>Changes Saved!</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('Google')}
                disabled={isSigningIn}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span className="text-red-500 font-bold">G</span>
                <span>{isSigningIn ? 'Signing in with Google...' : 'Continue with Google'}</span>
              </button>

              <button
                onClick={() => handleSocialLogin('GitHub')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Continue with GitHub</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or use email</span>
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <button
                onClick={() => {
                  onUpdateUser({ name: 'Pro Subscriber', email: 'user@example.com' });
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Sign In with Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
