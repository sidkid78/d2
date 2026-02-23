import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            login(email);
            navigate('/app');
        }
    };

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-700">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[100px]"></div>

            <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] max-w-sm w-full border-white/5 shadow-2xl animate-in slide-in-from-bottom-8 fade-in duration-1000 relative z-10">
                {/* Glossy Overlay for the card */}
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_20px_rgba(48,137,118,0.15)] group hover:scale-105 transition-transform duration-500">
                    <ShieldCheck className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_8px_rgba(48,137,118,0.5)] transition-all" />
                </div>

                <div className="space-y-2 mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight font-display">Agent Portal</h1>
                    <p className="text-text-muted font-medium text-sm leading-relaxed">Sign in to manage your commission protection links.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-xs font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Work Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            className="glass-input w-full px-5 py-4 rounded-2xl text-base"
                            placeholder="agent@dwellingly.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4.5 px-6 rounded-2xl shadow-[0_8px_25px_rgba(48,137,118,0.25)] hover:shadow-[0_12px_35px_rgba(48,137,118,0.4)] border border-primary/30 transition-all transform hover:-translate-y-1 active:translate-y-0 text-base flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                        <span className="relative z-10">Enter Portal</span>
                        <Lock size={18} className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/2 border border-white/5 rounded-full transition-colors hover:bg-white/4">
                        <span className="material-symbols-outlined text-primary text-[14px]">info</span>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">(Demo Mode: Auto Login Active)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
