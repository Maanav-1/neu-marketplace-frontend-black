import { useState } from 'react';
import { UserCircle, Loader2, Lock } from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch (err) {
      toast({ variant: "destructive", title: "Update failed", description: "Could not save changes." });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast({ variant: "destructive", title: "Error", description: "New passwords do not match." });
    }
    setChangingPassword(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast({ title: "Security Updated", description: "Your password has been changed successfully." });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.response?.data?.message || "Check current password and try again."
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8 px-4">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-slate-200 shadow-sm">
        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
          <UserCircle className="h-10 w-10 text-indigo-600" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-slate-500">{user.email}</p>
          <div className="flex gap-2 mt-3 justify-center md:justify-start">
            {user.role === 'ADMIN' && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200 font-semibold">
                Admin
              </span>
            )}
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
              Verified Husky
            </span>
            {isOAuthUser && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 font-semibold">
                Google Account
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Profile Settings */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Display Name</label>
              <Input
                value={editData.name}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
                className="bg-slate-50 border-slate-200 h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Email</label>
              <Input
                value={user.email}
                disabled
                className="bg-slate-100 border-slate-200 h-11 text-slate-500"
              />
              <p className="text-xs text-slate-400">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Contact Phone</label>
              <Input
                value={editData.phone}
                onChange={e => setEditData({ ...editData, phone: e.target.value })}
                className="bg-slate-50 border-slate-200 h-11"
                placeholder="+1 (617) 000-0000"
              />
            </div>
            <Button type="submit" disabled={updating} className="w-full bg-indigo-600 hover:bg-indigo-700 font-semibold h-11 rounded-lg mt-4">
              {updating ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security - Only for password users */}
      {!isOAuthUser && (
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Lock size={18} className="text-slate-400" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Current Password</label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="bg-slate-50 border-slate-200 h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">New Password</label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="bg-slate-50 border-slate-200 h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Confirm New Password</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="bg-slate-50 border-slate-200 h-11"
                  required
                />
              </div>
              <Button type="submit" disabled={changingPassword} variant="outline" className="w-full border-slate-200 hover:bg-slate-50 font-semibold h-11 rounded-lg mt-4">
                {changingPassword ? <Loader2 className="animate-spin" /> : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}