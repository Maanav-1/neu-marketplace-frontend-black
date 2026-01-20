import { useState, useEffect } from 'react';
import api from '@/api/client';
import type { AdminUser } from '@/types/admin';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Search, MoreHorizontal, User, Ban, UserCheck, Shield, Loader2 } from 'lucide-react';

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

  const handleBlockUser = async (userId: number) => {
    setActionLoading(userId);
    try {
      await api.post(`/admin/users/${userId}/block`, { reason: 'Blocked by admin' });
      toast({ title: "Blocked", description: "User has been blocked." });
      fetchUsers();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to block user." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    setActionLoading(userId);
    try {
      await api.post(`/admin/users/${userId}/unblock`);
      toast({ title: "Unblocked", description: "User can now access the platform." });
      fetchUsers();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to unblock user." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleMakeAdmin = async (userId: number) => {
    setActionLoading(userId);
    try {
      await api.post(`/admin/users/${userId}/make-admin`);
      toast({ title: "Done", description: "User is now an admin." });
      fetchUsers();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to grant admin." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveAdmin = async (userId: number) => {
    setActionLoading(userId);
    try {
      await api.post(`/admin/users/${userId}/remove-admin`);
      toast({ title: "Done", description: "Admin removed." });
      fetchUsers();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to remove admin." });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-black">Users</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 bg-white border-gray-200 focus:border-gray-400 focus:ring-0 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}
        {!loading && users.length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm">No users found.</p>
        )}
        {!loading && users.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Listings</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {user.profilePicUrl ? (
                          <img src={user.profilePicUrl} className="object-cover h-full w-full" alt="" />
                        ) : (
                          <User className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-black">{user.name}</span>
                          {user.role === 'ADMIN' && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Admin</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.listingsCount}</td>
                  <td className="px-4 py-3">
                    {user.blocked ? (
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">Blocked</span>
                    ) : (
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={actionLoading === user.id}>
                          {actionLoading === user.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <MoreHorizontal size={14} className="text-gray-500" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-white border-gray-200">
                        {user.role === 'ADMIN' ? (
                          <DropdownMenuItem className="cursor-pointer text-sm" onClick={() => handleRemoveAdmin(user.id)}>
                            <Shield className="mr-2 h-4 w-4" /> Remove Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="cursor-pointer text-sm" onClick={() => handleMakeAdmin(user.id)}>
                            <Shield className="mr-2 h-4 w-4" /> Make Admin
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {user.blocked ? (
                          <DropdownMenuItem className="cursor-pointer text-sm text-green-600" onClick={() => handleUnblockUser(user.id)}>
                            <UserCheck className="mr-2 h-4 w-4" /> Unblock
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="cursor-pointer text-sm text-red-600" onClick={() => handleBlockUser(user.id)}>
                            <Ban className="mr-2 h-4 w-4" /> Block
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}