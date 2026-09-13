import { GameCard } from "@/components/GameCard";
import { getTopRated } from "@/lib/games";

export const dynamic = "force-dynamic";

export const metadata = { title: "Ranking" };

export default async function RankingPage() {
  const games = await getTopRated(50);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-12 max-w-2xl">
        <p className="section-label">Señal de casa</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-6xl">
          Ranking
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          No es BoardGameGeek. Es lo que más funciona en esta mesa.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game, i) => (
          <GameCard key={game.id} game={game} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
