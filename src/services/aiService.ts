import { GoogleGenAI } from '@google/genai';
import type { BuyerInvite, AgreementTemplate } from '../types/domain';

// Use the unified standard library for Gemini API (2025)
// Implicitly uses GEMINI_API_KEY environment variable if available in Node
// In Vite, we'll check for VITE_GEMINI_API_KEY or fallback to an empty config
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
    apiKey: apiKey
});

/**
 * Summarizes a legal agreement into plain language bullet points.
 */
export async function summarizeAgreement(template: AgreementTemplate): Promise<{ title: string; content: string }[]> {
    if (!apiKey) {
        console.warn('AI Service: VITE_GEMINI_API_KEY is missing. Using template defaults.');
        return template.summarySections;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Summarize this real estate representation agreement for a buyer in exactly 3 simple, non-legalistic bullet points. Output ONLY as a JSON array of objects with "title" and "content" fields. 
      
      Agreement Name: ${template.name}
      Compensation: ${template.compensationDisclosure}
      Full Text: ${template.fullText}`,
            config: {
                responseMimeType: 'application/json',
            }
        });

        if (!response.text) {
            throw new Error('AI Summary: Empty response text');
        }
        const parsed = JSON.parse(response.text);
        return parsed;
    } catch (error) {
        console.error('AI Summarization failed:', error);
        return template.summarySections;
    }
}

/**
 * Analyzes an invite's audit trail to provide "Smart Nudges" for the agent.
 */
export async function getAgentInsights(invite: BuyerInvite): Promise<string> {
    if (!apiKey) return '';

    const eventSummary = invite.auditEvents
        .map(e => `${e.timestamp}: ${e.type}`)
        .join('\n');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are a real estate coach. Analyze this buyer invite's audit history and provide ONE concise "Smart Nudge" (max 15 words) for the agent. If the buyer has viewed the link multiple times but hasn't signed, suggest a follow-up. If it's new, suggest a warm touch.
      
      Buyer: ${invite.buyerName}
      Events:
      ${eventSummary}`,
        });

        return response.text || '';
    } catch (error) {
        return '';
    }
}
