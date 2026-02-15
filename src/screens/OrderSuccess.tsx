import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

export const OrderSuccess = () => {
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Simple entrance animation trigger
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-ceramic flex items-center justify-center p-6">
            <div className={`max-w-sm w-full bg-white rounded-3xl p-8 shadow-2xl shadow-emerald/20 text-center transition-all duration-700 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                <div className="w-20 h-20 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-emerald animate-in zoom-in duration-500 delay-300" />
                </div>

                <h1 className="text-3xl font-serif italic text-ink mb-2">Order Placed!</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Your order has been successfully placed with the provider. You saved <span className="text-emerald font-bold">₹45</span> on this order!
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3.5 bg-ink text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={18} /> Return Home
                    </button>
                    <button
                        onClick={() => navigate('/history')}
                        className="w-full py-3.5 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                    >
                        View History
                    </button>
                </div>
            </div>
        </div>
    );
};
