
import { GoogleGenAI, Type } from "@google/genai";
import { SmartScheduleResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSmartSchedule(prompt: string): Promise<SmartScheduleResponse> {
  const systemInstruction = `
    You are a professional time management assistant. 
    The user will provide a list of tasks or their daily schedule. 
    Your goal is to suggest a set of alarms to help them stay on track.
    Format your response as JSON.
    Each alarm should have a 'time' (24h format HH:mm), a 'label', and a 'reason' why you suggested it.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Schedule: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedAlarms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  label: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["time", "label", "reason"]
              }
            },
            explanation: { type: Type.STRING }
          },
          required: ["suggestedAlarms", "explanation"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
