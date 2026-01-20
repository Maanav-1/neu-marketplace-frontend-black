import { useState, useEffect } from 'react';
import api from '@/api/client';
import type { AdminUser } from '@/types/admin';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldAlert, ShieldCheck, MoreHorizontal, User } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users', { params: { search } });
        setUsers(data.content);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search email or name..."
            className="pl-9 bg-white border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id} className="p-4 bg-white border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                {user.profilePicUrl ? (
                  <img src={user.profilePicUrl} className="object-cover h-full w-full" />
                ) : (
                  <User className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">{user.name}</span>
                  {user.role === 'ADMIN' && (
                    <Badge variant="outline" className="text-xs text-indigo-600 border-indigo-200 bg-indigo-50 py-0">
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xs text-slate-400 font-medium">Listings</p>
                <p className="text-sm font-semibold text-slate-900">{user.listingsCount}</p>
              </div>
              <div className="flex items-center gap-2">
                {user.blocked ? (
                  <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">
                    <ShieldAlert size={12} className="mr-1" /> Blocked
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                    <ShieldCheck size={12} className="mr-1" /> Active
                  </Badge>
                )}
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreHorizontal size={16} className="text-slate-400" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}