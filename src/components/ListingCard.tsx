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
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="group overflow-hidden border-zinc-800 bg-zinc-950 rounded-2xl relative">
          {/* Expiring Soon Badge */}
          {isExpiringSoon && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-red-500/10 text-red-500 border-red-500/20 backdrop-blur-md px-2 py-1 flex gap-1 items-center">
                <Clock size={10} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">{diffDays} days left</span>
              </Badge>
            </div>
          )}

          <div className="aspect-square relative overflow-hidden bg-zinc-900">
            {item.images && item.images[0] ? (
              <img 
                src={item.images[0].imageUrl} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                alt={item.title} 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-700 font-bold text-xs uppercase tracking-widest">No Image</div>
            )}
            <div className="absolute top-3 left-3">
              <Badge className="bg-black/60 backdrop-blur-md border-zinc-700">{item.categoryDisplayName}</Badge>
            </div>
          </div>
          <div className="p-4 space-y-1">
            <h3 className="font-bold text-lg truncate tracking-tight">{item.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-xl font-black text-blue-500">${item.price}</span>
              <span className="text-xs text-zinc-500 uppercase font-medium">{item.conditionDisplayName}</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}