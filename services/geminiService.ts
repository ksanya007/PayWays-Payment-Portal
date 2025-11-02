
import { GoogleGenAI, Type } from '@google/genai';
import type { GeminiRiskAnalysis } from '../types';

export async function analyzeTransactionRisk(details: { country: string; amount: number; paymentMethod: string }): Promise<GeminiRiskAnalysis> {
    if (!process.env.API_KEY) {
        console.warn("API_KEY environment variable not set. Returning low risk default.");
        // Return a default low-risk response for UI testing without an API key
        return { riskLevel: 'low', reason: 'API key not configured. Defaulting to low risk.' };
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Analyze the following payment transaction for potential fraud risk and return a JSON object.
      Transaction details:
      - Country: ${details.country}
      - Amount (USD): ${details.amount}
      - Payment Method: ${details.paymentMethod}

      Consider factors like typical transaction amounts for the country, high-risk countries for certain payment types, unusually large sums, or common fraud patterns associated with the payment method.
      
      Provide:
      1. A 'riskLevel' (low, medium, high).
      2. A brief 'reason' summarizing the main factor for the risk level.
      3. An array of strings called 'indicators' listing specific factors that contributed to the risk assessment (e.g., "Large transaction for this country", "Payment method mismatch", "High-risk region"). If no specific indicators are found, return an empty array.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        riskLevel: { 
                            type: Type.STRING,
                            description: 'The calculated risk level, either "low", "medium", or "high".'
                        },
                        reason: {
                            type: Type.STRING,
                            description: 'A brief explanation for the assigned risk level.'
                        },
                        indicators: {
                            type: Type.ARRAY,
                            description: 'A list of specific risk indicators found in the transaction.',
                            items: {
                                type: Type.STRING
                            }
                        }
                    },
                    required: ['riskLevel', 'reason', 'indicators']
                },
            },
        });
        
        const jsonString = response.text.trim();
        const parsedResponse = JSON.parse(jsonString);

        if (['low', 'medium', 'high'].includes(parsedResponse.riskLevel) && parsedResponse.reason && Array.isArray(parsedResponse.indicators)) {
            return parsedResponse as GeminiRiskAnalysis;
        } else {
            throw new Error('Invalid JSON structure from Gemini API');
        }

    } catch (error) {
        console.error('Error analyzing transaction with Gemini:', error);
        // Fallback in case of API error
        return { riskLevel: 'low', reason: 'Could not perform risk analysis due to an API error.' };
    }
}