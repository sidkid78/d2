import { type BuyerInvite, AuditEventType, type SignatureData, type Notification, type Activity } from '../types/domain';
import { hashToken, generateCertificateId } from '../lib/utils/crypto';

const STORAGE_KEY = 'dwellingly_invites_v1';

export class MockBuyerEnsureService {
    private async _getAll(): Promise<BuyerInvite[]> {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    private async _saveAll(invites: BuyerInvite[]): Promise<void> {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
    }

    async listInvites(): Promise<BuyerInvite[]> {
        return await this._getAll();
    }

    async createInvite(params: Partial<BuyerInvite>, rawToken: string): Promise<BuyerInvite> {
        const invites = await this._getAll();
        const tokenHash = await hashToken(rawToken);

        const newInvite: BuyerInvite = {
            id: crypto.randomUUID(),
            agentId: 'agent_123', // Mock current user
            buyerName: params.buyerName || '',
            buyerContact: params.buyerContact || '',
            tokenHash,
            rawToken,
            createdAtUtc: new Date().toISOString(),
            ttlDays: 7,
            templateSnapshot: params.templateSnapshot!,
            auditEvents: [{ type: AuditEventType.INVITE_CREATED, timestamp: new Date().toISOString() }],
        };

        invites.push(newInvite);
        await this._saveAll(invites);
        return newInvite;
    }

    async getInviteByToken(rawToken: string): Promise<BuyerInvite | null> {
        const invites = await this._getAll();
        const incomingHash = await hashToken(rawToken);
        const invite = invites.find(i => i.tokenHash === incomingHash);

        if (invite) {
            // Record 'viewed' event if not already signed/revoked
            if (!invite.auditEvents.some(e => e.type === AuditEventType.INVITE_VIEWED)) {
                await this.addEvent(invite.id, AuditEventType.INVITE_VIEWED, {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform
                });
            }
        }

        return invite || null;
    }

    async signAgreement(inviteId: string, signature: SignatureData): Promise<string> {
        const invites = await this._getAll();
        const index = invites.findIndex(i => i.id === inviteId);

        if (index === -1) throw new Error('Invite not found');

        const certId = generateCertificateId();
        invites[index].signatureData = signature;
        invites[index].certificateId = certId;
        invites[index].auditEvents.push({
            type: AuditEventType.AGREEMENT_SIGNED,
            timestamp: new Date().toISOString(),
            metadata: {
                userAgent: signature.userAgent,
                typedName: signature.typedName
            }
        });

        await this._saveAll(invites);
        return certId;
    }

    async addEvent(inviteId: string, type: AuditEventType, metadata?: any): Promise<void> {
        const invites = await this._getAll();
        const index = invites.findIndex(i => i.id === inviteId);
        if (index !== -1) {
            invites[index].auditEvents.push({
                type,
                timestamp: new Date().toISOString(),
                metadata
            });
            await this._saveAll(invites);
        }
    }

    async verifyCertificate(certificateId: string): Promise<BuyerInvite | null> {
        const invites = await this._getAll();
        return invites.find(i => i.certificateId === certificateId) || null;
    }

    async listNotifications(): Promise<Notification[]> {
        const invites = await this._getAll();
        const notifications: Notification[] = [];

        // Derived: Signature Overdue (created > 48h ago and not signed)
        invites.forEach(invite => {
            const createdDate = new Date(invite.createdAtUtc);
            const now = new Date();
            const diffHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

            if (diffHours > 48 && !invite.signatureData) {
                notifications.push({
                    id: `notif_overdue_${invite.id}`,
                    category: 'action',
                    priority: 'high',
                    title: 'Signature Overdue',
                    message: `${invite.buyerName} hasn't signed the agreement sent 48 hours ago.`,
                    timestamp: invite.createdAtUtc,
                    read: false,
                    inviteId: invite.id
                });
            }

            // Derived: Signed (last 24h)
            if (invite.signatureData) {
                const signedDate = new Date(invite.signatureData.signedAtUtc);
                if ((now.getTime() - signedDate.getTime()) / (1000 * 60 * 60) < 24) {
                    notifications.push({
                        id: `notif_signed_${invite.id}`,
                        category: 'protected',
                        priority: 'medium',
                        title: 'Commission Secured',
                        message: `${invite.buyerName} signed. Dwellingly Certificate #${invite.certificateId} is now active.`,
                        timestamp: invite.signatureData.signedAtUtc,
                        read: false,
                        inviteId: invite.id
                    });
                }
            }
        });

        // Static system update
        notifications.push({
            id: 'notif_sys_compliance',
            category: 'system',
            priority: 'low',
            title: 'Compliance Update',
            message: 'New NAR settlement disclosure requirements added for 2024. Please review updated templates.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            read: true
        });

        return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    async listActivities(): Promise<Activity[]> {
        const invites = await this._getAll();
        const activities: Activity[] = [];

        invites.forEach(invite => {
            invite.auditEvents.forEach(event => {
                let type: any = null;
                let title = '';
                let description = '';
                let statusTag = '';

                if (event.type === AuditEventType.AGREEMENT_SIGNED) {
                    type = 'agreement_signed';
                    title = `Agreement Signed: ${invite.buyerName}`;
                    description = `Buyer Representation Agreement for property has been digitally signed and verified. Commission is now locked.`;
                    statusTag = 'Commission Secured';
                } else if (event.type === AuditEventType.INVITE_VIEWED) {
                    type = 'terms_reviewed';
                    title = `Reviewing Terms: ${invite.buyerName}`;
                    description = `Client is currently viewing the Buyer Agency Disclosure.`;
                } else if (event.type === AuditEventType.INVITE_CREATED) {
                    type = 'link_opened';
                    title = `Invite Created: ${invite.buyerName}`;
                    description = `Secure agreement link generated and sent to buyer.`;
                }

                if (type) {
                    activities.push({
                        id: `act_${invite.id}_${event.type}`,
                        type,
                        title,
                        description,
                        timestamp: event.timestamp,
                        inviteId: invite.id,
                        statusTag
                    });
                }
            });
        });

        return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
}

export const mockService = new MockBuyerEnsureService();
