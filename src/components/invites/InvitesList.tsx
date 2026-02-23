import React from 'react';
import { Link } from 'react-router-dom';
import type { BuyerInvite } from '../../types/domain';
import { deriveStatus } from '../../lib/logic/auditEngine';
import { StatusBadge } from './StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight } from 'lucide-react';

interface Props {
    invites: BuyerInvite[];
    onResend?: (inviteId: string) => void;
    resendingId?: string | null;
}

export const InvitesList: React.FC<Props> = ({ invites, onResend, resendingId }) => {
    if (invites.length === 0) {
        return (
            <div className="p-12 text-center text-text-muted">
                <p className="font-bold text-lg text-white font-display">No protection links sent yet.</p>
                <p className="text-sm mt-1">Create your first invite to secure your commission.</p>
            </div>
        );
    }

    // Sort by newest first
    const sortedInvites = [...invites].sort((a, b) =>
        new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime()
    );

    return (
        <div className="divide-y divide-white/5">
            {sortedInvites.map((invite) => {
                const status = deriveStatus(invite);
                const isSigned = !!invite.signatureData;

                return (
                    <div
                        key={invite.id}
                        className="flex items-center justify-between p-6 hover:bg-white/5 transition-all group"
                    >
                        <Link
                            to={`/app/invites/${invite.id}`}
                            className="flex flex-col gap-1.5 flex-1 min-w-0"
                        >
                            <span className="font-bold text-white group-hover:text-primary transition-colors font-display text-lg">
                                {invite.buyerName}
                            </span>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                                <span className="font-medium">{invite.buyerContact}</span>
                                <span className="hidden sm:inline-block text-white/10">•</span>
                                <span className="font-bold uppercase tracking-widest text-[10px]">
                                    Sent {formatDistanceToNow(new Date(invite.createdAtUtc), { addSuffix: true })}
                                </span>
                            </div>
                        </Link>
                        <div className="flex items-center gap-6">
                            <StatusBadge status={status} />

                            {!isSigned && onResend && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onResend(invite.id);
                                    }}
                                    disabled={resendingId === invite.id}
                                    className={`text-text-muted hover:text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all hover:translate-x-1 ${resendingId === invite.id ? 'opacity-50' : ''}`}
                                >
                                    {resendingId === invite.id ? 'Resending...' : 'Resend'}
                                    <span className="material-symbols-outlined text-base">
                                        {resendingId === invite.id ? 'sync' : 'forward_to_inbox'}
                                    </span>
                                </button>
                            )}

                            <Link to={`/app/invites/${invite.id}`} className="text-white/20 group-hover:text-primary transition-all group-hover:translate-x-1">
                                <ChevronRight size={24} />
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
