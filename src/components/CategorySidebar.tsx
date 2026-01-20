import {
    Book,
    Monitor,
    Armchair,
    Shirt,
    Bike,
    ChefHat,
    Gift,
    Layers,
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
        <div className="flex flex-col h-full">
            {/* Categories */}
            <div className="flex-1 space-y-1">
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3 px-2">
                    Categories
                </h3>
                {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.value;
                    return (
                        <button
                            key={cat.value}
                            onClick={() => onSelect(cat.value)}
                            className={cn(
                                "w-full flex items-center gap-2.5 px-2 py-1.5 rounded text-sm transition-colors",
                                isActive
                                    ? "text-black font-medium"
                                    : "text-gray-600 hover:text-black"
                            )}
                        >
                            <cat.icon
                                size={16}
                                className={cn(
                                    isActive ? "text-black" : "text-gray-400"
                                )}
                            />
                            {cat.label}
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Notice Card - at bottom */}
            <div className="mt-auto pt-4">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">Notice</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        An independent student project.{' '}
                        <span className="text-gray-700">Not affiliated</span>{' '}
                        with Northeastern University.
                    </p>
                </div>
            </div>
        </div>
    );
}