import { Wallet, Zap, Sparkles, MessageCircle, Youtube, Heart } from 'lucide-react';
import { PlatformCard } from './PlatformCard';
import type { ServiceResult } from '../hooks/useComparisonEngine';
import { useCart } from '../context/CartContext';
import { useLocalVault } from '../hooks/useLocalVault';

export const ResultCard = ({ item }: { item: ServiceResult }) => {
    const { addToCart } = useCart();
    const { addToWishlist } = useLocalVault();

    const handleAddToCart = (platform: ServiceResult['platforms'][0]) => {
        addToCart({
            id: `${item.id}-${platform.name}`,
            name: item.name,
            price: platform.finalPrice,
            brand: item.term, // Using term as brand proxy if needed, or item name
            image: item.image,
            quantity: 1,
            platform: platform.name
        });
        // Optional: toast.success('Added to cart');
    };

    return (
        <div className="bg-white rounded-3xl p-5 mb-8 border border-slate-100 shadow-xl shadow-ceramic-md animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
            {/* Header: Product & Savings */}
            <div className="flex items-center gap-4 mb-6 relative">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-sm border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-medium font-serif text-ink leading-tight mb-1 pr-8">
                        {item.name}
                    </h2>
                </div>
                <button
                    onClick={() => {
                        addToWishlist({
                            id: item.id,
                            name: item.name,
                            image: item.image,
                            price: item.bestPrice,
                            store: item.platforms[0]?.name || 'Unknown' // simplified
                        });
                        // alert("Saved to Vault");
                    }}
                    className="absolute top-0 right-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                    <Heart size={20} />
                </button>
            </div>

            {/* AI Summary & Score */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-ink text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-black/10">
                        <Zap size={14} className="fill-current" />
                        Compro Score: 9.2/10
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Based on 1,240+ reviews</span>
                </div>

                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Sparkles size={12} />
                        AI Summary
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold text-xs mt-0.5">+</span>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                <span className="font-semibold text-ink">Exceptional battery life.</span> Validated by 45 verified buyers on Reddit/YouTube.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold text-xs mt-0.5">+</span>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                <span className="font-semibold text-ink">Best-in-class camera.</span> Experts agree it outperforms competitors in low light.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-red-500 font-bold text-xs mt-0.5">-</span>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Charging speed is average compared to Android flagships.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => alert("Compro AI Chat is coming soon! Check back later.")}
                        className="flex-1 bg-white border border-slate-200 text-ink text-sm font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 active:scale-95"
                    >
                        <MessageCircle size={16} />
                        Ask Compro
                    </button>
                    <button
                        onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(item.name + ' review')}`, '_blank')}
                        className="flex-1 bg-white border border-slate-200 text-ink text-sm font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Youtube size={16} className="text-red-600" />
                        Watch Reviews
                    </button>
                </div>
            </div>

            {/* Savings Banner */}
            {item.savings > 0 && (
                <div className="bg-emerald/10 rounded-xl p-3 flex items-center gap-3 mb-6">
                    <Wallet className="text-emerald fill-emerald/20" size={20} />
                    <span className="text-sm font-bold text-emerald">
                        Compro AI just saved you ₹{item.savings.toLocaleString()}
                    </span>
                </div>
            )}

            {/* Stores List */}
            <div>
                <div className="flex items-center gap-1 mb-3">
                    <h3 className="text-lg font-bold text-ink">Recommended Stores ({item.platforms.length})</h3>
                </div>
                <div className="flex flex-col">
                    {item.platforms.map((platform, idx) => (
                        <PlatformCard
                            key={`${item.id}-${idx}`}
                            platform={platform}
                            bestPrice={item.bestPrice}
                            fastest={item.fastestTime}
                            onAddToCart={() => handleAddToCart(platform)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
