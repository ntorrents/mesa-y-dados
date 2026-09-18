"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type Variants,
} from "framer-motion";
import { useRef } from "react";
import type { GameDTO } from "@/lib/types";

type Mood = { label: string; href: string; hint: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeMotion({
  pick,
  pickImage,
  top,
  allCount,
  moods,
  usingFallback,
}: {
  pick: GameDTO | null;
  pickImage: string | null;
  top: GameDTO[];
  allCount: number;
  moods: Mood[];
  usingFallback: boolean;
}) {
  return (
    <div className="overflow-x-clip">
      <Hero allCount={allCount} />
      {usingFallback && (
        <p className="mx-auto max-w-6xl px-4 pt-6 text-sm text-[var(--muted)] sm:px-6">
          Datos locales de ejemplo — conecta Neon para la colección real.
        </p>
      )}
      <div aria-hidden className="h-12 bg-[var(--bg)] sm:h-16" />
      {pick && <TonightPick pick={pick} pickImage={pickImage} />}
      <HouseGameSection />
      <MoodsSection moods={moods} />
      <RankingSection top={top} />
      <HowSection />
    </div>
  );
}

function Hero({ allCount }: { allCount: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.15]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 0]);

  return (
    <section
      ref={ref}
      className="hero-plane relative flex h-dvh min-h-[100svh] w-full flex-col overflow-hidden"
    >
      <motion.div
        style={{ opacity: gridOpacity }}
        className="hero-grid pointer-events-none absolute inset-0"
      />
      <div className="pointer-events-none absolute right-8 top-1/4 h-56 w-56 rounded-full bg-[var(--mark)]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-8 h-40 w-40 rounded-full bg-[var(--signal)]/15 blur-3xl" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32"
      >
        <p className="hero-title min-w-0 font-[family-name:var(--font-display)] font-extrabold text-white">
          Mesa<span className="text-[var(--signal)]">&</span>Dados
        </p>
        <div className="mt-5 h-1 w-24 origin-left bg-[var(--signal)]" />
        <h1 className="mt-5 max-w-xl text-lg text-white/85 sm:text-xl md:text-2xl">
          Abre la estantería. Elige. Enseña. Juega.
        </h1>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/recomendar" className="btn-signal">
            Qué jugamos esta noche
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/juegos" className="btn-ghost text-white">
            Ver los {allCount} juegos
          </Link>
        </div>
        <motion.p
          style={{ opacity: hintOpacity }}
          className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-white/45"
        >
          Desliza para la propuesta de hoy ↓
        </motion.p>
      </motion.div>
    </section>
  );
}

function TonightPick({
  pick,
  pickImage,
}: {
  pick: GameDTO;
  pickImage: string | null;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section
      ref={ref}
      className="relative mt-2 overflow-x-clip bg-[var(--panel)] sm:mt-4"
    >
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, ease }}
        className="absolute inset-x-0 top-0 z-20 h-1.5 origin-left bg-[var(--signal)]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,200px)_1fr] lg:gap-12 xl:grid-cols-[minmax(0,240px)_1fr]">
        <div className="relative mx-auto w-full max-w-[160px] overflow-hidden bg-[var(--night)] sm:max-w-[180px] lg:mx-0 lg:max-w-none">
          <div className="relative aspect-[3/4] w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.12 }}
              className="absolute inset-0"
            >
              {pickImage && (
                <Image
                  src={pickImage}
                  alt={pick.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 180px, 240px"
                />
              )}
            </motion.div>
          </div>
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.4, ease }}
            className="absolute left-2 top-2 z-10 border border-[var(--signal)] bg-[var(--night)] px-2 py-0.5 font-[family-name:var(--font-display)] text-[10px] font-bold uppercase tracking-widest text-[var(--signal)] sm:left-3 sm:top-3 sm:text-xs"
          >
            Hoy
          </motion.span>
        </div>

        <div className="flex min-w-0 flex-col justify-center pb-2 lg:py-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5, ease }}
            className="section-label"
          >
            Propuesta de hoy
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.55, ease }}
            className="mt-2 break-words font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl"
          >
            {pick.name}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.52, duration: 0.5, ease }}
            className="mt-3 max-w-md text-sm text-[var(--muted)] sm:text-base"
          >
            {pick.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.65, duration: 0.45 }}
            className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[var(--ink)]"
          >
            {[
              `${pick.players} jug.`,
              pick.duration,
              pick.difficulty,
              pick.rating != null ? `${pick.rating.toFixed(1)} / 5` : null,
            ]
              .filter(Boolean)
              .map((item, i) => (
                <motion.span
                  key={String(item)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.68 + i * 0.07, duration: 0.35, ease }}
                >
                  {item}
                </motion.span>
              ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.85, duration: 0.4, ease }}
          >
            <Link href={`/juego/${pick.id}`} className="btn-signal mt-6 w-fit">
              Abrir ficha
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HouseGameSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section ref={ref} className="relative overflow-x-clip py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease }}
        className="mx-auto max-w-6xl px-4 sm:px-6"
      >
        <Link
          href="/estimaciones"
          className="group relative block overflow-hidden bg-[var(--night)] px-5 py-10 text-white sm:px-12 sm:py-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 top-0 hidden h-full w-1/2 skew-x-[-12deg] bg-[var(--mark)]/25 transition group-hover:bg-[var(--mark)]/35 sm:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-full origin-left bg-[var(--signal)]"
          />
          <p className="relative text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--signal)] sm:text-xs sm:tracking-[0.22em]">
            El juego de la casa
          </p>
          <h2 className="relative mt-2 break-words font-[family-name:var(--font-display)] text-[2rem] font-extrabold leading-tight tracking-tight sm:mt-3 sm:text-5xl md:text-6xl">
            Estimaciones
          </h2>
          <p className="relative mt-3 max-w-md text-sm text-white/70 sm:mt-4 sm:text-base">
            Intervalos, riesgo y deducción cotidiana. No es trivia: razonas el
            orden de magnitud y te la juegas con el rango.
          </p>
          <span className="relative mt-6 inline-flex items-center gap-2 border-2 border-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition group-hover:border-[var(--signal)] group-hover:bg-[var(--signal)] sm:mt-8 sm:px-5 sm:py-3 sm:text-sm">
            Jugar ahora
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </motion.div>
    </section>
  );
}

