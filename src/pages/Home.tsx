import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '@/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PackageSearch, Loader2, Plus, ArrowRight } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import CategorySidebar from '@/components/CategorySidebar';
import FilterBar from '@/components/FilterBar';
import Footer from '../components/Footer';
import { useAuthStore } from '@/store/authStore';

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
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Fixed Category Sidebar */}
      <div className="hidden lg:block w-52 shrink-0 border-r border-gray-200">
        <div className="p-4 h-full flex flex-col">
          <CategorySidebar selectedCategory={category} onSelect={setCategory} />
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              className="h-10 pl-10 bg-white border-gray-200 rounded-lg text-sm focus:border-gray-400 focus:ring-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Bar */}
          <FilterBar filters={filters} setFilters={setFilters} />

          {/* Sign-in CTA for non-authenticated users */}
          {!useAuthStore.getState().user && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Ready to sell?</p>
                  <p className="text-xs text-gray-500 mt-0.5">Sign in to list your items</p>
                </div>
                <Link to="/login">
                  <Button size="sm" className="bg-black hover:bg-gray-800 text-white text-xs h-8 px-3">
                    Sign In <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-end pt-2">
            <div>
              <h2 className="text-lg font-semibold text-black">
                {category === 'ALL' ? 'All Items' : category.replace('_', ' ')}
              </h2>
              {search && (
                <p className="text-gray-500 text-xs mt-0.5">Results for "{search}"</p>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {listings.length} items
            </span>
          </div>

          {/* Listings Grid */}
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <div className="aspect-square rounded-lg bg-gray-100 animate-pulse mb-3" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse mb-2 w-3/4" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {listings.map((item) => (
                    <ListingCard key={item.id} item={item} />
                  ))}
                </motion.div>

                {/* Load More */}
                {!isLastPage && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      variant="outline"
                      className="h-9 px-6 text-sm border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                    >
                      {loadingMore ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Plus size={14} /> Load More
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <PackageSearch className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-sm font-medium text-gray-700">No items found</h3>
                <p className="text-gray-400 text-xs mt-1">
                  Try adjusting your filters or search query.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer - only on right side */}
          <Footer />
        </div>
      </div>
    </div>
  );
}