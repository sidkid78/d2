import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { BuyerInvite } from '../../types/domain';
import { mockService } from '../../services/MockService';
import { deriveStatus } from '../../lib/logic/auditEngine';
import { StatusBadge } from './StatusBadge';
import { CertificatePrintView } from '../buyer/CertificatePrintView';
import { generatePDFFromElement } from '../../lib/utils/pdfGenerator';
import { Copy, MessageSquare, Mail, Download, Shield, Plus, Eye, ShieldCheck, XCircle, Clock, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const getEventStyles = (type: string) => {
    switch (type) {
        case 'INVITE_CREATED': return { icon: <Plus size={14} />, color: 'bg-blue-100 text-blue-600 border-blue-200', label: 'Invite Created' };
        case 'INVITE_SENT': return { icon: <Send size={14} />, color: 'bg-sky-100 text-sky-600 border-sky-200', label: 'Link Sent' };
        case 'INVITE_VIEWED': return { icon: <Eye size={14} />, color: 'bg-amber-100 text-amber-600 border-amber-200', label: 'Link Viewed' };
        case 'AGREEMENT_SIGNED': return { icon: <ShieldCheck size={14} />, color: 'bg-emerald-100 text-emerald-600 border-emerald-200', label: 'Agreement Signed' };
        case 'INVITE_REVOKED': return { icon: <XCircle size={14} />, color: 'bg-red-100 text-red-600 border-red-200', label: 'Invite Revoked' };
        default: return { icon: <Clock size={14} />, color: 'bg-slate-100 text-slate-600 border-slate-200', label: type.replace('_', ' ').toLowerCase() };
    }
};

export const InviteDetail: React.FC = () => {
    const { inviteId } = useParams<{ inviteId: string }>();
    const navigate = useNavigate();
    const [invite, setInvite] = useState<BuyerInvite | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const fetchInvite = async () => {
        if (!inviteId) return;
        const all = await mockService.listInvites();
        const found = all.find(i => i.id === inviteId);
        if (found) setInvite(found);
        else navigate('/app/invites');
    };

    useEffect(() => {
        fetchInvite();
    }, [inviteId]);

    if (!invite) return <div className="p-12 text-center text-slate-500">Loading Invite Data...</div>;

    const status = deriveStatus(invite);
    const shareUrl = `${window.location.origin}/sign/${invite.tokenHash}`; // Need raw token in real app

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard! (Note: the Raw Token needs to be appended in the actual flow.)');
    };

    const handleResend = async (type: 'sms' | 'email') => {
        await mockService.addEvent(invite.id, 'INVITE_SENT' as any);
        const message = `Hi ${invite.buyerName}, please review and sign our representation agreement here: ${shareUrl}`;

        if (type === 'sms') {
            window.location.href = `sms:${invite.buyerContact}?body=${encodeURIComponent(message)}`;
        } else {
            window.location.href = `mailto:${invite.buyerContact}?subject=Representation Agreement&body=${encodeURIComponent(message)}`;
        }
        fetchInvite();
    };

    const handleDownloadPdf = async () => {
        setIsGeneratingPdf(true);
        try {
            await generatePDFFromElement('print-certificate', `Protection_Certificate_${invite.certificateId}.pdf`);
        } catch (error) {
            alert('Failed to generate PDF. See console.');
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Link to="/app" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            {status === 'signed' && (
                <div id="print-certificate" className="absolute -z-50 opacity-0">
                    <CertificatePrintView invite={invite} />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                            <Shield size={120} />
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{invite.buyerName}</h3>
                                <p className="text-slate-500 font-medium">{invite.buyerContact}</p>
                            </div>
                            <StatusBadge status={status} />
                        </div>

                        <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                            <button onClick={copyLink} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-brand-600 font-bold rounded-xl hover:border-brand-200 hover:bg-brand-50/50 transition-all shadow-sm">
                                <Copy size={16} /> Copy Link
                            </button>
                            <button disabled={status === 'signed' || status === 'revoked'} onClick={() => handleResend('sms')} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-brand-600 font-bold rounded-xl hover:border-brand-200 hover:bg-brand-50/50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                <MessageSquare size={16} /> SMS
                            </button>
                            <button disabled={status === 'signed' || status === 'revoked'} onClick={() => handleResend('email')} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-brand-600 font-bold rounded-xl hover:border-brand-200 hover:bg-brand-50/50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                <Mail size={16} /> Email
                            </button>
                        </div>
                    </div>

                    {status === 'signed' && (
                        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-4">
                                <div className="bg-emerald-100 p-3 rounded-xl border border-emerald-200 shadow-sm">
                                    <ShieldCheck className="text-emerald-700 w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-black text-emerald-900 text-lg uppercase tracking-tight">Commission Protected</p>
                                    <p className="text-emerald-800 text-sm font-bold opacity-90 tracking-wide mt-0.5">Asset ID: {invite.certificateId}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isGeneratingPdf}
                                className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={18} /> {isGeneratingPdf ? 'Generating Asset...' : 'Download Certificate'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-6">
                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center justify-between">
                        Internal Audit Log
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded border border-emerald-200">Verified</span>
                    </h4>

                    <div className="space-y-0 relative before:absolute before:inset-0 before:left-[15px] before:w-0.5 before:bg-slate-100 before:h-full">
                        {invite.auditEvents.slice().reverse().map((event, idx) => {
                            const styles = getEventStyles(event.type);
                            return (
                                <div key={idx} className="relative pl-10 pb-8 last:pb-0 group">
                                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-white ${styles.color} flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-110`}>
                                        {styles.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-baseline justify-between gap-2 mb-1">
                                            <p className="font-bold text-slate-900 text-sm">{styles.label}</p>
                                            <time className="text-[10px] font-bold font-mono text-slate-400">
                                                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </time>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500">
                                            {new Date(event.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        {event.metadata && (
                                            <div className="mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono text-[9px] text-slate-400 break-all leading-tight">
                                                {event.metadata.userAgent && (
                                                    <div className="flex gap-1">
                                                        <span className="shrink-0 text-slate-300 font-black">UA:</span>
                                                        <span>{event.metadata.userAgent}</span>
                                                    </div>
                                                )}
                                                {event.metadata.platform && (
                                                    <div className="flex gap-1 mt-0.5">
                                                        <span className="shrink-0 text-slate-300 font-black">PLAT:</span>
                                                        <span>{event.metadata.platform}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
