import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2, RefreshCw, CheckCircle2, Plus } from 'lucide-react';
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
            toast({ title: "Done", description: "Item marked as sold." });
            fetchListings();
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Could not update." });
        } finally {
            setMarkingSoldId(null);
        }
    };

    const handleBump = async (listingId: number) => {
        setBumpingId(listingId);
        try {
            await api.patch(`/listings/${listingId}/bump`);
            toast({ title: "Renewed", description: "Listing active for 30 more days." });
            fetchListings();
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Could not renew." });
        } finally {
            setBumpingId(null);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-black">Your Listings</h1>
                    <p className="text-gray-500 text-sm mt-0.5">{myListings.length} items</p>
                </div>
                <Link to="/create">
                    <Button className="bg-black hover:bg-gray-800 text-white h-9 text-sm">
                        <Plus className="mr-1.5 h-4 w-4" /> New Listing
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-400 h-6 w-6" />
                </div>
            ) : myListings.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myListings.map(item => (
                        <div key={item.id} className="group space-y-2">
                            <ListingCard item={item} />

                            {/* Action Buttons */}
                            <div className="flex gap-1.5">
                                <button
                                    disabled={bumpingId === item.id || item.status === 'SOLD'}
                                    className="flex-1 h-7 text-xs font-medium border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-1 transition-colors"
                                    onClick={() => handleBump(item.id)}
                                >
                                    {bumpingId === item.id ? <Loader2 className="animate-spin h-3 w-3" /> : <><RefreshCw size={10} /> Renew</>}
                                </button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            disabled={markingSoldId === item.id || item.status === 'SOLD'}
                                            className="flex-1 h-7 text-xs font-medium border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-1 transition-colors"
                                        >
                                            {item.status === 'SOLD' ? <CheckCircle2 size={10} /> : "Sold?"}
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white border-gray-200">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Mark as Sold?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-gray-500">
                                                This will hide it from search but keep it in your history.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="border-gray-200">Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleMarkAsSold(item.id)}
                                                className="bg-black hover:bg-gray-800 text-white"
                                            >
                                                Confirm
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No listings yet</p>
                    <p className="text-gray-400 text-sm mt-1">Create your first listing to start selling</p>
                    <Link to="/create">
                        <Button className="mt-4 bg-black hover:bg-gray-800 text-white h-9 text-sm">Create Listing</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
