import { Link } from 'react-router-dom';
import type { Listing } from '@/types';
import { Clock } from 'lucide-react';

export default function ListingCard({ item }: { item: Listing }) {
  const expiresAt = new Date(item.expiresAt);
  const now = new Date();
  const diffDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = diffDays <= 3 && diffDays > 0;

  return (
    <Link to={`/listings/${item.slug}`}>
      <div className="group">
        {/* Image Container */}
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 border border-gray-200 mb-3">
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              alt={item.title}
            />
          ) : item.images && item.images[0] ? (
            <img
              src={item.images[0].imageUrl}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              alt={item.title}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No Image
            </div>
          )}

          {/* SOLD Badge */}
          {item.status === 'SOLD' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm tracking-wide">SOLD</span>
            </div>
          )}

          {/* Expiring Soon Badge */}
          {item.status !== 'SOLD' && isExpiringSoon && (
            <div className="absolute top-2 right-2">
              <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                <Clock size={10} /> {diffDays}d left
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900 text-sm truncate group-hover:text-black transition-colors">
              {item.title}
            </h3>
            <span className="text-sm font-semibold text-black shrink-0">
              ${item.price}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {item.categoryDisplayName}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-500">
              {item.conditionDisplayName}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}