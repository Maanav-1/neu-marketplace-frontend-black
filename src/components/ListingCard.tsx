import { Link } from 'react-router-dom';
import type { Listing } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function ListingCard({ item }: { item: Listing }) {
  // Calculate days left until expiry
  const expiresAt = new Date(item.expiresAt);
  const now = new Date();
  const diffDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = diffDays <= 3 && diffDays > 0;

  return (
    <Link to={`/listings/${item.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Card className="group overflow-hidden border-slate-200 bg-white rounded-2xl relative shadow-sm hover:shadow-lg transition-shadow duration-300">
          {/* Expiring Soon Badge */}
          {isExpiringSoon && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-rose-50 text-rose-600 border-rose-200 px-2 py-1 flex gap-1 items-center">
                <Clock size={10} className="animate-pulse" />
                <span className="text-xs font-semibold">{diffDays} days left</span>
              </Badge>
            </div>
          )}

          {/* Image Container */}
          <div className="aspect-square relative overflow-hidden bg-slate-100">
            {item.images && item.images[0] ? (
              <img
                src={item.images[0].imageUrl}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                alt={item.title}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium text-sm">
                No Image
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 backdrop-blur-sm border-slate-200 text-slate-700 font-medium shadow-sm">
                {item.categoryDisplayName}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-slate-900 text-base truncate group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-indigo-600">
                ${item.price}
              </span>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full">
                {item.conditionDisplayName}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}