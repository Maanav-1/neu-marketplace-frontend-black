import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2,
  Save,
  Trash2,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
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
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You do not have permission to edit this listing."
          });
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load listing details."
        });
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [slug, user, navigate, toast]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/listings/${listingId}`, formData);
      toast({ title: "Success", description: "Listing updated successfully." });
      navigate(`/listings/${slug}`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Please check your inputs and try again."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await api.patch(`/listings/${listingId}/sold`);
      toast({ title: "Sold!", description: "Your item has been marked as sold." });
      navigate('/profile');
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not update status." });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/listings/${listingId}`);
      toast({ title: "Deleted", description: "Listing has been removed from the marketplace." });
      navigate('/profile');
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete listing." });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
      <p className="text-slate-500 text-sm font-medium">Loading listing...</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-3xl py-10"
    >
      <Button
        variant="ghost"
        className="mb-6 text-slate-500 hover:text-slate-900"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} className="mr-2" /> Back
      </Button>

      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Edit Listing</h1>

      <div className="space-y-8">
        <form onSubmit={handleUpdate}>
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
                  Listing Title
                </label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
                    Price ($)
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={e => setFormData({ ...formData, condition: e.target.value as Condition })}
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {CONDITIONS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[150px] p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Tell buyers more about your item..."
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 pt-6">
              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 font-semibold shadow-sm"
              >
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Changes</>}
              </Button>
            </CardFooter>
          </Card>
        </form>

        {/* Danger Zone */}
        <Card className="bg-rose-50 border-rose-200 overflow-hidden">
          <CardHeader className="bg-rose-100/50 pb-4">
            <CardTitle className="text-base font-semibold text-rose-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col md:flex-row gap-4">

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-11">
                  <CheckCircle size={18} className="mr-2" /> Mark as Sold
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white border-slate-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-slate-900 font-semibold">Mark item as sold?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-500">
                    This will hide the listing from search results but keep it visible on your profile as "Sold".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-slate-200">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleMarkAsSold} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Confirm Sold
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1 h-11 font-semibold">
                  <Trash2 size={18} className="mr-2" /> Delete Listing
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white border-slate-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-rose-600 font-semibold">Delete Permanently?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-500">
                    This action is final. Your listing, images, and description will be purged from the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-slate-200">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 text-white font-semibold">
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}