function MoodsSection({ moods }: { moods: Mood[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 56, clipPath: "inset(40% 0 0 0)" },
    show: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0% 0 0 0)",
      transition: { duration: 0.7, ease },
    },
  };

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease }}
      >
        <p className="section-label">Según el plan</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          Entra por el mood, no por el catálogo.
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="mt-10 grid gap-px bg-[var(--line)] sm:grid-cols-2"
      >
        {moods.map((mood, i) => (
          <motion.div key={mood.href} variants={item}>
            <Link
              href={mood.href}
              className="group block bg-[var(--bg)] px-6 py-10 transition hover:bg-[var(--night)] hover:text-white"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--mark)] group-hover:text-[var(--signal)]">
                {mood.hint}
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
                <span className="mr-2 text-[var(--signal)]/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {mood.label}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function RankingSection({ top }: { top: GameDTO[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="overflow-x-clip bg-[var(--night)] py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="section-label !text-[var(--signal)]">Señal de casa</p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Ranking corto
            </h2>
          </div>
          <Link
            href="/ranking"
            className="text-sm font-semibold text-white/70 hover:text-white"
          >
            Ver completo →
          </Link>
        </motion.div>

        <ol className="mt-10 divide-y divide-white/10">
          {top.map((game, i) => (
            <motion.li
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.08, duration: 0.55, ease }}
            >
              <Link
                href={`/juego/${game.id}`}
                className="group flex min-w-0 items-baseline gap-4 py-5 transition sm:gap-6"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{
                    delay: 0.2 + i * 0.08,
                    duration: 0.4,
                    ease,
                  }}
                  className="w-10 shrink-0 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--signal)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
                <span className="min-w-0 flex-1 truncate text-xl font-semibold tracking-tight group-hover:text-white/90">
                  {game.name}
                </span>
                <span className="hidden shrink-0 text-sm text-white/45 sm:inline">
                  {game.players}
                </span>
                <span className="shrink-0 font-bold text-[var(--mark)]">
                  {game.rating?.toFixed(1)}
                </span>
              </Link>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function HowSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const steps = [
    ["01 · Filtra", "Jugadores, tiempo y vibe en la colección."],
    ["02 · Pregunta", "El asistente te propone partidas de la casa."],
    ["03 · Explica", "Reglas rápidas en la ficha, sin manual eterno."],
  ];

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <p className="section-label">Cómo usarlo</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            Tres gestos. Cero drama.
          </h2>
        </motion.div>
        <ol className="space-y-6 text-[var(--muted)]">
          {steps.map(([title, body], i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease }}
            >
              <span className="font-bold text-[var(--ink)]">{title}</span>
              <p className="mt-1">{body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
