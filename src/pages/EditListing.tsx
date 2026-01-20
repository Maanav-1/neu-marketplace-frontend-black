import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Save, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'TEXTBOOKS', label: 'Textbooks' },
  { value: 'CLOTHING', label: 'Clothing' },
  { value: 'BIKES', label: 'Bikes & Scooters' },
  { value: 'KITCHEN', label: 'Kitchen' },
  { value: 'FREE_STUFF', label: 'Free Stuff' },
  { value: 'OTHER', label: 'Other' },
];

const CONDITIONS: { value: Condition; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

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
        toast({ variant: "destructive", title: "Error", description: "Failed to load." });
        navigate('/my-listings');
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
      toast({ title: "Saved", description: "Changes applied." });
      navigate(`/listings/${slug}`);
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/listings/${listingId}`);
      toast({ title: "Deleted" });
      navigate('/my-listings');
    } catch (err) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await api.patch(`/listings/${listingId}/sold`);
      toast({ title: "Marked as sold" });
      navigate('/my-listings');
    } catch (err) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black mb-6 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="text-2xl font-semibold text-black mb-8">Edit Listing</h1>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <Input
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="bg-white border-gray-200 h-10 focus:border-gray-400 focus:ring-0"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <Input
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="bg-white border-gray-200 h-10 pl-7 focus:border-gray-400 focus:ring-0"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Condition</label>
            <Select
              value={formData.condition}
              onValueChange={(value) => setFormData({ ...formData, condition: value as Condition })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map(cond => (
                  <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full min-h-[120px] p-3 rounded-lg bg-white border border-gray-200 text-sm focus:border-gray-400 focus:ring-0 focus:outline-none resize-none"
          />
        </div>

        <Button type="submit" disabled={saving} className="w-full bg-black hover:bg-gray-800 text-white font-medium h-10">
          {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save size={14} className="mr-1.5" /> Save Changes</>}
        </Button>
      </form>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-9 text-sm border-gray-200 hover:bg-gray-50"
            onClick={handleMarkAsSold}
          >
            <CheckCircle size={14} className="mr-1.5" /> Mark Sold
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1 h-9 text-sm border-gray-200 text-red-600 hover:bg-red-50">
                <Trash2 size={14} className="mr-1.5" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-gray-200">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-200">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}