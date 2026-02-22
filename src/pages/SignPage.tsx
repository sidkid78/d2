import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '../services/MockService';
import type { BuyerInvite, SignatureData } from '../types/domain';
import { canSign } from '../lib/logic/auditEngine';

import StepIntro from '../components/buyer/StepIntro';
import StepSummary from '../components/buyer/StepSummary';
import StepSign from '../components/buyer/StepSign';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { summarizeAgreement } from '../services/aiService';

export const SignPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [invite, setInvite] = useState<BuyerInvite | null>(null);
    const [summarySections, setSummarySections] = useState<{ title: string; content: string }[] | null>(null);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isSigning, setIsSigning] = useState(false);

    useEffect(() => {
        const loadInvite = async () => {
            if (!token) {
                setError('Invalid link.');
                setLoading(false);
                return;
            }

            const foundInvite = await mockService.getInviteByToken(token);

            if (!foundInvite) {
                setError('Invite not found or invalid link.');
                setLoading(false);
                return;
            }

            const accessCheck = canSign(foundInvite);
            if (!accessCheck.allowed) {
                setError(accessCheck.reason || 'Cannot access this invite.');
            }

            setInvite(foundInvite);
            setLoading(false);

            // Fetch AI summary dynamically
            setIsSummarizing(true);
            const aiSummary = await summarizeAgreement(foundInvite.templateSnapshot);
            setSummarySections(aiSummary);
            setIsSummarizing(false);
        };

        loadInvite();
    }, [token]);

    const handleSign = async (data: { typedName: string; signatureImageDataUrl: string; consent: boolean }) => {
        if (!invite) return;
        setIsSigning(true);
        setError('');

        try {
            console.log('Submitting signature for invite:', invite.id);
            const fullSignatureData: SignatureData = {
                ...data,
                signedAtUtc: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            const certId = await mockService.signAgreement(invite.id, fullSignatureData);
            console.log('Signature successful, certId:', certId);
            navigate(`/verify/${certId}`);
        } catch (err: any) {
            console.error('Signing error:', err);
            setError(err.message || 'Failed to securely sign agreement. Please try again.');
            setIsSigning(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !invite) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center border border-slate-200 shadow-sm animate-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
                    <p className="text-slate-600 mb-6 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:justify-center items-center md:p-4">
            <div className="bg-white w-full min-h-screen md:min-h-0 md:max-w-xl md:rounded-3xl shadow-xl overflow-hidden shadow-slate-200 divide-y divide-slate-100 transition-all flex flex-col">

                {/* Progress Header */}
                <div role="progressbar" {...{ 'aria-valuenow': step, 'aria-valuemin': 1, 'aria-valuemax': 3 }} aria-label={`Step ${step} of 3`} className="px-6 py-4 flex items-center gap-2 bg-slate-50 border-b border-slate-100 shrink-0">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            aria-hidden="true"
                            className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-brand-500' : 'bg-slate-200'}`}
                        />
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {step === 1 && <StepIntro onNext={() => setStep(2)} agentName={invite.agentId} />}
                    {step === 2 && (
                        <div className="relative">
                            {isSummarizing && !summarySections && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                                    <Sparkles className="w-10 h-10 text-brand-500 animate-bounce mb-4" />
                                    <p className="text-sm font-bold text-brand-900 tracking-tight">AI is summarizing the agreement...</p>
                                    <p className="text-xs text-slate-500 mt-1">Generating plain language terms with Gemini 3 Flash</p>
                                </div>
                            )}
                            <StepSummary onNext={() => setStep(3)} summarySections={summarySections || invite.templateSnapshot.summarySections} />
                        </div>
                    )}
                    {step === 3 && <StepSign onSign={handleSign} buyerName={invite.buyerName} isLoading={isSigning} />}
                </div>
            </div>
        </div>
    );
};
