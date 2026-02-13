import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import type { GameRecommendation } from "../util/types";

interface GameListProps {
  games: GameRecommendation[];
}

export default function GameList({ games }: GameListProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <a
            key={game.game_id}
            href={`https://rawg.io/games/${game.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl border border-gray-700 bg-[#2a2a2a] transition hover:border-orange-500"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={game.background_image}
                alt={game.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                <HiOutlineArrowTopRightOnSquare className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4">
              <h3 className="truncate text-lg font-semibold text-white">{game.name}</h3>

              <div className="flex items-center gap-3 text-sm">
                {game.rating != null && (
                  <span className="text-yellow-400">★ {game.rating.toFixed(1)}</span>
                )}
                {game.metacritic != null && (
                  <span className="rounded bg-green-700/60 px-1.5 py-0.5 text-xs font-bold text-green-300">
                    {game.metacritic}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {game.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-gray-700 px-2.5 py-0.5 text-xs text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-center text-xs text-gray-600">
        Game data provided by{" "}
        <a
          href="https://rawg.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 underline transition hover:text-white"
        >
          RAWG
        </a>
      </p>
    </div>
  );
}
