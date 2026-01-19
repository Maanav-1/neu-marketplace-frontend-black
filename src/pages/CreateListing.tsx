import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, Plus } from 'lucide-react';
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
      // Strict Backend Alignment: Max 5 images
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
      // 1. Create the Listing
      const { data: listing } = await api.post('/listings', formData);

      // 2. Upload Images if any
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
      <h1 className="text-4xl font-bold tracking-tighter mb-8">List your item</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 bg-zinc-950 border-zinc-800">
          <div className="space-y-6">
            {/* Image Upload Zone */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <AnimatePresence>
                {images.map((file, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800"
                  >
                    <img src={URL.createObjectURL(file)} className="object-cover w-full h-full" alt="preview" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/80"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {images.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 cursor-pointer transition-all">
                  <Plus className="text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Add Photo</span>
                  <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
            </div>

            {/* Title & Price */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-medium text-zinc-500 uppercase">Item Title</label>
                <Input 
                  placeholder="What are you selling?" 
                  className="bg-zinc-900 border-zinc-800"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 uppercase">Price ($)</label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="bg-zinc-900 border-zinc-800"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 uppercase">Category</label>
                <select 
                  className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm focus:ring-1 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 uppercase">Condition</label>
                <select 
                  className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm focus:ring-1 focus:ring-blue-500"
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value as Condition})}
                >
                  {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 uppercase">Description</label>
              <textarea 
                className="w-full min-h-[120px] p-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm focus:ring-1 focus:ring-blue-500"
                placeholder="Describe your item..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        </Card>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-full transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Publish Listing"}
        </Button>
      </form>
    </motion.div>
  );
}