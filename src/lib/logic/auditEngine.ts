import { type BuyerInvite, type InviteStatus, AuditEventType } from '../../types/domain';

export const deriveStatus = (invite: BuyerInvite): InviteStatus => {
    const events = invite.auditEvents.map(e => e.type);
    const now = new Date();
    const createdDate = new Date(invite.createdAtUtc);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(createdDate.getDate() + (invite.ttlDays || 7));

    // 1. Revocation has highest priority
    if (events.includes(AuditEventType.INVITE_REVOKED)) return 'revoked';
    // 2. Signature check
    if (events.includes(AuditEventType.AGREEMENT_SIGNED)) return 'signed';
    // 3. Expiration check (TTL logic)
    if (now > expiryDate) return 'expired';
    // 4. Activity progression
    if (events.includes(AuditEventType.INVITE_VIEWED)) return 'viewed';
    if (events.includes(AuditEventType.INVITE_SENT)) return 'sent';

    return 'created';
};

export const getBuyerInitials = (name: string): string => {
    if (!name) return '';
    return name
        .split(' ')
        .filter(n => n.length > 0)
        .map(n => n[0])
        .join('.')
        .toUpperCase();
};

// Hardening check for the Signing Page
export function canSign(invite: BuyerInvite): { allowed: boolean; reason?: string } {
    const status = deriveStatus(invite);

    if (status === 'signed') return { allowed: false, reason: 'Agreement already signed.' };
    if (status === 'revoked') return { allowed: false, reason: 'This invite has been revoked by the agent.' };
    if (status === 'expired') return { allowed: false, reason: 'This invite has expired.' };

    return { allowed: true };
}
