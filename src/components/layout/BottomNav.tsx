import { Home, Search, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-200 safe-area-pb">
            <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-ink' : 'text-slate-400 hover:text-slate-600'}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <Home size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium mt-1">Home</span>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/results"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-azure' : 'text-slate-400 hover:text-slate-600'}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <Search size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium mt-1">Search</span>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/vault"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <Shield size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium mt-1">Vault</span>
                        </>
                    )}
                </NavLink>
            </div>
        </nav>
    );
};
