import Image from "next/image";
import Link from "next/link";
import { Clock, Star, Users } from "lucide-react";
import type { GameDTO } from "@/lib/types";
import { mediaSrc } from "@/lib/media";

export function GameListItem({
  game,
  rank,
}: {
  game: GameDTO;
  rank?: number;
}) {
  const image = mediaSrc(game.image);

  return (
    <Link
      href={`/juego/${game.id}`}
      className="group grid grid-cols-[4.5rem_1fr] gap-4 border border-[var(--line)] bg-[var(--panel)] p-3 transition hover:border-[var(--ink)] sm:grid-cols-[5.5rem_1fr_auto] sm:items-center"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-deep)]">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            sizes="88px"
            unoptimized={image.startsWith("/api/media")}
          />
        ) : null}
        {typeof rank === "number" && (
          <span className="absolute left-0 top-0 bg-[var(--signal)] px-1.5 text-[10px] font-bold text-white">
            {rank}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--mark)]">
          {game.categories.slice(0, 2).join(" · ")}
        </p>
        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--ink)] group-hover:text-[var(--mark)]">
          {game.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-[var(--muted)]">
          {game.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted)] sm:hidden">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" />
            {game.players}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {game.duration}
          </span>
        </div>
      </div>

      <div className="hidden items-center gap-6 text-sm text-[var(--muted)] sm:flex">
        <span>{game.players}</span>
        <span>{game.duration}</span>
        <span>{game.difficulty}</span>
        {game.rating != null && (
          <span className="inline-flex items-center gap-1 font-bold text-[var(--ink)]">
            <Star className="h-3.5 w-3.5 fill-[var(--signal)] text-[var(--signal)]" />
            {game.rating.toFixed(1)}
          </span>
        )}
      </div>
    </Link>
  );
}
