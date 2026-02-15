import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';
import { Zap } from 'lucide-react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-ceramic gap-4">
                <div className="relative">
                    <div className="w-14 h-14 border-[3px] border-azure/20 border-t-azure rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap size={20} className="text-azure animate-pulse" />
                    </div>
                </div>
                <p className="text-slate-500 text-sm font-medium">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
