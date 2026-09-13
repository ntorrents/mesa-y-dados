"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Dices } from "lucide-react";
import { useState } from "react";
import type { GameDTO } from "@/lib/types";
import { mediaSrc } from "@/lib/media";

function pickOne(games: GameDTO[], excludeId?: number) {
  const pool =
    games.length > 1 && excludeId != null
      ? games.filter((g) => g.id !== excludeId)
      : games;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

export function DiceRoller({ games }: { games: GameDTO[] }) {
  const [game, setGame] = useState<GameDTO | null>(() => pickOne(games));
  const image = mediaSrc(game?.image);

  if (!game) {
    return (
      <p className="text-[var(--muted)]">No hay juegos en la estantería.</p>
    );
  }

  return (
    <div className="grid overflow-hidden bg-[var(--panel)] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative min-h-[320px] bg-[var(--night)] lg:min-h-[440px]">
        {image && (
          <Image
            src={image}
            alt={game.name}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        )}
      </div>

      <div className="flex flex-col justify-center px-6 py-10 sm:px-10">
        <p className="section-label">Ha salido</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {game.name}
        </h2>
        <p className="mt-4 max-w-md text-[var(--muted)]">{game.description}</p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm font-semibold text-[var(--ink)]">
          <span>{game.players} jug.</span>
          <span>{game.duration}</span>
          <span>{game.difficulty}</span>
          {game.rating != null && <span>{game.rating.toFixed(1)} / 5</span>}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setGame(pickOne(games, game.id))}
            className="btn-signal"
          >
            Tirar otra vez
            <Dices className="h-4 w-4" />
          </button>
          <Link href={`/juego/${game.id}`} className="btn-ghost">
            Abrir ficha
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
