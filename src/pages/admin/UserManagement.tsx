import { useState, useEffect } from 'react';
import api from '@/api/client';
import type { AdminUser } from '@/types/admin';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Search, ShieldAlert, ShieldCheck, MoreHorizontal, User, Ban, UserCheck, Shield, Loader2 } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { search } });
      setUsers(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  // Block user - POST /api/admin/users/{id}/block
  const handleBlockUser = async (userId: number) => {
    setActionLoading(userId);
    try {
      await api.post(`/admin/users/${userId}/block`, { reason: 'Blocked by admin' });
      toast({ title: "User Blocked", description: "User has been blocked from the platform." });
      fetchUsers();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to block user." });
    } finally {
      setActionLoading(null);
    }
  };

  // Unblock user - POST /api/admin/users/{id}/unblock
  const handleUnblockUser = async (userId: number) => {
    setActionLoading(userId);
    try {
      await api.post(`/admin/users/${userId}/unblock`);
      toast({ title: "User Unblocked", description: "User can now access the platform." });
      fetchUsers();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to unblock user." });
    } finally {
      setActionLoading(null);
    }
  };

  // Make admin - POST /api/admin/users/{id}/make-admin
  const handleMakeAdmin = async (userId: number) => {
    setActionLoading(userId);
    try {
      await api.post(`/admin/users/${userId}/make-admin`);
      toast({ title: "Admin Granted", description: "User is now an administrator." });
      fetchUsers();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to grant admin." });
    } finally {
      setActionLoading(null);
    }
  };

  // Remove admin - POST /api/admin/users/{id}/remove-admin
  const handleRemoveAdmin = async (userId: number) => {
    setActionLoading(userId);
    try {
      await api.post(`/admin/users/${userId}/remove-admin`);
      toast({ title: "Admin Removed", description: "User is no longer an administrator." });
      fetchUsers();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to remove admin." });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search email or name..."
            className="pl-9 bg-white border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-indigo-600" />
          </div>
        )}
        {!loading && users.length === 0 && (
          <p className="text-center text-slate-400 py-10">No users found.</p>
        )}
        {!loading && users.map((user) => (
          <Card key={user.id} className="p-4 bg-white border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                {user.profilePicUrl ? (
                  <img src={user.profilePicUrl} className="object-cover h-full w-full" alt="" />
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

            <div className="flex items-center gap-6">
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

                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={actionLoading === user.id}>
                      {actionLoading === user.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <MoreHorizontal size={16} className="text-slate-500" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white border-slate-200">
                    {user.role === 'ADMIN' ? (
                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleRemoveAdmin(user.id)}>
                        <Shield className="mr-2 h-4 w-4" /> Remove Admin
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleMakeAdmin(user.id)}>
                        <Shield className="mr-2 h-4 w-4" /> Make Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {user.blocked ? (
                      <DropdownMenuItem className="cursor-pointer text-emerald-600" onClick={() => handleUnblockUser(user.id)}>
                        <UserCheck className="mr-2 h-4 w-4" /> Unblock User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="cursor-pointer text-rose-600" onClick={() => handleBlockUser(user.id)}>
                        <Ban className="mr-2 h-4 w-4" /> Block User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}