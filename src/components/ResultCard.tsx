import { Wallet } from 'lucide-react';
import { PlatformCard } from './PlatformCard';
import type { ServiceResult } from '../hooks/useComparisonEngine';
import { useCart } from '../context/CartContext';

export const ResultCard = ({ item }: { item: ServiceResult }) => {
    const { addToCart } = useCart();

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
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-sm border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-medium text-ink leading-tight mb-1">
                        {item.name}
                    </h2>
                </div>
            </div>

            {/* Savings Banner */}
            {item.savings > 0 && (
                <div className="bg-emerald/10 rounded-xl p-3 flex items-center gap-3 mb-6">
                    <Wallet className="text-emerald fill-emerald/20" size={20} />
                    <span className="text-sm font-bold text-emerald">
                        Flash AI just saved you ₹{item.savings.toLocaleString()}
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
