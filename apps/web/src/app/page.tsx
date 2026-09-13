import { getAllGames, getFeaturedGames, getTopRated } from "@/lib/games";
import { hasDatabase } from "@/db";
import { mediaSrc } from "@/lib/media";
import { HomeMotion } from "@/components/HomeMotion";

export const dynamic = "force-dynamic";

const moods = [
  { label: "Dúo tenso", href: "/juegos?players=2&sort=rating", hint: "2 jugadores" },
  { label: "Ruido bueno", href: "/juegos?category=Party", hint: "Party" },
  { label: "Todos juntos", href: "/juegos?category=Cooperativo", hint: "Cooperativo" },
  { label: "Media hora", href: "/juegos?maxMinutes=30&sort=rating", hint: "≤ 30 min" },
];

export default async function HomePage() {
  const [featured, top, all] = await Promise.all([
    getFeaturedGames(1),
    getTopRated(6),
    getAllGames(),
  ]);
  const pick = featured[0] ?? top[0] ?? null;

  return (
    <HomeMotion
      pick={pick}
      pickImage={mediaSrc(pick?.image)}
      top={top}
      allCount={all.length}
      moods={moods}
      usingFallback={!hasDatabase()}
    />
  );
}
