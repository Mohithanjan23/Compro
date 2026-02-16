import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { ResultCard } from '../components/ResultCard';
import { ComparisonLoader } from '../components/ComparisonLoader';

type SortOption = 'best' | 'price' | 'time';

export const Results = () => {
    const navigate = useNavigate();
    const {
        searchTerm,
        setSearchTerm,
        activeTab,
        results,
        loading,
        setSearchTrigger
    } = useSearch();

    const [sortBy, setSortBy] = useState<SortOption>('best');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                setSearchTrigger(searchTerm);
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [searchTerm, setSearchTrigger]);

    const sortedResults = useMemo(() => {
        if (!results) return [];
        const sorted = [...results];
        switch (sortBy) {
            case 'price':
                return sorted.sort((a, b) => a.bestPrice - b.bestPrice);
            case 'time':
                // Assuming lowest fastestTime is better
                // fastestTime can be number or string ("30 mins"). Data model says number for comparison usually.
                // We'll trust the hook provided numbers.
                return sorted.sort((a, b) => (typeof a.fastestTime === 'number' && typeof b.fastestTime === 'number') ? a.fastestTime - b.fastestTime : 0);
            case 'best':
            default:
                // Default "Value Score" from hook is likely already sorted by best match, 
                // but let's assume 'savings' is a good proxy for 'best' if not.
                // Actually, let's trust the engine's default order for 'best'.
                return sorted; // The engine returns best matches first
        }
    }, [results, sortBy]);

    return (
        <div className="min-h-screen bg-ceramic">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-ceramic/95 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-500 hover:text-ink">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 text-ink text-sm rounded-xl pl-9 pr-8 py-2.5 border-none focus:ring-2 focus:ring-azure/50 outline-none"
                            placeholder="Search..."
                        />
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    navigate('/');
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink bg-slate-200 rounded-full p-0.5"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Bar */}
                {!loading && results.length > 0 && (
                    <div className="max-w-md mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'best', label: 'Best Value' },
                            { id: 'price', label: 'Cheapest' },
                            { id: 'time', label: 'Fastest' },
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSortBy(opt.id as SortOption)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${sortBy === opt.id
                                    ? 'bg-ink text-white border-ink shadow-md'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            <main className="max-w-md mx-auto px-4 pt-6 pb-24">
                {/* Loading State */}
                {loading && <ComparisonLoader />}

                {/* Results List */}
                {!loading && sortedResults.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                Sort: <span className="text-ink">{sortBy === 'price' ? 'Cheapest' : sortBy === 'time' ? 'Fastest' : 'Best Match'}</span>
                            </h3>
                            <span className="text-xs font-bold text-azure bg-azure/10 px-2 py-1 rounded-md">
                                {sortedResults.length} Found
                            </span>
                        </div>
                        {sortedResults.map(item => (
                            <ResultCard key={item.id} item={item} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && results.length === 0 && searchTerm && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-400 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-ink mb-1">No matches found</h3>
                        <p className="text-slate-500 text-sm">Try searching for something else in {activeTab}.</p>
                    </div>
                )}
            </main>
        </div>
    );
};
