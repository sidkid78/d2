import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users } from 'lucide-react';

export const AgentLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-brand-500/20">D</div>
                        <span className="font-bold text-slate-900 tracking-tight">Dwellingly</span>
                    </div>

                    <nav className="hidden sm:flex items-center gap-4 border-l border-slate-100 pl-6 h-6">
                        <Link to="/app" className={`text-sm font-bold transition-colors ${isActive('/app') ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'}`}>Dashboard</Link>
                        <Link to="/app/invites" className={`text-sm font-bold transition-colors ${isActive('/app/invites') ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'}`}>Invites List</Link>
                    </nav>

                    <a
                        href="/dwellingly.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors hidden lg:inline-block border border-slate-200 px-2 py-0.5 rounded"
                    >
                        Marketing Site
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
                        {user?.name}
                    </span>
                    <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">Logout</button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto w-full">
                <Outlet />
            </main>

            <nav className="bg-white border-t border-slate-200 flex justify-around py-3 pb-safe sticky bottom-0 z-10 w-full sm:hidden">
                <Link to="/app" className={`flex flex-col items-center gap-1 ${isActive('/app') ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <LayoutDashboard size={20} />
                    <span className="text-[10px] font-semibold">Dashboard</span>
                </Link>
                <Link to="/app/invites" className={`flex flex-col items-center gap-1 ${isActive('/app/invites') ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Users size={20} />
                    <span className="text-[10px] font-semibold">Invites</span>
                </Link>
            </nav>
        </div >
    );
};
