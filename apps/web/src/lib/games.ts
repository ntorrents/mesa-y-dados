import { asc, eq, sql } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import { games } from "@/db/schema";
import seedData from "@/db/seed-data.json";
import { toGameDTO, type GameDTO, type SeedGame } from "@/lib/types";
import { parseDurationMinutes } from "@/lib/utils";

function fallbackGames(): GameDTO[] {
  return (seedData.games as SeedGame[]).map((game, index) =>
    toGameDTO({ ...game, id: index + 1 }),
  );
}

export async function getAllGames(): Promise<GameDTO[]> {
  if (!hasDatabase()) return fallbackGames();
  try {
    const rows = await getDb().select().from(games).orderBy(asc(games.name));
    if (!rows.length) return fallbackGames();
    return rows.map(toGameDTO);
  } catch {
    return fallbackGames();
  }
}

export async function getGameById(id: number): Promise<GameDTO | null> {
  if (!hasDatabase()) {
    return fallbackGames().find((g) => g.id === id) ?? null;
  }
  try {
    const rows = await getDb()
      .select()
      .from(games)
      .where(eq(games.id, id))
      .limit(1);
    if (rows[0]) return toGameDTO(rows[0]);
    return fallbackGames().find((g) => g.id === id) ?? null;
  } catch {
    return fallbackGames().find((g) => g.id === id) ?? null;
  }
}

export async function getTopRated(limit = 10): Promise<GameDTO[]> {
  const all = await getAllGames();
  return [...all]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}

export async function getFeaturedGames(limit = 3): Promise<GameDTO[]> {
  const all = await getAllGames();
  const featured = all.filter((g) => g.featured);
  const source = featured.length ? featured : all;
  return [...source]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}

/** Propuesta estable por día (zona Europe/Madrid). */
export async function getDailyPick(): Promise<GameDTO | null> {
  const all = await getAllGames();
  if (!all.length) return null;

  const featured = all.filter((g) => g.featured);
  const pool = featured.length ? featured : all;

  const dayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  let hash = 0;
  for (let i = 0; i < dayKey.length; i++) {
    hash = (hash * 31 + dayKey.charCodeAt(i)) >>> 0;
  }
  // Mezcla con ids para que el ciclo no sea trivial
  for (const g of pool) {
    hash = (hash * 17 + g.id) >>> 0;
  }

  return pool[hash % pool.length] ?? null;
}

export async function getCategories(): Promise<string[]> {
  const all = await getAllGames();
  return [...new Set(all.flatMap((g) => g.categories))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

const difficultyRank: Record<string, number> = {
  Fácil: 1,
  Medio: 2,
  Difícil: 3,
};

export type SearchGamesParams = {
  q?: string;
  category?: string;
  difficulty?: string;
  players?: number;
  maxMinutes?: number;
  featured?: boolean;
  sort?: "name" | "rating" | "duration" | "difficulty";
};

export async function searchGames(
  params: SearchGamesParams,
): Promise<GameDTO[]> {
  let results = await getAllGames();

  if (params.q?.trim()) {
    const q = params.q.trim().toLowerCase();
    results = results.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q) ||
        g.review?.toLowerCase().includes(q) ||
        g.categories.some((c) => c.toLowerCase().includes(q)),
    );
  }

  if (params.category) {
    results = results.filter((g) => g.categories.includes(params.category!));
  }

  if (params.difficulty) {
    results = results.filter((g) => g.difficulty === params.difficulty);
  }

  if (params.featured) {
    results = results.filter((g) => g.featured);
  }

  if (params.players) {
    const n = params.players;
    results = results.filter((g) => {
      if (!g.players) return true;
      const match = g.players.match(/(\d+)\s*[-–]\s*(\d+)/);
      if (match) return n >= Number(match[1]) && n <= Number(match[2]);
      const single = g.players.match(/(\d+)/);
      return single ? Number(single[1]) === n : true;
    });
  }

  if (params.maxMinutes) {
    results = results.filter(
      (g) => parseDurationMinutes(g.duration) <= params.maxMinutes!,
    );
  }

  const sort = params.sort ?? "name";
  results = [...results].sort((a, b) => {
    switch (sort) {
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      case "duration":
        return (
          parseDurationMinutes(a.duration) - parseDurationMinutes(b.duration)
        );
      case "difficulty":
        return (
          (difficultyRank[a.difficulty ?? ""] ?? 99) -
          (difficultyRank[b.difficulty ?? ""] ?? 99)
        );
      default:
        return a.name.localeCompare(b.name, "es");
    }
  });

  return results;
}

export async function createGame(data: typeof games.$inferInsert) {
  if (!hasDatabase()) {
    throw new Error("Necesitas DATABASE_URL (Neon) para crear juegos");
  }
  const [row] = await getDb().insert(games).values(data).returning();
  return toGameDTO(row);
}

export async function updateGame(
  id: number,
  data: Partial<typeof games.$inferInsert>,
) {
  if (!hasDatabase()) {
    throw new Error("Necesitas DATABASE_URL (Neon) para editar juegos");
  }
  const [row] = await getDb()
    .update(games)
    .set(data)
    .where(eq(games.id, id))
    .returning();
  return row ? toGameDTO(row) : null;
}

export async function deleteGame(id: number) {
  if (!hasDatabase()) {
    throw new Error("Necesitas DATABASE_URL (Neon) para borrar juegos");
  }
  await getDb().delete(games).where(eq(games.id, id));
}

export async function countGames(): Promise<number> {
  if (!hasDatabase()) return fallbackGames().length;
  try {
    const [row] = await getDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(games);
    return row?.count ?? 0;
  } catch {
    return fallbackGames().length;
  }
}
