import { GoogleGenAI, Type } from "@google/genai";
import { PalaceGenerationRequest, RoomData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction based on the user's specific Method of Loci persona
const SYSTEM_INSTRUCTION = `
Você é um especialista em técnica de memorização pelo Método de Loci (Palácio da Memória). Sua função é transformar informações técnicas em narrativas memorizáveis usando localizações espaciais específicas.

REGRAS FUNDAMENTAIS:
1. PRESERVAÇÃO ABSOLUTA: Todas as informações técnicas fornecidas devem ser mantidas EXATAMENTE como recebidas.
2. ORDEM FIXA DOS AMBIENTES: Entrada -> Cozinha -> Quartos -> Banheiros -> Quintal. Use apenas o necessário.
3. NARRATIVA: Crie narrativas lúdicas, usando metáforas e alusões visuais fortes.
`;

export const generatePalaceStructure = async (request: PalaceGenerationRequest): Promise<RoomData[]> => {
  try {
    const prompt = `
    Tema: ${request.theme}
    Conteúdo técnico: ${request.content}
    Estilo visual: ${request.visualStyle}

    Analise o conteúdo, divida em grupos lógicos e atribua aos ambientes.
    Gere um JSON array onde cada objeto representa uma cena.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              roomName: { type: Type.STRING, description: "Nome do ambiente (ex: Entrada, Cozinha)" },
              narrative: { type: Type.STRING, description: "Narrativa lúdica e visual" },
              technicalInfo: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "Lista exata dos dados técnicos incluídos nesta cena" 
              },
              imagePrompt: { type: Type.STRING, description: "Prompt detalhado para gerar a imagem da cena" }
            },
            required: ["roomName", "narrative", "technicalInfo", "imagePrompt"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No text response from Gemini");
    }

    const rooms: RoomData[] = JSON.parse(response.text);
    return rooms;

  } catch (error) {
    console.error("Error generating palace structure:", error);
    throw error;
  }
};

export const generateRoomImage = async (imagePrompt: string, style: string): Promise<string | null> => {
  try {
    const fullPrompt = `Style: ${style}. Scene: ${imagePrompt}. High quality, detailed, atmospheric.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: fullPrompt,
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
