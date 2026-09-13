import { Suspense } from "react";
import { GameCard } from "@/components/GameCard";
import { GameListItem } from "@/components/GameListItem";
import { GamesFilters } from "@/components/GamesFilters";
import { getCategories, searchGames } from "@/lib/games";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Colección",
};

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    difficulty?: string;
    players?: string;
    maxMinutes?: string;
    featured?: string;
    sort?: string;
    view?: string;
  }>;
};

export default async function JuegosPage({ searchParams }: Props) {
  const params = await searchParams;
  const view = params.view === "list" ? "list" : "grid";
  const sort =
    params.sort === "rating" ||
    params.sort === "duration" ||
    params.sort === "difficulty"
      ? params.sort
      : "name";

  const [games, categories] = await Promise.all([
    searchGames({
      q: params.q,
      category: params.category,
      difficulty: params.difficulty,
      players: params.players ? Number(params.players) : undefined,
      maxMinutes: params.maxMinutes ? Number(params.maxMinutes) : undefined,
      featured: params.featured === "1",
      sort,
    }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <p className="section-label">Inventario</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-6xl">
          Colección
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Afiná por gente, tiempo y energía. Cambia a lista si quieres escanear
          más rápido.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={null}>
            <GamesFilters categories={categories} resultCount={games.length} />
          </Suspense>
        </aside>

        <div>
          <div className="mb-6 hidden lg:block" aria-hidden />
          {games.length === 0 ? (
            <div className="border border-[var(--line)] bg-[var(--panel)] px-6 py-16 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
                Cero coincidencias
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Quita duración o categoría y vuelve a mirar.
              </p>
            </div>
          ) : view === "list" ? (
            <div className="space-y-3">
              {games.map((game) => (
                <GameListItem key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
