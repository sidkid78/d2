import React, { useMemo, useEffect, useState } from 'react';
import { mockService } from '../services/MockService.ts';
import { calculateKPIs } from '../utils/analytics.ts';
import { InvitesList } from '../components/invites/InvitesList.tsx';
import { CreateInviteModal } from '../components/invites/CreateInviteModal.tsx';
import { Shield, Send, CheckCircle, Clock, Sparkles, Lightbulb } from 'lucide-react';
import type { BuyerInvite } from '../types/domain';
import { getAgentInsights } from '../services/aiService.ts';

export const DashboardPage: React.FC = () => {
    const [invites, setInvites] = useState<BuyerInvite[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nudges, setNudges] = useState<Record<string, string>>({});

    const loadInvites = async () => {
        const freshInvites = await mockService.listInvites();
        setInvites(freshInvites);
    };

    useEffect(() => {
        loadInvites();
    }, []);

    const kpis = useMemo(() => calculateKPIs(invites), [invites]);

    // Fetch AI insights for the most recent 3 invites
    useEffect(() => {
        const fetchNudges = async () => {
            const recent = invites.slice(0, 3);
            const nudgeMap: Record<string, string> = {};
            for (const invite of recent) {
                const nudge = await getAgentInsights(invite);
                if (nudge) nudgeMap[invite.id] = nudge;
            }
            setNudges(nudgeMap);
        };
        if (invites.length > 0) fetchNudges();
    }, [invites]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agent Dashboard</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage your commission protections</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-brand-500/20 transition-all hover:shadow-md hover:-translate-y-0.5 w-full sm:w-auto text-center"
                >
                    + New Protection Link
                </button>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Sent (7d)" value={kpis.sentLast7Days} icon={<Send size={20} />} color="text-blue-600 focus-visible:ring-blue-500" />
                <KpiCard
                    title="Protected (7d)"
                    value={kpis.signedLast7Days}
                    icon={<Shield size={20} />}
                    color="text-emerald-600 focus-visible:ring-emerald-500"
                    isProtectedHighlight={true}
                />
                <KpiCard title="Conversion" value={`${kpis.conversionRate.toFixed(0)}%`} icon={<CheckCircle size={20} />} color="text-brand-600 focus-visible:ring-brand-500" />
                <KpiCard title="Avg. Time to Sign" value={kpis.medianTimeToSignMinutes ? `${kpis.medianTimeToSignMinutes.toFixed(0)}m` : '--'} icon={<Clock size={20} />} color="text-amber-600 focus-visible:ring-amber-500" />
            </div>

            {/* Smart Nudges Panel */}
            {Object.keys(nudges).length > 0 && (
                <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl shadow-slate-200 border border-slate-800 animate-in slide-in-from-top-4 duration-500 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Sparkles size={120} />
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-brand-500 p-1.5 rounded-lg">
                            <Sparkles className="text-white w-4 h-4" />
                        </div>
                        <h2 className="font-black uppercase tracking-[0.2em] text-[10px] text-brand-400">Tactical Agent Insights</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {invites.slice(0, 3).map(invite => nudges[invite.id] && (
                            <div key={invite.id} className="flex items-start gap-4 bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-brand-500/50 transition-colors group">
                                <div className="bg-amber-500/10 p-2 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                                    <Lightbulb className="text-amber-400 shrink-0 w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{invite.buyerName}</p>
                                    <p className="text-sm font-medium leading-relaxed text-slate-100">"{nudges[invite.id]}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="font-bold text-slate-900">Recent Invites</h2>
                    <span className="bg-slate-100 text-slate-600 font-bold py-1 px-3 rounded-full text-xs">All Time</span>
                </div>
                <InvitesList invites={invites} />
            </section>

            <CreateInviteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={() => loadInvites()}
            />
        </div>
    );
};

const KpiCard = ({ title, value, icon, color, isProtectedHighlight }: any) => {
    const bgColor = color.replace('text-', 'bg-').replace('-600', '-100').split(' ')[0];

    return (
        <div className={`bg-white p-5 rounded-2xl border transition-all ${isProtectedHighlight ? 'border-emerald-200 shadow-lg shadow-emerald-100/50 scale-[1.02]' : 'border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start">
                <div className={`${color} ${bgColor} p-3 rounded-xl ring-1 ring-inset ring-black/5 relative`}>
                    {icon}
                    {isProtectedHighlight && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                </div>
            </div>
            <div className="mt-5">
                <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">{title}</p>
            </div>
        </div>
    );
};
