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
  Tag,
  Info,
  Loader2
} from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
      <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
      <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Fetching details...</p>
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
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
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
                  variant="secondary" size="icon" className="rounded-full pointer-events-auto shadow-xl"
                  onClick={() => setCurrentImage(prev => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button 
                  variant="secondary" size="icon" className="rounded-full pointer-events-auto shadow-xl"
                  onClick={() => setCurrentImage(prev => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2">
            {listing.images.map((img, i) => (
              <button 
                key={img.id} 
                onClick={() => setCurrentImage(i)}
                className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-all ${currentImage === i ? 'border-blue-500 scale-105' : 'border-transparent opacity-50'}`}
              >
                <img src={img.imageUrl} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600/10 text-blue-500 border-blue-500/20">{listing.categoryDisplayName}</Badge>
              <Badge variant="outline" className="border-zinc-800 text-zinc-400">{listing.conditionDisplayName}</Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tighter leading-none">{listing.title}</h1>
            <p className="text-4xl font-bold text-blue-500">${listing.price}</p>
          </div>

          <Card className="p-6 bg-zinc-950 border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                  {listing.seller.profilePicUrl ? (
                    <img src={listing.seller.profilePicUrl} className="object-cover h-full w-full" />
                  ) : (
                    <UserIcon size={20} className="text-zinc-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold">{listing.seller.name}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Husky Seller</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-500 hover:text-white">View Profile</Button>
            </div>
          </Card>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Info size={14} /> Description
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
              {listing.description || "No description provided."}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-lg shadow-blue-500/20"
              onClick={handleStartChat}
              disabled={isMessaging || user?.id === listing.seller.id}
            >
              {isMessaging ? <Loader2 className="animate-spin" /> : (
                <><MessageSquare size={20} className="mr-2" /> Contact Seller</>
              )}
            </Button>
            <Button 
              variant="outline" 
              className={`h-14 w-14 rounded-2xl border-zinc-800 ${listing.isSaved ? 'text-red-500 bg-red-500/5 border-red-500/20' : 'text-zinc-400'}`}
              onClick={handleToggleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Heart size={24} fill={listing.isSaved ? 'currentColor' : 'none'} />}
            </Button>
          </div>

          <div className="pt-6 border-t border-zinc-900 grid grid-cols-2 gap-4 text-zinc-500">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium">
              <Clock size={14} /> Posted {new Date(listing.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium">
              <ShieldAlert size={14} /> Report Listing
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}