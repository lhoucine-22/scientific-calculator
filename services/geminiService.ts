import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (
  message: string, 
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    // Format history for the chat session
    // The new SDK simplifies chat management but let's just use a fresh chat for simplicity 
    // or a persistent one if we were storing objects. 
    // For this stateless service call, we'll re-construct context or just send the prompt with context.
    // To keep it simple and robust with the requested stateless structure:
    
    const model = 'gemini-2.5-flash';
    const systemInstruction = `
      You are an expert mathematical assistant integrated into a scientific calculator app "NeuralCalc".
      Your goal is to help users solve complex math problems, explain concepts, or convert units.
      
      Rules:
      1. If the user asks a math question, solve it step-by-step.
      2. Use LaTeX formatting for complex equations if possible, but plain text is fine for simple ones.
      3. Be concise. The user is on a calculator app.
      4. If the user provides an equation that the calculator failed to solve, analyze why.
      5. Format your response with clear headings or bullet points for readability.
    `;

    // We create a chat session with the history
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message: message });
    return response.text || "I couldn't generate a response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the AI assistant.");
  }
};