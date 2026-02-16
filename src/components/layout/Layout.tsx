import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { CartDrawer } from '../cart/CartDrawer';

export const Layout = () => {
    return (
        <div className="min-h-screen bg-ceramic text-ink font-sans selection:bg-azure/20 pb-20">
            <Outlet />
            <BottomNav />
            <CartDrawer />
        </div>
    );
};
