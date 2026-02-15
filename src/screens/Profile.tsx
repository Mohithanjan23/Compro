import { User, Settings, CreditCard, Bell, LogOut, Copy, Check, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
    const { user, signOut } = useAuth();
    const [copied, setCopied] = useState(false);

    // Use fallback if user metadata is missing (e.g. initial load or partial mock)
    const email = user?.email || "guest@compro.co";
    const name = user?.user_metadata?.full_name || "Guest User";
    const comproId = email.replace('@', '.') + "@compro.co"; // Simple mock generation

    const handleCopy = () => {
        navigator.clipboard.writeText(comproId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSignOut = async () => {
        await signOut();
        window.location.href = '/';
    };

    return (
        <div className="max-w-md mx-auto px-6 pt-8 pb-24">
            {/* Header / Coins */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-azure to-emerald flex items-center justify-center text-white text-2xl font-serif italic shadow-lg shadow-azure/30">
                        {name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif italic text-ink">{name}</h1>
                        <p className="text-sm text-slate-500">Gold Member</p>
                    </div>
                </div>
                <div className="bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 border border-amber-200">
                    <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white">C</div>
                    450 Coins
                </div>
            </div>

            {/* Compro ID Card */}
            <div className="bg-gradient-to-br from-ink to-slate-800 rounded-2xl p-6 text-white shadow-xl shadow-ink/20 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield size={100} className="rotate-12" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-slate-300">
                        <Shield size={16} className="text-emerald-400" />
                        <span className="text-xs font-bold tracking-widest uppercase">My Compro ID</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-4 max-w-[250px]">
                        Use this email at checkout to auto-track orders and earn rewards.
                    </p>

                    <button
                        onClick={handleCopy}
                        className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-3 flex items-center justify-between transition-colors group-active:scale-[0.99]"
                    >
                        <span className="font-mono text-emerald-400 font-bold tracking-wide">{comproId}</span>
                        {copied ? (
                            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                                <Check size={14} /> Copied
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold group-hover:text-white transition-colors">
                                <Copy size={14} /> Copy
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Spending Insights Chart */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Spending Insights</h3>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-end justify-between h-32 gap-2 mb-2">
                        {[
                            { label: 'Mon', h: '40%', amount: '₹1.2k' },
                            { label: 'Tue', h: '60%', amount: '₹2.4k' },
                            { label: 'Wed', h: '30%', amount: '₹800' },
                            { label: 'Thu', h: '85%', amount: '₹3.1k', active: true },
                            { label: 'Fri', h: '50%', amount: '₹1.5k' },
                            { label: 'Sat', h: '70%', amount: '₹2.8k' },
                            { label: 'Sun', h: '20%', amount: '₹500' },
                        ].map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="relative w-full flex items-end justify-center">
                                    <div
                                        style={{ height: day.h }}
                                        className={`w-full rounded-t-md transition-all duration-500 group-hover:opacity-80 ${day.active ? 'bg-ink' : 'bg-slate-200'}`}
                                    ></div>
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {day.amount}
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold ${day.active ? 'text-ink' : 'text-slate-400'}`}>{day.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 p-3 bg-slate-50 rounded-xl">
                        <span className="text-xs text-slate-500 font-medium">Total Spend (This Week)</span>
                        <span className="text-sm font-bold text-ink">₹12,300</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Connected Apps</h3>
                    <div className="space-y-3">
                        {['Zomato', 'Swiggy', 'Uber', 'Amazon'].map(app => (
                            <div key={app} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <span className="font-medium text-ink">{app}</span>
                                <span className="text-emerald text-xs font-bold bg-emerald/10 px-2 py-1 rounded">Connected</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Settings</h3>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {[
                            { icon: User, label: 'Account Details' },
                            { icon: Bell, label: 'Notifications' },
                            { icon: CreditCard, label: 'Payment Methods' },
                            { icon: Settings, label: 'Preferences' },
                        ].map((item, i) => (
                            <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                <item.icon size={18} className="text-slate-400" />
                                <span className="text-sm font-medium text-ink">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <button
                    onClick={handleSignOut}
                    className="w-full py-3 text-scarlet font-medium flex items-center justify-center gap-2 hover:bg-scarlet/5 rounded-xl transition-colors"
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </div>
    );
};
