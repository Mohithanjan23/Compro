import { useState, useEffect } from 'react';

export interface HistoryItem {
    term: string;
    timestamp: number;
}

export interface WishlistItem {
    id: string;
    name: string;
    image: string;
    price: number;
    store: string;
    timestamp: number;
}

export const useLocalVault = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('compro-history');
        const savedWishlist = localStorage.getItem('compro-wishlist');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    }, []);

    const addToHistory = (term: string) => {
        setHistory(prev => {
            const newHistory = [{ term, timestamp: Date.now() }, ...prev.filter(h => h.term !== term)].slice(0, 20);
            localStorage.setItem('compro-history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const addToWishlist = (item: Omit<WishlistItem, 'timestamp'>) => {
        setWishlist(prev => {
            if (prev.some(i => i.id === item.id)) return prev;
            const newWishlist = [{ ...item, timestamp: Date.now() }, ...prev];
            localStorage.setItem('compro-wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlist(prev => {
            const newWishlist = prev.filter(i => i.id !== id);
            localStorage.setItem('compro-wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('compro-history');
    };

    const clearWishlist = () => {
        setWishlist([]);
        localStorage.removeItem('compro-wishlist');
    };

    return {
        history,
        wishlist,
        addToHistory,
        addToWishlist,
        removeFromWishlist,
        clearHistory,
        clearWishlist
    };
};
