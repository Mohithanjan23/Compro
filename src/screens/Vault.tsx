import { ArrowLeft, Clock, Heart, Shield, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalVault } from '../hooks/useLocalVault';
import { useSearch } from '../context/SearchContext';
import { motion } from 'framer-motion';

export const Vault = () => {
    const navigate = useNavigate();
    const { history, wishlist, clearHistory, clearWishlist } = useLocalVault();
    const { setSearchTerm, setSearchTrigger } = useSearch();

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setSearchTrigger(term);
        navigate('/results');
    };

    return (
        <div className="min-h-screen bg-ceramic pb-24">
            <header className="sticky top-0 z-50 bg-ceramic/95 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-500 hover:text-ink">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-serif font-bold text-ink flex items-center gap-2">
                            <Shield className="fill-emerald-100 text-emerald-600" size={18} />
                            Local Vault
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 py-8 space-y-10">

                {/* Privacy Badge */}
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <h3 className="text-emerald-800 font-bold mb-1 flex items-center gap-2">
                        <Shield size={16} />
                        Your Data Stays Here
                    </h3>
                    <p className="text-emerald-700/80 text-sm leading-relaxed">
                        History and Wishlist are stored only on this device. Compro servers never see this data.
                    </p>
                </div>

                {/* History Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={14} />
                            Recent Searches
                        </h2>
                        {history.length > 0 && (
                            <button
                                onClick={clearHistory}
                                className="text-xs font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    {history.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                            {history.map((item, idx) => (
                                <motion.button
                                    key={item.term + idx}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSearch(item.term)}
                                    className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all text-left"
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Search size={14} />
                                    </div>
                                    <span className="font-medium text-ink flex-1">{item.term}</span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-400 text-sm">No recent history</p>
                        </div>
                    )}
                </section>

                {/* Wishlist Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Heart size={14} />
                            Saved Items
                        </h2>
                        {wishlist.length > 0 && (
                            <button
                                onClick={clearWishlist}
                                className="text-xs font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {wishlist.map((item) => (
                                <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex gap-3">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-50" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-ink text-sm truncate">{item.name}</h4>
                                        <p className="text-emerald-600 font-bold text-sm">₹{item.price.toLocaleString()}</p>
                                        <p className="text-slate-400 text-xs">{item.store}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-400 text-sm">Your wishlist is empty</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};
