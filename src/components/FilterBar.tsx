import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Condition } from '@/types';

interface FilterState {
    minPrice: string;
    maxPrice: string;
    condition: Condition | 'ALL';
}

interface FilterBarProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
}

const CONDITIONS: { value: Condition | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'Any' },
    { value: 'NEW', label: 'New' },
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'GOOD', label: 'Good' },
    { value: 'FAIR', label: 'Fair' },
    { value: 'POOR', label: 'Poor' },
];

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
    const [expanded, setExpanded] = useState(false);

    const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.condition !== 'ALL';

    const resetFilters = () => {
        setFilters({ minPrice: '', maxPrice: '', condition: 'ALL' });
    };

    return (
        <div className="w-full space-y-3">
            {/* Main Filter Bar */}
            <div className="flex items-center gap-2 flex-wrap">
                {/* Condition Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {CONDITIONS.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => setFilters({ ...filters, condition: c.value })}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all border ${filters.condition === c.value
                                    ? 'bg-black border-black text-white'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black'
                                }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* Expand Price Filters */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all border flex items-center gap-1 ${expanded
                            ? 'bg-gray-100 border-gray-300 text-black'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                >
                    Price
                    {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-0.5"
                    >
                        <X className="h-3 w-3" /> Clear
                    </button>
                )}
            </div>

            {/* Expandable Price Range */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-gray-500">Price:</span>
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    className="w-20 pl-5 h-7 text-xs bg-white border-gray-200 focus:border-gray-400 focus:ring-0"
                                />
                            </div>
                            <span className="text-gray-300">–</span>
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    className="w-20 pl-5 h-7 text-xs bg-white border-gray-200 focus:border-gray-400 focus:ring-0"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
