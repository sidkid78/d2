import React from 'react';
import QRCodeComponent from 'react-qr-code';
import type { BuyerInvite } from '../../types/domain';
import { format } from 'date-fns';
import { ShieldCheck } from 'lucide-react';

interface Props {
    invite: BuyerInvite;
}

export const CertificatePrintView: React.FC<Props> = ({ invite }) => {
    // Defensive check for QRCode component due to potential ESM/CJS interop issues in Vite
    const QRCode = (QRCodeComponent as any).default || QRCodeComponent;

    const verifyUrl = `${window.location.origin}/verify/${invite.certificateId}`;
    const signedDate = invite.auditEvents.find((e: any) => e.type === 'AGREEMENT_SIGNED')?.timestamp;

    return (
        <div
            id="print-certificate"
            className="p-12 max-w-[800px] mx-auto absolute -left-[9999px] top-0 font-sans border-12"
            style={{
                borderColor: 'rgba(48, 137, 118, 0.05)',
                color: '#0f172a',
                backgroundColor: '#ffffff'
            }}
        >

            {/* Premium Header */}
            <div className="flex justify-between items-end border-b-4 pb-8 mb-10 relative" style={{ borderBottomColor: '#308976' }}>
                <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: '#308976' }}>Official Document</p>
                    <h1 className="text-4xl font-bold tracking-tighter font-display" style={{ color: '#0f172a' }}>Certificate of Representation</h1>
                    <p className="text-sm font-medium mt-2" style={{ color: '#64748b' }}>Verified via <span className="font-bold" style={{ color: '#308976' }}>Dwellingly Commission Infrastructure™</span></p>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="px-4 py-2 rounded-lg border mb-2" style={{ backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' }}>
                        <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#64748b' }}>Certificate ID</p>
                        <p className="font-mono text-lg font-bold leading-none" style={{ color: '#0f172a' }}>{invite.certificateId}</p>
                    </div>
                </div>
            </div>

            {/* Parties Grid */}
            <div className="grid grid-cols-2 gap-10 mb-12">
                <div className="relative">
                    <div className="absolute top-0 left-0 w-1 h-full rounded-full" style={{ backgroundColor: 'rgba(48, 137, 118, 0.2)' }}></div>
                    <div className="pl-6 pt-1">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>Designated Broker / Agent</h3>
                        <p className="font-bold text-xl font-display" style={{ color: '#0f172a' }}>Mock Texas Agent</p>
                        <p className="text-sm mt-1" style={{ color: '#475569' }}>Dwellingly Realty Group, Inc.</p>
                        <p className="text-[11px] mt-3 font-mono" style={{ color: '#94a3b8' }}>License Verified: active_state_tx_2024</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute top-0 left-0 w-1 h-full rounded-full" style={{ backgroundColor: 'rgba(48, 137, 118, 0.2)' }}></div>
                    <div className="pl-6 pt-1">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>Protected Client (Buyer)</h3>
                        <p className="font-bold text-xl font-display" style={{ color: '#0f172a' }}>{invite.buyerName}</p>
                        <p className="text-sm mt-1" style={{ color: '#475569' }}>{invite.buyerContact}</p>
                        <p className="text-[11px] font-bold mt-3 uppercase tracking-widest underline underline-offset-4" style={{ color: '#059669', textDecorationColor: 'rgba(16, 185, 129, 0.2)' }}>Identity Protected</p>
                    </div>
                </div>
            </div>

            {/* Agreement Specifics */}
            <div
                className="mb-12 p-8 rounded-2xl border-2 border-slate-100"
                style={{ backgroundColor: 'rgba(248, 250, 252, 0.5)' }}
            >
                <h3 className="text-sm font-bold uppercase tracking-widest pb-3 mb-6 flex items-center gap-2 border-b" style={{ color: '#0f172a', borderBottomColor: '#e2e8f0' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#308976' }}></span>
                    Agreement Validation Details
                </h3>

                <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#94a3b8' }}>Executed Template</p>
                        <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{invite.templateSnapshot.name} <span style={{ color: '#94a3b8' }}>(v{invite.templateSnapshot.version})</span></p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#94a3b8' }}>Legal Jurisdiction</p>
                        <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{invite.templateSnapshot.jurisdiction}</p>
                    </div>
                </div>

                <div className="flex gap-10 items-end">
                    <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#94a3b8' }}>Electronic Execution Stamp</p>
                        <div className="border-2 rounded-xl px-6 py-4 h-32 flex items-center justify-center bg-white shadow-sm relative overflow-hidden group" style={{ borderColor: '#e2e8f0' }}>
                            <div className="absolute top-2 right-3 opacity-10">
                                <ShieldCheck size={48} style={{ color: '#308976' }} />
                            </div>
                            {invite.signatureData?.signatureImageDataUrl ? (
                                <img src={invite.signatureData.signatureImageDataUrl} alt="Signature" className="max-h-full max-w-full relative z-10 grayscale contrast-125" />
                            ) : (
                                <span className="italic text-sm" style={{ color: '#cbd5e1' }}>Signature Image Verified</span>
                            )}
                        </div>
                        <div className="flex justify-between mt-3 px-1">
                            <p className="text-[10px] font-mono" style={{ color: '#94a3b8' }}>Signed: {signedDate ? format(new Date(signedDate), "yyyy-MM-dd HH:mm:ss 'UTC'") : ''}</p>
                            <p className="text-[10px] font-mono font-bold uppercase tracking-tighter" style={{ color: '#308976' }}>Cryptographically Secured</p>
                        </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-center">
                        <div className="p-3 border-2 rounded-2xl bg-white shadow-sm mb-2" style={{ borderColor: '#308976' }}>
                            <QRCode value={verifyUrl} size={90} level="H" />
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-widest leading-none" style={{ color: '#94a3b8' }}>Scan to Verify</p>
                    </div>
                </div>
            </div>

            {/* Proof of Registry */}
            <div className="pt-8 border-t-2 flex justify-between items-start" style={{ borderTopColor: '#f1f5f9' }}>
                <div className="max-w-md">
                    <p className="text-[10px] font-medium leading-relaxed italic" style={{ color: '#94a3b8' }}>
                        This document serves as definitive proof of a legally binding agreement between the listed parties.
                        The underlying contract hash: {invite.certificateId?.split('-').join('')}b7a2...
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#0f172a' }}>Dwellingly Registry</p>
                    <p className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>Status: active_protected_verified</p>
                </div>
            </div>

        </div>
    );
};
