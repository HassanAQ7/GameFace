export interface EmotionResult {
    confidence: number;
    emotion: string;
}

export interface GameRecommendation {
    game_id: number;
    name: string;
    slug: string;
    released: string;
    background_image: string;
    rating?: number;
    ratings_count?: number;
    metacritic?: number;
    playtime: number;
    genres: Array<{ id: number; name: string; slug: string }>;
    tags: Array<{ id: number; name: string; slug: string }>;
    parent_platforms: Array<{ platform: { id: number; name: string; slug: string } }>;
    esrb_rating?: { id: number; name: string; slug: string };

}

export interface RecommendationResponse {
    recommendation_id: string;
    session_id: string;
    emotion: EmotionResult;
    recommendations: GameRecommendation[];
    timestamp: string;
  }