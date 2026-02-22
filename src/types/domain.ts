export type InviteStatus = 'created' | 'sent' | 'viewed' | 'signed' | 'expired' | 'revoked';

export const AuditEventType = {
    INVITE_CREATED: 'INVITE_CREATED',
    INVITE_SENT: 'INVITE_SENT',
    INVITE_VIEWED: 'INVITE_VIEWED',
    AGREEMENT_SIGNED: 'AGREEMENT_SIGNED',
    INVITE_REVOKED: 'INVITE_REVOKED',
} as const;

export type AuditEventType = typeof AuditEventType[keyof typeof AuditEventType];

export interface AuditEvent {
    type: AuditEventType;
    timestamp: string; // ISO UTC
    metadata?: Record<string, any>;
}

export interface AgreementTemplate {
    id: string;
    name: string;
    jurisdiction: 'TX';
    version: string;
    summarySections: { title: string; content: string }[];
    fullText: string;
    compensationDisclosure: string;
}

export interface SignatureData {
    typedName: string;
    signatureImageDataUrl?: string;
    consent: boolean;
    signedAtUtc: string;
    userAgent: string;
}

export interface BuyerInvite {
    id: string;
    agentId: string;
    buyerName: string;
    buyerContact: string; // Email or Phone
    tokenHash: string; // SHA-256
    createdAtUtc: string;
    ttlDays: number;
    templateSnapshot: AgreementTemplate;
    auditEvents: AuditEvent[];
    certificateId?: string;
    signatureData?: SignatureData;
}

export interface Certificate {
    certificateId: string;
    inviteId: string;
    issuedAtUtc: string;
    agentName: string;
    brokerageName: string;
    buyerInitials: string;
}
