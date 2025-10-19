
import { GoogleGenAI, Chat } from "@google/genai";
import { ZCORE_SYSTEM_PROMPT } from '../constants';
import { ChatMessage, MessageRole } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// This function converts our app's message format to Gemini's format.
const buildGeminiHistory = (messages: ChatMessage[]) => {
  return messages.map(msg => ({
    role: msg.role === MessageRole.USER ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
};


export const getZCoreResponse = async (prompt: string, history: ChatMessage[]): Promise<string> => {
  try {
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-pro',
      history: buildGeminiHistory(history),
      config: {
        systemInstruction: ZCORE_SYSTEM_PROMPT,
      },
    });

    const response = await chat.sendMessage({ message: prompt });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // It's better to let the caller handle the UI part of the error
    throw new Error("Failed to communicate with the Z-CORE system.");
  }
};
