import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const AgentLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Command Center', path: '/app/dashboard', icon: 'dashboard' },
        { name: 'Agreements', path: '/app/invites', icon: 'description' },
        { name: 'Contacts', path: '#', icon: 'group' },
        { name: 'Commissions', path: '#', icon: 'payments' },
    ];

    return (
        <div className="bg-background-dark text-text-main font-display min-h-screen flex h-screen overflow-hidden selection:bg-primary selection:text-white dark">
            {/* Sidebar */}
            <aside className="w-64 bg-black/60 backdrop-blur-lg border-r border-glass-border flex flex-col justify-between h-full hidden md:flex shrink-0 z-20">
                <div className="p-6 flex flex-col gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 rounded-lg p-2 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(48,137,118,0.2)]">
                            <span className="material-symbols-outlined text-3xl">home_work</span>
                        </div>
                        <div>
                            <h1 className="text-white text-lg font-bold leading-tight tracking-wide">Dwellingly</h1>
                            <p className="text-secondary-brand text-xs font-medium uppercase tracking-wider">Agent Portal</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive(item.path)
                                        ? 'bg-primary/10 border border-primary/20 text-primary shadow-[0_0_10px_rgba(48,137,118,0.1)] font-semibold'
                                        : 'text-text-muted hover:text-white hover:bg-white/5 font-medium'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t border-glass-border">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors mb-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                    <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm">
                        <div className="h-8 w-8 rounded-full bg-secondary-brand/30 border border-secondary-brand/50 overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-xs uppercase">
                            {user?.name?.substring(0, 2) || 'AM'}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Alex Morgan'}</p>
                            <p className="text-xs text-secondary-brand truncate">Production Agent</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
                {/* Background Glows */}
                <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-brand/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3"></div>

                {/* Mobile Header */}
                <header className="bg-black/60 backdrop-blur-lg border-b border-glass-border sticky top-0 z-30 px-6 py-4 md:hidden flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">home_work</span>
                        <h1 className="font-bold text-lg text-white">Dwellingly</h1>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-text-muted hover:text-white"
                    >
                        <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden">
                        <div className="bg-background-dark w-full p-6 border-b border-glass-border">
                            <nav className="flex flex-col gap-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                                ? 'bg-primary/10 border border-primary/20 text-primary'
                                                : 'text-text-muted hover:text-white'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                        <span className="font-semibold">{item.name}</span>
                                    </Link>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                    <span className="font-semibold">Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <div className="relative z-10 w-full h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
