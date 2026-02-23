import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '../services/MockService';
import type { BuyerInvite, SignatureData } from '../types/domain';
import { canSign } from '../lib/logic/auditEngine';
import SignatureCanvas from 'react-signature-canvas';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const trimCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let top = height, bottom = 0, left = width, right = 0;
    let found = false;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 0) {
                if (y < top) top = y;
                if (y > bottom) bottom = y;
                if (x < left) left = x;
                if (x > right) right = x;
                found = true;
            }
        }
    }
    if (!found) return canvas;
    const trimWidth = right - left + 1;
    const trimHeight = bottom - top + 1;
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimWidth;
    trimmedCanvas.height = trimHeight;
    const trimmedCtx = trimmedCanvas.getContext('2d');
    if (!trimmedCtx) return canvas;
    trimmedCtx.drawImage(canvas, left, top, trimWidth, trimHeight, 0, 0, trimWidth, trimHeight);
    return trimmedCanvas;
};

export const SignPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const sigCanvas = useRef<SignatureCanvas>(null);

    const [invite, setInvite] = useState<BuyerInvite | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigning, setIsSigning] = useState(false);
    const [error, setError] = useState('');
    const [consent, setConsent] = useState(false);
    const [typedName, setTypedName] = useState('');

    useEffect(() => {
        const loadInvite = async () => {
            if (!token) {
                setError('Invalid link.');
                setIsLoading(false);
                return;
            }

            const foundInvite = await mockService.getInviteByToken(token);

            if (!foundInvite) {
                setError('Invite not found or invalid link.');
                setIsLoading(false);
                return;
            }

            const accessCheck = canSign(foundInvite);
            if (!accessCheck.allowed) {
                setError(accessCheck.reason || 'Cannot access this invite.');
            }

            setInvite(foundInvite);
            setTypedName(foundInvite.buyerName);
            setIsLoading(false);
        };

        loadInvite();
    }, [token]);

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isSigning) return;
        sigCanvas.current?.clear();
    };

    const handleSign = async () => {
        if (!invite || isSigning) return;

        if (!consent) {
            setError('Please acknowledge the terms to protect your representation.');
            return;
        }
        if (sigCanvas.current?.isEmpty()) {
            setError('Please provide your digital signature.');
            return;
        }

        setIsSigning(true);
        setError('');

        try {
            const rawCanvas = sigCanvas.current?.getCanvas();
            if (!rawCanvas) throw new Error('Failed to capture signature.');

            const trimmed = trimCanvas(rawCanvas);
            const signatureImageDataUrl = trimmed.toDataURL('image/png');

            const fullSignatureData: SignatureData = {
                typedName: typedName || invite.buyerName,
                signatureImageDataUrl,
                consent,
                signedAtUtc: new Date().toISOString(),
                userAgent: navigator.userAgent
            };

            const certId = await mockService.signAgreement(invite.id, fullSignatureData);
            navigate(`/verify/${certId}`);
        } catch (err: any) {
            console.error('Signing error:', err);
            setError(err.message || 'Failed to securely sign agreement. Please try again.');
            setIsSigning(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Initialising Secure Portal...</p>
                </div>
            </div>
        );
    }

    if (error || !invite) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
                <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center border-red-500/20 shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-display">Access Denied</h2>
                    <p className="text-text-muted mb-8 font-medium">{error}</p>
                    <button onClick={() => window.location.reload()} className="w-full glass-button py-3 font-bold">Retry Connection</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-dark text-slate-100 min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white dark overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 bg-background-dark bg-opacity-80 backdrop-blur-md px-6 py-4 lg:px-10 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="size-8 text-primary shadow-[0_0_15px_rgba(48,137,118,0.2)]">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fill-rule="evenodd"></path>
                            <path clip-rule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fill-rule="evenodd"></path>
                        </svg>
                    </div>
                    <h2 className="text-white text-xl font-bold leading-tight tracking-tight font-display">Dwellingly</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-sm">lock</span>
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest">Secure & Encrypted</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[100px]"></div>
                </div>

                {/* Left Column: Value Prop */}
                <section className="lg:w-5/12 xl:w-1/2 bg-transparent lg:border-r border-white/5 p-8 lg:p-12 xl:p-16 flex flex-col justify-center overflow-y-auto relative z-10 custom-scrollbar">
                    <div className="max-w-lg mx-auto w-full space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
                                <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                                <span className="text-primary text-[10px] font-bold uppercase tracking-widest">Buyer Protection</span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight font-display">
                                Why this agreement protects you
                            </h1>
                            <p className="text-text-muted text-base leading-relaxed">
                                This standard agreement ensures mutual transparency and professional representation, complying with new NAR settlement standards.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: 'visibility', title: 'Mutual Transparency', desc: 'Defines exactly what your agent will do for you, ensuring no ambiguity in services.' },
                                { icon: 'payments', title: 'No Hidden Fees', desc: 'You know the commission structure upfront. No surprises at the closing table.' },
                                { icon: 'gavel', title: 'Professional Standards', desc: 'Ensures your representation is compliant with new laws and ethical guidelines.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/3 border border-white/5 transition-all hover:bg-white/5 hover:border-white/10 group">
                                    <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg mb-1 tracking-tight font-display">{item.title}</h3>
                                        <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2 overflow-hidden items-center">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-8 w-8 rounded-full ring-2 ring-background-dark bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-text-muted font-medium">Trusted by 10,000+ buyers this month</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Column: Sign Section */}
                <section className="flex-1 bg-black/20 lg:bg-transparent p-4 sm:p-8 lg:p-12 xl:p-16 flex flex-col items-center justify-center overflow-y-auto relative z-10 custom-scrollbar">
                    <div className="w-full max-w-md space-y-8 relative animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl font-bold text-white tracking-tight font-display">Review & Sign</h2>
                            <p className="text-text-muted mt-1 text-sm">Please review the summary below before signing.</p>
                        </div>

                        {/* Agreement Card */}
                        <div className="glass-panel rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white flex items-center gap-2 font-display">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                    Agreement Terms
                                </h3>
                                <button className="text-xs font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1 uppercase tracking-widest">
                                    View Full
                                    <span className="material-symbols-outlined text-base">open_in_new</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-y-3">
                                {[
                                    { label: 'Agent Name', value: invite.agentId },
                                    { label: 'Commission', value: '2.5%' },
                                    { label: 'Duration', value: '90 Days' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3.5 bg-white/2 border border-white/5 rounded-xl hover:bg-white/4 transition-colors">
                                        <span className="text-xs text-text-muted font-bold uppercase tracking-wider">{item.label}</span>
                                        <span className="text-sm font-bold text-white font-display">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Signature Section */}
                        <div className="space-y-4">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-300">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-between items-end px-1">
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Digital Signature</label>
                                <button onClick={handleClear} className="text-[10px] font-bold text-primary hover:text-primary-hover uppercase tracking-widest transition-colors">Clear</button>
                            </div>

                            <div className="relative w-full h-40 bg-black/40 rounded-2xl border border-white/10 hover:border-primary/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 transition-all cursor-crosshair group shadow-inner overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <p className="text-white/10 font-black text-4xl uppercase tracking-[0.3em] font-display group-hover:text-primary/10 transition-colors">Sign Here</p>
                                </div>
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="#308976"
                                    canvasProps={{
                                        className: 'w-full h-full rounded-2xl opacity-90 relative z-10',
                                        width: 800,
                                        height: 320,
                                        title: 'Digital Signature Canvas'
                                    }}
                                />
                                <div className="absolute bottom-4 right-4 pointer-events-none z-0 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <span className="material-symbols-outlined text-white text-3xl">draw</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 px-1 pt-2">
                                <input
                                    type="checkbox"
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                    aria-label="Consent to digital signature"
                                    className="mt-1 size-4 rounded bg-white/5 border-white/20 text-primary focus:ring-primary transition-all cursor-pointer"
                                />
                                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                                    I agree that my digital signature is legally binding and acknowledges I have reviewed the standard representation terms.
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={handleSign}
                                disabled={isSigning}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4.5 px-6 rounded-2xl shadow-[0_8px_25px_rgba(48,137,118,0.25)] hover:shadow-[0_12px_35px_rgba(48,137,118,0.4)] border border-primary/40 transition-all transform hover:-translate-y-1 active:translate-y-0 text-base flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                                {isSigning ? (
                                    <div className="flex items-center gap-2">
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span className="relative z-10">Recording Protection...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="relative z-10">Sign to Protect</span>
                                        <ShieldCheck size={20} className="relative z-10" />
                                    </>
                                )}
                            </button>
                            <div className="mt-6 flex justify-center items-center gap-2 bg-white/2 py-2 px-4 rounded-full border border-white/5 w-fit mx-auto transition-colors hover:bg-white/4">
                                <span className="material-symbols-outlined text-primary text-sm">lock</span>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-none">Military-Grade Encryption Active</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(48, 137, 118, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(48, 137, 118, 0.4);
                }
            `}</style>
        </div>
    );
};
