import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Save, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
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

import type { Category, Condition, ListingRequest } from '@/types/listing';
import type { Listing } from '@/types';

const CATEGORIES: Category[] = ['FURNITURE', 'ELECTRONICS', 'TEXTBOOKS', 'CLOTHING', 'BIKES', 'KITCHEN', 'FREE_STUFF', 'OTHER'];
const CONDITIONS: Condition[] = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'];

export default function EditListing() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listingId, setListingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ListingRequest>({
    title: '',
    description: '',
    price: 0,
    category: 'ELECTRONICS',
    condition: 'NEW',
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.get<Listing>(`/listings/${slug}`);
        if (data.seller.id !== user?.id) {
          toast({ variant: "destructive", title: "Unauthorized" });
          return navigate('/');
        }
        setListingId(data.id);
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          condition: data.condition,
        });
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Failed to load listing." });
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [slug, user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/listings/${listingId}`, formData);
      toast({ title: "Updated", description: "Changes saved successfully." });
      navigate(`/listings/${slug}`);
    } catch (err) {
      toast({ variant: "destructive", title: "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/listings/${listingId}`);
      toast({ title: "Deleted", description: "Listing has been removed." });
      navigate('/profile'); // Redirect back to profile
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete." });
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await api.patch(`/listings/${listingId}/sold`);
      toast({ title: "Sold!", description: "Item marked as sold." });
      navigate('/profile');
    } catch (err) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="container max-w-3xl py-10">
      <Button variant="ghost" className="mb-6 text-slate-500" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} className="mr-2" /> Back
      </Button>
      <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>
      <form onSubmit={handleUpdate} className="space-y-8">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Title</label>
              <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Price ($)</label>
                <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Condition</label>
                <select value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value as Condition })} className="w-full h-10 border rounded-md px-3">
                  {CONDITIONS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as Category })} className="w-full h-10 border rounded-md px-3">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full min-h-[150px] p-3 border rounded-md" />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={saving} className="w-full bg-indigo-600 text-white">
              {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Changes</>}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card className="mt-8 bg-slate-50 border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-slate-700">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={handleMarkAsSold}>
            <CheckCircle size={18} className="mr-2" /> Mark as Sold
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50">
                <Trash2 size={18} className="mr-2" /> Delete Listing
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Permanently?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. Your listing will be removed from the marketplace.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-rose-600 text-white hover:bg-rose-700">Confirm Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </motion.div>
  );
}