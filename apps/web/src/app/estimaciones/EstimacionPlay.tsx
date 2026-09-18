"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  useTransition,
} from "react";
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
  const [inputFocused, setInputFocused] = useState(false);

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
    if (inputFocused) return; // pausa con teclado abierto
    if (left <= 0) {
      onTimeout();
      return;
    }
    const t = setTimeout(() => setLeft((s) => (s == null ? s : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [boot?.secondsPerQuestion, left, boot, pending, inputFocused]);

  async function handleSubmitResult(
    res: Awaited<ReturnType<typeof submitEstimationAnswer>>,
  ) {
    if (!res.ok) {
      setError(res.error);
      setLocked(false);
      return;
    }

    setLow("");
    setHigh("");
    setError(null);
    setInputFocused(false);

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
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-2xl flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:min-h-0 sm:pb-0">
      <div className="flex items-center justify-between gap-3">
        <p className="section-label !tracking-wider">
          {q.index + 1}/{q.total}
        </p>
        {left != null && (
          <p
            className={`font-[family-name:var(--font-display)] text-xl font-bold tabular-nums sm:text-3xl ${
              left <= 10 ? "text-[var(--signal)]" : "text-[var(--ink)]"
            }`}
          >
            {left}s{inputFocused ? " · pausa" : ""}
          </p>
        )}
      </div>

      <div className="mt-3 h-1 w-full bg-[var(--line)] sm:mt-4 sm:h-1.5">
        <div
          className="h-full bg-[var(--signal)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h1 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold leading-snug tracking-tight sm:mt-8 sm:text-3xl">
        {q.prompt}
      </h1>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--mark)] sm:mt-2 sm:text-sm">
        {q.unit}
        {q.hint ? (
          <span className="ml-2 font-normal normal-case tracking-normal text-[var(--muted)]">
            · {q.hint}
          </span>
        ) : null}
      </p>

      <form onSubmit={submit} className="mt-5 flex flex-1 flex-col gap-3 sm:mt-10 sm:gap-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold sm:text-sm">
            Mínimo
            <input
              inputMode="decimal"
              enterKeyHint="next"
              value={low}
              onChange={(e) => setLow(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              disabled={pending || locked}
              className="mt-1.5 w-full border border-[var(--line)] bg-[var(--panel)] px-3 py-2.5 text-base sm:mt-2 sm:px-4 sm:py-3 sm:text-lg"
              placeholder="100"
              required
            />
          </label>
          <label className="block text-xs font-semibold sm:text-sm">
            Máximo
            <input
              inputMode="decimal"
              enterKeyHint="done"
              value={high}
              onChange={(e) => setHigh(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              disabled={pending || locked}
              className="mt-1.5 w-full border border-[var(--line)] bg-[var(--panel)] px-3 py-2.5 text-base sm:mt-2 sm:px-4 sm:py-3 sm:text-lg"
              placeholder="400"
              required
            />
          </label>
        </div>

        {/* Riesgo compacto en móvil; detalle completo en desktop */}
        <div
          className={`flex items-center justify-between gap-3 border px-3 py-2.5 sm:border-2 sm:px-4 sm:py-4 ${
            risk
              ? "border-[var(--mark)] bg-[var(--panel)]"
              : "border-[var(--line)]"
          }`}
        >
          {risk ? (
            <>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--mark)] sm:text-xs">
                  {risk.riskLabel} · {risk.widthApprox}
                </p>
                <p className="mt-0.5 hidden text-sm text-[var(--ink)] sm:block">
                  {risk.tip}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted)] sm:mt-1">
                  Fallo: {risk.missScore} pts
                </p>
              </div>
              <p className="shrink-0 font-[family-name:var(--font-display)] text-2xl font-extrabold text-[var(--ink)] sm:text-3xl">
                ×{risk.hitMultiplier.toFixed(1)}
              </p>
            </>
          ) : (
            <p className="text-xs text-[var(--muted)] sm:text-sm">
              Escribe mín y máx para ver el multiplicador.
            </p>
          )}
        </div>

        {error && <p className="text-sm text-[var(--signal)]">{error}</p>}

        {/* Acciones: sticky abajo en móvil */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[var(--bg)]/95 px-4 py-3 backdrop-blur-md sm:static sm:mt-2 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <div className="mx-auto flex max-w-2xl gap-2 pb-[env(safe-area-inset-bottom)] sm:pb-0">
            <button
              type="submit"
              disabled={pending || locked}
              className="btn-signal flex-1 justify-center sm:flex-none"
            >
              {pending || locked ? "…" : "Enviar"}
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
              className="btn-ghost shrink-0"
            >
              Saltar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
