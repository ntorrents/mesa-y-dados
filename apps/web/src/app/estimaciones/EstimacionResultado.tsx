"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  attachScoreToPlayer,
  loginEstimator,
} from "./actions";

type Detail = {
  questionId: string;
  prompt: string;
  unit: string;
  low: number;
  high: number;
  answer: number;
  score: number;
  hit: boolean;
  baseLabel?: string;
  spreadLabel?: string;
};

export function EstimacionResultado({
  results,
  session,
}: {
  results: {
    totalScore: number;
    maxScore: number;
    hits: number;
    total: number;
    details: Detail[];
    rank: number;
    player: { nickname: string; email: string } | null;
  };
  session: { nickname: string; email: string } | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const pct = Math.round((results.totalScore / results.maxScore) * 100);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="section-label">Resultado</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl">
        {results.totalScore}{" "}
        <span className="text-2xl font-bold text-[var(--muted)] sm:text-3xl">
          / {results.maxScore}
        </span>
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        {results.hits}/{results.total} aciertos · {pct}% del máximo · puesto
        estimado #{results.rank} (30 días, con sesión)
      </p>

      {!session && (
        <section className="mt-8 border border-[var(--line)] bg-[var(--panel)] p-6">
          <p className="font-semibold">Guarda tu puntuación en el ranking</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Solo correo y apodo. Sin contraseña.
          </p>
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
            action={async (fd) => {
              setAuthError(null);
              const res = await loginEstimator(fd);
              if (!res.ok) {
                setAuthError(res.error);
                return;
              }
              const attached = await attachScoreToPlayer();
              if (!attached.ok) setAuthError(attached.error);
              else {
                setMsg("Puntuación guardada en el ranking.");
                router.refresh();
              }
            }}
          >
            <input
              name="nickname"
              required
              minLength={2}
              placeholder="Apodo"
              className="flex-1 border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="correo@ejemplo.com"
              className="flex-1 border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
            />
            <button type="submit" className="btn-signal text-sm">
              Guardar
            </button>
          </form>
          {authError && (
            <p className="mt-2 text-sm text-[var(--signal)]">{authError}</p>
          )}
        </section>
      )}

      {session && !results.player && (
        <button
          type="button"
          disabled={pending}
          className="btn-signal mt-6"
          onClick={() =>
            startTransition(async () => {
              const res = await attachScoreToPlayer();
              if (!res.ok) setMsg(res.error);
              else {
                setMsg("Puntuación vinculada a tu perfil.");
                router.refresh();
              }
            })
          }
        >
          Publicar mi puntuación
        </button>
      )}

      {msg && <p className="mt-4 text-sm text-[var(--mark)]">{msg}</p>}

      <ol className="mt-10 divide-y divide-[var(--line)] border-t border-[var(--line)]">
        {results.details.map((d, i) => (
          <li key={d.questionId} className="py-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {String(i + 1).padStart(2, "0")} · {d.hit ? "Acierto" : "Fallo"} ·{" "}
              {d.score} pts
            </p>
            <p className="mt-1 font-semibold">{d.prompt}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Tu rango:{" "}
              {d.low > 0 ? (
                <>
                  {formatNum(d.low)} – {formatNum(d.high)} {d.unit}
                </>
              ) : (
                "saltada"
              )}
              {" · "}
              Respuesta:{" "}
              <span className="font-bold text-[var(--ink)]">
                {formatNum(d.answer)} {d.unit}
              </span>
            </p>
            {(d.baseLabel || d.spreadLabel) && (
              <p className="mt-1 text-xs text-[var(--muted)]">
                {[d.baseLabel, d.spreadLabel].filter(Boolean).join(" · ")}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/estimaciones" className="btn-signal">
          Otra partida
        </Link>
        <Link href="/" className="btn-ghost">
          Volver a inicio
        </Link>
      </div>
    </div>
  );
}

function formatNum(n: number) {
  return new Intl.NumberFormat("es-ES").format(n);
}
