import Link from "next/link";
import { houseFavorites } from "@/data/favorites";
import { getAllGames } from "@/lib/games";

export const metadata = { title: "Favoritos" };

export default async function FavoritosPage() {
  const games = await getAllGames();

  function findGame(name: string) {
    return games.find(
      (g) =>
        g.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(g.name.toLowerCase()),
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-12 max-w-2xl">
        <p className="section-label">Votos de casa</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-6xl">
          Favoritos
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Categorías fijas. Gustos distintos. Nil vs Christine.
        </p>
      </header>

      <div className="grid gap-px bg-[var(--line)] lg:grid-cols-2">
        {houseFavorites.map((person) => (
          <section key={person.slug} className="bg-[var(--panel)] p-6 sm:p-10">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: person.accent }}
            >
              {person.slug}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              {person.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{person.tagline}</p>

            <ul className="mt-8 divide-y divide-[var(--line)]">
              {person.picks.map((pick) => {
                const game = findGame(pick.gameName);
                return (
                  <li
                    key={pick.category}
                    className="flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                      {pick.category}
                    </span>
                    {game ? (
                      <Link
                        href={`/juego/${game.id}`}
                        className="text-right font-semibold text-[var(--ink)] hover:text-[var(--mark)]"
                      >
                        {game.name}
                      </Link>
                    ) : (
                      <span className="text-right font-semibold">
                        {pick.gameName}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
