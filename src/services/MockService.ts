import { type BuyerInvite, AuditEventType, type SignatureData } from '../types/domain';
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
}

export const mockService = new MockBuyerEnsureService();
