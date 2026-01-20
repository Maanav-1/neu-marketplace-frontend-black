import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PackageSearch, Loader2, Plus } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import CategorySidebar from '@/components/CategorySidebar';
import FilterBar from '@/components/FilterBar';

// Type-only imports for TS strictness
import type { Listing, Category, Condition, PagedResponse } from '@/types';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Pagination State
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  // Advanced Filter State
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
        size: 12,
        sort: 'newest'
      };

      if (category !== 'ALL') params.category = category;

      // Safety Gate: Do not send negative values or non-numeric strings to backend
      const minVal = parseFloat(filters.minPrice);
      if (!isNaN(minVal) && minVal >= 0) {
        params.minPrice = filters.minPrice;
      }

      const maxVal = parseFloat(filters.maxPrice);
      if (!isNaN(maxVal) && maxVal >= 0) {
        params.maxPrice = filters.maxPrice;
      }

      if (filters.condition !== 'ALL') params.condition = filters.condition;

      const { data } = await api.get<PagedResponse<Listing>>('/listings', { params });

      // Append results for pagination or replace for new search
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

  // Triggered on category, search, or filter changes
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
    <div className="flex flex-col lg:flex-row gap-10">
      {/* 1. Category Sidebar */}
      <CategorySidebar selectedCategory={category} onSelect={setCategory} />

      {/* 2. Main Content Area */}
      <div className="flex-1 space-y-6">

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search textbooks, furniture, electronics..."
            className="h-12 pl-12 bg-white border-slate-200 rounded-xl text-base focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Inline Filter Bar */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* 3. Listings Section */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {category === 'ALL' ? 'Latest Discoveries' : category.replace('_', ' ')}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {search ? `Showing results for "${search}"` : 'Handpicked for the Northeastern community'}
              </p>
            </div>
            <span className="hidden sm:block text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              {listings.length} items
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 rounded-2xl bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="space-y-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {listings.map((item) => (
                    <ListingCard key={item.id} item={item} />
                  ))}
                </motion.div>

                {/* Load More Button */}
                {!isLastPage && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      variant="outline"
                      className="h-12 px-8 rounded-full border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300 font-semibold text-slate-700 shadow-sm transition-all"
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
                className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
              >
                <PackageSearch className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">No items found</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xs text-center">
                  Try adjusting your filters or searching for something else.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}