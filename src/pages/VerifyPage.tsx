import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockService } from '../services/MockService';
import type { BuyerInvite } from '../types/domain';
import { getBuyerInitials } from '../lib/logic/auditEngine';
import { ShieldCheck, Calendar, ArrowRight, UserCheck, Download, Loader2, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { CertificatePrintView } from '../components/buyer/CertificatePrintView';
import { generatePDFFromElement } from '../lib/utils/pdfGenerator';

export const VerifyPage: React.FC = () => {
    const { certificateId } = useParams<{ certificateId: string }>();
    const [invite, setInvite] = useState<BuyerInvite | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);

    useEffect(() => {
        const fetchCert = async () => {
            if (certificateId) {
                const result = await mockService.verifyCertificate(certificateId);
                setInvite(result);
            }
            setLoading(false);
        };
        fetchCert();
    }, [certificateId]);

    // Automatic download trigger
    useEffect(() => {
        if (!loading && invite && !hasAutoDownloaded && !isDownloading) {
            const triggerDownload = async () => {
                setHasAutoDownloaded(true);
                setIsDownloading(true);
                try {
                    // Small delay to ensure the hidden print view is fully rendered
                    await new Promise(resolve => setTimeout(resolve, 800));
                    await generatePDFFromElement('print-certificate', `Dwellingly_Cert_${invite.certificateId}.pdf`);
                } catch (err) {
                    console.error('Auto-download failed:', err);
                } finally {
                    setIsDownloading(false);
                }
            };
            triggerDownload();
        }
    }, [loading, invite, hasAutoDownloaded, isDownloading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Verifying Credentials...</p>
                </div>
            </div>
        );
    }

    if (!invite) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-500/5 rounded-full blur-[120px]"></div>

                <div className="glass-panel p-8 md:p-10 rounded-3xl max-w-md w-full text-center border-red-500/20 shadow-2xl animate-in zoom-in-95 duration-300 relative z-10">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        <Shield size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-display">Invalid Certificate</h2>
                    <p className="text-text-muted mb-8 font-medium">This Commission Protection Certificate ID could not be found or is no longer valid.</p>
                    <Link to="/" className="w-full glass-button py-3 font-bold group">
                        Return Home
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }

    const initials = getBuyerInitials(invite.buyerName);
    const signedDate = invite.auditEvents.find((e: any) => e.type === 'AGREEMENT_SIGNED')?.timestamp;

    return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-4 md:p-8 relative overflow-x-hidden transition-colors duration-700">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[100px]"></div>

            <div className="max-w-lg w-full rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden animate-in zoom-in-95 duration-500 relative z-10 glass-panel">

                {/* Certificate Header Section */}
                <div className="bg-primary/20 bg-linear-to-br from-primary/30 to-background-dark/80 px-8 py-12 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-10 bg-dots"></div>
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(48,137,118,0.3)] border border-white/10 group-hover:scale-105 transition-transform duration-500">
                            <ShieldCheck className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(48,137,118,0.5)]" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight font-display">Active Representation</h1>
                        <p className="text-primary font-bold tracking-[0.2em] uppercase text-[10px]">Verified Certificate</p>
                    </div>
                </div>

                {/* Certificate Body Section */}
                <div className="px-8 py-12 space-y-10 relative">

                    {/* Status Badge Overlap */}
                    <div className="absolute -top-6 inset-x-0 flex justify-center">
                        <div className="bg-background-dark/80 backdrop-blur-md px-5 py-2 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(48,137,118,0.1)] flex items-center gap-2.5 text-xs font-bold text-white font-mono">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary)]"></span>
                            ID: {invite.certificateId}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-10 mt-4">
                        <div className="animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Agent Details</p>
                            <div className="flex items-start gap-3 glass-card p-4 rounded-2xl border-white/5 bg-white/2 hover:bg-white/4 transition-colors">
                                <div className="bg-primary/10 p-2 rounded-xl text-primary border border-primary/20 shrink-0">
                                    <UserCheck size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-white leading-tight truncate font-display text-sm">Mock Texas Agent</p>
                                    <p className="text-[11px] text-text-muted mt-1 font-medium truncate">Dwellingly Realty</p>
                                </div>
                            </div>
                        </div>

                        <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Client Profile</p>
                            <div className="flex items-center gap-3 glass-card p-4 rounded-2xl border-white/5 bg-white/2 hover:bg-white/4 transition-colors">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-primary shadow-inner text-sm shrink-0">
                                    {initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 w-fit truncate uppercase tracking-widest">Protected</p>
                                    <p className="text-[10px] text-text-muted mt-1 font-bold uppercase tracking-widest leading-none">Privacy Active</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Verification Timeline</p>
                            <div className="flex items-center gap-4 glass-card p-5 rounded-2xl border-white/5 bg-white/2 hover:bg-white/4 transition-colors">
                                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 shrink-0">
                                    <Calendar className="text-primary" size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Signed Securely At</p>
                                    <p className="font-bold text-white font-display text-base">
                                        {signedDate ? format(new Date(signedDate), "MMMM d, yyyy 'at' h:mm a") : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <p className="text-[11px] text-text-muted font-medium text-center leading-relaxed">
                            This cryptographically signed digital certificate verifies active, exclusive representation conforming to local regulations and Dwellingly Commission Protection™ standards.
                        </p>

                        <button
                            onClick={async () => {
                                setIsDownloading(true);
                                try {
                                    await generatePDFFromElement('print-certificate', `Dwellingly_Cert_${invite.certificateId}.pdf`);
                                } finally {
                                    setIsDownloading(false);
                                }
                            }}
                            disabled={isDownloading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4.5 px-6 rounded-2xl shadow-[0_8px_25px_rgba(48,137,118,0.25)] hover:shadow-[0_12px_35px_rgba(48,137,118,0.4)] border border-primary/40 transition-all transform hover:-translate-y-1 active:translate-y-0 text-base flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                            {isDownloading ? (
                                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                            ) : (
                                <Download className="w-5 h-5 text-white/90 relative z-10" />
                            )}
                            <span className="relative z-10">Download Official Certificate</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* Hidden Print View for PDF generation */}
            <CertificatePrintView invite={invite} />

            <div className="mt-12 text-center animate-in fade-in duration-1000 delay-500">
                <Link to="/" className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/2 border border-white/5 rounded-full text-[11px] font-bold text-text-muted hover:text-white hover:bg-white/5 transition-all group">
                    Powered by <span className="text-white font-display uppercase tracking-widest">Dwellingly</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
