import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, X, SlidersHorizontal } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { ResultCard } from '../components/ResultCard';
import { ComparisonLoader } from '../components/ComparisonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalVault } from '../hooks/useLocalVault';

type SortOption = 'best' | 'price' | 'time';

export const Results = () => {
    const navigate = useNavigate();
    const {
        searchTerm,
        setSearchTerm,
        results,
        loading,
        setSearchTrigger
    } = useSearch();

    const [sortBy, setSortBy] = useState<SortOption>('best');
    const [showFilters, setShowFilters] = useState(false);

    // Filter State
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [selectedStores, setSelectedStores] = useState<string[]>([]);
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    const { addToHistory } = useLocalVault();

    // Debounce Search Term & Save History
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== debouncedSearch) {
                setDebouncedSearch(searchTerm);
                setSearchTrigger(searchTerm);
                if (searchTerm.length > 2) {
                    addToHistory(searchTerm);
                }
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [searchTerm, setSearchTrigger, debouncedSearch, addToHistory]);

    // Derive available stores and price bounds from results
    const { availableStores, minPrice, maxPrice } = useMemo(() => {
        if (!results || results.length === 0) return { availableStores: [], minPrice: 0, maxPrice: 100000 };

        const stores = new Set<string>();
        let min = Infinity;
        let max = -Infinity;

        results.forEach(item => {
            item.platforms.forEach(p => {
                stores.add(p.name);
                if (p.price < min) min = p.price;
                if (p.price > max) max = p.price;
            });
        });

        // Add buffer to max price
        return {
            availableStores: Array.from(stores),
            minPrice: Math.floor(min),
            maxPrice: Math.ceil(max * 1.2)
        };
    }, [results]);

    // Initialize/Update filters when results change (only if not manually set?)
    // Actually, let's just keep the bounds dynamic but respect user selection if possible.
    // simpler: reset filters on new search?
    useEffect(() => {
        setPriceRange([minPrice, maxPrice]);
        setSelectedStores([]);
    }, [minPrice, maxPrice]); // simplified for now

    const filteredAndSortedResults = useMemo(() => {
        if (!results) return [];

        let filtered = results.filter(item => {
            const bestPrice = item.bestPrice;
            const inPriceRange = bestPrice >= priceRange[0] && bestPrice <= priceRange[1];

            // Store filter: Show item if ANY of its platforms match selected stores (OR logic)
            // If no stores selected, show all.
            const hasSelectedStore = selectedStores.length === 0 || item.platforms.some(p => selectedStores.includes(p.name));

            return inPriceRange && hasSelectedStore;
        });

        switch (sortBy) {
            case 'price':
                return filtered.sort((a, b) => a.bestPrice - b.bestPrice);
            case 'time':
                // best effort sort for time
                return filtered.sort((a, b) => (typeof a.fastestTime === 'number' && typeof b.fastestTime === 'number') ? a.fastestTime - b.fastestTime : 0);
            case 'best':
            default:
                return filtered;
        }
    }, [results, sortBy, priceRange, selectedStores]);

    const toggleStore = (store: string) => {
        setSelectedStores(prev =>
            prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]
        );
    };

    return (
        <div className="min-h-screen bg-ceramic">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-ceramic/95 backdrop-blur-xl border-b border-slate-200/50 supports-[backdrop-filter]:bg-ceramic/60">
                <div className="max-w-md mx-auto">
                    <div className="px-4 h-16 flex items-center gap-3">
                        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-500 hover:text-ink transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex-1 relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-ink transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-100/50 hover:bg-slate-100 focus:bg-white text-ink text-sm rounded-xl pl-9 pr-8 py-2.5 border border-transparent focus:border-slate-200 focus:ring-4 focus:ring-slate-100 outline-none transition-all shadow-sm"
                                placeholder="Search..."
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        navigate('/');
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink bg-slate-200/50 hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2.5 rounded-xl border transition-all ${showFilters ? 'bg-ink text-white border-ink' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                            <SlidersHorizontal size={18} />
                        </button>
                    </div>

                    {/* Filter Drawer / Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-white border-b border-slate-100"
                            >
                                <div className="px-4 pb-6 pt-2 space-y-6">
                                    {/* Sort Options */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Sort By</label>
                                        <div className="flex gap-2">
                                            {[
                                                { id: 'best', label: 'Best Match' },
                                                { id: 'price', label: 'Cheapest' },
                                                { id: 'time', label: 'Fastest' },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setSortBy(opt.id as SortOption)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${sortBy === opt.id
                                                        ? 'bg-slate-100 text-ink ring-2 ring-slate-200 ring-offset-1'
                                                        : 'text-slate-500 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Max Price</label>
                                            <span className="text-sm font-bold text-ink">₹{priceRange[1].toLocaleString()}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={minPrice}
                                            max={maxPrice}
                                            step={100}
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-ink"
                                        />
                                    </div>

                                    {/* Stores */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Stores</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableStores.map(store => (
                                                <button
                                                    key={store}
                                                    onClick={() => toggleStore(store)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedStores.includes(store)
                                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {store}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 pt-6 pb-24">
                {/* Loading State */}
                {loading && <ComparisonLoader />}

                {/* Results List */}
                {!loading && filteredAndSortedResults.length > 0 && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                Results
                            </h3>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                {filteredAndSortedResults.length} Found
                            </span>
                        </div>
                        <AnimatePresence mode='popLayout'>
                            {filteredAndSortedResults.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ResultCard item={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && filteredAndSortedResults.length === 0 && searchTerm && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-400 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-ink mb-1">No matches found</h3>
                        <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
                            adjust filters or try searching for something else.
                        </p>
                        <button
                            onClick={() => {
                                setPriceRange([minPrice, maxPrice]);
                                setSelectedStores([]);
                            }}
                            className="mt-6 text-sm font-bold text-azure hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};
