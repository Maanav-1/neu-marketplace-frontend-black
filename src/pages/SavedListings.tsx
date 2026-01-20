import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import ListingCard from '@/components/ListingCard';
import type { SavedItem } from '@/types';

export default function SavedListings() {
    const { user } = useAuthStore();

    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const { data } = await api.get('/saved');
                setSavedItems(data);
            } catch (err) {
                console.error("Failed to fetch saved items", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSaved();
    }, [user]);

    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto py-6 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Saved Items</h1>
                <p className="text-slate-500 mt-1">Items you've saved for later</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
                </div>
            ) : savedItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {savedItems.map(save => <ListingCard key={save.id} item={save.listing} />)}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium text-lg">No saved items yet</p>
                    <p className="text-slate-400 text-sm mt-1">Browse listings and save items you're interested in</p>
                </div>
            )}
        </div>
    );
}
