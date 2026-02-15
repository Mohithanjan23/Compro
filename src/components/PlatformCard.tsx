import React from 'react';
import { Zap, Clock, Star, Tag } from 'lucide-react';
import type { PlatformResult } from '../hooks/useComparisonEngine';

interface PlatformCardProps {
    platform: PlatformResult;
    bestPrice: number;
    fastest: number | string;
}

const deliveryTimeMinutes = (t: number | string): number =>
    typeof t === 'number' ? t : 999;

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, bestPrice, fastest }) => {
    const isCheapest = platform.finalPrice === bestPrice;
    const isFastest = deliveryTimeMinutes(platform.deliveryTime) === fastest;

    return (
        <div className={`relative p-4 mb-3 rounded-xl border transition-all duration-300 group ${isCheapest ? 'border-emerald/30 bg-emerald/5 shadow-sm' : 'border-slate-100 bg-white shadow-sm hover:border-slate-200'}`}>

            {/* Badges */}
            <div className="absolute -top-3 right-4 flex gap-2">
                {isCheapest && (
                    <span className="bg-emerald text-white text-[10px] tracking-wider font-bold px-2 py-1 rounded-full flex items-center shadow-md shadow-emerald/30 animate-in fade-in slide-in-from-bottom-2">
                        <Zap size={10} className="mr-1" /> BEST VALUE
                    </span>
                )}
                {isFastest && (
                    <span className="bg-azure text-white text-[10px] tracking-wider font-bold px-2 py-1 rounded-full flex items-center shadow-md shadow-azure/30 animate-in fade-in slide-in-from-bottom-2 delay-75">
                        <Clock size={10} className="mr-1" /> FASTEST
                    </span>
                )}
            </div>

            <div className="flex justify-between items-center">
                {/* Left: Platform Info */}
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md ${platform.color}`}>
                        {platform.name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-ink">{platform.name}</h3>
                        <div className="flex items-center text-xs text-slate-500">
                            <span className="mr-2 font-medium">
                                {typeof platform.deliveryTime === 'number' ? `${platform.deliveryTime} mins` : platform.deliveryTime}
                            </span>
                            <span className="flex items-center text-amber-500">
                                <Star size={10} className="fill-current mr-1" />{platform.rating}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Price Info */}
                <div className="text-right">
                    <div className={`text-xl font-bold ${isCheapest ? 'text-emerald' : 'text-ink'}`}>
                        ₹{platform.finalPrice}
                    </div>
                    {platform.discountAmount > 0 && (
                        <div className="text-xs text-slate-400 line-through">
                            ₹{platform.price + platform.deliveryFee + platform.taxes}
                        </div>
                    )}
                </div>
            </div>

            {/* Breakdown / Offers */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs">
                <div className="flex gap-2 text-slate-500">
                    {platform.deliveryFee > 0 ? (
                        <span>+ ₹{platform.deliveryFee} Del</span>
                    ) : (
                        <span className="text-emerald font-medium">Free Delivery</span>
                    )}
                    {platform.taxes > 0 && <span>+ ₹{platform.taxes} Tax</span>}
                </div>
                {platform.discountAmount > 0 && (
                    <div className="flex items-center text-scarlet font-medium bg-scarlet/5 px-2 py-1 rounded-md border border-scarlet/10">
                        <Tag size={12} className="mr-1" />
                        {platform.discountCode}: -₹{platform.discountAmount}
                    </div>
                )}
            </div>
        </div>
    );
};
