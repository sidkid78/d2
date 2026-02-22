import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { ShieldCheck } from 'lucide-react';

interface Props {
    onSign: (data: { typedName: string; signatureImageDataUrl: string; consent: boolean }) => void;
    buyerName: string;
}

const StepSign: React.FC<Props> = ({ onSign, buyerName }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [typedName, setTypedName] = useState(buyerName);
    const [consent, setConsent] = useState(false);
    const [error, setError] = useState('');

    // Handle window resize for canvas
    useEffect(() => {
        const handleResize = () => {
            if (sigCanvas.current) {
                // We don't clear on resize to preserve the signature, but we could if needed
                // sigCanvas.current.clear();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        sigCanvas.current?.clear();
    };

    const handleSubmit = () => {
        if (!consent) {
            setError('You must agree to the terms to proceed.');
            return;
        }
        if (!typedName.trim()) {
            setError('Please type your full legal name.');
            return;
        }
        if (sigCanvas.current?.isEmpty()) {
            setError('Please provide your signature.');
            return;
        }

        setError('');

        // Get the base64 image of the signature
        const signatureImageDataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png') || '';

        onSign({
            typedName,
            signatureImageDataUrl,
            consent
        });
    };

    return (
        <div className="p-8 animate-in slide-in-from-right-2 duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Sign Agreement</h2>
            <p className="text-slate-500 mb-8 font-medium">Please review the details below and provide your signature.</p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 font-semibold animate-in fade-in">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Legal Name</label>
                    <input
                        type="text"
                        value={typedName}
                        onChange={(e) => setTypedName(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
                        placeholder="Type your name"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="block text-sm font-bold text-slate-700">Digital Signature</label>
                        <button
                            onClick={handleClear}
                            className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="border-2 border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
                        {/* Note: In a real app, react-signature-canvas needs specific styling to be responsive */}
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{ className: 'w-full h-48 cursor-crosshair' }}
                        />
                    </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mt-8 group hover:border-slate-300 transition-colors">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 leading-relaxed font-medium">
                            I acknowledge that I have read the summary, understand the representation terms, and agree to use electronic records and signatures.
                        </span>
                    </label>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group mt-4 hover:shadow-md hover:-translate-y-0.5"
                >
                    <ShieldCheck className="w-5 h-5" /> Protect My Representation
                </button>
            </div>
        </div>
    );
};

export default StepSign;
