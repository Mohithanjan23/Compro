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

// --- MOCK DATA GENERATOR ---
const generateMockData = () => {
    // Food
    const foodPrefixes = ['Spicy', 'Cheesy', 'Grilled', 'Crispy', 'Classic', 'Maharaja', 'Veg', 'Chicken', 'Paneer', 'Egg', 'Hyderabadi', 'Mexican'];
    const foodItems = ['Burger', 'Pizza', 'Biryani', 'Pasta', 'Dosa', 'Sandwich', 'Tacos', 'Sushi', 'Salad', 'Roll', 'Noodles', 'Thali', 'Momos', 'Kebab'];
    const foodSuffixes = ['Supreme', 'Delight', 'Special', 'Combo', 'XL', 'Bowl', 'Platter', 'Wrap', 'Box', 'Meal'];

    // Shop (Specific Real World Brands)
    const shopBrands = [
        'Nike', 'Adidas', 'Puma', 'New Balance', 'Asics', // Shoes
        'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Nothing', // Phones
        'Sony', 'Bose', 'JBL', 'Marshall', // Audio
        'Dell', 'HP', 'Lenovo', 'MacBook', 'Asus', // Laptops
        'Zara', 'H&M', 'Levis', 'Uniqlo', 'Gucci', 'Prada' // Fashion
    ];
    const shopItems = [
        'Air Jordan', 'Yeezy', 'UltraBoost', 'Air Max', 'Running Shoes', 'Sneakers', // Shoes
        'iPhone 15', 'iPhone 14', 'Galaxy S24', 'Pixel 8', 'Phone (2)', 'Redmi Note', // Phones
        'WH-1000XM5', 'QuietComfort', 'AirPods Pro', 'Earbuds', 'Headphones', // Audio
        'Air M2', 'Pro 14', 'XPS 13', 'Spectre', 'Legion', 'Laptop', // Laptops
        'T-Shirt', 'Jeans', 'Jacket', 'Hoodie', 'Dress', 'Bag', 'Watch' // Fashion
    ];
    const shopVariants = ['Pro', 'Ultra', 'Max', 'Lite', 'Plus', 'SE', 'Limited Edition', 'Black', 'White', 'Blue', 'Red'];

    // Ride
    const rideDestinations = ['Airport (T1)', 'Airport (T2)', 'Mall of India', 'Select Citywalk', 'Cyber Hub', 'Tech Park', 'Railway Station', 'Hospital', 'Home', 'Office'];
    const rideTypes = ['Uber Go', 'Uber Premier', 'Ola Mini', 'Ola Prime', 'BluSmart', 'Rapido Bike', 'Auto Rickshaw'];

    const generate = (category: string, count: number) => {
        const items: MockItem[] = [];
        for (let i = 0; i < count; i++) {
            let name = '';
            let term = '';
            let image = '';
            let platforms: any[] = [];

            if (category === 'food') {
                const prefix = foodPrefixes[Math.floor(Math.random() * foodPrefixes.length)];
                const item = foodItems[Math.floor(Math.random() * foodItems.length)];
                const suffix = foodSuffixes[Math.floor(Math.random() * foodSuffixes.length)];
                name = `${prefix} ${item} ${suffix}`;
                term = item.toLowerCase();
                image = `https://source.unsplash.com/200x200/?${item.toLowerCase()},food`;
                platforms = [
                    { name: 'Zomato', price: 100 + Math.floor(Math.random() * 400), deliveryTime: 20 + Math.floor(Math.random() * 40), rating: (3.5 + Math.random() * 1.5).toFixed(1) },
                    { name: 'Swiggy', price: 100 + Math.floor(Math.random() * 400), deliveryTime: 20 + Math.floor(Math.random() * 40), rating: (3.5 + Math.random() * 1.5).toFixed(1) }
                ];
            } else if (category === 'shop') {
                const brand = shopBrands[Math.floor(Math.random() * shopBrands.length)];
                const item = shopItems[Math.floor(Math.random() * shopItems.length)];
                const variant = shopVariants[Math.floor(Math.random() * shopVariants.length)];
                // Improve naming logic to avoid "Nike iPhone"
                // Simple heuristic: randomly pick, but in reality we should map brands to items.
                // For mock volume, random is okay, but let's try to be slightly coherent if we can, 
                // OR just rely on the Search to filter the "weird" ones or user ignores them.
                // Better: Just make the Name combining random but the Term include both.

                name = `${brand} ${item} ${variant}`;
                // Term should capture specific keywords for search
                term = `${brand} ${item}`.toLowerCase();
                image = `https://source.unsplash.com/200x200/?${item.split(' ')[0].toLowerCase()},product`;

                platforms = [
                    { name: 'Amazon', price: 1000 + Math.floor(Math.random() * 90000), deliveryTime: 'Tomorrow' },
                    { name: 'Flipkart', price: 1000 + Math.floor(Math.random() * 90000), deliveryTime: '2 Days' },
                    { name: 'Croma', price: 1000 + Math.floor(Math.random() * 95000), deliveryTime: 'Today' }
                ];
            } else if (category === 'ride') {
                const dest = rideDestinations[Math.floor(Math.random() * rideDestinations.length)];
                const type = rideTypes[Math.floor(Math.random() * rideTypes.length)];
                name = `Ride to ${dest}`;
                term = `${dest} ${type}`.toLowerCase();
                image = `https://source.unsplash.com/200x200/?car,traffic`;
                platforms = [
                    { name: 'Uber', price: 100 + Math.floor(Math.random() * 1000), deliveryTime: Math.floor(Math.random() * 15) },
                    { name: 'Ola', price: 100 + Math.floor(Math.random() * 1000), deliveryTime: Math.floor(Math.random() * 15) },
                    { name: 'InDrive', price: 80 + Math.floor(Math.random() * 900), deliveryTime: Math.floor(Math.random() * 20) }
                ];
            }

            items.push({
                id: `${category}-${i}`,
                term,
                name,
                image,
                platforms
            });
        }
        return items;
    };

    return {
        food: generate('food', 120),
        shop: generate('shop', 150),
        ride: generate('ride', 50)
    };
};

