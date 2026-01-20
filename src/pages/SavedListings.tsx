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
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-black">Saved Items</h1>
                <p className="text-gray-500 text-sm mt-0.5">{savedItems.length} items</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-400 h-6 w-6" />
                </div>
            ) : savedItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {savedItems.map(save => <ListingCard key={save.id} item={save.listing} />)}
                </div>
            ) : (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
                    <Heart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No saved items</p>
                    <p className="text-gray-400 text-sm mt-1">Browse listings and save items you're interested in</p>
                </div>
            )}
        </div>
    );
}
