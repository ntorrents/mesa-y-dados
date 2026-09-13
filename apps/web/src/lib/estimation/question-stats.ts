import "server-only";

import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { estimationQuestionStats } from "@/db/schema";

export type QuestionOutcome = "hit" | "miss" | "skip";

/**
 * Contadores internos por pregunta para calibrar dificultad más adelante.
 * No se exponen al jugador durante la partida.
 */
export async function recordQuestionAttempt(input: {
  questionId: string;
  outcome: QuestionOutcome;
  score: number;
  /** Anchura log10 del intervalo; null si skip */
  spread: number | null;
}) {
  const db = getDb();
  const now = new Date();
  const hitInc = input.outcome === "hit" ? 1 : 0;
  const missInc = input.outcome === "miss" ? 1 : 0;
  const skipInc = input.outcome === "skip" ? 1 : 0;
  const spreadVal = input.spread != null && Number.isFinite(input.spread)
    ? input.spread
    : 0;
  const spreadInc = input.spread != null && Number.isFinite(input.spread) ? 1 : 0;

  await db
    .insert(estimationQuestionStats)
    .values({
      questionId: input.questionId,
      attempts: 1,
      hits: hitInc,
      misses: missInc,
      skips: skipInc,
      scoreSum: Math.max(0, input.score),
      spreadSum: spreadVal,
      spreadSamples: spreadInc,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: estimationQuestionStats.questionId,
      set: {
        attempts: sql`${estimationQuestionStats.attempts} + 1`,
        hits: sql`${estimationQuestionStats.hits} + ${hitInc}`,
        misses: sql`${estimationQuestionStats.misses} + ${missInc}`,
        skips: sql`${estimationQuestionStats.skips} + ${skipInc}`,
        scoreSum: sql`${estimationQuestionStats.scoreSum} + ${Math.max(0, input.score)}`,
        spreadSum: sql`${estimationQuestionStats.spreadSum} + ${spreadVal}`,
        spreadSamples: sql`${estimationQuestionStats.spreadSamples} + ${spreadInc}`,
        updatedAt: now,
      },
    });
}

export async function getQuestionDifficultySnapshot() {
  const db = getDb();
  const rows = await db.select().from(estimationQuestionStats);
  return rows.map((r) => {
    const graded = r.hits + r.misses;
    const hitRate = graded > 0 ? r.hits / graded : null;
    const avgScore = r.attempts > 0 ? r.scoreSum / r.attempts : null;
    const avgSpread =
      r.spreadSamples > 0 ? r.spreadSum / r.spreadSamples : null;
    // Dificultad heurística 0–1 (1 = más difícil): baja tasa de acierto + baja nota media
    let difficulty: number | null = null;
    if (graded >= 3 && hitRate != null && avgScore != null) {
      difficulty = Math.min(
        1,
        Math.max(0, (1 - hitRate) * 0.65 + (1 - avgScore / 200) * 0.35),
      );
    }
    return {
      questionId: r.questionId,
      attempts: r.attempts,
      hits: r.hits,
      misses: r.misses,
      skips: r.skips,
      hitRate,
      avgScore,
      avgSpread,
      difficulty,
    };
  });
}

export async function getStatsForQuestion(questionId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(estimationQuestionStats)
    .where(eq(estimationQuestionStats.questionId, questionId))
    .limit(1);
  return rows[0] ?? null;
}
