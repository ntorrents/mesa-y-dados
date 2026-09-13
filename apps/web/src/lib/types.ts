import type { Game, RulesSection } from "@/db/schema";

export type { Game, RulesSection };

export type GameDTO = {
  id: number;
  name: string;
  image: string | null;
  players: string | null;
  minAge: number | null;
  duration: string | null;
  categories: string[];
  difficulty: string | null;
  rating: number | null;
  description: string | null;
  review: string | null;
  externalLink: string | null;
  pros: string[];
  cons: string[];
  featured: boolean;
  rulesSummary: string | null;
  rulesFile: string | null;
  rulesSections: RulesSection[] | null;
};

export function normalizeRulesSections(
  value: Game["rulesSections"],
): RulesSection[] | null {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  return Object.values(value);
}

export function toGameDTO(game: Game | (SeedGame & { id: number })): GameDTO {
  return {
    id: game.id,
    name: game.name,
    image: game.image ?? null,
    players: game.players ?? null,
    minAge: game.minAge ?? null,
    duration: game.duration ?? null,
    categories: game.categories ?? [],
    difficulty: game.difficulty ?? null,
    rating: game.rating ?? null,
    description: game.description ?? null,
    review: game.review ?? null,
    externalLink: game.externalLink ?? null,
    pros: game.pros ?? [],
    cons: game.cons ?? [],
    featured: Boolean(game.featured),
    rulesSummary: game.rulesSummary ?? null,
    rulesFile: game.rulesFile ?? null,
    rulesSections: normalizeRulesSections(
      ("rulesSections" in game ? game.rulesSections : null) ?? null,
    ),
  };
}

export type SeedGame = {
  id?: number;
  name: string;
  image?: string;
  players?: string;
  minAge?: number;
  duration?: string;
  categories?: string[];
  difficulty?: string;
  rating?: number;
  description?: string;
  review?: string;
  externalLink?: string;
  pros?: string[];
  cons?: string[];
  featured?: boolean;
  rulesSummary?: string;
  rulesFile?: string;
  rulesSections?: RulesSection[] | Record<string, RulesSection>;
};
