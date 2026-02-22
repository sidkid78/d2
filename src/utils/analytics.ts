import type { BuyerInvite } from '../types/domain';

export interface DashboardKPIs {
    sentLast7Days: number;
    signedLast7Days: number;
    conversionRate: number;
    medianTimeToSignMinutes: number | null;
}

export const calculateKPIs = (invites: BuyerInvite[]): DashboardKPIs => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentInvites = invites.filter(i => new Date(i.createdAtUtc) >= sevenDaysAgo);
    const sentCount = recentInvites.length;
    const signedInvites = recentInvites.filter(i =>
        i.auditEvents.some(e => e.type === 'AGREEMENT_SIGNED')
    );
    const signedCount = signedInvites.length;

    // Calculate Median Time to Sign
    const signDurations = signedInvites.map(i => {
        const sentEvent = i.auditEvents.find(e => e.type === 'INVITE_SENT');
        const signedEvent = i.auditEvents.find(e => e.type === 'AGREEMENT_SIGNED');
        if (sentEvent && signedEvent) {
            return (new Date(signedEvent.timestamp).getTime() - new Date(sentEvent.timestamp).getTime()) / 60000;
        }
        return null;
    }).filter((d): d is number => d !== null).sort((a, b) => a - b);

    let medianTime = null;
    if (signDurations.length > 0) {
        const mid = Math.floor(signDurations.length / 2);
        medianTime = signDurations.length % 2 !== 0
            ? signDurations[mid]
            : (signDurations[mid - 1] + signDurations[mid]) / 2;
    }

    return {
        sentLast7Days: sentCount,
        signedLast7Days: signedCount,
        conversionRate: sentCount > 0 ? (signedCount / sentCount) * 100 : 0,
        medianTimeToSignMinutes: medianTime
    };
};
