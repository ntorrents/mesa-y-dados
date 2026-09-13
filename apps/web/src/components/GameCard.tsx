import Image from "next/image";
import Link from "next/link";
import { Clock, Star, Users } from "lucide-react";
import type { GameDTO } from "@/lib/types";
import { mediaSrc } from "@/lib/media";

export function GameCard({ game, rank }: { game: GameDTO; rank?: number }) {
  const image = mediaSrc(game.image);

  return (
    <Link
      href={`/juego/${game.id}`}
      className="group flex flex-col overflow-hidden border border-[var(--line)] bg-[var(--panel)] transition hover:border-[var(--ink)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-deep)]">
        {image ? (
          <Image
            src={image}
            alt={game.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized={image.startsWith("/api/media")}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--muted)]">
            Sin imagen
          </div>
        )}
        {typeof rank === "number" && (
          <span className="absolute left-0 top-0 bg-[var(--signal)] px-3 py-1 font-[family-name:var(--font-display)] text-sm font-bold text-white">
            {String(rank).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--mark)]">
          {game.categories.slice(0, 2).join(" · ")}
        </p>
        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold leading-tight tracking-tight text-[var(--ink)]">
          {game.name}
        </h3>
        <p className="line-clamp-2 text-sm text-[var(--muted)]">{game.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-3 text-xs font-medium text-[var(--muted)]">
          {game.players && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {game.players}
            </span>
          )}
          {game.duration && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {game.duration}
            </span>
          )}
          {game.rating != null && (
            <span className="ml-auto inline-flex items-center gap-1 font-bold text-[var(--ink)]">
              <Star className="h-3.5 w-3.5 fill-[var(--signal)] text-[var(--signal)]" />
              {game.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
