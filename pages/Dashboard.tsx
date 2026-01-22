
import React, { useState } from 'react';
import { SellerProfile, AnalyticsData, Ad } from '../types';
import { 
  TrendingUp, 
  BarChart2, 
  Package, 
  FileText, 
  Settings, 
  PlusSquare,
  Eye,
  MousePointer2,
  PhoneCall,
  Edit,
  Trash2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Button } from '../components/ui/Button';

interface DashboardProps {
  user: SellerProfile;
  onNavigateTo: (page: any) => void;
}

const mockAnalytics: AnalyticsData[] = [
  { date: 'Mon', views: 120, clicks: 34, whatsapp_clicks: 12 },
  { date: 'Tue', views: 150, clicks: 42, whatsapp_clicks: 15 },
  { date: 'Wed', views: 180, clicks: 50, whatsapp_clicks: 18 },
  { date: 'Thu', views: 160, clicks: 38, whatsapp_clicks: 14 },
  { date: 'Fri', views: 210, clicks: 58, whatsapp_clicks: 22 },
  { date: 'Sat', views: 240, clicks: 65, whatsapp_clicks: 28 },
  { date: 'Sun', views: 220, clicks: 60, whatsapp_clicks: 25 },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigateTo }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ads' | 'analytics' | 'invoices'>('overview');

  const stats = [
    { label: 'Total Ads', value: '12', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Views', value: '1,450', icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Clicks', value: '348', icon: MousePointer2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'WhatsApp Leads', value: '154', icon: PhoneCall, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user.full_name}. Here's what's happening with your ads.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" className="gap-2 shadow-lg" onClick={() => onNavigateTo('post-ad')}>
            <PlusSquare size={20} />
            Post New Ad
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('ads')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'ads' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          My Ads
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'analytics' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Detailed Analytics
        </button>
        <button 
          onClick={() => setActiveTab('invoices')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'invoices' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Invoices
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={20} className="text-indigo-600" /> Daily Impressions
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockAnalytics}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart2 size={20} className="text-green-600" /> Click Statistics
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="whatsapp_clicks" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stats</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${i + 100}/100/100`} alt="" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">iPhone 15 Pro Max</div>
                        <div className="text-xs text-gray-400">Electronics • Mobile Phones</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-indigo-600">LKR 425,000</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <div>Views: <span className="font-bold text-gray-700">124</span></div>
                      <div>Clicks: <span className="font-bold text-gray-700">45</span></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No invoices yet</h3>
          <p className="text-gray-500">When you upgrade your package, your invoices will appear here.</p>
          <Button variant="outline" className="mt-6" onClick={() => onNavigateTo('pricing')}>
            View Packages
          </Button>
        </div>
      )}
    </div>
  );
};
