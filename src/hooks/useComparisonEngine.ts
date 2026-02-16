import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface PlatformResult {
    name: string;
    price: number;
    deliveryTime: number | string; // mins or "Tomorrow"
    rating: number;
    deliveryFee: number;
    taxes: number;
    discountCode?: string;
    discountAmount: number;
    color: string; // Tailwind class for logo bg
    link?: string; // URL to buy
    // Computed
    finalPrice: number;
    tags: {
        isCheapest: boolean;
        isFastest: boolean;
    };
}

export interface ServiceResult {
    id: string;
    term: string;
    name: string;
    image: string;
    platforms: PlatformResult[];
    category: 'food' | 'shop' | 'ride';
    // Computed
    bestPrice: number;
    fastestTime: number;
    savings: number; // Max price - Min price
}

interface UseComparisonEngineProps {
    searchTerm: string;
    category: string;
}

interface MockItem {
    id: string;
    term: string;
    name: string;
    image: string;
    platforms: Array<Record<string, unknown>>;
}

// MOCK DB (Fallback)
const MOCK_DB: Record<string, MockItem[]> = {
    food: [
        {
            id: 'f1',
            term: 'biryani',
            name: 'Hyderabadi Chicken Dum Biryani',
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop',
            platforms: [
                { name: 'Zomato', price: 350, deliveryTime: 35, rating: 4.2, deliveryFee: 40, taxes: 25, discountCode: 'ZOMATO60', discountAmount: 100, color: 'bg-red-600' },
                { name: 'Swiggy', price: 340, deliveryTime: 28, rating: 4.3, deliveryFee: 30, taxes: 25, discountCode: 'TRYNEW', discountAmount: 80, color: 'bg-orange-500' },
                { name: 'MagicPin', price: 350, deliveryTime: 45, rating: 4.0, deliveryFee: 10, taxes: 20, discountCode: 'ONDC50', discountAmount: 150, color: 'bg-purple-600' },
            ]
        },
        // ... (Keep existing mock data for food/rides/shop as fallback) ...
    ],
    shop: [
        {
            id: 's1',
            term: 'iphone',
            name: 'iPhone 15 (128GB) - Black',
            image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200&h=200&fit=crop',
            platforms: [
                { name: 'Amazon', price: 72999, deliveryTime: 'Tomorrow', rating: 4.8, deliveryFee: 0, taxes: 0, discountCode: 'SBI Card', discountAmount: 4000, color: 'bg-yellow-500' },
                { name: 'Flipkart', price: 71999, deliveryTime: '2 Days', rating: 4.7, deliveryFee: 0, taxes: 0, discountCode: 'Axis Bank', discountAmount: 3500, color: 'bg-blue-500' },
                { name: 'Croma', price: 79900, deliveryTime: 'Today', rating: 4.5, deliveryFee: 99, taxes: 0, discountCode: 'STORE', discountAmount: 5000, color: 'bg-teal-600' },
            ]
        }
    ],
    ride: [
        {
            id: 'r1',
            term: 'cab',
            name: 'Ride to Airport (T1)',
            image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop',
            platforms: [
                { name: 'Uber', price: 850, deliveryTime: 4, rating: 4.8, deliveryFee: 0, taxes: 40, discountCode: 'UBERONE', discountAmount: 50, color: 'bg-black' },
                { name: 'Ola', price: 790, deliveryTime: 8, rating: 4.5, deliveryFee: 0, taxes: 35, discountCode: '', discountAmount: 0, color: 'bg-lime-600' },
                { name: 'BluSmart', price: 950, deliveryTime: 15, rating: 4.9, deliveryFee: 0, taxes: 0, discountCode: 'GREEN', discountAmount: 100, color: 'bg-blue-500' },
            ]
        }
    ]
};

