"use server";

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, hasDatabase } from "@/db";
import {
  estimationPlayers,
  estimationRuns,
  type EstimationAnswerRow,
} from "@/db/schema";
import type { PublicQuestion } from "@/lib/estimation/types";
import {
  getQuestionById,
  pickQuestionIds,
  toPublicQuestion,
} from "@/lib/estimation/questions";
import { maxPossibleScore, scoreInterval } from "@/lib/estimation/scoring";
import { recordQuestionAttempt } from "@/lib/estimation/question-stats";
import {
  clearPlayerSession,
  createPlayerSession,
  getPlayerSession,
  upsertPlayer,
} from "@/lib/estimation/player-auth";

const RUN_COOKIE = "md_estimation_run";

function newToken() {
  return randomBytes(24).toString("hex");
}

async function setRunCookie(token: string) {
  const jar = await cookies();
  jar.set(RUN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 6,
  });
}

async function clearRunCookie() {
  const jar = await cookies();
  jar.delete(RUN_COOKIE);
}

async function getRunToken() {
  const jar = await cookies();
  return jar.get(RUN_COOKIE)?.value ?? null;
}

export async function loginEstimator(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const nickname = String(formData.get("nickname") ?? "");
  try {
    const player = await upsertPlayer(email, nickname);
    await createPlayerSession({
      playerId: player.id,
      email: player.email,
      nickname: player.nickname,
    });
    revalidatePath("/estimaciones");
    return { ok: true as const };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "No se pudo iniciar sesión",
    };
  }
}

export async function logoutEstimator() {
  await clearPlayerSession();
  revalidatePath("/estimaciones");
}

export async function startEstimationRun(input: {
  count: number;
  showHints: boolean;
  secondsPerQuestion: number | null;
}) {
  if (!hasDatabase()) {
    return { ok: false as const, error: "Base de datos no configurada" };
  }

  const count = Math.min(12, Math.max(4, Math.round(input.count) || 8));
  const questionIds = pickQuestionIds(count);
  const token = newToken();
  const player = await getPlayerSession();

  const db = getDb();
  await db.insert(estimationRuns).values({
    token,
    playerId: player?.playerId ?? null,
    questionIds,
    answers: [],
    showHints: Boolean(input.showHints),
    secondsPerQuestion: input.secondsPerQuestion,
    status: "active",
    totalScore: 0,
  });

  await setRunCookie(token);

  const first = getQuestionById(questionIds[0]!);
  if (!first) {
    return { ok: false as const, error: "No hay preguntas" };
  }

  return {
    ok: true as const,
    question: toPublicQuestion(first, 0, questionIds.length, input.showHints),
    maxScore: maxPossibleScore(questionIds.length),
  };
}

export type SubmitResult =
  | {
      ok: true;
      next: PublicQuestion | null;
      finished: boolean;
      /** Solo se rellena al terminar; durante la partida no se filtra puntuación */
      runningTotal?: number;
    }
  | { ok: false; error: string };

export async function submitEstimationAnswer(input: {
  questionId: string;
  low: number;
  high: number;
}): Promise<SubmitResult> {
  if (!hasDatabase()) {
    return { ok: false, error: "Base de datos no configurada" };
  }

  const token = await getRunToken();
  if (!token) return { ok: false, error: "No hay partida activa" };

  const db = getDb();
  const rows = await db
    .select()
    .from(estimationRuns)
    .where(eq(estimationRuns.token, token))
    .limit(1);
  const run = rows[0];
  if (!run || run.status !== "active") {
    return { ok: false, error: "Partida no válida" };
  }

  const answered = run.answers ?? [];
  const nextIndex = answered.length;
  const expectedId = run.questionIds[nextIndex];
  if (!expectedId || expectedId !== input.questionId) {
    return { ok: false, error: "Pregunta fuera de orden" };
  }

  const question = getQuestionById(expectedId);
  if (!question) return { ok: false, error: "Pregunta desconocida" };

  const breakdown = scoreInterval(input.low, input.high, question.answer);
  const skipped =
    !Number.isFinite(input.low) ||
    !Number.isFinite(input.high) ||
    input.low <= 0 ||
    input.high <= 0 ||
    input.low > input.high;

  const row: EstimationAnswerRow = {
    questionId: expectedId,
    low: input.low,
    high: input.high,
    score: skipped ? 0 : breakdown.score,
    hit: skipped ? false : breakdown.hit,
    answer: question.answer,
    baseLabel: skipped ? "Saltada" : breakdown.baseLabel,
    spreadLabel: skipped ? "—" : breakdown.spreadLabel,
  };

  await recordQuestionAttempt({
    questionId: expectedId,
    outcome: skipped ? "skip" : breakdown.hit ? "hit" : "miss",
    score: row.score,
    spread: skipped ? null : breakdown.spread,
  });

  const newAnswers = [...answered, row];
  const totalScore = newAnswers.reduce((s, a) => s + a.score, 0);
  const finished = newAnswers.length >= run.questionIds.length;

  await db
    .update(estimationRuns)
    .set({
      answers: newAnswers,
      totalScore,
      status: finished ? "finished" : "active",
      finishedAt: finished ? new Date() : null,
      // Si el jugador inicia sesión a mitad, ya está; si no, deja null
    })
    .where(eq(estimationRuns.id, run.id));

  if (finished) {
    // Adjuntar jugador si hay sesión
    const player = await getPlayerSession();
    if (player && !run.playerId) {
      await db
        .update(estimationRuns)
        .set({ playerId: player.playerId })
        .where(eq(estimationRuns.id, run.id));
    }
  }

  let next: PublicQuestion | null = null;
  if (!finished) {
    const nq = getQuestionById(run.questionIds[newAnswers.length]!);
    if (nq) {
      next = toPublicQuestion(
        nq,
        newAnswers.length,
        run.questionIds.length,
        run.showHints,
      );
    }
  }

  return {
    ok: true,
    next,
    finished,
    ...(finished ? { runningTotal: totalScore } : {}),
  };
}

