import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '@/api/client';
import type { DashboardStats } from '@/types/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Users,
  Package,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="p-8 text-slate-500 animate-pulse">Loading metrics...</div>
  );
  if (!stats) return null;

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, sub: `+${stats.newUsersToday} today`, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Active Listings", value: stats.activeListings, sub: `Avg. $${stats.averageListingPrice.toFixed(2)}`, icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Pending Reports", value: stats.pendingReports, sub: `${stats.totalReports} total`, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", link: "/admin/reports" },
    { title: "Conversations", value: stats.totalConversations, sub: `${stats.totalMessages} messages`, icon: MessageSquare, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time marketplace analytics</p>
        </div>
        <div className="flex gap-2 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full items-center border border-emerald-200">
          <TrendingUp size={14} /> System Online
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <Card key={i} className="bg-white border-slate-200 shadow-sm group relative overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{card.value}</div>
              <p className="text-xs text-slate-500 mt-1">{card.sub}</p>

              {card.link && (
                <Link to={card.link} className="absolute inset-0 z-10">
                  <span className="sr-only">View {card.title}</span>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-base font-semibold text-slate-900">Listings by Category</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.listingsByCategory).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 capitalize">{cat.toLowerCase().replace('_', ' ')}</span>
                <div className="flex items-center gap-3 flex-1 px-4">
                  <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / stats.totalListings) * 100}%` }}
                      className="h-full bg-indigo-500 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-base font-semibold text-slate-900">Quick Access</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            <Link to="/admin/users">
              <Button variant="outline" className="w-full justify-between border-slate-200 hover:bg-slate-50 hover:border-indigo-200 h-12">
                User Management <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button variant="outline" className="w-full justify-between border-slate-200 hover:bg-slate-50 hover:border-indigo-200 h-12">
                Moderation Queue <ArrowRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}