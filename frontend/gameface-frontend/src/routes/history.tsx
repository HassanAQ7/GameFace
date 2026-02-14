import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import EmotionDisplay from "../components/EmotionDisplay";
import GameList from "../components/GameList";
import { gameRecommendationAPI } from "../util/api";
import { useSessionId } from "../hooks/useSessionId";
import type { RecommendationResponse } from "../util/types";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function HistoryPage() {
  const sessionId = useSessionId();
  const [loading, setLoading] = useState<boolean>(true);
  const [recommendations, setRecommendations] = useState<RecommendationResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchHistory = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const data = await gameRecommendationAPI.getRecentRecommendations(sessionId, 10);
        setRecommendations(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load history.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-white">
        Your Recommendation History
      </h1>

      {loading && (
        <div className="flex flex-col items-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-orange-500" />
          <p className="mt-4 text-sm text-gray-500">Loading history...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (!recommendations || recommendations.length === 0) && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-lg text-gray-400">No recommendations yet.</p>
          <p className="text-sm text-gray-500">Upload a photo to get started!</p>
        </div>
      )}

      {!loading && !error && recommendations && recommendations.length > 0 && (
        <div className="flex flex-col gap-10">
          {recommendations.map((rec) => (
            <div
              key={rec.recommendation_id}
              className="animate-fade-in rounded-2xl border border-gray-700/80 bg-[#1e1e1e] p-6"
            >
              <p className="mb-5 text-sm text-gray-500">
                {formatTimestamp(rec.timestamp)}
              </p>

              <div className="flex flex-col items-center gap-6">
                <EmotionDisplay emotion={rec.emotion} />
                <GameList games={rec.recommendations} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
