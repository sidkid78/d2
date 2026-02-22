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

            onCreated(newInvite.id);

            // Pass the raw token via URL hash for demo purposes so it can be generated
            window.location.hash = `#copy_${rawToken}`;
            onClose();
        } catch (error) {
            console.error('Failed to create invite:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 id="modal-title" className="text-xl font-bold text-slate-900">New Protection Link</h2>
                    <button onClick={onClose} aria-label="Close modal" className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="buyerName" className="block text-sm font-semibold text-slate-700 mb-1">
                                Buyer Name
                            </label>
                            <input
                                id="buyerName"
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
                                placeholder="e.g. Jane Doe"
                                value={buyerName}
                                onChange={(e) => setBuyerName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="buyerContact" className="block text-sm font-semibold text-slate-700 mb-1">
                                Contact (Email or Phone)
                            </label>
                            <input
                                id="buyerContact"
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
                                placeholder="jane@example.com or 555-0199"
                                value={buyerContact}
                                onChange={(e) => setBuyerContact(e.target.value)}
                            />
                        </div>

                        <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 mt-6">
                            <h4 className="text-sm font-semibold text-brand-900 mb-1">Agreement Template</h4>
                            <p className="text-xs text-brand-700">{TEMPLATE_MOCK.name} ({TEMPLATE_MOCK.version})</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                'Generate Secure Link'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
