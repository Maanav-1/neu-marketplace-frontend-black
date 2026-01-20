
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { Condition } from '@/types';

interface FilterState {
  minPrice: string;
  maxPrice: string;
  condition: Condition | 'ALL';
}

interface FilterDrawerProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onApply: () => void;
}

const CONDITIONS: (Condition | 'ALL')[] = ['ALL', 'NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'];

export default function FilterDrawer({ filters, setFilters, onApply }: FilterDrawerProps) {
  const resetFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', condition: 'ALL' });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-14 rounded-2xl border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition-all px-6">
          <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-zinc-950 border-zinc-800 text-white w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-black tracking-tighter text-white">Refine Search</SheetTitle>
        </SheetHeader>

        <div className="py-8 space-y-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Price Range</h4>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">$</span>
                <Input
                  placeholder="Min"
                  type="number"
                  min="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 pl-7 h-11"
                />
              </div>
              <div className="w-2 h-[1px] bg-zinc-800" />
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">$</span>
                <Input
                  placeholder="Max"
                  type="number"
                  min="0"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 pl-7 h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Item Condition</h4>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilters({ ...filters, condition: c })}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${filters.condition === c
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                >
                  {c.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="absolute bottom-8 left-0 w-full px-6 flex-col gap-3">
          <Button onClick={onApply} className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl">
            Apply Filters
          </Button>
          <Button variant="ghost" onClick={resetFilters} className="w-full text-zinc-500 hover:text-white">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset All
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}