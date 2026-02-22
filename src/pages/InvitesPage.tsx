import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockService } from '../services/MockService.ts';
import { InvitesList } from '../components/invites/InvitesList.tsx';
import { ArrowLeft, Users } from 'lucide-react';
import type { BuyerInvite } from '../types/domain';

export const InvitesPage: React.FC = () => {
    const [invites, setInvites] = useState<BuyerInvite[]>([]);

    useEffect(() => {
        const load = async () => {
            const all = await mockService.listInvites();
            setInvites(all);
        };
        load();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <Link to="/app" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Users size={100} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Protection Links</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Review and manage every representation invite in your account</p>
                </div>
            </header>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <InvitesList invites={invites} />
            </section>
        </div>
    );
};
