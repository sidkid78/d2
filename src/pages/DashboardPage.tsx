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

    const [resendingId, setResendingId] = useState<string | null>(null);

    const handleResend = async (inviteId: string) => {
        setResendingId(inviteId);
        try {
            await mockService.resendInvite(inviteId);
            await loadInvites();
            // Show a temporary success state
            setTimeout(() => setResendingId(null), 2000);
        } catch (error) {
            console.error('Failed to resend invite:', error);
            setResendingId(null);
        }
    };

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

    const [showSuccess, setShowSuccess] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [sentToEmail, setSentToEmail] = useState('');

    const handleQuickInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('handleQuickInvite triggered', { newBuyerName, newBuyerEmail });
        if (!newBuyerName || !newBuyerEmail) return;

        setIsSubmitting(true);
        try {
            const rawToken = generateRawToken();
            const invite = await mockService.createInvite({
                buyerName: newBuyerName,
                buyerContact: newBuyerEmail,
                templateSnapshot: TEMPLATE_MOCK,
            }, rawToken);
            console.log('Invite created successfully:', invite);

            // Construct the real link for the user
            const link = `${window.location.origin}/sign/${rawToken}`;
            setGeneratedLink(link);
            setSentToEmail(newBuyerEmail);

            setNewBuyerName('');
            setNewBuyerEmail('');
            await loadInvites();
            setShowSuccess(true);
        } catch (error) {
            console.error('Failed to create quick invite:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8 relative z-10 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight font-display mb-1">Command Center</h1>
                    <p className="text-text-muted text-base">Manage your buyer agreements and commission status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-text-muted bg-white/5 px-4 py-2 rounded-full border border-glass-border shadow-sm backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(48,137,118,0.8)]"></span>
                        System Operational
                    </div>
                    <button
                        onClick={() => navigate('/app/invites')}
                        className="glass-button px-5 py-2.5 rounded-xl font-bold text-sm"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        New Agreement
                    </button>
                </div>
            </header>

            {/* Quick Action & KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Action Card */}
                <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col md:flex-row border border-glass-border shadow-2xl overflow-hidden">
                    <div className="flex-1 p-8 flex flex-col justify-center relative z-10">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
                                <span className="material-symbols-outlined text-primary scale-110">bolt</span>
                                Quick Action: Secure a Buyer
                            </h2>
                            <p className="text-text-muted text-sm mt-1">Send a representation agreement link instantly.</p>
                        </div>
                        {showSuccess ? (
                            <div className="space-y-4 animate-in zoom-in duration-300">
                                <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 text-primary">
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                        <span className="text-sm font-bold uppercase tracking-wider">Invitation Secured</span>
                                    </div>
                                    <p className="text-xs text-text-muted">Invite link generated for <span className="text-white font-bold">Mock Testing</span>. Share this link directly with your client:</p>
                                    <div className="flex bg-background-dark/50 p-2.5 rounded-lg border border-white/10 group/link">
                                        <code className="text-[10px] text-primary font-mono flex-1 overflow-hidden transition-colors group-hover/link:text-white">{generatedLink}</code>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedLink);
                                                // Simple alert for confirmation
                                                const btn = document.getElementById('copy-btn');
                                                if (btn) btn.innerText = 'check';
                                                setTimeout(() => { if (btn) btn.innerText = 'content_copy'; }, 2000);
                                            }}
                                            className="ml-3 hover:text-white text-text-muted transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <span id="copy-btn" className="material-symbols-outlined text-base">content_copy</span>
                                        </button>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => {
                                                const subject = encodeURIComponent('Action Required: Secure Buyer Representation Agreement');
                                                const body = encodeURIComponent(`Hi,\n\nPlease review and sign the buyer representation agreement to secure your commission protection:\n\n${generatedLink}\n\nBest regards,\nDwellingly Agent`);
                                                window.location.href = `mailto:${sentToEmail}?subject=${subject}&body=${body}`;
                                            }}
                                            className="flex-1 glass-button bg-primary/20 text-primary border-primary/30 font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/30 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">mail</span>
                                            Send via Email
                                        </button>
                                        <button
                                            onClick={() => setShowSuccess(false)}
                                            className="glass-button font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                                            title="Send Another"
                                        >
                                            <span className="material-symbols-outlined text-sm">refresh</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleQuickInvite} className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Buyer Name</label>
                                        <input
                                            className="w-full glass-input"
                                            placeholder="Full Name"
                                            type="text"
                                            value={newBuyerName}
                                            onChange={(e) => setNewBuyerName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Email Address</label>
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
                                    className={`w-full glass-button font-bold text-base py-3 px-4 rounded-xl h-[52px] transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {isSubmitting ? 'sync' : 'send'}
                                    </span>
                                    {isSubmitting ? 'Securing Link...' : 'Send Agreement Link'}
                                </button>
                            </form>
                        )}
                    </div>
                    <div className="hidden md:flex w-1/3 bg-white/5 border-l border-glass-border p-8 flex-col justify-center items-center text-center relative">
                        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-50"></div>
                        <div className="w-20 h-20 rounded-2xl bg-black/40 border border-primary/20 shadow-[0_0_20px_rgba(48,137,118,0.1)] flex items-center justify-center mb-4 text-primary relative z-10 rotate-3">
                            <span className="material-symbols-outlined text-4xl">verified_user</span>
                        </div>
                        <h3 className="font-bold text-white relative z-10 text-lg font-display">Compliance Ready</h3>
                        <p className="text-xs text-text-muted mt-2 relative z-10 leading-relaxed font-medium">All agreements reflect the latest NAR settlement guidelines.</p>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="flex flex-col gap-4">
                    <div className="flex-1 glass-panel rounded-2xl p-6 group relative border border-white/5 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <span className="material-symbols-outlined text-7xl text-primary">shield_lock</span>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-primary/10 text-primary border border-primary/20 p-1.5 rounded-lg shadow-[0_0_10px_rgba(48,137,118,0.2)]">
                                    <span className="material-symbols-outlined text-base">lock</span>
                                </span>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Protected Agreements</p>
                            </div>
                            <h3 className="text-4xl font-bold text-white tracking-tight drop-shadow-sm font-display">{kpis.signedLast7Days}</h3>
                            <div className="flex items-center gap-1.5 mt-3 text-primary text-xs font-bold uppercase tracking-wider">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>{kpis.conversionRate.toFixed(0)}% Conversion Rate</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-linear-to-r from-primary to-secondary-brand opacity-80"></div>
                    </div>

                    <div className="flex-1 glass-panel rounded-2xl p-6 relative group border border-white/5 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-7xl text-text-muted">hourglass_empty</span>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-white/5 text-text-muted border border-white/10 p-1.5 rounded-lg">
                                    <span className="material-symbols-outlined text-base">history</span>
                                </span>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Avg. Speed to Sign</p>
                            </div>
                            <h3 className="text-4xl font-bold text-white tracking-tight drop-shadow-sm font-display">
                                {kpis.medianTimeToSignMinutes ? `${kpis.medianTimeToSignMinutes.toFixed(0)}m` : '--'}
                            </h3>
                            <div className="flex items-center gap-1 mt-3 text-text-muted text-[10px] font-bold uppercase tracking-tight">
                                <span>Optimized for Mobile Completion</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-linear-to-r from-gray-700 to-gray-800 opacity-50"></div>
                    </div>
                </div>
            </div>

            {/* Smart Nudges Panel */}
            {Object.keys(nudges).length > 0 && (
                <section className="glass-panel p-8 rounded-2xl border border-primary/10 animate-in slide-in-from-top-4 duration-500 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                        <Sparkles size={120} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/20 p-2 rounded-xl border border-primary/20">
                            <Sparkles className="text-primary w-5 h-5" />
                        </div>
                        <h2 className="font-bold uppercase tracking-[0.3em] text-[11px] text-primary font-display">Strategic Agent Insights</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {invites.slice(-3).map(invite => nudges[invite.id] && (
                            <div key={invite.id} className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-primary/30 transition-all group/insight relative overflow-hidden">
                                <div className="bg-primary/10 p-2.5 rounded-xl group-hover/insight:bg-primary/20 transition-colors shadow-inner">
                                    <Lightbulb className="text-primary shrink-0 w-5 h-5" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] font-display">{invite.buyerName}</p>
                                    <p className="text-sm font-medium leading-relaxed text-white">"{nudges[invite.id]}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Transaction Pipeline */}
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight font-display">Transaction Pipeline</h3>
                    <button
                        onClick={() => navigate('/app/invites')}
                        className="text-primary hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                    >
                        View All
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
                <div className="glass-panel rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase text-text-muted font-bold tracking-[0.2em] font-display">
                                    <th className="px-8 py-5">Buyer Name</th>
                                    <th className="px-8 py-5 text-center">Agreement Status</th>
                                    <th className="px-8 py-5">Date Created</th>
                                    <th className="px-8 py-5">Est. Commission</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {invites.slice().reverse().map((invite) => {
                                    const status = getStatusInfo(invite);
                                    return (
                                        <tr key={invite.id} className="hover:bg-white/5 transition-all group/row">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(48,137,118,0.1)] group-hover/row:scale-105 transition-transform">
                                                        {invite.buyerName.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover/row:text-primary transition-colors">{invite.buyerName}</p>
                                                        <p className="text-[11px] text-text-muted font-medium">{invite.buyerContact}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${status.color === 'primary'
                                                    ? 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_12px_rgba(48,137,118,0.2)]'
                                                    : status.color === 'amber'
                                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                                                        : 'bg-white/5 text-text-muted border-white/10'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${status.color === 'primary' ? 'bg-primary animate-pulse' :
                                                        status.color === 'amber' ? 'bg-amber-500' : 'bg-gray-500'
                                                        }`}></span>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-sm text-text-muted font-bold font-display">
                                                {new Date(invite.createdAtUtc).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-base font-black text-white font-display">
                                                $12,500.00
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right">
                                                {invite.signatureData ? (
                                                    <button
                                                        onClick={() => navigate(`/verify/DW-${invite.id}`)}
                                                        className="glass-button text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-lg"
                                                    >
                                                        Certificate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleResend(invite.id)}
                                                        disabled={resendingId === invite.id}
                                                        className={`text-text-muted hover:text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-end gap-2 ml-auto transition-all hover:translate-x-1 ${resendingId === invite.id ? 'opacity-50' : ''}`}
                                                    >
                                                        {resendingId === invite.id ? 'Resending...' : 'Resend'}
                                                        <span className="material-symbols-outlined text-base">
                                                            {resendingId === invite.id ? 'sync' : 'forward_to_inbox'}
                                                        </span>
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
