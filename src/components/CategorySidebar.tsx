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
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 px-2">
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
                                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <cat.icon
                                        size={18}
                                        className={cn(
                                            isActive
                                                ? "text-indigo-600"
                                                : "text-slate-400 group-hover:text-slate-600"
                                        )}
                                    />
                                    {cat.label}
                                </div>
                                <ChevronRight
                                    size={14}
                                    className={cn(
                                        "opacity-0 transition-opacity text-indigo-500",
                                        isActive && "opacity-100"
                                    )}
                                />
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Notice Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Notice
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                    neu-Marketplace is an independent student project. This site is{' '}
                    <span className="text-slate-700 font-medium">not affiliated</span>{' '}
                    with Northeastern University.
                </p>
            </div>
        </div>
    );
}