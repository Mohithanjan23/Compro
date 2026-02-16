import React from 'react';
import type { PlatformResult } from '../hooks/useComparisonEngine';
import { ShoppingCart } from 'lucide-react';

interface PlatformCardProps {
    platform: PlatformResult;
    bestPrice: number;
    fastest: number | string;
    onAddToCart?: () => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, bestPrice, onAddToCart }) => {
    const isCheapest = platform.finalPrice === bestPrice;

    // Check for "Free delivery" text in deliveryTime or deliveryFee
    const isFreeDelivery = platform.deliveryFee === 0;

    return (
        <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-1 -mx-1 rounded-lg">
            {/* Left: Store Info */}
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm ${platform.color}`}>
                    {platform.name[0]}
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-ink text-sm leading-tight">{platform.name}</h3>
                    <div className="flex flex-col mt-1">
                        {isFreeDelivery && (
                            <span className="text-[10px] text-slate-500 font-medium">• Free delivery</span>
                        )}
                        <span className="text-[10px] text-emerald font-medium">• In stock</span>
                    </div>
                </div>
            </div>

            {/* Right: Price & Action */}
            <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                    <div className="text-lg font-bold text-ink leading-none">
                        ₹{platform.finalPrice.toLocaleString()}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Cheap Badge */}
                    {isCheapest && (
                        <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            LOWEST
                        </span>
                    )}

                    {/* Add to Cart Button */}
                    <button
                        onClick={onAddToCart}
                        className="bg-slate-100 hover:bg-slate-200 text-ink p-2 rounded-lg transition-colors active:scale-95"
                        title="Add to Cart"
                    >
                        <ShoppingCart size={16} />
                    </button>

                    {/* Buy Now Button */}
                    <a
                        href={platform.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-black/10 active:scale-95 flex items-center"
                    >
                        Buy Now
                    </a>
                </div>
            </div>
        </div>
    );
};
