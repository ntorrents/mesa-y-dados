import { RecommendWizard } from "@/components/RecommendWizard";
import { getAllGames } from "@/lib/games";

export const metadata = { title: "Qué jugamos" };

export default async function RecomendarPage() {
  const games = await getAllGames();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <RecommendWizard games={games} />
    </div>
  );
}
