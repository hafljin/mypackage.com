
import { GoogleGenAI } from "@google/genai";

/**
 * Analyzes the inquiry text using Gemini API and provides automation suggestions.
 */
export const analyzeInquiry = async (text: string): Promise<string> => {
  // Check if API key is present; though external handling is assumed, we provide a fallback for robustness.
  if (!process.env.API_KEY) {
    return "APIキーが設定されていないため、分析を実行できません。";
  }

  try {
    // Create a new GoogleGenAI instance right before making an API call to ensure latest configuration.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `以下の問い合わせ内容を分析し、自動化の可能性と具体的な改善アドバイスを日本語で簡潔に提供してください。
      
問い合わせ内容:
${text}`,
      config: {
        systemInstruction: "あなたは業務効率化のスペシャリストです。問い合わせ内容から『よくある質問』として自動化できるポイントを抽出し、ユーザーが『この人に任せれば楽になりそう』と思えるようなアドバイスを提供してください。",
        temperature: 0.7,
      },
    });

    // Access the text property directly (not as a method).
    return response.text || "分析に失敗しました。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "分析中にエラーが発生しました。直接ご相談ください。";
  }
};
