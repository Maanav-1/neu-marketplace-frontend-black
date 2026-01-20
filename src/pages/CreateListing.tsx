import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2, ImagePlus } from 'lucide-react';
import api from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Condition, ListingRequest } from '@/types/listing';

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
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-black mb-8">Create listing</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Zone */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Photos <span className="text-gray-400 font-normal">(up to 5)</span>
          </label>
          <div className="grid grid-cols-5 gap-3">
            <AnimatePresence>
              {images.map((file, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                >
                  <img src={URL.createObjectURL(file)} className="object-cover w-full h-full" alt="preview" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <X size={12} className="text-gray-600" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {images.length < 5 && (
              <label className="aspect-square flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-all">
                <ImagePlus className="text-gray-400 mb-1" size={20} />
                <span className="text-xs text-gray-500">Add</span>
                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>
        </div>

        {/* Title & Price */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <Input
              placeholder="What are you selling?"
              className="bg-white border-gray-200 h-10 focus:border-gray-400 focus:ring-0"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <Input
                type="number"
                placeholder="0"
                className="bg-white border-gray-200 h-10 pl-7 focus:border-gray-400 focus:ring-0"
                value={formData.price}
                onChange={(e) => {
                  const parsed = parseFloat(e.target.value);
                  setFormData({ ...formData, price: isNaN(parsed) ? 0 : parsed });
                }}
                required
              />
            </div>
          </div>
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-2 gap-4">
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

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full min-h-[120px] p-3 rounded-lg bg-white border border-gray-200 text-sm focus:border-gray-400 focus:ring-0 focus:outline-none resize-none"
            placeholder="Describe your item..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-black hover:bg-gray-800 text-white font-medium"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Publish Listing"}
        </Button>
      </form>
    </div>
  );
}