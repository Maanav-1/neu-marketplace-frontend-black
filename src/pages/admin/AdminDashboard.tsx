import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/api/client';
import type { DashboardStats } from '@/types/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Package, AlertTriangle, MessageSquare, TrendingUp } from 'lucide-react';

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

  if (loading) return <div className="p-8 text-zinc-500">Loading metrics...</div>;
  if (!stats) return null;

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, sub: `+${stats.newUsersToday} today`, icon: Users, color: "text-blue-500" },
    { title: "Active Listings", value: stats.activeListings, sub: `Avg. $${stats.averageListingPrice.toFixed(2)}`, icon: Package, color: "text-emerald-500" },
    { title: "Pending Reports", value: stats.pendingReports, sub: `${stats.totalReports} total`, icon: AlertTriangle, color: "text-orange-500" },
    { title: "Conversations", value: stats.totalConversations, sub: `${stats.totalMessages} messages`, icon: MessageSquare, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Admin Overview</h1>
          <p className="text-zinc-500 text-sm">Real-time marketplace analytics</p>
        </div>
        <div className="flex gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full items-center">
          <TrendingUp size={14} /> System Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <Card key={i} className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-zinc-500 mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader><CardTitle className="text-lg">Listings by Category</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.listingsByCategory).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 capitalize">{cat.toLowerCase().replace('_', ' ')}</span>
                <div className="flex items-center gap-3 flex-1 px-4">
                  <div className="h-1.5 flex-1 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${(count / stats.totalListings) * 100}%` }}
                      className="h-full bg-blue-600" 
                    />
                  </div>
                  <span className="text-xs font-bold w-6">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}