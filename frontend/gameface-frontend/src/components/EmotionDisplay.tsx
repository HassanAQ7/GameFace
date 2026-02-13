import type { EmotionResult } from "../util/types";

interface EmotionDisplayProps {
  emotion: EmotionResult;
}

const EMOTION_GRADIENTS: Record<string, string> = {
  happy: "from-yellow-400 to-green-400",
  sad: "from-blue-400 to-indigo-500",
  angry: "from-red-500 to-orange-600",
  calm: "from-cyan-400 to-blue-400",
  surprised: "from-purple-400 to-pink-500",
  confused: "from-gray-400 to-gray-600",
  disgusted: "from-green-600 to-yellow-700",
  fear: "from-purple-600 to-gray-700",
};

const DEFAULT_GRADIENT = "from-gray-400 to-gray-500";

function getGradient(emotion: string): string {
  return EMOTION_GRADIENTS[emotion.toLowerCase()] ?? DEFAULT_GRADIENT;
}

export default function EmotionDisplay({ emotion }: EmotionDisplayProps) {
  const gradient = getGradient(emotion.emotion);
  const percentage = Math.round(emotion.confidence * 100);

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-gray-700 bg-[#2a2a2a] px-10 py-8">
      <div
        className={`h-32 w-32 animate-pulse rounded-full bg-gradient-to-br ${gradient} shadow-lg`}
      />
      <h2 className="text-2xl font-light text-white capitalize">
        {emotion.emotion.toLowerCase()}
      </h2>
      <span className="text-sm text-gray-500">{percentage}% confidence</span>
    </div>
  );
}
