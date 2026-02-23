import React from 'react';
import QRCodeComponent from 'react-qr-code';
import type { BuyerInvite } from '../../types/domain';
import { format } from 'date-fns';

interface Props {
    invite: BuyerInvite;
}

export const CertificatePrintView: React.FC<Props> = ({ invite }) => {
    // Defensive check for QRCode component due to potential ESM/CJS interop issues in Vite
    const QRCode = (QRCodeComponent as any).default || QRCodeComponent;

    const verifyUrl = `${window.location.origin}/verify/${invite.certificateId}`;
    const signedDate = invite.auditEvents.find(e => e.type === 'AGREEMENT_SIGNED')?.timestamp;

    return (
        <div id="print-certificate" className="bg-white p-10 max-w-[800px] mx-auto absolute -left-[9999px] top-0">

            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Certificate of Representation</h1>
                    <p className="text-sm font-bold text-slate-500 mt-1">Dwellingly Commission Infrastructure™</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-600 uppercase">Certificate ID</p>
                    <p className="font-mono text-lg font-bold text-slate-900">{invite.certificateId}</p>
                </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Broker / Agent</h3>
                    <p className="font-bold text-lg text-slate-900">Mock Texas Agent</p>
                    <p className="text-sm text-slate-600">Dwellingly Realty Group</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Client (Buyer)</h3>
                    <p className="font-bold text-lg text-slate-900">{invite.buyerName}</p>
                    <p className="text-sm text-slate-600">{invite.buyerContact}</p>
                </div>
            </div>

            {/* Terms & Signature */}
            <div className="mb-10">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">Agreement Details</h3>
                <p className="text-sm text-slate-700 mb-2"><span className="font-bold">Template:</span> {invite.templateSnapshot.name} ({invite.templateSnapshot.version})</p>
                <p className="text-sm text-slate-700 mb-6"><span className="font-bold">Jurisdiction:</span> {invite.templateSnapshot.jurisdiction}</p>

                <div className="flex gap-8 items-end">
                    <div className="flex-1">
                        <p className="text-sm text-slate-600 mb-2">Electronic Signature securely recorded at <span className="font-bold">{signedDate ? format(new Date(signedDate), "yyyy-MM-dd HH:mm:ss 'UTC'") : ''}</span></p>
                        <div className="border border-slate-300 rounded p-4 h-32 flex items-center justify-center bg-slate-50">
                            {invite.signatureData?.signatureImageDataUrl ? (
                                <img src={invite.signatureData.signatureImageDataUrl} alt="Signature" className="max-h-full max-w-full" />
                            ) : (
                                <span className="text-slate-400 italic">Signature Image</span>
                            )}
                        </div>
                        <p className="text-xs text-center text-slate-500 mt-2 font-mono">Signer Name: {invite.signatureData?.typedName}</p>
                    </div>

                    <div className="shrink-0 flex items-center justify-center p-4 border-2 border-slate-900 rounded-xl">
                        <QRCode value={verifyUrl} size={100} />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 text-center leading-relaxed">
                <p>This certificate represents a cryptographically verified intent to form an exclusive buyer representation agreement.</p>
                <p className="font-mono mt-1">Scan the QR code or visit the verification URL to validate authenticity.</p>
            </div>

        </div>
    );
};
