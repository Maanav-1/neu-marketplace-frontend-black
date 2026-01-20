import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCircle,
  Package,
  Settings,
  Heart,
  Loader2,
  RefreshCw,
  Lock,
  CheckCircle2
} from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ListingCard from '@/components/ListingCard';

import type { Listing, SavedItem } from '@/types';

export default function Profile() {
  const { user, setAuth } = useAuthStore();
  const { toast } = useToast();

  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [bumpingId, setBumpingId] = useState<number | null>(null);
  const [markingSoldId, setMarkingSoldId] = useState<number | null>(null);

  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fetchProfileData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data: listingsData } = await api.get(`/users/${user.id}/listings`);
      setMyListings(listingsData);
      const { data: savedData } = await api.get('/saved');
      setSavedItems(savedData);
    } catch (err) {
      console.error("Failed to fetch profile data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

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

  const handleMarkAsSold = async (listingId: number) => {
    setMarkingSoldId(listingId);
    try {
      await api.patch(`/listings/${listingId}/sold`);
      toast({ title: "Congratulations!", description: "Item marked as sold." });
      fetchProfileData();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not update status." });
    } finally {
      setMarkingSoldId(null);
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

  const handleBump = async (listingId: number) => {
    setBumpingId(listingId);
    try {
      await api.patch(`/listings/${listingId}/bump`);
      toast({ title: "Listing Renewed!", description: "Your item is now active for another 30 days." });
      fetchProfileData();
    } catch (err) {
      toast({ variant: "destructive", title: "Bump failed", description: "Could not renew listing." });
    } finally {
      setBumpingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10 px-4">
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
          </div>
        </div>
      </section>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200 p-1 rounded-full w-full max-w-md mx-auto md:mx-0">
          <TabsTrigger value="listings" className="rounded-full px-6 flex-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Package size={14} className="mr-2" /> Listings
          </TabsTrigger>
          <TabsTrigger value="saved" className="rounded-full px-6 flex-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Heart size={14} className="mr-2" /> Saved
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-full px-6 flex-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Settings size={14} className="mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myListings.map(item => (
                <div key={item.id} className="group relative space-y-3">
                  <ListingCard item={item} />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={bumpingId === item.id || item.status === 'SOLD'}
                      className="flex-1 rounded-lg border-slate-200 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 h-9"
                      onClick={() => handleBump(item.id)}
                    >
                      {bumpingId === item.id ? <Loader2 className="animate-spin h-3 w-3" /> : <><RefreshCw size={12} className="mr-1" /> Renew</>}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={markingSoldId === item.id || item.status === 'SOLD'}
                          className="flex-1 rounded-lg border-slate-200 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 h-9"
                        >
                          {item.status === 'SOLD' ? <CheckCircle2 size={12} /> : "Sold?"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white border-slate-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-slate-900 font-semibold">Mark as Sold?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-500">
                            This will hide the item from the main feed but keep it on your profile for history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-slate-200">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleMarkAsSold(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                          >
                            Confirm Sold
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <Package className="h-10 w-10 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Your inventory is empty.</p>
              <Link to="/create">
                <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">Create Listing</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : savedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedItems.map(save => <ListingCard key={save.id} item={save.listing} />)}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <Heart className="h-10 w-10 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No items saved for later.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-8 space-y-8 max-w-xl">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader><CardTitle className="text-lg font-semibold text-slate-900">Public Profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Display Name</label>
                  <Input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} className="bg-slate-50 border-slate-200 h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Contact Phone</label>
                  <Input value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} className="bg-slate-50 border-slate-200 h-11" placeholder="+1 (617) 000-0000" />
                </div>
                <Button type="submit" disabled={updating} className="w-full bg-indigo-600 hover:bg-indigo-700 font-semibold h-11 rounded-lg mt-4">
                  {updating ? <Loader2 className="animate-spin" /> : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader><CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2"><Lock size={18} className="text-slate-400" /> Security</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Current Password</label>
                  <Input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="bg-slate-50 border-slate-200 h-11" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">New Password</label>
                  <Input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="bg-slate-50 border-slate-200 h-11" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Confirm New Password</label>
                  <Input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="bg-slate-50 border-slate-200 h-11" required />
                </div>
                <Button type="submit" disabled={changingPassword} variant="outline" className="w-full border-slate-200 hover:bg-slate-50 font-semibold h-11 rounded-lg mt-4">
                  {changingPassword ? <Loader2 className="animate-spin" /> : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}