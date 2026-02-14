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

const EMOTION_SHADOWS: Record<string, string> = {
  happy: "shadow-[0_0_40px_rgba(250,204,21,0.25)]",
  sad: "shadow-[0_0_40px_rgba(96,165,250,0.25)]",
  angry: "shadow-[0_0_40px_rgba(239,68,68,0.25)]",
  calm: "shadow-[0_0_40px_rgba(34,211,238,0.25)]",
  surprised: "shadow-[0_0_40px_rgba(192,132,252,0.25)]",
  confused: "shadow-[0_0_40px_rgba(156,163,175,0.2)]",
  disgusted: "shadow-[0_0_40px_rgba(22,163,74,0.25)]",
  fear: "shadow-[0_0_40px_rgba(147,51,234,0.25)]",
};

const DEFAULT_GRADIENT = "from-gray-400 to-gray-500";
const DEFAULT_SHADOW = "shadow-lg";

function getGradient(emotion: string): string {
  return EMOTION_GRADIENTS[emotion.toLowerCase()] ?? DEFAULT_GRADIENT;
}

function getShadow(emotion: string): string {
  return EMOTION_SHADOWS[emotion.toLowerCase()] ?? DEFAULT_SHADOW;
}

export default function EmotionDisplay({ emotion }: EmotionDisplayProps) {
  const gradient = getGradient(emotion.emotion);
  const shadow = getShadow(emotion.emotion);
  const percentage = Math.round(emotion.confidence);

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-gray-700/80 bg-[#1e1e1e] px-12 py-10">
      <div
        className={`h-32 w-32 animate-pulse rounded-full bg-gradient-to-br ${gradient} ${shadow}`}
      />
      <h2 className="text-3xl font-light tracking-wide text-white capitalize">
        {emotion.emotion.toLowerCase()}
      </h2>
      <span className="text-sm text-gray-500">{percentage}% confidence</span>
    </div>
  );
}
