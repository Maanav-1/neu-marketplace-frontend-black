import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '@/api/client';
import type { DashboardStats } from '@/types/admin';
import {
  Users,
  Package,
  AlertTriangle,
  MessageSquare,
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
    <div className="py-10 text-gray-400 text-sm">Loading...</div>
  );
  if (!stats) return null;

  const statCards = [
    { title: "Users", value: stats.totalUsers, sub: `+${stats.newUsersToday} today`, icon: Users },
    { title: "Listings", value: stats.activeListings, sub: `Avg $${stats.averageListingPrice.toFixed(0)}`, icon: Package },
    { title: "Reports", value: stats.pendingReports, sub: `${stats.totalReports} total`, icon: AlertTriangle, link: "/admin/reports" },
    { title: "Chats", value: stats.totalConversations, sub: `${stats.totalMessages} messages`, icon: MessageSquare },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Marketplace overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="relative p-4 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">{card.title}</span>
              <card.icon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold text-black">{card.value}</div>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            {card.link && (
              <Link to={card.link} className="absolute inset-0">
                <span className="sr-only">View {card.title}</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <h2 className="text-sm font-medium text-black mb-4">By Category</h2>
          <div className="space-y-3">
            {Object.entries(stats.listingsByCategory).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize">{cat.toLowerCase().replace('_', ' ')}</span>
                <div className="flex items-center gap-3 flex-1 px-4">
                  <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / stats.totalListings) * 100}%` }}
                      className="h-full bg-black rounded-full"
                    />
                  </div>
                  <span className="font-medium text-gray-700 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <h2 className="text-sm font-medium text-black mb-4">Quick Access</h2>
          <div className="space-y-2">
            <Link to="/admin/users">
              <Button variant="outline" className="w-full justify-between border-gray-200 hover:bg-gray-50 h-10 text-sm">
                User Management <ArrowRight size={14} />
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button variant="outline" className="w-full justify-between border-gray-200 hover:bg-gray-50 h-10 text-sm">
                Moderation Queue <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}