const MOCK_DB: Record<string, MockItem[]> = generateMockData();

export const useComparisonEngine = ({ searchTerm, category }: UseComparisonEngineProps) => {
    const [results, setResults] = useState<ServiceResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Immediate clear if empty
        if (!searchTerm) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);

            // REAL DATA CHECK: Only for 'shop' category and if Supabase is active
            let realData: Record<string, unknown>[] = [];
            let usedMock = true;

            if (supabase) {
                try {
                    let functionName = '';
                    if (category === 'shop') functionName = 'search-products';
                    if (category === 'food') functionName = 'search-food';
                    if (category === 'ride') functionName = 'search-ride';

                    if (functionName) {
                        // console.log(`Fetching real data for ${category}:`, searchTerm);
                        // Only fetch real data if SEARCHAPI_KEY is likely present or we want to try
                        const { data, error } = await supabase.functions.invoke(functionName, {
                            body: { query: searchTerm }
                        });

                        if (!error && data && Array.isArray(data) && data.length > 0) {
                            realData = data as Record<string, unknown>[];
                            usedMock = false;
                        }
                    }
                } catch (err) {
                    console.warn('Failed to fetch real data, using mock.', err);
                }
            }

            // SIMULATION DELAY (Only for mock comfort, but reduce it for responsiveness)
            if (usedMock) {
                await new Promise(resolve => setTimeout(resolve, 300)); // Reduced from 1000
            }

            const rawItems = usedMock ? (MOCK_DB[category] || []) : realData;

            const foundItems = usedMock
                ? (rawItems as MockItem[]).filter((item: MockItem) => {
                    // Cleaner tokenizer: handle multiple spaces, punctuation
                    const tokens = searchTerm.toLowerCase()
                        .replace(/[^\w\s]/g, '') // Remove punctuation
                        .split(/\s+/) // Split by whitespace
                        .filter(w => w.length > 0);

                    const itemText = (item.name + ' ' + item.term).toLowerCase();

                    // AND Logic: All tokens must be present
                    return tokens.every(token => itemText.includes(token));
                })
                : rawItems;

            // If we are using mock data and found no matches, return empty.
            // Do NOT generate fake results like "Ride to nike" or "Nike Pizza".
            let finalItems = foundItems;

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

        // NO DEBOUNCE HERE - Handled by UI
        fetchResults();

    }, [searchTerm, category]);

    return { results, loading };
};
