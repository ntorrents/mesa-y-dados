import { getAllGames } from "@/lib/games";
import { DiceRoller } from "@/components/DiceRoller";

export const metadata = { title: "Al azar" };

export default async function AzarPage() {
  const games = await getAllGames();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <p className="section-label">Sin pensar</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-6xl">
          Al azar
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Un solo tirón del dado sobre la estantería. Si no convence, otra vez.
        </p>
      </header>

      <DiceRoller games={games} />
    </div>
  );
}
