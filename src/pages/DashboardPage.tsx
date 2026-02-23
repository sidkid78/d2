import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../services/MockService.ts';
import { calculateKPIs } from '../utils/analytics.ts';
import { getAgentInsights } from '../services/aiService.ts';
import { generateRawToken } from '../lib/utils/crypto.ts';
import type { BuyerInvite } from '../types/domain';
import { Sparkles, Lightbulb } from 'lucide-react';

const TEMPLATE_MOCK = {
    id: 'tpl_tx_1501_2024',
    name: 'Texas Residential Buyer Representation Agreement',
    jurisdiction: 'TX' as const,
    version: '2024.1',
    compensationDisclosure: 'Broker compensation is not set by law and is fully negotiable.',
    summarySections: [
        { title: 'Exclusive Representation', content: 'You agree to work exclusively with me for the duration of this agreement.' },
        { title: 'Broker Compensation', content: 'Our brokerage fee is 3% of the sales price, payable at closing. If the seller offers compensation, it will be credited against this amount.' },
        { title: 'Term & Termination', content: 'This agreement lasts for 6 months but can be terminated by either party with 30 days written notice.' }
    ],
    fullText: 'Legal text placeholder for TREC 1501...'
};

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [invites, setInvites] = useState<BuyerInvite[]>([]);
    const [nudges, setNudges] = useState<Record<string, string>>({});
    const [newBuyerName, setNewBuyerName] = useState('');
    const [newBuyerEmail, setNewBuyerEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadInvites = async () => {
        const freshInvites = await mockService.listInvites();
        setInvites(freshInvites);
    };

    useEffect(() => {
        loadInvites();
    }, []);

    const kpis = useMemo(() => calculateKPIs(invites), [invites]);

    const getStatusInfo = (invite: BuyerInvite) => {
        if (invite.signatureData) return { label: 'Signed', color: 'primary', icon: 'check_circle' };
        if (invite.auditEvents.some(e => e.type === 'INVITE_VIEWED')) return { label: 'Viewed', color: 'amber', icon: 'visibility' };
        return { label: 'Sent', color: 'text-muted', icon: 'send' };
    };

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

    const handleQuickInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBuyerName || !newBuyerEmail) return;

        setIsSubmitting(true);
        try {
            const rawToken = generateRawToken();
            await mockService.createInvite({
                buyerName: newBuyerName,
                buyerContact: newBuyerEmail,
                templateSnapshot: TEMPLATE_MOCK,
            }, rawToken);

            setNewBuyerName('');
            setNewBuyerEmail('');
            await loadInvites();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8 relative z-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md font-display">Command Center</h1>
                    <p className="text-text-muted mt-1 text-base font-light">Manage your buyer agreements and commission status.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted bg-black/40 px-3 py-1.5 rounded-full border border-glass-border shadow-lg backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(48,137,118,0.8)]"></span>
                    System Operational
                </div>
            </div>

            {/* Quick Action & KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Action Card */}
                <div className="lg:col-span-2 glass-panel rounded-xl flex flex-col md:flex-row">
                    <div className="flex-1 p-6 flex flex-col justify-center relative z-10">
                        <div className="mb-5">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary drop-shadow-[0_0_5px_rgba(48,137,118,0.5)]">bolt</span>
                                Quick Action: Secure a Buyer
                            </h2>
                            <p className="text-text-muted text-sm mt-1">Send a representation agreement link instantly.</p>
                        </div>
                        <form onSubmit={handleQuickInvite} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">Buyer Name</label>
                                    <input
                                        className="w-full glass-input"
                                        placeholder="Full Name"
                                        type="text"
                                        value={newBuyerName}
                                        onChange={(e) => setNewBuyerName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">Email Address</label>
                                    <input
                                        className="w-full glass-input"
                                        placeholder="client@example.com"
                                        type="email"
                                        value={newBuyerEmail}
                                        onChange={(e) => setNewBuyerEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                className={`w-full glass-button font-medium py-2 px-4 rounded-lg h-[42px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <span className="material-symbols-outlined text-[20px]">send</span>
                                {isSubmitting ? 'Sending...' : 'Send Agreement Link'}
                            </button>
                        </form>
                    </div>
                    <div className="hidden md:flex w-1/3 bg-white/5 border-l border-glass-border p-6 flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-50"></div>
                        <div className="w-16 h-16 rounded-full bg-black/40 border border-primary/30 shadow-[0_0_15px_rgba(48,137,118,0.15)] flex items-center justify-center mb-3 text-primary relative z-10">
                            <span className="material-symbols-outlined text-3xl">verified_user</span>
                        </div>
                        <h3 className="font-semibold text-white relative z-10">Compliance Ready</h3>
                        <p className="text-xs text-text-muted mt-2 relative z-10 leading-relaxed">All agreements reflect the latest NAR settlement guidelines.</p>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="flex flex-col gap-4">
                    <div className="flex-1 glass-panel rounded-xl p-5 group relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <span className="material-symbols-outlined text-7xl text-primary">shield_lock</span>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-primary/10 text-primary border border-primary/20 p-1 rounded-md shadow-[0_0_10px_rgba(48,137,118,0.2)]">
                                    <span className="material-symbols-outlined text-sm">lock</span>
                                </span>
                                <p className="text-sm font-medium text-text-muted">Protected Agreements</p>
                            </div>
                            <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">{kpis.signedLast7Days}</h3>
                            <div className="flex items-center gap-1 mt-2 text-primary text-sm font-medium">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>{kpis.conversionRate.toFixed(0)}% Conversion</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-primary to-secondary-brand opacity-70"></div>
                    </div>
                    <div className="flex-1 glass-panel rounded-xl p-5 relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-7xl text-text-muted">hourglass_empty</span>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-white/5 text-text-muted border border-white/10 p-1 rounded-md">
                                    <span className="material-symbols-outlined text-sm">history</span>
                                </span>
                                <p className="text-sm font-medium text-text-muted">Avg. Speed to Sign</p>
                            </div>
                            <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                                {kpis.medianTimeToSignMinutes ? `${kpis.medianTimeToSignMinutes.toFixed(0)}m` : '--'}
                            </h3>
                            <div className="flex items-center gap-1 mt-2 text-text-muted text-sm">
                                <span>Based on recent activity</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-gray-700 to-gray-500 opacity-50"></div>
                    </div>
                </div>
            </div>

            {/* Smart Nudges Panel */}
            {Object.keys(nudges).length > 0 && (
                <section className="glass-panel p-6 rounded-2xl border border-primary/20 animate-in slide-in-from-top-4 duration-500 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                        <Sparkles size={120} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/20">
                            <Sparkles className="text-primary w-4 h-4" />
                        </div>
                        <h2 className="font-bold uppercase tracking-[0.2em] text-[10px] text-primary">Strategic Agent Insights</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {invites.slice(0, 3).map(invite => nudges[invite.id] && (
                            <div key={invite.id} className="flex items-start gap-4 bg-white/5 p-5 rounded-xl border border-white/5 backdrop-blur-sm hover:border-primary/50 transition-all group/insight">
                                <div className="bg-primary/10 p-2 rounded-xl group-hover/insight:bg-primary/20 transition-colors">
                                    <Lightbulb className="text-primary shrink-0 w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 font-display">{invite.buyerName}</p>
                                    <p className="text-sm font-medium leading-relaxed text-white">"{nudges[invite.id]}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Transaction Pipeline */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white drop-shadow-sm font-display">Transaction Pipeline</h3>
                </div>
                <div className="glass-panel rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-glass-border text-xs uppercase text-text-muted font-semibold tracking-wider font-display">
                                    <th className="px-6 py-4 font-bold">Buyer Name</th>
                                    <th className="px-6 py-4 font-bold">Agreement Status</th>
                                    <th className="px-6 py-4 font-bold">Date Sent</th>
                                    <th className="px-6 py-4 font-bold">Est. Commission</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-glass-border">
                                {invites.slice().reverse().map((invite) => {
                                    const status = getStatusInfo(invite);
                                    return (
                                        <tr key={invite.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shadow-[0_0_8px_rgba(48,137,118,0.2)]">
                                                        {invite.buyerName.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{invite.buyerName}</p>
                                                        <p className="text-xs text-text-muted">{invite.buyerContact}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${status.color === 'primary'
                                                    ? 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_8px_rgba(48,137,118,0.15)]'
                                                    : status.color === 'amber'
                                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                        : 'bg-white/5 text-text-muted border-white/10'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${status.color === 'primary' ? 'bg-primary animate-pulse' :
                                                        status.color === 'amber' ? 'bg-amber-500' : 'bg-gray-400'
                                                        }`}></span>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted font-medium">
                                                {new Date(invite.createdAtUtc).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                                                $12,500.00
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {invite.signatureData ? (
                                                    <button
                                                        onClick={() => navigate(`/verify/DWELL-${invite.id}`)}
                                                        className="text-primary hover:text-white font-bold text-sm flex items-center justify-end gap-1 ml-auto transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                                        View Certificate
                                                    </button>
                                                ) : (
                                                    <button className="text-text-muted hover:text-white font-bold text-sm flex items-center justify-end gap-1 ml-auto transition-colors">
                                                        <span className="material-symbols-outlined text-sm">forward_to_inbox</span>
                                                        Resend Link
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