export async function skipEstimationQuestion(questionId: string) {
  return submitEstimationAnswer({
    questionId,
    low: -1,
    high: -1,
  });
}

export async function getEstimationResults(runToken?: string) {
  if (!hasDatabase()) return null;
  const token = runToken || (await getRunToken());
  if (!token) return null;

  const db = getDb();
  const rows = await db
    .select()
    .from(estimationRuns)
    .where(eq(estimationRuns.token, token))
    .limit(1);
  const run = rows[0];
  if (!run || run.status !== "finished") return null;

  const details = (run.answers ?? []).map((a) => {
    const q = getQuestionById(a.questionId);
    return {
      questionId: a.questionId,
      prompt: q?.prompt ?? a.questionId,
      unit: q?.unit ?? "",
      low: a.low,
      high: a.high,
      answer: a.answer ?? q?.answer ?? 0,
      score: a.score,
      hit: a.hit,
      baseLabel: a.baseLabel,
      spreadLabel: a.spreadLabel,
    };
  });

  let player: { nickname: string; email: string } | null = null;
  if (run.playerId) {
    const p = await db
      .select()
      .from(estimationPlayers)
      .where(eq(estimationPlayers.id, run.playerId))
      .limit(1);
    if (p[0]) player = { nickname: p[0].nickname, email: p[0].email };
  }

  const rank = await getRankForScore(run.totalScore);

  return {
    totalScore: run.totalScore,
    maxScore: maxPossibleScore(run.questionIds.length),
    hits: details.filter((d) => d.hit).length,
    total: details.length,
    details,
    player,
    rank,
    token: run.token,
  };
}

export async function attachScoreToPlayer() {
  const session = await getPlayerSession();
  if (!session) return { ok: false as const, error: "Inicia sesión primero" };
  if (!hasDatabase()) return { ok: false as const, error: "Sin base de datos" };

  const token = await getRunToken();
  if (!token) return { ok: false as const, error: "No hay partida" };

  const db = getDb();
  await db
    .update(estimationRuns)
    .set({ playerId: session.playerId })
    .where(
      and(eq(estimationRuns.token, token), eq(estimationRuns.status, "finished")),
    );

  revalidatePath("/estimaciones");
  return { ok: true as const };
}

async function getRankForScore(score: number) {
  const db = getDb();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const better = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(estimationRuns)
    .where(
      and(
        eq(estimationRuns.status, "finished"),
        gte(estimationRuns.finishedAt, since),
        sql`${estimationRuns.totalScore} > ${score}`,
        sql`${estimationRuns.playerId} is not null`,
      ),
    );
  return (better[0]?.c ?? 0) + 1;
}

export async function getLeaderboard(limit = 10) {
  if (!hasDatabase()) return [];
  const db = getDb();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const rows = await db
    .select({
      score: estimationRuns.totalScore,
      nickname: estimationPlayers.nickname,
      finishedAt: estimationRuns.finishedAt,
    })
    .from(estimationRuns)
    .innerJoin(
      estimationPlayers,
      eq(estimationRuns.playerId, estimationPlayers.id),
    )
    .where(
      and(
        eq(estimationRuns.status, "finished"),
        gte(estimationRuns.finishedAt, since),
      ),
    )
    .orderBy(desc(estimationRuns.totalScore))
    .limit(80);

  const bestByNick = new Map<string, number>();
  for (const r of rows) {
    const prev = bestByNick.get(r.nickname);
    if (prev == null || r.score > prev) bestByNick.set(r.nickname, r.score);
  }

  return [...bestByNick.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([nickname, score], i) => ({
      rank: i + 1,
      nickname,
      score,
    }));
}

export async function getPlayerStats() {
  const session = await getPlayerSession();
  if (!session || !hasDatabase()) {
    return { session, stats: null };
  }

  const db = getDb();
  const runs = await db
    .select()
    .from(estimationRuns)
    .where(
      and(
        eq(estimationRuns.playerId, session.playerId),
        eq(estimationRuns.status, "finished"),
      ),
    )
    .orderBy(desc(estimationRuns.finishedAt));

  if (!runs.length) {
    return {
      session,
      stats: { sessions: 0, best: 0, latest: 0 },
    };
  }

  return {
    session,
    stats: {
      sessions: runs.length,
      best: Math.max(...runs.map((r) => r.totalScore)),
      latest: runs[0]!.totalScore,
    },
  };
}

export async function endEstimationCleanup() {
  await clearRunCookie();
}
