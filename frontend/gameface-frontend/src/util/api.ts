import { type EmotionResult, type GameRecommendation, type RecommendationResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const gameRecommendationAPI = {
  getRecommendations: async (
    imageFile: File,
    sessionId: string
  ): Promise<RecommendationResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/recommendations/get-recommendations`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-SESSION-ID': sessionId,
      },
    });

    if (!response.ok) {
      throw new Error(`status: ${response.status}`);
    }

    return response.json();
  },

  getRecentRecommendations: async (
    sessionId: string,
    limit: number = 10
  ): Promise<RecommendationResponse[]> => {
    const url = new URL(`${API_BASE_URL}/recommendations/get-recent-recommendations`);
    url.searchParams.append('session_id', sessionId);
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(` status: ${response.status}`);
    }

    return response.json();
  },
};
