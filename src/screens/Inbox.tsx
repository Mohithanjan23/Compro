import { Mail, Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { useState } from 'react';
import { useOrders, type Order } from '../hooks/useOrders';

export const Inbox = () => {
    const [filter, setFilter] = useState<'all' | 'updates'>('all');
    const { orders, loading } = useOrders();

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'out-for-delivery': return <Truck size={14} className="text-azure" />;
            case 'shipped': return <Package size={14} className="text-orange-500" />;
            case 'processing': return <Clock size={14} className="text-slate-400" />;
            case 'delivered': return <CheckCircle size={14} className="text-emerald" />;
        }
    };

    const getStatusText = (status: Order['status']) => {
        switch (status) {
            case 'out-for-delivery': return 'Out for Delivery';
            case 'shipped': return 'Shipped';
            case 'processing': return 'Processing';
            case 'delivered': return 'Delivered';
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'out-for-delivery': return 'bg-azure/10 text-azure';
            case 'shipped': return 'bg-orange-50 text-orange-600';
            case 'processing': return 'bg-slate-50 text-slate-500';
            case 'delivered': return 'bg-emerald/10 text-emerald';
        }
    };

    return (
        <div className="min-h-screen bg-ceramic pb-24">
            <header className="sticky top-0 z-50 bg-ceramic/95 backdrop-blur-xl border-b border-slate-200/50 px-6 h-16 flex items-center justify-between">
                <h1 className="text-2xl font-serif italic text-ink">Smart Inbox</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${filter === 'all' ? 'bg-ink text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('updates')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${filter === 'updates' ? 'bg-ink text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
                    >
                        Updates
                    </button>
                </div>
            </header>

            <div className="px-4 py-6 space-y-4">
                {/* Connection Status Card */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg shadow-slate-900/20 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Mail size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Email Tracking Active</h3>
                            <p className="text-xs text-slate-300">Scanning for new orders...</p>
                        </div>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-slate-400">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="text-slate-400 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-ink mb-1">No orders yet</h3>
                        <p className="text-slate-500 text-sm">Orders from connected apps will show up here.</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${order.logoBg} ${order.logoText} flex items-center justify-center font-bold text-xs`}>
                                        {order.brand[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-ink text-sm">{order.brand}</h3>
                                        <p className="text-xs text-slate-400">{order.date}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                            <div className="pl-[52px]">
                                <p className="text-sm font-medium text-slate-700 mb-1">{order.item}</p>
                                <p className="text-xs text-slate-500">{order.price}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
