import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Heart,
  Clock,
  User as UserIcon,
  Loader2,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingSold, setIsMarkingSold] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.get(`/listings/${slug}`);
        setListing(data);
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Listing not found." });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [slug]);

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
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || "Could not start chat." });
    } finally {
      setIsMessaging(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/listings/${listing?.id}`);
      toast({ title: "Deleted", description: "Listing removed." });
      navigate('/my-listings');
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete." });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkAsSold = async () => {
    setIsMarkingSold(true);
    try {
      await api.patch(`/listings/${listing?.id}/sold`);
      setListing(prev => prev ? { ...prev, status: 'SOLD' } : null);
      toast({ title: "Success", description: "Item marked as sold!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update." });
    } finally {
      setIsMarkingSold(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
      </div>
    );
  }

  if (!listing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={listing.images[currentImage]?.imageUrl || '/placeholder.png'}
              className={`object-cover w-full h-full ${listing.status === 'SOLD' ? 'grayscale opacity-70' : ''}`}
              alt={listing.title}
            />

            {/* Image Navigation */}
            {listing.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-lg h-10 w-10"
                  onClick={() => setCurrentImage(prev => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-lg h-10 w-10"
                  onClick={() => setCurrentImage(prev => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight size={20} />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {listing.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImage(i)}
                  className={`h-16 w-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${currentImage === i ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={img.imageUrl} className="object-cover w-full h-full" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {listing.status === 'SOLD' && (
              <Badge className="bg-emerald-500 text-white border-emerald-600 font-bold">SOLD</Badge>
            )}
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">{listing.categoryDisplayName}</Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600">{listing.conditionDisplayName}</Badge>
          </div>

          {/* Title & Price */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{listing.title}</h1>
            <p className="text-3xl font-bold text-indigo-600 mt-2">${listing.price}</p>
          </div>

          {/* Seller Card */}
          <Card className="p-4 bg-slate-50 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                {listing.seller.profilePicUrl ? (
                  <img src={listing.seller.profilePicUrl} className="object-cover h-full w-full" alt="" />
                ) : (
                  <UserIcon size={20} className="text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{listing.seller.name}</p>
                <p className="text-xs text-slate-500">Husky Seller</p>
              </div>
            </div>
          </Card>

          {/* Owner Controls */}
          {user?.id === listing.seller.id && (
            <Card className="p-4 bg-slate-50 border-slate-200 space-y-3">
              <p className="text-xs font-semibold uppercase text-slate-400">Manage Listing</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-white"
                  onClick={() => navigate(`/listings/${listing.slug}/edit`)}
                >
                  <Edit size={16} className="mr-2" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50">
                      <Trash2 size={16} className="mr-2" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Permanently?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-rose-600 text-white">
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {listing.status !== 'SOLD' && (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleMarkAsSold}
                  disabled={isMarkingSold}
                >
                  {isMarkingSold ? <Loader2 className="animate-spin mr-2" size={16} /> : <CheckCircle2 size={16} className="mr-2" />}
                  Mark as Sold
                </Button>
              )}
            </Card>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-slate-400">Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {listing.description || "No description provided."}
            </p>
          </div>

          {/* Action Buttons - Only for non-owners */}
          {user?.id !== listing.seller.id && (
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 font-semibold"
                onClick={handleStartChat}
                disabled={isMessaging}
              >
                {isMessaging ? <Loader2 className="animate-spin" /> : (
                  <><MessageSquare size={18} className="mr-2" /> Contact Seller</>
                )}
              </Button>
              <Button
                variant="outline"
                className={`h-12 w-12 ${listing.isSaved
                  ? 'text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200'
                  }`}
                onClick={handleToggleSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Heart size={22} fill={listing.isSaved ? 'currentColor' : 'none'} />}
              </Button>
            </div>
          )}

          {/* Meta Info */}
          <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-sm text-slate-500">
            <Clock size={14} />
            <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}