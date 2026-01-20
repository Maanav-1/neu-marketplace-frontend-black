import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
            <div className="flex items-center gap-3 flex-wrap">
                {/* Condition Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                    {CONDITIONS.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => setFilters({ ...filters, condition: c.value })}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${filters.condition === c.value
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                                }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* Expand Price Filters */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpanded(!expanded)}
                    className={`rounded-full border-slate-200 hover:border-indigo-300 hover:text-indigo-600 ${expanded ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : ''
                        }`}
                >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Price
                    {expanded ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                </Button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full"
                    >
                        <X className="mr-1 h-3 w-3" /> Clear
                    </Button>
                )}
            </div>

            {/* Expandable Price Range */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center gap-3 pt-2">
                            <span className="text-sm text-slate-500 font-medium">Price:</span>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    className="w-24 pl-7 h-9 bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                                />
                            </div>
                            <span className="text-slate-300">—</span>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    className="w-24 pl-7 h-9 bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
