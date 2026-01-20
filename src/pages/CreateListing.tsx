import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, Plus, ImagePlus } from 'lucide-react';
import api from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { Category, Condition, ListingRequest } from '@/types/listing';

const CATEGORIES: Category[] = ['FURNITURE', 'ELECTRONICS', 'TEXTBOOKS', 'CLOTHING', 'BIKES', 'KITCHEN', 'FREE_STUFF', 'OTHER'];
const CONDITIONS: Condition[] = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'];

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<ListingRequest>({
    title: '',
    description: '',
    price: 0,
    category: 'ELECTRONICS',
    condition: 'NEW',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 5) {
        alert("Maximum 5 images allowed per listing.");
        return;
      }
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: listing } = await api.post('/listings', formData);

      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((file) => imageFormData.append('files', file));
        await api.post(`/listings/${listing.id}/images`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate(`/listings/${listing.slug}`);
    } catch (error) {
      console.error("Failed to create listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-3xl py-10"
    >
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">List your item</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="space-y-6">
            {/* Image Upload Zone */}
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide mb-3 block">
                Photos (up to 5)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <AnimatePresence>
                  {images.map((file, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                    >
                      <img src={URL.createObjectURL(file)} className="object-cover w-full h-full" alt="preview" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm"
                      >
                        <X size={14} className="text-slate-600" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {images.length < 5 && (
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition-all">
                    <ImagePlus className="text-slate-400 mb-1" size={24} />
                    <span className="text-xs text-slate-500 font-medium">Add Photo</span>
                    <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            {/* Title & Price */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Item Title</label>
                <Input
                  placeholder="What are you selling?"
                  className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Price ($)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Category</label>
                <select
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Condition</label>
                <select
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as Condition })}
                >
                  {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Description</label>
              <textarea
                className="w-full min-h-[120px] p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Describe your item..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-sm transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Publish Listing"}
        </Button>
      </form>
    </motion.div>
  );
}