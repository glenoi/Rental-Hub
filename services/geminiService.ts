import { GoogleGenAI, Type } from "@google/genai";
import { TenantProfile, Property } from '../types';

// In a real app, this key comes from process.env.API_KEY.
// For this demo, we assume the environment is set up correctly.
const apiKey = process.env.API_KEY || ''; 

// Helper to check if key is present to prevent crashing if user forgets it
const isConfigured = !!apiKey;

export const calculateTenantScore = async (profile: TenantProfile, propertyPrice: number): Promise<{ score: number; reasoning: string }> => {
  if (!isConfigured) {
    console.warn("Gemini API Key missing. Returning mock score.");
    return { score: 75, reasoning: "Mock Analysis: Sufficient income and stable profile (API Key missing)." };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze this tenant profile for a rental property priced at RM${propertyPrice}/month.
    
    Tenant Data:
    - Occupation: ${profile.occupation}
    - Income: RM${profile.monthlyIncome}
    - Pax: ${profile.paxAdults} Adults, ${profile.paxKids} Kids
    - Contract: ${profile.contractPeriod} months
    - Nationality: ${profile.nationality}

    Criteria:
    1. Rent-to-Income Ratio (Ideal is < 30%)
    2. Employment Stability (Implied by occupation)
    3. Family composition vs Property fit (Assuming average sized unit)

    Return a JSON object with:
    - score: Integer 0-100
    - reasoning: A short sentence summarizing the risk assessment.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Gemini Scoring Failed:", error);
    return { score: 70, reasoning: "AI Analysis unavailable, default score assigned." };
  }
};

export const generatePropertyDescription = async (details: Partial<Property>): Promise<string> => {
  if (!isConfigured) return "A lovely unit in a prime location. (AI Description unavailable)";

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Write a catchy, professional 2-sentence description for a rental property in Malaysia.
    Details: ${details.type}, ${details.rooms} rooms, ${details.furnishing}, located in ${details.location}.
    Highlight: ${details.tags?.join(', ')}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Description generation failed.";
  } catch (error) {
    return "Description generation failed.";
  }
};