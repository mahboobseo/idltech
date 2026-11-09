import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Search, 
  CheckCircle, 
  AlertTriangle,
  Server,
  BarChart3,
  Layers
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'logs'>('analytics');

  const mockUsers = [
    { id: 'u-1', name: 'Liam Sterling', email: 'liam@vertexmedia.com', plan: 'Business', scans: 4920, status: 'Active' },
    { id: 'u-2', name: 'Sophia Chen', email: 'sophia.c@stanford.edu', plan: 'Pro', scans: 840, status: 'Active' },
    { id: 'u-3', name: 'Marcus Brody', email: 'mbrody@fintech-ops.co', plan: 'Business', scans: 12480, status: 'Active' },
    { id: 'u-4', name: 'Elena Rostova', email: 'elena@novapress.de', plan: 'Pro', scans: 310, status: 'Active' },
    { id: 'u-5', name: 'David Park', email: 'dpark99@gmail.com', plan: 'Free', scans: 10, status: 'Active' },
  ];

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.plan.toLowerCase().includes(userSearch.toLowerCase())
  );

  const mockLogs = [
    { id: 'log-1', time: '14:32:01', action: 'OCR Processing', status: '200 OK', latency: '142ms', ip: '104.28.19.4' },
    { id: 'log-2', time: '14:31:49', action: 'Stripe Webhook', status: '200 OK', latency: '88ms', ip: 'Stripe Inc' },
    { id: 'log-3', time: '14:30:12', action: 'API Token Verified', status: '200 OK', latency: '24ms', ip: '198.51.100.22' },
    { id: 'log-4', time: '14:28:55', action: 'PDF Multi-page OCR', status: '200 OK', latency: '320ms', ip: '172.56.21.9' },
    { id: 'log-5', time: '14:26:40', action: 'Translation to Spanish', status: '200 OK', latency: '110ms', ip: '162.243.1.80' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            SaaS Metrics & Operations
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time platform throughput, user subscriptions, and API latency.
          </p>
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {(['analytics', 'users', 'logs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>DAILY REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">$2,840.00</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">+18.4% from yesterday</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>TOTAL OCR RUNS</span>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">184,920</div>
          <p className="text-xs text-slate-400 mt-1">99.4% success rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>ACTIVE SUBSCRIBERS</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">4,210</div>
          <p className="text-xs text-indigo-600 font-medium mt-1">68% Pro / 32% Business</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>MEDIAN LATENCY</span>
            <Server className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">142 ms</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Zero throttle errors</p>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily OCR Volume Chart Graphic */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-600" />
                OCR Hourly Throughput (Last 24 Hours)
              </h3>
              <span className="text-xs font-semibold text-slate-400">Total: 34,190 requests</span>
            </div>

            {/* Visual Bar Graph */}
            <div className="h-48 flex items-end gap-2 pt-8 border-b border-slate-200 dark:border-slate-800 pb-2">
              {[45, 62, 58, 80, 95, 88, 72, 90, 110, 125, 140, 155, 130, 145, 160, 175, 165, 150, 135, 120, 110, 95, 85, 70].map(
                (val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      style={{ height: `${(val / 180) * 100}%` }}
                      className="w-full rounded-t-sm bg-gradient-to-t from-sky-600 to-blue-400 group-hover:from-sky-500 group-hover:to-indigo-400 transition-all cursor-pointer"
                    />
                    <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                      {val * 12} reqs
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-indigo-600" />
                Document Type Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Receipts & Retail Bills</span>
                    <span className="text-sky-600">34%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="w-[34%] h-full bg-sky-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Invoices & Purchase Orders</span>
                    <span className="text-blue-600">28%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="w-[28%] h-full bg-blue-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Handwritten Notes</span>
                    <span className="text-amber-600">16%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="w-[16%] h-full bg-amber-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Scanned PDF Documents</span>
                    <span className="text-purple-600">14%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="w-[14%] h-full bg-purple-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Business Cards & IDs</span>
                    <span className="text-emerald-600">8%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="w-[8%] h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              Top countries: United States, Germany, United Kingdom, France, Japan.
            </div>
          </div>
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
            <span className="text-xs text-slate-500">Showing {filteredUsers.length} accounts</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{u.name}</h4>
                    <p className="text-slate-400">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{u.scans}</span>
                    <span className="text-slate-400 ml-1">scans</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    u.plan === 'Business' ? 'bg-indigo-100 text-indigo-800' : u.plan === 'Pro' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {u.plan}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 mb-2">
            <span>TIMESTAMP</span>
            <span>ACTION</span>
            <span>STATUS</span>
            <span>LATENCY</span>
            <span>CLIENT IP</span>
          </div>
          <div className="space-y-2">
            {mockLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-1 hover:bg-slate-900 rounded px-1">
                <span className="text-slate-500">{log.time}</span>
                <span className="text-sky-300 font-semibold">{log.action}</span>
                <span className="text-emerald-400">{log.status}</span>
                <span className="text-amber-400">{log.latency}</span>
                <span className="text-slate-400">{log.ip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
