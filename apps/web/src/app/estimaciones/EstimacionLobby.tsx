"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  loginEstimator,
  logoutEstimator,
  startEstimationRun,
} from "./actions";

type LeaderRow = { rank: number; nickname: string; score: number };

export function EstimacionLobby({
  session,
  stats,
  leaderboard,
}: {
  session: { nickname: string; email: string } | null;
  stats: { sessions: number; best: number; latest: number } | null;
  leaderboard: LeaderRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [count, setCount] = useState(8);
  const [seconds, setSeconds] = useState(60);
  const [timed, setTimed] = useState(true);
  const [hints, setHints] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  function start() {
    setError(null);
    startTransition(async () => {
      const res = await startEstimationRun({
        count,
        showHints: hints,
        secondsPerQuestion: timed ? seconds : null,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      sessionStorage.setItem(
        "md_estimation_q",
        JSON.stringify({
          question: res.question,
          maxScore: res.maxScore,
          runningTotal: 0,
          secondsPerQuestion: timed ? seconds : null,
        }),
      );
      router.push("/estimaciones/jugar");
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="bg-[var(--panel)] p-6 sm:p-8">
        <p className="section-label">Ajustes</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Prepara la partida
        </h2>

        <label className="mt-8 block text-sm font-semibold text-[var(--ink)]">
          Número de preguntas
          <input
            type="range"
            min={4}
            max={12}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--signal)]"
          />
          <span className="mt-1 block text-[var(--muted)]">{count} preguntas · máx.{" "}
          {count * 200} pts
          </span>
        </label>

        <label className="mt-6 flex items-center justify-between gap-4 text-sm font-semibold">
          <span>Tiempo por pregunta</span>
          <button
            type="button"
            onClick={() => setTimed((v) => !v)}
            className={`border px-3 py-1 text-xs uppercase tracking-wider ${
              timed
                ? "border-[var(--mark)] bg-[var(--mark)] text-white"
                : "border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            {timed ? "On" : "Off"}
          </button>
        </label>
        {timed && (
          <input
            type="range"
            min={20}
            max={120}
            step={10}
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--mark)]"
          />
        )}
        {timed && (
          <p className="mt-1 text-sm text-[var(--muted)]">{seconds}s</p>
        )}

        <label className="mt-6 flex items-center justify-between gap-4 text-sm font-semibold">
          <span>Mostrar pistas</span>
          <button
            type="button"
            onClick={() => setHints((v) => !v)}
            className={`border px-3 py-1 text-xs uppercase tracking-wider ${
              hints
                ? "border-[var(--mark)] bg-[var(--mark)] text-white"
                : "border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            {hints ? "On" : "Off"}
          </button>
        </label>

        {error && <p className="mt-4 text-sm text-[var(--signal)]">{error}</p>}

        <button
          type="button"
          onClick={start}
          disabled={pending}
          className="btn-signal mt-8 w-full justify-center sm:w-auto"
        >
          {pending ? "Preparando…" : "Empezar partida"}
        </button>
      </section>

      <div className="space-y-6">
        <section className="bg-[var(--panel)] p-6 sm:p-8">
          <p className="section-label">Tu perfil</p>
          {session ? (
            <>
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold">
                {session.nickname}
              </p>
              <p className="text-sm text-[var(--muted)]">{session.email}</p>
              {stats && (
                <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">
                      Partidas
                    </dt>
                    <dd className="mt-1 text-2xl font-bold">{stats.sessions}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">
                      Mejor
                    </dt>
                    <dd className="mt-1 text-2xl font-bold">{stats.best}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">
                      Última
                    </dt>
                    <dd className="mt-1 text-2xl font-bold">{stats.latest}</dd>
                  </div>
                </dl>
              )}
              <button
                type="button"
                onClick={() =>
                  startTransition(async () => {
                    await logoutEstimator();
                    router.refresh();
                  })
                }
                className="mt-6 text-sm text-[var(--muted)] underline"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <form
              className="mt-4 space-y-3"
              action={async (fd) => {
                setAuthError(null);
                const res = await loginEstimator(fd);
                if (!res.ok) setAuthError(res.error);
                else router.refresh();
              }}
            >
              <p className="text-sm text-[var(--muted)]">
                Correo + apodo para guardar puntuación en el ranking. Sin
                contraseña.
              </p>
              <input
                name="nickname"
                required
                minLength={2}
                placeholder="Apodo"
                className="w-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="correo@ejemplo.com"
                className="w-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
              />
              {authError && (
                <p className="text-sm text-[var(--signal)]">{authError}</p>
              )}
              <button type="submit" className="btn-signal text-sm">
                Entrar / registrarse
              </button>
            </form>
          )}
        </section>

        <section className="bg-[var(--night)] p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--signal)]">
            Ranking · 30 días
          </p>
          <ol className="mt-4 divide-y divide-white/10">
            {leaderboard.length === 0 && (
              <li className="py-3 text-sm text-white/50">
                Aún no hay puntuaciones. Sé el primero.
              </li>
            )}
            {leaderboard.map((row) => (
              <li
                key={`${row.rank}-${row.nickname}`}
                className="flex items-baseline justify-between gap-4 py-3"
              >
                <span className="w-8 font-[family-name:var(--font-display)] text-lg font-bold text-[var(--signal)]">
                  {String(row.rank).padStart(2, "0")}
                </span>
                <span className="flex-1 font-semibold">{row.nickname}</span>
                <span className="font-bold text-[var(--mark)]">
                  {row.score} pts
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
