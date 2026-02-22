/**
 * Generates a secure random token for the buyer link.
 */
export const generateRawToken = (): string => {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
};

/**
 * SHA-256 Hashing for token storage.
 */
export const hashToken = async (token: string): Promise<string> => {
    const msgUint8 = new TextEncoder().encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Generates a unique Certificate ID: DW-XXXX-XXXX
 */
export const generateCertificateId = (): string => {
    const segment = () => Math.floor(1000 + Math.random() * 9000).toString();
    return `DW-${segment()}-${segment()}`;
};