export const useComparisonEngine = ({ searchTerm, category }: UseComparisonEngineProps) => {
    const [results, setResults] = useState<ServiceResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!searchTerm) {
            queueMicrotask(() => setResults([]));
            return;
        }

        const fetchResults = async () => {
            setLoading(true);

            // REAL DATA CHECK: Only for 'shop' category and if Supabase is active
            // NOTE: This assumes the edge function 'search-products' is deployed.
            // If not, it will fail and fall back to mock.
            let realData: Record<string, unknown>[] = [];
            let usedMock = true;

            if (supabase) {
                try {
                    let functionName = '';
                    if (category === 'shop') functionName = 'search-products';
                    if (category === 'food') functionName = 'search-food';
                    if (category === 'ride') functionName = 'search-ride';

                    if (functionName) {
                        console.log(`Fetching real data for ${category}:`, searchTerm);
                        const { data, error } = await supabase.functions.invoke(functionName, {
                            body: { query: searchTerm }
                        });

                        if (!error && data && Array.isArray(data)) {
                            realData = data as Record<string, unknown>[];
                            usedMock = false;
                        } else {
                            console.warn(`Edge Function Error (${functionName}):`, error);
                            if (error?.message?.includes('SEARCHAPI_KEY')) {
                                console.error('CRITICAL: SEARCHAPI_KEY is missing in Supabase Edge Function Secrets.');
                            }
                        }
                    }
                } catch (err) {
                    console.warn('Failed to fetch real data, using mock. Details:', err);
                }
            }

            // SIMULATION DELAY (Only if mocking, real data has its own network delay)
            if (usedMock) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const rawItems = usedMock ? (MOCK_DB[category] || []) : realData;

            const foundItems = usedMock
                ? (rawItems as MockItem[]).filter((item: MockItem) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.term.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : rawItems;

            // If we are using mock data and found no matches (e.g. searching "shoes" in "food" category or just missing mock data),
            // let's NOT return empty. Let's return a dynamic mock result so the user sees SOMETHING.
            // This prevents "Briyani" showing up for "Shoes" (actually Briyani wouldn't show up, but empty would).
            // But if the user saw Briyani, it means the filter passeed OR the source was different.

            // Fix: If foundItems is empty AND we are in mock mode, generate a generic mock item
            let finalItems = foundItems;
            if (usedMock && foundItems.length === 0 && searchTerm) {
                finalItems = [{
                    id: String(Math.random()),
                    term: searchTerm,
                    name: `${searchTerm} (Mock ${category} Result)`,
                    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop', // generic
                    platforms: (MOCK_DB[category]?.[0]?.platforms) || [] // borrow platforms from first item
                }];
            }

            const processedResults: ServiceResult[] = (finalItems as Array<MockItem | Record<string, unknown>>).map((item) => {
                const platformsRaw = Array.isArray((item as MockItem).platforms) ? (item as MockItem).platforms : [];
                const platforms: PlatformResult[] = platformsRaw.map((p: Record<string, unknown>) => {
                    const price = Number(p.price ?? 0);
                    const deliveryFee = Number(p.deliveryFee ?? 0);
                    const taxes = Number(p.taxes ?? 0);
                    const discountAmount = Number(p.discountAmount ?? 0);
                    return {
                        ...p,
                        finalPrice: price + deliveryFee + taxes - discountAmount,
                        tags: { isCheapest: false, isFastest: false }
                    } as PlatformResult;
                });

                // Calculate Stats
                const prices = platforms.map(p => p.finalPrice);
                const times = platforms.map(p => typeof p.deliveryTime === 'number' ? p.deliveryTime : 999);

                const minPrice = prices.length ? Math.min(...prices) : 0;
                const minTime = times.length ? Math.min(...times) : 0;
                const maxPrice = prices.length ? Math.max(...prices) : 0;

                // Assign flags
                platforms.forEach(p => {
                    p.tags.isCheapest = p.finalPrice === minPrice;
                    p.tags.isFastest = (typeof p.deliveryTime === 'number' ? p.deliveryTime : 999) === minTime;
                });

                // Sort platforms
                platforms.sort((a, b) => a.finalPrice - b.finalPrice);

                const i = item as Record<string, unknown>;
                return {
                    id: String(i.id ?? ''),
                    term: String(i.term ?? ''),
                    name: String(i.name ?? ''),
                    image: String(i.image ?? ''),
                    platforms,
                    category: category as ServiceResult['category'],
                    bestPrice: minPrice,
                    fastestTime: minTime,
                    savings: maxPrice - minPrice
                };
            });

            setResults(processedResults);
            setLoading(false);
        };

        // Debounce only for mock needed? No, standard debounce for API efficiency
        const timer = setTimeout(fetchResults, 800);
        return () => clearTimeout(timer);

    }, [searchTerm, category]);

    return { results, loading };
};
