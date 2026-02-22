import React from 'react';
import type { InviteStatus } from '../../types/domain';

const STATUS_CONFIG: Record<InviteStatus, { label: string; classes: string }> = {
    created: { label: 'Created', classes: 'bg-gray-100 text-gray-700' },
    sent: { label: 'Sent', classes: 'bg-blue-100 text-blue-700' },
    viewed: { label: 'Viewed', classes: 'bg-amber-100 text-amber-700' },
    signed: { label: 'Protected', classes: 'bg-green-100 text-green-700 font-bold' },
    expired: { label: 'Expired', classes: 'bg-red-100 text-red-700' },
    revoked: { label: 'Revoked', classes: 'bg-slate-100 text-slate-700' },
};

export const StatusBadge: React.FC<{ status: InviteStatus }> = ({ status }) => {
    const config = STATUS_CONFIG[status];
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
            {config.label}
        </span>
    );
};
