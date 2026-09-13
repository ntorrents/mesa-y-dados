import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ExternalLink, Star, Users } from "lucide-react";
import { getAllGames, getGameById } from "@/lib/games";
import { mediaSrc } from "@/lib/media";
import type { RulesSection } from "@/lib/types";
import { GameCard } from "@/components/GameCard";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const game = await getGameById(Number(id));
  return { title: game?.name ?? "Juego" };
}

function sectionsFrom(
  game: Awaited<ReturnType<typeof getGameById>>,
): RulesSection[] {
  if (!game) return [];
  if (game.rulesSections?.length) return game.rulesSections;
  if (game.rulesSummary) {
    return [{ title: "En cinco minutos", content: game.rulesSummary }];
  }
  return [];
}

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;
  const game = await getGameById(Number(id));
  if (!game) notFound();

  const sections = sectionsFrom(game);
  const all = await getAllGames();
  const related = all
    .filter(
      (g) =>
        g.id !== game.id &&
        g.categories.some((c) => game.categories.includes(c)),
    )
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 3);

  const image = mediaSrc(game.image);

  return (
    <div>
      <section className="border-b border-[var(--line)] bg-[var(--panel)]">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[360px] bg-[var(--night)] lg:min-h-[520px]">
            {image && (
              <Image
                src={image}
                alt={game.name}
                fill
                priority
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            )}
          </div>
          <div className="flex flex-col justify-center px-4 py-10 sm:px-10">
            <Link
              href="/juegos"
              className="text-xs font-bold uppercase tracking-widest text-[var(--mark)]"
            >
              ← Colección
            </Link>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[var(--signal)]">
              {game.categories.join(" · ")}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-6xl">
              {game.name}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-[var(--muted)]">
              {game.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              {game.players && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[var(--mark)]" />
                  {game.players}
                </span>
              )}
              {game.duration && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[var(--mark)]" />
                  {game.duration}
                </span>
              )}
              {game.difficulty && <span>{game.difficulty}</span>}
              {game.rating != null && (
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[var(--signal)] text-[var(--signal)]" />
                  {game.rating.toFixed(1)}
                </span>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {mediaSrc(game.rulesFile) && (
                <a
                  href={mediaSrc(game.rulesFile)!}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-signal"
                >
                  PDF de reglas
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {game.externalLink && (
                <a
                  href={game.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost border-[var(--ink)] text-[var(--ink)]"
                >
                  BoardGameGeek
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {game.review && (
          <section className="max-w-3xl">
            <p className="section-label">Reseña de casa</p>
            <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
              {game.review}
            </p>
          </section>
        )}

        <div className="mt-12 grid gap-px bg-[var(--line)] sm:grid-cols-2">
          {game.pros.length > 0 && (
            <div className="bg-[var(--panel)] p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--mark)]">
                Pros
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {game.pros.map((p) => (
                  <li key={p}>+ {p}</li>
                ))}
              </ul>
            </div>
          )}
          {game.cons.length > 0 && (
            <div className="bg-[var(--panel)] p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--signal)]">
                Contras
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {game.cons.map((c) => (
                  <li key={c}>− {c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {sections.length > 0 && (
          <section className="mt-14 border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8">
            <p className="section-label">Cómo se juega</p>
            <div className="mt-6 space-y-6">
              {sections.map((section) => (
                <article key={section.title}>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                    {section.title}
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
                    {section.content}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <p className="section-label">También te puede encajar</p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              Si te gusta este
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
