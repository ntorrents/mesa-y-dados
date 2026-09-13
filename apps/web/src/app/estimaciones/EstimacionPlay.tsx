"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useState, useTransition } from "react";
import {
  skipEstimationQuestion,
  submitEstimationAnswer,
} from "./actions";
import type { PublicQuestion } from "@/lib/estimation/types";
import { getRiskPreview } from "@/lib/estimation/scoring";

type Boot = {
  question: PublicQuestion;
  maxScore: number;
  runningTotal: number;
  secondsPerQuestion: number | null;
};

export function EstimacionPlay() {
  const router = useRouter();
  const [boot, setBoot] = useState<Boot | null>(null);
  const [low, setLow] = useState("");
  const [high, setHigh] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("md_estimation_q");
    if (!raw) {
      router.replace("/estimaciones");
      return;
    }
    try {
      const data = JSON.parse(raw) as Boot;
      setBoot(data);
      setLeft(data.secondsPerQuestion);
    } catch {
      router.replace("/estimaciones");
    }
  }, [router]);

  const risk = useMemo(() => {
    const lo = Number(low.replace(",", "."));
    const hi = Number(high.replace(",", "."));
    return getRiskPreview(lo, hi);
  }, [low, high]);

  const onTimeout = useEffectEvent(() => {
    if (!boot || pending || locked) return;
    setLocked(true);
    startTransition(async () => {
      const res = await skipEstimationQuestion(boot.question.id);
      await handleSubmitResult(res);
    });
  });

  useEffect(() => {
    if (!boot?.secondsPerQuestion || left == null) return;
    if (left <= 0) {
      onTimeout();
      return;
    }
    const t = setTimeout(() => setLeft((s) => (s == null ? s : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [boot?.secondsPerQuestion, left, boot, pending]);

  async function handleSubmitResult(
    res: Awaited<ReturnType<typeof submitEstimationAnswer>>,
  ) {
    if (!res.ok) {
      setError(res.error);
      setLocked(false);
      return;
    }

    // Sin feedback entre preguntas: ni puntuación ni acierto hasta el resultado.
    setLow("");
    setHigh("");
    setError(null);

    if (res.finished) {
      sessionStorage.removeItem("md_estimation_q");
      router.push("/estimaciones/resultado");
      return;
    }

    if (!res.next || !boot) {
      setError("No se pudo cargar la siguiente pregunta.");
      setLocked(false);
      return;
    }

    const nextBoot: Boot = {
      question: res.next,
      maxScore: boot.maxScore,
      runningTotal: boot.runningTotal,
      secondsPerQuestion: boot.secondsPerQuestion,
    };
    sessionStorage.setItem("md_estimation_q", JSON.stringify(nextBoot));
    setBoot(nextBoot);
    setLeft(nextBoot.secondsPerQuestion);
    setLocked(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!boot || locked) return;
    const lo = Number(low.replace(",", "."));
    const hi = Number(high.replace(",", "."));
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi || lo <= 0) {
      setError("Pon un mínimo y un máximo válidos (mín ≤ máx, > 0).");
      return;
    }
    setLocked(true);
    startTransition(async () => {
      const res = await submitEstimationAnswer({
        questionId: boot.question.id,
        low: lo,
        high: hi,
      });
      await handleSubmitResult(res);
    });
  }

  if (!boot) {
    return <p className="text-[var(--muted)]">Cargando partida…</p>;
  }

  const q = boot.question;
  const progress = ((q.index + 1) / q.total) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-end justify-between gap-4">
        <p className="section-label">
          Pregunta {q.index + 1} / {q.total}
        </p>
        {left != null && (
          <p
            className={`font-[family-name:var(--font-display)] text-3xl font-bold tabular-nums ${
              left <= 10 ? "text-[var(--signal)]" : "text-[var(--ink)]"
            }`}
          >
            {left}s
          </p>
        )}
      </div>

      <div className="mt-4 h-1.5 w-full bg-[var(--line)]">
        <div
          className="h-full bg-[var(--signal)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h1 className="mt-8 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
        {q.prompt}
      </h1>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[var(--mark)]">
        Unidad: {q.unit}
      </p>
      {q.hint && (
        <p className="mt-3 text-sm text-[var(--muted)]">Pista: {q.hint}</p>
      )}

      <form onSubmit={submit} className="mt-10 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Mínimo
            <input
              inputMode="decimal"
              value={low}
              onChange={(e) => setLow(e.target.value)}
              disabled={pending || locked}
              className="mt-2 w-full border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-lg"
              placeholder="ej. 100"
              required
            />
          </label>
          <label className="block text-sm font-semibold">
            Máximo
            <input
              inputMode="decimal"
              value={high}
              onChange={(e) => setHigh(e.target.value)}
              disabled={pending || locked}
              className="mt-2 w-full border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-lg"
              placeholder="ej. 400"
              required
            />
          </label>
        </div>

        <div
          className={`border-2 px-4 py-4 ${
            risk
              ? "border-[var(--mark)] bg-[var(--panel)]"
              : "border-[var(--line)] bg-transparent"
          }`}
        >
          {risk ? (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--mark)]">
                  {risk.riskLabel}
                </p>
                <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[var(--ink)]">
                  ×{risk.hitMultiplier.toFixed(1)}
                </p>
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Multiplicador si aciertas · {risk.widthApprox}
              </p>
              <p className="mt-2 text-sm text-[var(--ink)]">{risk.tip}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Si fallas con este rango: {risk.missScore} pts
              </p>
            </>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Escribe mín y máx para ver el multiplicador según el riesgo.
            </p>
          )}
        </div>

        {error && <p className="text-sm text-[var(--signal)]">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending || locked}
            className="btn-signal"
          >
            {pending || locked ? "Siguiente…" : "Enviar intervalo"}
          </button>
          <button
            type="button"
            disabled={pending || locked}
            onClick={() => {
              if (locked) return;
              setLocked(true);
              startTransition(async () => {
                const res = await skipEstimationQuestion(q.id);
                await handleSubmitResult(res);
              });
            }}
            className="btn-ghost"
          >
            Saltar (0 pts)
          </button>
        </div>
      </form>
    </div>
  );
}
