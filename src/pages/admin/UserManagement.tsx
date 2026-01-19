import { useState, useEffect } from 'react';
import api from '@/api/client';
import type { AdminUser } from '@/types/admin';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldAlert, ShieldCheck, MoreHorizontal } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users', { params: { search } });
        setUsers(data.content); // PagedResponse
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tighter">User Management</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search email or name..." 
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <Card key={user.id} className="p-4 bg-zinc-950 border-zinc-800 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-800 overflow-hidden">
                <img src={user.profilePicUrl || '/placeholder-user.png'} className="object-cover h-full w-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{user.name}</span>
                  {user.role === 'ADMIN' && <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-400/20 py-0 uppercase">Admin</Badge>}
                </div>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-[10px] uppercase text-zinc-600 font-bold tracking-widest">Listings</p>
                <p className="text-sm font-bold">{user.listingsCount}</p>
              </div>
              <div className="flex items-center gap-2">
                {user.blocked ? (
                  <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/10 border-red-500/20"><ShieldAlert size={12} className="mr-1" /> Blocked</Badge>
                ) : (
                  <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20"><ShieldCheck size={12} className="mr-1" /> Active</Badge>
                )}
                <button className="p-2 hover:bg-zinc-800 rounded-md transition-colors"><MoreHorizontal size={16} className="text-zinc-500" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}