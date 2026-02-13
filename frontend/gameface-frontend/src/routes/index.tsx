import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ImageCapture from "../components/ImageCapture";
import EmotionDisplay from "../components/EmotionDisplay";
import GameList from "../components/GameList";
import { gameRecommendationAPI } from "../util/api";
import { useSessionId } from "../hooks/useSessionId";
import type { RecommendationResponse } from "../util/types";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const sessionId = useSessionId();
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageCapture = async (file: File): Promise<void> => {
    if (!sessionId) {
      alert("Session not ready. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await gameRecommendationAPI.getRecommendations(file, sessionId);
      setResults(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (): void => {
    setResults(null);
    setError(null);
  };

  if (!results) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <ImageCapture onImageCapture={handleImageCapture} isLoading={loading} />

        {loading && (
          <div className="mt-8 flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-600 border-t-orange-500" />
            <p className="mt-4 text-sm text-gray-400">Analyzing...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded border border-red-500/30 bg-red-900/20 p-4 text-red-400">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col items-center gap-8">
        <EmotionDisplay emotion={results.emotion} />
        <GameList games={results.recommendations} />

        <button
          type="button"
          onClick={handleReset}
          className="rounded border border-gray-600 bg-transparent px-6 py-3 text-sm text-gray-300 transition hover:bg-gray-800"
        >
          Try Another Image
        </button>
      </div>
    </div>
  );
}
