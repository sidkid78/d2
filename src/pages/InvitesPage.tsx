import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockService } from '../services/MockService.ts';
import { InvitesList } from '../components/invites/InvitesList.tsx';
import { ArrowLeft, Users } from 'lucide-react';
import type { BuyerInvite } from '../types/domain';

export const InvitesPage: React.FC = () => {
    const [invites, setInvites] = useState<BuyerInvite[]>([]);
    const [resendingId, setResendingId] = useState<string | null>(null);

    const load = async () => {
        const all = await mockService.listInvites();
        setInvites(all);
    };

    useEffect(() => {
        load();
    }, []);

    const handleResend = async (inviteId: string) => {
        setResendingId(inviteId);
        try {
            await mockService.resendInvite(inviteId);
            await load();
            setTimeout(() => setResendingId(null), 2000);
        } catch (error) {
            console.error('Failed to resend:', error);
            setResendingId(null);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 relative z-10">
            <Link to="/app" className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-white uppercase tracking-widest transition-all group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Return to Command Center
            </Link>

            <header className="glass-panel p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                    <Users size={160} className="text-primary" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white tracking-tight font-display mb-2">Protection Links</h1>
                    <p className="text-text-muted text-base">Review and manage every representation agreement in your account.</p>
                </div>
            </header>

            <section className="glass-panel rounded-2xl border border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
                <InvitesList
                    invites={invites}
                    onResend={handleResend}
                    resendingId={resendingId}
                />
            </section>
        </div>
    );
};
