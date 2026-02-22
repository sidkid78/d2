import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockService } from '../services/MockService';
import type { BuyerInvite } from '../types/domain';
import { getBuyerInitials } from '../lib/logic/auditEngine';
import { ShieldCheck, Calendar, ArrowRight, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

export const VerifyPage: React.FC = () => {
    const { certificateId } = useParams<{ certificateId: string }>();
    const [invite, setInvite] = useState<BuyerInvite | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">Loading Verification...</div>;
    }

    if (!invite) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center border border-slate-200 shadow-xl shadow-slate-200">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Invalid Certificate</h2>
                    <p className="text-slate-600 mb-8 font-medium">This Commission Protection Certificate ID could not be found or is no longer valid.</p>
                    <Link to="/" className="text-brand-600 font-bold hover:text-brand-700">Return Home</Link>
                </div>
            </div>
        );
    }

    const initials = getBuyerInitials(invite.buyerName);
    const signedDate = invite.auditEvents.find(e => e.type === 'AGREEMENT_SIGNED')?.timestamp;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl shadow-slate-200 border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500">

                {/* Certificate Header Section */}
                <div className="bg-emerald-600 px-8 py-10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ring-4 ring-white/30">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Active Representation</h1>
                        <p className="text-emerald-50 font-medium opacity-90 tracking-widest uppercase text-sm">Verified Certificate</p>
                    </div>
                </div>

                {/* Certificate Body Section */}
                <div className="px-8 py-10 space-y-8 bg-white relative">

                    {/* Status Badge Overlap */}
                    <div className="absolute -top-5 inset-x-0 flex justify-center">
                        <div className="bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2 text-sm font-bold text-slate-700 font-mono">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            ID: {invite.certificateId}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 mt-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Agent</p>
                            <div className="flex items-start gap-2">
                                <div className="bg-brand-50 p-2 rounded-lg text-brand-600 mt-0.5">
                                    <UserCheck size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 leading-tight">Mock Texas Agent</p>
                                    <p className="text-sm text-slate-500 mt-0.5">Dwellingly Realty</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Client</p>
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-inner">
                                    {initials}
                                </div>
                                <p className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Privacy Protected</p>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Agreement Verified</p>
                            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <Calendar className="text-slate-400" size={18} />
                                <p className="font-bold text-slate-700">
                                    {signedDate ? format(new Date(signedDate), "MMMM d, yyyy 'at' h:mm a") : 'Unknown'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500 font-medium">This digital certificate verifies active, exclusive representation conforming to local regulations.</p>
                    </div>
                </div>

            </div>

            <div className="mt-8 text-center">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group">
                    Powered by Dwellingly <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
