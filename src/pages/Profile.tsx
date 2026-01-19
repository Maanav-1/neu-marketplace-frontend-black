import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircle, 
  Package, 
  Settings, 
  Heart, 
  Loader2, 
  RefreshCw,
  Lock,
  CheckCircle2 // Added for "Sold" icon
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
} from "@/components/ui/alert-dialog"; // Added for safety confirmation
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
  const [markingSoldId, setMarkingSoldId] = useState<number | null>(null); // State for Sold loading
  
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

  // Logic to Mark as Sold
  const handleMarkAsSold = async (listingId: number) => {
    setMarkingSoldId(listingId);
    try {
      await api.patch(`/listings/${listingId}/sold`);
      toast({ title: "Congratulations!", description: "Item marked as sold." });
      fetchProfileData(); // Refresh to update statuses
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
      <section className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl">
        <div className="h-24 w-24 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
          <UserCircle className="h-12 w-12 text-blue-500" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tighter">{user.name}</h1>
          <p className="text-zinc-500 font-medium">{user.email}</p>
          <div className="flex gap-2 mt-3 justify-center md:justify-start">
            {user.role === 'ADMIN' && (
              <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase font-bold tracking-widest">
                Admin Access
              </span>
            )}
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-bold tracking-widest">
              Verified Husky
            </span>
          </div>
        </div>
      </section>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-full w-full max-w-md mx-auto md:mx-0">
          <TabsTrigger value="listings" className="rounded-full px-6 flex-1 text-xs uppercase font-bold tracking-widest">
            <Package size={14} className="mr-2"/> Listings
          </TabsTrigger>
          <TabsTrigger value="saved" className="rounded-full px-6 flex-1 text-xs uppercase font-bold tracking-widest">
            <Heart size={14} className="mr-2"/> Saved
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-full px-6 flex-1 text-xs uppercase font-bold tracking-widest">
            <Settings size={14} className="mr-2"/> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800" />
              ))}
            </div>
          ) : myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myListings.map(item => (
                <div key={item.id} className="group relative space-y-3">
                  <ListingCard item={item} />
                  
                  {/* Action Buttons: Bump and Mark as Sold */}
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      disabled={bumpingId === item.id || item.status === 'SOLD'}
                      className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/10 hover:text-blue-500 hover:border-blue-500/20 py-5 transition-all"
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
                          className="flex-1 rounded-xl border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20 py-5"
                        >
                          {item.status === 'SOLD' ? <CheckCircle2 size={12} /> : "Sold?"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white font-black">Mark as Sold?</AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400">
                            This will hide the item from the main feed but keep it on your profile for history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-transparent border-zinc-800">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleMarkAsSold(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 font-bold"
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
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/30">
              <Package className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">Your inventory is empty.</p>
            </div>
          )}
        </TabsContent>

        {/* ... (Saved and Settings TabsContent remain the same) */}
        <TabsContent value="saved" className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800" />
              ))}
            </div>
          ) : savedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedItems.map(save => <ListingCard key={save.id} item={save.listing} />)}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/30">
              <Heart className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">No items saved for later.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-8 space-y-8 max-w-xl">
          <Card className="bg-zinc-950 border-zinc-800 backdrop-blur-md">
            <CardHeader><CardTitle className="text-xl font-black tracking-tighter">Public Profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Display Name</label>
                  <Input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="bg-zinc-900 border-zinc-800 h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Contact Phone</label>
                  <Input value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className="bg-zinc-900 border-zinc-800 h-12" placeholder="+1 (617) 000-0000" />
                </div>
                <Button type="submit" disabled={updating} className="w-full bg-blue-600 hover:bg-blue-700 font-black h-12 rounded-xl mt-4">
                  {updating ? <Loader2 className="animate-spin" /> : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800 backdrop-blur-md">
            <CardHeader><CardTitle className="text-xl font-black tracking-tighter flex items-center gap-2"><Lock size={18} className="text-zinc-500" /> Security</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Current Password</label>
                  <Input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="bg-zinc-900 border-zinc-800 h-12" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">New Password</label>
                  <Input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="bg-zinc-900 border-zinc-800 h-12" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Confirm New Password</label>
                  <Input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="bg-zinc-900 border-zinc-800 h-12" required />
                </div>
                <Button type="submit" disabled={changingPassword} variant="outline" className="w-full border-zinc-800 hover:bg-zinc-900 font-black h-12 rounded-xl mt-4">
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