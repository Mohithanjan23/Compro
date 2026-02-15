import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Zap, Chrome } from 'lucide-react';

export const Login = () => {
    const navigate = useNavigate();
    const { signIn, isMock } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // If isMock is true, this will just simulate a login
            // If isMock is false, we need to implement real Supabase login in AuthContext
            await signIn(email, password);
            navigate('/');
        } catch {
            alert('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ceramic flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-azure/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200 z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-azure to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-azure/30">
                        <Zap size={32} className="text-white fill-white" />
                    </div>
                    <h1 className="text-2xl font-serif italic text-ink mb-1">Welcome Back</h1>
                    <p className="text-sm text-slate-400">Sign in to track your orders</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-11 pr-4 text-ink font-medium focus:ring-2 focus:ring-azure/20 outline-none transition-all placeholder:text-slate-300"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-11 pr-4 text-ink font-medium focus:ring-2 focus:ring-azure/20 outline-none transition-all placeholder:text-slate-300"
                                placeholder="••••••••"
                                required={!isMock} // Mock mode allows empty password
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-ink text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-ink/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <button
                        type="button"
                        className="w-full py-3.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Chrome size={20} /> Continue with Google
                    </button>
                </div>

                {isMock && (
                    <p className="text-xs text-center text-amber-500 mt-4 bg-amber-50 py-2 rounded-lg">
                        ⚠️ Running in Mock Mode. Any credentials work.
                    </p>
                )}
            </div>
        </div>
    );
};
