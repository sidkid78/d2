import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-10 rounded-3xl max-w-sm w-full shadow-xl shadow-slate-200 border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">

                <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/30">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>

                <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Agent Portal</h1>
                <p className="text-slate-500 font-medium mb-8">Sign in to manage your commission protection links.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5">Work Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white outline-none transition-all"
                            placeholder="agent@dwellingly.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        Enter Portal
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium tracking-wide">(Demo Mode: Any email will automatically log you in as a Mock Agent)</p>
                </div>
            </div>
        </div>
    );
};
