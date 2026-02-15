import { ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlatformCard } from './PlatformCard';
import type { ServiceResult } from '../hooks/useComparisonEngine';
import { useAuth } from '../context/AuthContext';

export const ResultCard = ({ item }: { item: ServiceResult }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    return (
        <div className="bg-white rounded-3xl p-5 mb-8 border border-slate-100 shadow-xl shadow-ceramic-md animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-5 mb-6">
                <div className="relative shrink-0">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-2xl object-cover shadow-md"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-ink text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white">
                        {item.platforms.length} APPS
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-serif italic text-ink mb-1 tracking-wide leading-none truncate">
                        {item.name}
                    </h2>
                    {item.savings > 0 && (
                        <div className="inline-flex items-center mt-2 text-xs font-bold text-emerald bg-emerald/10 px-3 py-1.5 rounded-full border border-emerald/20">
                            <TrendingUp size={12} className="mr-1.5" />
                            Save ₹{item.savings} instantly
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                {item.platforms.map((platform, idx) => (
                    <PlatformCard
                        key={`${item.id}-${idx}`}
                        platform={platform}
                        bestPrice={item.bestPrice}
                        fastest={item.fastestTime}
                    />
                ))}
            </div>

            <button
                onClick={() => {
                    if (!user) {
                        // If guest, redirect to login
                        navigate('/login');
                    } else {
                        navigate('/order-success');
                    }
                }}
                className="w-full mt-5 py-4 rounded-xl bg-azure hover:bg-sky-600 text-white font-bold transition-all shadow-lg shadow-azure/30 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
                {user ? 'Order Now' : 'Login to Order'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};
