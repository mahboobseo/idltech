import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  X, 
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface PricingModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpgradePlan: (plan: 'free' | 'pro' | 'business') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpgradePlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business'>('pro');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onUpgradePlan(selectedPlan);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 text-center relative bg-gradient-to-b from-sky-50/50 to-transparent dark:from-slate-800/40">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Simple, Transparent Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Supercharge Your Document OCR
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Extract, translate, summarize, and export with zero limits. Cancel anytime.
          </p>

          {/* Billing Switcher */}
          <div className="flex items-center justify-center mt-5">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Yearly</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
                  SAVE 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <div
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                user.plan === 'free'
                  ? 'border-sky-300 dark:border-sky-800 bg-sky-50/30 dark:bg-sky-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase text-slate-500">Free Tier</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">$0</span>
                  <span className="text-xs text-slate-400">/ forever</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Essential OCR for light document scanning.</p>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-500" />
                    <span>10 OCR extractions / day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-500" />
                    <span>Images up to 10MB</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-500" />
                    <span>Download TXT & CSV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-500" />
                    <span>7 Days History Retention</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <span className="block text-center text-xs font-semibold text-slate-400">
                  {user.plan === 'free' ? 'Current Active Plan' : 'Free Included'}
                </span>
              </div>
            </div>

            {/* Pro Tier (Recommended) */}
            <div
              onClick={() => setSelectedPlan('pro')}
              className={`p-6 rounded-2xl border-2 transition-all relative flex flex-col justify-between cursor-pointer ${
                selectedPlan === 'pro'
                  ? 'border-sky-600 bg-sky-50/50 dark:bg-sky-950/40 shadow-xl'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white text-[11px] font-bold shadow-md uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase text-sky-600 dark:text-sky-400">Pro Plan</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {billingCycle === 'monthly' ? '$14.99' : '$11.20'}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Unlimited power for professionals & students.</p>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold">Unlimited OCR extractions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Chat with Extracted Document</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>100+ Language AI Translation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Download Word (.DOCX) & PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Priority GPU Vision Processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>90 Days History Storage</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    selectedPlan === 'pro'
                      ? 'bg-sky-600 hover:bg-sky-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {user.plan === 'pro' ? 'Current Plan' : 'Select Pro'}
                </button>
              </div>
            </div>

            {/* Business Tier */}
            <div
              onClick={() => setSelectedPlan('business')}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                selectedPlan === 'business'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xl'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">
                  Business & API
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {billingCycle === 'monthly' ? '$49.99' : '$39.00'}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Enterprise throughput, API keys & SLAs.</p>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold">Full REST API Access (50k calls)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-500" />
                    <span>Unlimited OCR & AI Chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-500" />
                    <span>Team Multi-Seat (Up to 10 users)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-500" />
                    <span>Custom Webhooks & Web scraping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-500" />
                    <span>Dedicated 99.9% Uptime SLA</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    selectedPlan === 'business'
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {user.plan === 'business' ? 'Current Plan' : 'Select Business'}
                </button>
              </div>
            </div>
          </div>

          {/* Stripe Checkout Form Card */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-sky-600" />
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Instant Payment Checkout (Stripe Powered Simulation)
                </h4>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      MM / YY
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Upgrading to <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{selectedPlan}</span> ({billingCycle})
                </span>
                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Upgrade</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
