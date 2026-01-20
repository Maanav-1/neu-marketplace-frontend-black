import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        <Loader2 className="animate-spin text-gray-400 h-6 w-6" />
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={listing.images[currentImage]?.imageUrl || '/placeholder.png'}
              className={`object-cover w-full h-full ${listing.status === 'SOLD' ? 'grayscale opacity-60' : ''}`}
              alt={listing.title}
            />

            {/* SOLD overlay */}
            {listing.status === 'SOLD' && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold text-lg tracking-wide">SOLD</span>
              </div>
            )}

            {/* Image Navigation */}
            {listing.images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                  onClick={() => setCurrentImage(prev => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                  onClick={() => setCurrentImage(prev => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {listing.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImage(i)}
                  className={`h-14 w-14 rounded overflow-hidden border-2 shrink-0 transition-all ${currentImage === i
                      ? 'border-black'
                      : 'border-gray-200 opacity-60 hover:opacity-100'
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
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {listing.categoryDisplayName}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {listing.conditionDisplayName}
            </span>
          </div>

          {/* Title & Price */}
          <div>
            <h1 className="text-2xl font-semibold text-black">{listing.title}</h1>
            <p className="text-2xl font-semibold text-black mt-2">${listing.price}</p>
          </div>

          {/* Seller Card */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {listing.seller.profilePicUrl ? (
                  <img src={listing.seller.profilePicUrl} className="object-cover h-full w-full" alt="" />
                ) : (
                  <UserIcon size={18} className="text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-black">{listing.seller.name}</p>
                <p className="text-xs text-gray-500">Seller</p>
              </div>
            </div>
          </div>

          {/* Owner Controls */}
          {user?.id === listing.seller.id && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Manage</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-9 text-sm border-gray-200 hover:bg-gray-100"
                  onClick={() => navigate(`/listings/${listing.slug}/edit`)}
                >
                  <Edit size={14} className="mr-1.5" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex-1 h-9 text-sm text-red-600 border-gray-200 hover:bg-red-50">
                      <Trash2 size={14} className="mr-1.5" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border-gray-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-200">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {listing.status !== 'SOLD' && (
                <Button
                  className="w-full h-9 text-sm bg-black hover:bg-gray-800 text-white"
                  onClick={handleMarkAsSold}
                  disabled={isMarkingSold}
                >
                  {isMarkingSold ? <Loader2 className="animate-spin mr-1.5" size={14} /> : <CheckCircle2 size={14} className="mr-1.5" />}
                  Mark as Sold
                </Button>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {listing.description || "No description provided."}
            </p>
          </div>

          {/* Action Buttons - Only for non-owners */}
          {user?.id !== listing.seller.id && (
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 h-10 bg-black hover:bg-gray-800 text-white font-medium"
                onClick={handleStartChat}
                disabled={isMessaging}
              >
                {isMessaging ? <Loader2 className="animate-spin" /> : (
                  <><MessageSquare size={16} className="mr-1.5" /> Contact Seller</>
                )}
              </Button>
              <Button
                variant="outline"
                className={`h-10 w-10 border-gray-200 ${listing.isSaved
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                onClick={handleToggleSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Heart size={18} fill={listing.isSaved ? 'currentColor' : 'none'} />}
              </Button>
            </div>
          )}

          {/* Meta Info */}
          <div className="pt-4 border-t border-gray-200 flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={12} />
            <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}