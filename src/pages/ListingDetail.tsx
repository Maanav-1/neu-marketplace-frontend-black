import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Heart,
  ShieldAlert,
  Clock,
  User as UserIcon,
  Info,
  Loader2
} from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ReportModal from '@/components/ReportModal';
import type { Listing } from '@/types';

export default function ListingDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.get(`/listings/${slug}`);
        setListing(data);
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Could not load listing." });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [slug, navigate, toast]);

  const handleToggleSave = async () => {
    if (!user) return navigate('/login');
    setIsSaving(true);
    try {
      if (listing?.isSaved) {
        await api.delete(`/saved/${listing.id}`);
        setListing(prev => prev ? { ...prev, isSaved: false } : null);
      } else {
        await api.post(`/saved/${listing?.id}`);
        setListing(prev => prev ? { ...prev, isSaved: true } : null);
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Action failed." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartChat = async () => {
    if (!user) return navigate('/login');
    if (!user.emailVerified) {
      return toast({ title: "Verification Required", description: "Please verify your email to chat." });
    }

    setIsMessaging(true);
    try {
      const { data } = await api.post(`/conversations?listingId=${listing?.id}`);
      navigate(`/chat/${data.id}`);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Chat failed",
        description: err.response?.data?.message || "Could not start conversation."
      });
    } finally {
      setIsMessaging(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
      <p className="text-slate-500 text-sm font-medium">Fetching details...</p>
    </div>
  );

  if (!listing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-6xl py-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={listing.images[currentImage]?.imageUrl || '/placeholder.png'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="object-cover w-full h-full"
              />
            </AnimatePresence>

            {listing.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full pointer-events-auto shadow-lg bg-white/90 hover:bg-white border-slate-200"
                  onClick={() => setCurrentImage(prev => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                >
                  <ChevronLeft size={20} className="text-slate-700" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full pointer-events-auto shadow-lg bg-white/90 hover:bg-white border-slate-200"
                  onClick={() => setCurrentImage(prev => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight size={20} className="text-slate-700" />
                </Button>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {listing.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setCurrentImage(i)}
                className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${currentImage === i
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
              >
                <img src={img.imageUrl} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">{listing.categoryDisplayName}</Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600">{listing.conditionDisplayName}</Badge>
          </div>

          {/* Title & Price */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{listing.title}</h1>
            <p className="text-3xl font-bold text-indigo-600 mt-2">${listing.price}</p>
          </div>

          {/* Seller Card */}
          <Card className="p-5 bg-slate-50 border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                  {listing.seller.profilePicUrl ? (
                    <img src={listing.seller.profilePicUrl} className="object-cover h-full w-full" />
                  ) : (
                    <UserIcon size={20} className="text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{listing.seller.name}</p>
                  <p className="text-xs text-slate-500">Husky Seller</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-sm text-slate-500 hover:text-indigo-600">
                View Profile
              </Button>
            </div>
          </Card>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-2">
              <Info size={14} /> Description
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {listing.description || "No description provided."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold shadow-sm"
              onClick={handleStartChat}
              disabled={isMessaging || user?.id === listing.seller.id}
            >
              {isMessaging ? <Loader2 className="animate-spin" /> : (
                <><MessageSquare size={18} className="mr-2" /> Contact Seller</>
              )}
            </Button>
            <Button
              variant="outline"
              className={`h-12 w-12 rounded-xl border-slate-200 ${listing.isSaved
                  ? 'text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200'
                }`}
              onClick={handleToggleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Heart size={22} fill={listing.isSaved ? 'currentColor' : 'none'} />}
            </Button>
          </div>

          {/* Meta Info */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock size={14} /> Posted {new Date(listing.createdAt).toLocaleDateString()}
            </div>
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <ShieldAlert size={14} /> Report Listing
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        listingId={listing.id}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </motion.div>
  );
}