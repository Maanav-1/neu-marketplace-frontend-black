import { motion } from 'framer-motion';
import {
    Book,
    Monitor,
    Armchair,
    Shirt,
    Bike,
    ChefHat,
    Gift,
    Layers,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

const CATEGORIES: { label: string; value: Category | 'ALL'; icon: any }[] = [
    { label: 'All Items', value: 'ALL', icon: Layers },
    { label: 'Textbooks', value: 'TEXTBOOKS', icon: Book },
    { label: 'Electronics', value: 'ELECTRONICS', icon: Monitor },
    { label: 'Furniture', value: 'FURNITURE', icon: Armchair },
    { label: 'Clothing', value: 'CLOTHING', icon: Shirt },
    { label: 'Bikes & Scooters', value: 'BIKES', icon: Bike },
    { label: 'Kitchen', value: 'KITCHEN', icon: ChefHat },
    { label: 'Free Stuff', value: 'FREE_STUFF', icon: Gift },
    { label: 'Other', value: 'OTHER', icon: Layers },
];

interface CategorySidebarProps {
    selectedCategory: Category | 'ALL';
    onSelect: (category: Category | 'ALL') => void;
}

export default function CategorySidebar({ selectedCategory, onSelect }: CategorySidebarProps) {
    return (
        <div className="w-64 hidden lg:block space-y-6">
            <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 px-2">
                    Categories
                </h3>
                <div className="space-y-1">
                    {CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.value;
                        return (
                            <motion.button
                                key={cat.value}
                                onClick={() => onSelect(cat.value)}
                                whileHover={{ x: 4 }}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-500 border border-blue-500/20"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <cat.icon size={18} className={cn(isActive ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300")} />
                                    {cat.label}
                                </div>
                                <ChevronRight size={14} className={cn("opacity-0 transition-opacity", isActive && "opacity-100")} />
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                    Notice
                </p>
                <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                    neu-Marketplace is an independent student project. This site is <span className="text-zinc-400 font-bold">not affiliated</span> with Northeastern University.
                </p>
            </div>
        </div>
    );
}