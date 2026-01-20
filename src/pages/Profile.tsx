import { useState } from 'react';
import { UserCircle, Loader2, Lock } from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Profile() {
  const { user, setAuth, isOAuthUser } = useAuthStore();
  const { toast } = useToast();

  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data } = await api.put('/users/me', editData);
      const token = localStorage.getItem('token') || '';
      setAuth(data, token);
      toast({ title: "Saved", description: "Your profile has been updated." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not save changes." });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
    }
    setChangingPassword(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast({ title: "Updated", description: "Your password has been changed." });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Check your current password."
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto py-10 space-y-8">
      {/* Header Section */}
      <section className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
          <UserCircle className="h-8 w-8 text-gray-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-black">{user.name}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <div className="flex gap-2 mt-2">
            {user.role === 'ADMIN' && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                Admin
              </span>
            )}
            {isOAuthUser && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                Google
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Profile Settings */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Profile</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input
              value={editData.name}
              onChange={e => setEditData({ ...editData, name: e.target.value })}
              className="bg-white border-gray-200 h-10 focus:border-gray-400 focus:ring-0"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              value={user.email}
              disabled
              className="bg-gray-50 border-gray-200 h-10 text-gray-500"
            />
            <p className="text-xs text-gray-400">Email cannot be changed</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <Input
              value={editData.phone}
              onChange={e => setEditData({ ...editData, phone: e.target.value })}
              className="bg-white border-gray-200 h-10 focus:border-gray-400 focus:ring-0"
              placeholder="+1 (617) 000-0000"
            />
          </div>
          <Button type="submit" disabled={updating} className="w-full bg-black hover:bg-gray-800 text-white font-medium h-10">
            {updating ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </section>

      {/* Security - Only for password users */}
      {!isOAuthUser && (
        <section className="space-y-4 pt-4 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <Lock size={14} /> Security
          </h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Current Password</label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="bg-white border-gray-200 h-10 focus:border-gray-400 focus:ring-0"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="bg-white border-gray-200 h-10 focus:border-gray-400 focus:ring-0"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="bg-white border-gray-200 h-10 focus:border-gray-400 focus:ring-0"
                required
              />
            </div>
            <Button type="submit" disabled={changingPassword} variant="outline" className="w-full border-gray-200 hover:bg-gray-50 font-medium h-10">
              {changingPassword ? <Loader2 className="animate-spin" /> : "Change Password"}
            </Button>
          </form>
        </section>
      )}
    </div>
  );
}