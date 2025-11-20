
import { GoogleGenAI } from "@google/genai";
import type { Coordinates, Restaurant } from '../types';

const getRestaurants = async (location: Coordinates): Promise<Restaurant[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "推薦我附近適合吃晚餐的餐廳 (Recommend some good dinner restaurants near me)",
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        }
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (!groundingChunks || groundingChunks.length === 0) {
      return [];
    }

    const restaurants: Restaurant[] = groundingChunks
      .filter(chunk => chunk.maps && chunk.maps.title && chunk.maps.uri)
      .map((chunk, index) => ({
        title: chunk.maps.title!,
        uri: chunk.maps.uri!,
        imageUrl: `https://picsum.photos/seed/${index+1}/400/300`,
      }));

    return restaurants;

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get recommendations: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching recommendations.");
  }
};

export const geminiService = {
  getRestaurants,
};
