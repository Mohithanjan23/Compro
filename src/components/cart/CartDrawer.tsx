import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const CartDrawer = () => {
    const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, total, checkout } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white text-ink">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <ShoppingBag className="text-emerald-500" />
                                Your Compro Cart
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                    <ShoppingBag size={48} className="opacity-20" />
                                    <p className="text-sm font-medium">Your cart is empty</p>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-emerald-500 font-bold text-sm hover:underline"
                                    >
                                        Start Browsing
                                    </button>
                                </div>
                            ) : (
                                items.map(item => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100"
                                    >
                                        <div className="w-20 h-20 bg-white rounded-lg p-2 flex items-center justify-center shrink-0">
                                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-sm text-ink line-clamp-2">{item.name}</h3>
                                                    <button onClick={() => removeFromCart(item.id)}>
                                                        <X size={14} className="text-slate-400 hover:text-red-500" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 capitalize">{item.platform} • {item.brand}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="font-bold text-ink">₹{item.price.toLocaleString()}</p>
                                                <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="text-slate-400 hover:text-ink disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="text-slate-400 hover:text-ink"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-4 border-t border-slate-100 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-500 text-sm font-medium">Total</span>
                                    <span className="text-2xl font-extrabold text-ink">₹{total.toLocaleString()}</span>
                                </div>
                                <button
                                    disabled={loading}
                                    onClick={async () => {
                                        if (!user) {
                                            setIsOpen(false);
                                            navigate('/login');
                                            return;
                                        }
                                        setLoading(true);
                                        try {
                                            await checkout(user.id);
                                            setIsOpen(false);
                                            navigate('/order-success');
                                        } catch (error) {
                                            console.error('Checkout failed', error);
                                            // alert('Checkout failed, please try again');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-slate-900 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                                    {!loading && <ArrowRight size={18} />}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
