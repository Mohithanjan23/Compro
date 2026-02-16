import { useNavigate } from 'react-router-dom';
import {
    Search,
    ShoppingBag,
    Utensils,
    Car,
    TrendingUp,
    ArrowRight,
    Zap,
    ShieldCheck,
    Lock
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { motion } from 'framer-motion';

export const Home = () => {
    const navigate = useNavigate();
    const {
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        setSearchTrigger
    } = useSearch();

    const categories = [
        { id: 'food', label: 'Food', icon: Utensils, color: 'bg-orange-500' },
        { id: 'shop', label: 'Shopping', icon: ShoppingBag, color: 'bg-blue-500' },
        { id: 'ride', label: 'Rides', icon: Car, color: 'bg-black' },
    ];

    const features = [
        {
            icon: ShieldCheck,
            title: "Unbiased Reviews",
            desc: "We aggregate real reviews from Reddit, YouTube, and verified buyers.",
            color: "bg-blue-500"
        },
        {
            icon: Zap,
            title: "Real-Time Lowest Price",
            desc: "Instant price comparison across Amazon, Walmart, Best Buy, and 1,000+ stores.",
            color: "bg-emerald-500"
        },
        {
            icon: Lock,
            title: "Privacy First",
            desc: "No ads. No tracking. We don't sell your data. Your history stays yours.",
            color: "bg-purple-500"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                            <Zap size={18} className="fill-current" />
                        </div>
                        <span className="text-xl font-bold font-serif tracking-tight text-ink">Compro</span>
                    </div>
                    <div>
                        {/* Guest / No Auth UI */}
                        <div
                            onClick={() => navigate('/vault')}
                            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200 transition-colors"
                        >
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Guest`} alt="Guest" className="w-full h-full rounded-full opacity-80" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto px-6 pt-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald/10 text-emerald text-[11px] font-bold tracking-wide uppercase mb-6 border border-emerald/20">
                        <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
                        The Truth Before You Buy
                    </div>
                    <h1 className="text-4xl font-extrabold font-serif text-ink mb-4 leading-tight tracking-tight">
                        Cut Through The Noise<br />Get The Truth
                    </h1>
                    <p className="text-slate-500 text-base leading-relaxed max-w-[320px] mx-auto">
                        Unbiased reviews from Reddit & YouTube, AI summaries, and real-time lowest price comparison. One click away.
                    </p>
                </motion.div>

                {/* Search Interaction */}
                <div className="relative mb-12 z-20">
                    {/* Floating Categories */}
                    <div className="flex justify-center gap-4 mb-6">
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeTab === cat.id;
                            return (
                                <motion.button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex flex-col items-center gap-2 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                                >
                                    <motion.div
                                        animate={{
                                            backgroundColor: isActive ? '#000000' : '#ffffff',
                                            color: isActive ? '#ffffff' : '#94a3b8',
                                            boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                        }}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isActive ? 'border-transparent' : 'border-slate-100'}`}
                                    >
                                        <Icon size={20} />
                                    </motion.div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{cat.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group relative"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-2 pl-4 flex items-center">
                            <Search className="text-slate-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setSearchTrigger(e.target.value);
                                }}
                                placeholder={`Search for ${activeTab === 'food' ? 'Biryani' : activeTab === 'ride' ? 'a ride' : 'iPhone 15'}...`}
                                className="flex-1 bg-transparent border-none outline-none text-ink placeholder:text-slate-300 font-medium h-12 pl-3 text-lg"
                                onFocus={() => {
                                    if (searchTerm) navigate('/results');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') navigate('/results');
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/results')}
                                className="bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg shadow-black/20"
                            >
                                <ArrowRight size={20} />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-4 mb-12"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-slate-200 transition-colors"
                        >
                            <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center text-white shadow-md shrink-0`}>
                                <feature.icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-ink mb-1">{feature.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    {feature.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trending Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <TrendingUp size={16} className="text-emerald" />
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Trending Now</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                        {['iPhone 15 Pro', 'Nike Air Jordan', 'Sony WH-1000XM5', 'Nothing Phone 2'].map((item, i) => (
                            <motion.button
                                key={item}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                onClick={() => {
                                    setSearchTerm(item);
                                    setSearchTrigger(item);
                                    navigate('/results');
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="shrink-0 bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 shadow-sm whitespace-nowrap hover:border-black hover:text-black transition-colors"
                            >
                                {item}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
