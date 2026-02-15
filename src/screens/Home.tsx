import { useNavigate } from 'react-router-dom';
import {
    Search,
    ShoppingBag,
    Utensils,
    Car,
    TrendingUp,
    Filter,
    ChevronRight,
    Menu,
    Zap,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

export const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        setSearchTrigger
    } = useSearch();

    const categories = [
        { id: 'food', label: 'Food', icon: Utensils },
        { id: 'shop', label: 'Shopping', icon: ShoppingBag },
        { id: 'ride', label: 'Rides', icon: Car },
    ];

    const history = ['Biryani', 'iPhone 15', 'Cab to Airport'];

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-ceramic/80 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
                <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-ink to-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-ceramic-md">
                            <span className="font-serif text-xl italic pt-1">C</span>
                        </div>
                        <span className="text-2xl font-serif italic tracking-wide text-ink pt-1">Compro</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div onClick={() => navigate('/profile')} className="bg-amber-100/80 backdrop-blur-sm text-amber-700 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 border border-amber-200/50 shadow-sm cursor-pointer hover:bg-amber-200/80 transition-colors">
                                <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white">C</div>
                                450
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-ink text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-ink/20 hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Sign In
                            </button>
                        )}
                        <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                            <Menu size={18} className="text-slate-600" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto px-6 pt-6 mb-24">

                {/* Hero Text */}
                <div className="mb-8 text-center pt-2 animate-in fade-in zoom-in duration-500">
                    <h1 className="text-5xl font-serif italic text-ink mb-2 leading-[0.9]">
                        Compare<br /><span className="text-emerald"> & Save.</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">The intelligent way to shop across apps.</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8 group z-20">

                    <div className="absolute inset-0 bg-gradient-to-r from-azure/20 to-emerald/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-2 flex items-center gap-2 transition-transform group-hover:-translate-y-1">
                        <Search className="text-slate-400 ml-3" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSearchTrigger(e.target.value);
                            }}
                            placeholder={`Try "${activeTab === 'food' ? 'Biryani' : activeTab === 'ride' ? 'Airport' : 'Nike Shoes'}..."`}
                            className="flex-1 bg-transparent border-none outline-none text-ink placeholder:text-slate-300 font-medium h-12"
                            onFocus={() => {
                                if (searchTerm) navigate('/results');
                            }}
                        />
                        <button
                            onClick={() => navigate('/results')}
                            className="bg-ink text-white p-3 rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        const isActive = activeTab === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${isActive
                                    ? 'bg-ink text-white shadow-lg shadow-ink/20 scale-105'
                                    : 'bg-white text-slate-400 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon size={16} className={isActive ? 'text-emerald-400' : ''} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Trending / History */}
                <div className="animate-in slide-in-from-bottom-5 duration-500 delay-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trending Near You</h3>
                        <Filter size={14} className="text-slate-400" />
                    </div>

                    <div className="space-y-3">
                        {history.map((term, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setSearchTerm(term);
                                    setSearchTrigger(term);
                                    navigate('/results');
                                }}
                                className="w-full bg-white hover:bg-slate-50 p-4 rounded-2xl flex items-center justify-between group transition-all border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald/10 text-emerald flex items-center justify-center">
                                        <TrendingUp size={16} />
                                    </div>
                                    <span className="text-slate-700 font-medium group-hover:text-ink">{term}</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-transform group-hover:translate-x-1" />
                            </button>
                        ))}
                    </div>

                    {/* Connect Accounts Card */}
                    <div className="mt-8 bg-gradient-to-br from-ink to-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-ink/20 group cursor-pointer">
                        <div className="relative z-10">
                            <h4 className="font-serif italic text-2xl text-white mb-2">Connect Accounts</h4>
                            <p className="text-xs text-slate-300 mb-4 max-w-[200px] leading-relaxed">
                                Link your email to auto-detect orders and apply hidden coupons.
                            </p>
                            <button
                                onClick={() => navigate('/profile')}
                                className="bg-white text-ink px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-ceramic transition-colors shadow-lg"
                            >
                                Connect Now
                            </button>
                        </div>
                        <div className="absolute -right-4 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                            <Zap size={140} className="text-white rotate-12" />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
