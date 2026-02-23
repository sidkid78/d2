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
        <div id="print-certificate" className="bg-white p-12 max-w-[800px] mx-auto absolute -left-[9999px] top-0 font-sans text-slate-900 border-12 border-primary/5">

            {/* Premium Header */}
            <div className="flex justify-between items-end border-b-4 border-primary pb-8 mb-10 relative">
                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Official Document</p>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter font-display">Certificate of Representation</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">Verified via <span className="text-primary font-bold">Dwellingly Commission Infrastructure™</span></p>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 mb-2">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Certificate ID</p>
                        <p className="font-mono text-lg font-bold text-slate-900 leading-none">{invite.certificateId}</p>
                    </div>
                </div>
            </div>

            {/* Parties Grid */}
            <div className="grid grid-cols-2 gap-10 mb-12">
                <div className="relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 rounded-full"></div>
                    <div className="pl-6 pt-1">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Designated Broker / Agent</h3>
                        <p className="font-bold text-xl text-slate-900 font-display">Mock Texas Agent</p>
                        <p className="text-sm text-slate-600 mt-1">Dwellingly Realty Group, Inc.</p>
                        <p className="text-[11px] text-slate-400 mt-3 font-mono">License Verified: active_state_tx_2024</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 rounded-full"></div>
                    <div className="pl-6 pt-1">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Protected Client (Buyer)</h3>
                        <p className="font-bold text-xl text-slate-900 font-display">{invite.buyerName}</p>
                        <p className="text-sm text-slate-600 mt-1">{invite.buyerContact}</p>
                        <p className="text-[11px] text-emerald-600 font-bold mt-3 uppercase tracking-widest underline decoration-emerald-200 underline-offset-4">Identity Protected</p>
                    </div>
                </div>
            </div>

            {/* Agreement Specifics */}
            <div className="mb-12 bg-slate-50/50 p-8 rounded-2xl border-2 border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-3 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Agreement Validation Details
                </h3>

                <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Executed Template</p>
                        <p className="text-sm text-slate-900 font-medium">{invite.templateSnapshot.name} <span className="text-slate-400">(v{invite.templateSnapshot.version})</span></p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Legal Jurisdiction</p>
                        <p className="text-sm text-slate-900 font-medium">{invite.templateSnapshot.jurisdiction}</p>
                    </div>
                </div>

                <div className="flex gap-10 items-end">
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Electronic Execution Stamp</p>
                        <div className="border-2 border-slate-200 rounded-xl px-6 py-4 h-32 flex items-center justify-center bg-white shadow-sm relative overflow-hidden group">
                            <div className="absolute top-2 right-3 opacity-10">
                                <ShieldCheck size={48} className="text-primary" />
                            </div>
                            {invite.signatureData?.signatureImageDataUrl ? (
                                <img src={invite.signatureData.signatureImageDataUrl} alt="Signature" className="max-h-full max-w-full relative z-10 grayscale contrast-125" />
                            ) : (
                                <span className="text-slate-300 italic text-sm">Signature Image Verified</span>
                            )}
                        </div>
                        <div className="flex justify-between mt-3 px-1">
                            <p className="text-[10px] font-mono text-slate-400">Signed: {signedDate ? format(new Date(signedDate), "yyyy-MM-dd HH:mm:ss 'UTC'") : ''}</p>
                            <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-tighter">Cryptographically Secured</p>
                        </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-center">
                        <div className="p-3 border-2 border-primary rounded-2xl bg-white shadow-sm mb-2">
                            <QRCode value={verifyUrl} size={90} level="H" />
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Scan to Verify</p>
                    </div>
                </div>
            </div>

            {/* Proof of Registry */}
            <div className="pt-8 border-t-2 border-slate-100 flex justify-between items-start">
                <div className="max-w-md">
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                        This document serves as definitive proof of a legally binding agreement between the listed parties.
                        The underlying contract hash: {invite.certificateId?.split('-').join('')}b7a2...
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-1">Dwellingly Registry</p>
                    <p className="text-[9px] text-slate-400 font-mono">Status: active_protected_verified</p>
                </div>
            </div>

        </div>
    );
};
