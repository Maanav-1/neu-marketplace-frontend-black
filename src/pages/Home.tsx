import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PackageSearch, Loader2, Plus } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import CategorySidebar from '@/components/CategorySidebar';
import FilterBar from '@/components/FilterBar';

import type { Listing, Category, Condition, PagedResponse } from '@/types';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    condition: 'ALL' as Condition | 'ALL'
  });

  const fetchListings = async (pageNum: number, isNewSearch: boolean = false) => {
    try {
      pageNum === 0 ? setLoading(true) : setLoadingMore(true);

      const params: any = {
        search: search.trim(),
        page: pageNum,
        size: 16,
        sort: 'newest'
      };

      if (category !== 'ALL') params.category = category;

      const minVal = parseFloat(filters.minPrice);
      if (!isNaN(minVal) && minVal >= 0) params.minPrice = filters.minPrice;

      const maxVal = parseFloat(filters.maxPrice);
      if (!isNaN(maxVal) && maxVal >= 0) params.maxPrice = filters.maxPrice;

      if (filters.condition !== 'ALL') params.condition = filters.condition;

      const { data } = await api.get<PagedResponse<Listing>>('/listings', { params });

      if (isNewSearch) {
        setListings(data.content);
      } else {
        setListings(prev => [...prev, ...data.content]);
      }

      setIsLastPage(data.last);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(0);
    const delayDebounceFn = setTimeout(() => {
      fetchListings(0, true);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [category, search, filters]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage, false);
  };

  return (
    <div className="flex gap-8">
      {/* Category Sidebar */}
      <CategorySidebar selectedCategory={category} onSelect={setCategory} />

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search textbooks, furniture, electronics..."
            className="h-12 pl-12 bg-white border-slate-200 rounded-xl text-base shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Bar */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {category === 'ALL' ? 'Latest Discoveries' : category.replace('_', ' ')}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {search ? `Results for "${search}"` : 'For the Northeastern community'}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            {listings.length} items
          </span>
        </div>

        {/* Listings Grid */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                {listings.map((item) => (
                  <ListingCard key={item.id} item={item} />
                ))}
              </motion.div>

              {/* Load More */}
              {!isLastPage && (
                <div className="flex justify-center">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    variant="outline"
                    className="h-11 px-8 rounded-full border-slate-300 bg-white hover:bg-slate-50 font-semibold"
                  >
                    {loadingMore ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <Plus size={16} /> Load More
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200"
            >
              <PackageSearch className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">No items found</h3>
              <p className="text-slate-500 text-sm mt-2">
                Try adjusting your filters or search query.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}