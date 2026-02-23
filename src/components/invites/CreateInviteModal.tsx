import React, { useState } from 'react';
import { mockService } from '../../services/MockService';
import { generateRawToken } from '../../lib/utils/crypto';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (inviteId: string) => void;
}

const TEMPLATE_MOCK = {
    id: 'tpl_tx_1501_2024',
    name: 'Texas Residential Buyer Representation Agreement',
    jurisdiction: 'TX' as const,
    version: '2024.1',
    compensationDisclosure: 'Broker compensation is not set by law and is fully negotiable.',
    summarySections: [
        { title: 'Exclusive Representation', content: 'You agree to work exclusively with me for the duration of this agreement.' },
        { title: 'Broker Compensation', content: 'Our brokerage fee is 3% of the sales price, payable at closing. If the seller offers compensation, it will be credited against this amount.' },
        { title: 'Term & Termination', content: 'This agreement lasts for 6 months but can be terminated by either party with 30 days written notice.' }
    ],
    fullText: 'Legal text placeholder for TREC 1501...'
};

export const CreateInviteModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
    const [buyerName, setBuyerName] = useState('');
    const [buyerContact, setBuyerContact] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const rawToken = generateRawToken();
            const newInvite = await mockService.createInvite(
                { buyerName, buyerContact, templateSnapshot: TEMPLATE_MOCK },
                rawToken
            );

            const link = `${window.location.origin}/sign/${rawToken}`;
            setGeneratedLink(link);
            setShowSuccess(true);

            onCreated(newInvite.id);
        } catch (error) {
            console.error('Failed to create invite:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="glass-panel rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-glass-border">
                <div className="px-6 py-5 border-b border-glass-border flex justify-between items-center bg-white/5">
                    <h2 id="modal-title" className="text-xl font-bold text-white tracking-tight font-display">New Protection Link</h2>
                    <button onClick={onClose} aria-label="Close modal" className="p-2 text-text-muted hover:text-white rounded-full hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {showSuccess ? (
                    <div className="p-8 space-y-6 animate-in zoom-in duration-300">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(48,137,118,0.3)]">
                                <span className="material-symbols-outlined text-3xl">check_circle</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Invite Secured</h3>
                                <p className="text-text-muted text-sm mt-1">Real emails are disabled in prototype mode. Copy this link to test the signing flow:</p>
                            </div>
                        </div>

                        <div className="bg-background-dark/50 p-4 rounded-xl border border-white/10 space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Live Invite Link</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedLink);
                                        const btn = document.getElementById('modal-copy-btn');
                                        if (btn) btn.innerText = 'check';
                                        setTimeout(() => { if (btn) btn.innerText = 'content_copy'; }, 2000);
                                    }}
                                    className="text-primary hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                                >
                                    <span id="modal-copy-btn" className="material-symbols-outlined text-sm">content_copy</span>
                                    Copy Link
                                </button>
                                <button
                                    onClick={() => {
                                        const subject = encodeURIComponent('Action Required: Secure Buyer Representation Agreement');
                                        const body = encodeURIComponent(`Hi ${buyerName},\n\nPlease review and sign the buyer representation agreement to secure your commission protection:\n\n${generatedLink}\n\nBest regards,\nDwellingly Agent`);
                                        window.location.href = `mailto:${buyerContact}?subject=${subject}&body=${body}`;
                                    }}
                                    className="text-primary hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold ml-4"
                                >
                                    <span className="material-symbols-outlined text-sm">mail</span>
                                    Send via Email
                                </button>
                            </div>
                            <code className="block w-full p-3 bg-white/5 rounded-lg border border-white/5 text-[10px] text-primary font-mono break-all leading-relaxed">{generatedLink}</code>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full glass-button font-bold py-3 px-4 rounded-xl"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="buyerName" className="block text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2 ml-1">
                                    Buyer Name
                                </label>
                                <input
                                    id="buyerName"
                                    type="text"
                                    required
                                    className="w-full glass-input"
                                    placeholder="e.g. Jane Doe"
                                    value={buyerName}
                                    onChange={(e) => setBuyerName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="buyerContact" className="block text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2 ml-1">
                                    Contact (Email or Phone)
                                </label>
                                <input
                                    id="buyerContact"
                                    type="text"
                                    required
                                    className="w-full glass-input"
                                    placeholder="jane@example.com or 555-0199"
                                    value={buyerContact}
                                    onChange={(e) => setBuyerContact(e.target.value)}
                                />
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-6 backdrop-blur-[2px]">
                                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Agreement Template</h4>
                                <p className="text-sm font-medium text-white">{TEMPLATE_MOCK.name}</p>
                                <p className="text-[10px] text-text-muted mt-1 uppercase tracking-tighter">Version: {TEMPLATE_MOCK.version}</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full glass-button font-bold py-3 px-4 rounded-xl h-[52px] ${isSubmitting ? 'opacity-50' : ''}`}
                            >
                                {isSubmitting ? (
                                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">verified_user</span>
                                        Generate Secure Link
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
