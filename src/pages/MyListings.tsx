import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';
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
import ListingCard from '@/components/ListingCard';
import type { Listing } from '@/types';

export default function MyListings() {
    const { user } = useAuthStore();
    const { toast } = useToast();

    const [myListings, setMyListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [bumpingId, setBumpingId] = useState<number | null>(null);
    const [markingSoldId, setMarkingSoldId] = useState<number | null>(null);

    const fetchListings = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data } = await api.get(`/users/${user.id}/listings`);
            setMyListings(data);
        } catch (err) {
            console.error("Failed to fetch listings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [user]);

    const handleMarkAsSold = async (listingId: number) => {
        setMarkingSoldId(listingId);
        try {
            await api.patch(`/listings/${listingId}/sold`);
            toast({ title: "Congratulations!", description: "Item marked as sold." });
            fetchListings();
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Could not update status." });
        } finally {
            setMarkingSoldId(null);
        }
    };

    const handleBump = async (listingId: number) => {
        setBumpingId(listingId);
        try {
            await api.patch(`/listings/${listingId}/bump`);
            toast({ title: "Listing Renewed!", description: "Your item is now active for another 30 days." });
            fetchListings();
        } catch (err) {
            toast({ variant: "destructive", title: "Bump failed", description: "Could not renew listing." });
        } finally {
            setBumpingId(null);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto py-6 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Listings</h1>
                    <p className="text-slate-500 mt-1">Manage your items on the marketplace</p>
                </div>
                <Link to="/create">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Package className="mr-2 h-4 w-4" /> New Listing
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
                </div>
            ) : myListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myListings.map(item => (
                        <div key={item.id} className="group relative space-y-3">
                            <ListingCard item={item} />

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={bumpingId === item.id || item.status === 'SOLD'}
                                    className="flex-1 rounded-lg border-slate-200 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 h-9"
                                    onClick={() => handleBump(item.id)}
                                >
                                    {bumpingId === item.id ? <Loader2 className="animate-spin h-3 w-3" /> : <><RefreshCw size={12} className="mr-1" /> Renew</>}
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={markingSoldId === item.id || item.status === 'SOLD'}
                                            className="flex-1 rounded-lg border-slate-200 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 h-9"
                                        >
                                            {item.status === 'SOLD' ? <CheckCircle2 size={12} /> : "Sold?"}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white border-slate-200">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-slate-900 font-semibold">Mark as Sold?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-slate-500">
                                                This will hide the item from the main feed but keep it on your profile for history.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="border-slate-200">Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleMarkAsSold(item.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                            >
                                                Confirm Sold
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium text-lg">Your inventory is empty</p>
                    <p className="text-slate-400 text-sm mt-1">Start selling by creating your first listing</p>
                    <Link to="/create">
                        <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700">Create Listing</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
