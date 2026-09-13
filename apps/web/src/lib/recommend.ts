import { parseDurationMinutes, parsePlayers } from "@/lib/utils";
import type { GameDTO } from "@/lib/types";

export type RecommendInput = {
  players: number;
  maxMinutes: number;
  difficulty?: "Fácil" | "Medio" | "Difícil" | "cualquiera";
  vibe?: "familiar" | "estrategia" | "party" | "cooperativo" | "cualquiera";
};

const vibeMap: Record<string, string[]> = {
  familiar: ["Familiar", "Abstracto"],
  estrategia: ["Estrategia", "Cartas", "Subasta", "Comercio"],
  party: ["Party", "Reflejos", "Deducción", "Bluff"],
  cooperativo: ["Cooperativo"],
};

export function recommendGames(
  games: GameDTO[],
  input: RecommendInput,
  limit = 6,
): GameDTO[] {
  const scored = games.map((game) => {
    let score = (game.rating ?? 3) * 10;

    const { min, max } = parsePlayers(game.players);
    if (input.players >= min && input.players <= max) score += 25;
    else if (input.players >= min - 1 && input.players <= max + 1) score += 8;
    else score -= 40;

    const minutes = parseDurationMinutes(game.duration);
    if (minutes <= input.maxMinutes) score += 20;
    else if (minutes <= input.maxMinutes + 20) score += 5;
    else score -= 25;

    if (
      input.difficulty &&
      input.difficulty !== "cualquiera" &&
      game.difficulty === input.difficulty
    ) {
      score += 15;
    }

    if (input.vibe && input.vibe !== "cualquiera") {
      const wanted = vibeMap[input.vibe] ?? [];
      if (game.categories.some((c) => wanted.includes(c))) score += 18;
    }

    if (game.featured) score += 5;

    return { game, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.game);
}
