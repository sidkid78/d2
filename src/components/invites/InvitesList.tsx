import React from 'react';
import { Link } from 'react-router-dom';
import type { BuyerInvite } from '../../types/domain';
import { deriveStatus } from '../../lib/logic/auditEngine';
import { StatusBadge } from './StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight } from 'lucide-react';

interface Props {
    invites: BuyerInvite[];
}

export const InvitesList: React.FC<Props> = ({ invites }) => {
    if (invites.length === 0) {
        return (
            <div className="p-12 text-center text-slate-500">
                <p>No protection links sent yet.</p>
                <p className="text-sm mt-1">Create your first invite to secure your commission.</p>
            </div>
        );
    }

    // Sort by newest first
    const sortedInvites = [...invites].sort((a, b) =>
        new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime()
    );

    return (
        <div className="divide-y divide-slate-100">
            {sortedInvites.map((invite) => {
                const status = deriveStatus(invite);
                return (
                    <Link
                        key={invite.id}
                        to={`/app/invites/${invite.id}`}
                        className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                    >
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                                {invite.buyerName}
                            </span>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                                <span>{invite.buyerContact}</span>
                                <span className="hidden sm:inline-block text-slate-300">•</span>
                                <span>Sent {formatDistanceToNow(new Date(invite.createdAtUtc), { addSuffix: true })}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <StatusBadge status={status} />
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-400" />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};
