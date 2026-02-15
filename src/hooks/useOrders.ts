import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export interface Order {
    id: string;
    brand: string;
    item: string;
    price: string;
    date: string;
    status: 'delivered' | 'processing' | 'shipped' | 'out-for-delivery';
    logoBg: string;
    logoText: string;
}

const MOCK_ORDERS: Order[] = [
    { id: '1', brand: 'Amazon', item: 'Sony WH-1000XM5', price: '₹24,999', date: 'Today, 10:30 AM', status: 'out-for-delivery', logoBg: 'bg-orange-100', logoText: 'text-orange-600' },
    { id: '2', brand: 'Zomato', item: 'Meghana Foods - Biryani', price: '₹450', date: 'Yesterday', status: 'delivered', logoBg: 'bg-red-100', logoText: 'text-red-600' },
    { id: '3', brand: 'Myntra', item: 'Nike Air Jordan', price: '₹12,495', date: '2 days ago', status: 'shipped', logoBg: 'bg-pink-100', logoText: 'text-pink-600' },
    { id: '4', brand: 'Uber', item: 'Ride to Airport', price: '₹890', date: 'Last Week', status: 'delivered', logoBg: 'bg-slate-100', logoText: 'text-black' },
];

export const useOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            if (supabase) {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching orders:', error);
                } else if (data) {
                    setOrders(
                        (data as unknown[]).map((row: unknown) => {
                            const r = row as Record<string, unknown>;
                            return {
                                id: String(r.id),
                                brand: String(r.brand ?? ''),
                                item: String(r.item ?? ''),
                                price: String(r.price ?? ''),
                                date: String(r.date ?? ''),
                                status: (r.status ?? 'processing') as Order['status'],
                                logoBg: String(r.logo_bg ?? r.logoBg ?? 'bg-slate-100'),
                                logoText: String(r.logo_text ?? r.logoText ?? 'text-slate-600'),
                            };
                        })
                    );
                }
                setLoading(false);
            } else {
                setTimeout(() => {
                    setOrders(MOCK_ORDERS);
                    setLoading(false);
                }, 500);
            }
        };

        fetchOrders();

        // Realtime Subscription
        if (supabase) {
            const channel = supabase
                .channel('orders-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'orders',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        // Simple refetch or optimistic update. Refetch is safer for now.
                        console.log('Realtime update:', payload);
                        fetchOrders();
                    }
                )
                .subscribe();

            return () => {
                supabase?.removeChannel(channel);
            };
        }
    }, [user]);

    return { orders, loading };
};
