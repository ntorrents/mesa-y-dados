"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { recommendGames, type RecommendInput } from "@/lib/recommend";
import type { GameDTO } from "@/lib/types";

const steps = ["Gente", "Tiempo", "Ambiente", "Resultado"] as const;

export function RecommendWizard({ games }: { games: GameDTO[] }) {
  const [step, setStep] = useState(0);
  const [players, setPlayers] = useState(2);
  const [maxMinutes, setMaxMinutes] = useState(45);
  const [difficulty, setDifficulty] =
    useState<RecommendInput["difficulty"]>("cualquiera");
  const [vibe, setVibe] = useState<RecommendInput["vibe"]>("cualquiera");

  const results = useMemo(() => {
    if (step < 3) return [];
    return recommendGames(games, { players, maxMinutes, difficulty, vibe });
  }, [step, games, players, maxMinutes, difficulty, vibe]);

  return (
    <div>
      <div className="mb-10 flex gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1 ${i <= step ? "bg-[var(--signal)]" : "bg-[var(--line)]"}`}
            />
            <p
              className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${
                i === step ? "text-[var(--ink)]" : "text-[var(--muted)]"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <StepShell
          title="¿Cuántas sillas hay ocupadas?"
          subtitle="Cuenta solo a quien va a jugar esta partida."
        >
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPlayers(n)}
                className={`aspect-square border text-2xl font-bold transition ${
                  players === n
                    ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                    : "border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] hover:border-[var(--ink)]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <Nav next={() => setStep(1)} />
        </StepShell>
      )}

      {step === 1 && (
        <StepShell
          title="¿Hasta cuándo podéis?"
          subtitle={`Tope ahora: ${maxMinutes} minutos.`}
        >
          <input
            type="range"
            min={15}
            max={120}
            step={15}
            value={maxMinutes}
            onChange={(e) => setMaxMinutes(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--signal)]"
          />
          <div className="mt-4 flex justify-between text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            <span>15</span>
            <span>60</span>
            <span>120</span>
          </div>
          <fieldset className="mt-10">
            <legend className="text-sm font-bold text-[var(--ink)]">
              Dificultad (opcional)
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(["cualquiera", "Fácil", "Medio", "Difícil"] as const).map(
                (d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`border px-3 py-3 text-sm font-semibold ${
                      difficulty === d
                        ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                        : "border-[var(--line)]"
                    }`}
                  >
                    {d === "cualquiera" ? "Da igual" : d}
                  </button>
                ),
              )}
            </div>
          </fieldset>
          <Nav back={() => setStep(0)} next={() => setStep(2)} />
        </StepShell>
      )}

      {step === 2 && (
        <StepShell
          title="¿Qué energía buscáis?"
          subtitle="Una sola dirección. Luego afinamos."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["cualquiera", "Sorpréndeme", "Sin filtro de vibe"],
                ["familiar", "Familiar", "Accesible y limpio"],
                ["estrategia", "Estrategia", "Decisiones con peso"],
                ["party", "Party", "Ruido, risas, velocidad"],
                ["cooperativo", "Cooperativo", "Ganar o perder juntos"],
              ] as const
            ).map(([value, title, hint]) => (
              <button
                key={value}
                type="button"
                onClick={() => setVibe(value)}
                className={`border p-5 text-left transition ${
                  vibe === value
                    ? "border-[var(--ink)] bg-[var(--night)] text-white"
                    : "border-[var(--line)] bg-[var(--panel)] hover:border-[var(--ink)]"
                }`}
              >
                <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
                  {title}
                </p>
                <p
                  className={`mt-1 text-sm ${vibe === value ? "text-white/60" : "text-[var(--muted)]"}`}
                >
                  {hint}
                </p>
              </button>
            ))}
          </div>
          <Nav back={() => setStep(1)} next={() => setStep(3)} nextLabel="Ver partidas" />
        </StepShell>
      )}

      {step === 3 && (
        <div>
          <p className="section-label">Propuestas</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            {results.length
              ? `${results.length} partidas que encajan`
              : "Nada claro — afloja un criterio"}
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            {players} jug. · ≤ {maxMinutes} min
            {difficulty !== "cualquiera" ? ` · ${difficulty}` : ""}
            {vibe !== "cualquiera" ? ` · ${vibe}` : ""}
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="btn-ghost mt-10 border-[var(--ink)] text-[var(--ink)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Empezar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="section-label">Asistente</p>
      <h2 className="mt-2 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-[var(--muted)]">{subtitle}</p>
      <div className="mt-10">{children}</div>
    </div>
  );
}

function Nav({
  back,
  next,
  nextLabel = "Siguiente",
}: {
  back?: () => void;
  next: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="mt-12 flex flex-wrap gap-3">
      {back && (
        <button
          type="button"
          onClick={back}
          className="btn-ghost border-[var(--ink)] text-[var(--ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </button>
      )}
      <button type="button" onClick={next} className="btn-signal">
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
