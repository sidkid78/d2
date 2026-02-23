import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { ShieldCheck } from 'lucide-react';

interface Props {
    onSign: (data: { typedName: string; signatureImageDataUrl: string; consent: boolean }) => void;
    buyerName: string;
    isLoading?: boolean;
}

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

const StepSign: React.FC<Props> = ({ onSign, buyerName, isLoading = false }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [typedName, setTypedName] = useState(buyerName);
    const [consent, setConsent] = useState(false);
    const [error, setError] = useState('');

    // Handle window resize for canvas
    useEffect(() => {
        const handleResize = () => {
            if (sigCanvas.current) {
                // Adjusting canvas size if needed
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isLoading) return;
        sigCanvas.current?.clear();
    };

    const handleSubmit = () => {
        if (isLoading) return;

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

        try {
            // Get the base64 image of the signature
            const rawCanvas = sigCanvas.current?.getCanvas();
            if (!rawCanvas) {
                setError('Failed to capture signature canvas. Please try again.');
                return;
            }
            const canvas = trimCanvas(rawCanvas);
            const signatureImageDataUrl = canvas.toDataURL('image/png');

            onSign({
                typedName,
                signatureImageDataUrl,
                consent
            });
        } catch (err) {
            console.error('Canvas error:', err);
            setError('Signature capture failed. Please ensure your browser supports canvas.');
        }
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
                        disabled={isLoading}
                        value={typedName}
                        onChange={(e) => setTypedName(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow disabled:opacity-50"
                        placeholder="Type your name"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="block text-sm font-bold text-slate-700">Digital Signature</label>
                        {!isLoading && (
                            <button
                                onClick={handleClear}
                                className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <div className={`border-2 border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-inner ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{ className: 'w-full h-48 cursor-crosshair' }}
                        />
                    </div>
                </div>

                <div className={`bg-slate-50 p-5 rounded-xl border border-slate-100 mt-8 group hover:border-slate-300 transition-colors ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            disabled={isLoading}
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
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group mt-4 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Recording Protection...</span>
                        </div>
                    ) : (
                        <>
                            <ShieldCheck className="w-5 h-5" /> Protect My Representation
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default StepSign;
