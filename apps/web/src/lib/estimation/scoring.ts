/**
 * Puntuación Fermi (intervalos calibrados).
 * Seguro para cliente: no contiene respuestas.
 * @see https://www.tradermath.org/market-games/fermi-estimation-game
 */

export type RiskPreview = {
  hitMultiplier: number;
  missScore: number;
  widthApprox: string;
  riskLabel: string;
  tip: string;
};

export type ScoreBreakdown = {
  score: number;
  hit: boolean;
  credit: number;
  basePoints: number;
  baseLabel: string;
  spread: number;
  spreadLabel: string;
  hitMultiplier: number;
  missDeduction: number;
  logDist: number;
  geoMean: number;
};

const CREDIT = 50;
const MAX_PER_QUESTION = 200;

function baseFromLogDist(logDist: number): { points: number; label: string } {
  if (logDist <= 0.05) return { points: 100, label: "Casi perfecto" };
  if (logDist <= 0.1) return { points: 80, label: "Excelente" };
  if (logDist <= 0.2) return { points: 60, label: "Muy cerca" };
  if (logDist <= 0.3) return { points: 40, label: "Buen estimado" };
  if (logDist <= 0.5) return { points: 20, label: "En la zona" };
  if (logDist <= 1) return { points: 10, label: "Orden de magnitud" };
  return { points: 0, label: "Demasiado lejos" };
}

function spreadBand(spread: number): {
  hitMultiplier: number;
  missDeduction: number;
  label: string;
  widthApprox: string;
  riskLabel: string;
  tip: string;
} {
  if (spread <= 0.3)
    return {
      hitMultiplier: 1.5,
      missDeduction: 50,
      label: "≤ 2×",
      widthApprox: "máx ≤ 2× el mín",
      riskLabel: "Arriesgado",
      tip: "Si aciertas, bonus máximo. Si fallas, 0 pts.",
    };
  if (spread <= 0.5)
    return {
      hitMultiplier: 1.2,
      missDeduction: 30,
      label: "2–3×",
      widthApprox: "máx entre 2× y 3× el mín",
      riskLabel: "Atrevido",
      tip: "Buen bonus al acertar; si fallas, solo 20 pts.",
    };
  if (spread <= 1)
    return {
      hitMultiplier: 1,
      missDeduction: 15,
      label: "3–10×",
      widthApprox: "máx entre 3× y 10× el mín",
      riskLabel: "Equilibrado",
      tip: "Bonus normal; si fallas, te quedas con 35 pts.",
    };
  return {
    hitMultiplier: 0.8,
    missDeduction: 10,
    label: "> 10×",
    widthApprox: "máx > 10× el mín",
    riskLabel: "Conservador",
    tip: "Menos bonus si aciertas; si fallas, 40 pts de consuelo.",
  };
}

/** Vista previa del multiplicador según el rango (sin conocer la respuesta). */
export function getRiskPreview(low: number, high: number): RiskPreview | null {
  if (
    !Number.isFinite(low) ||
    !Number.isFinite(high) ||
    low <= 0 ||
    high <= 0 ||
    low > high
  ) {
    return null;
  }
  const spread = Math.log10(high) - Math.log10(low);
  const band = spreadBand(spread);
  return {
    hitMultiplier: band.hitMultiplier,
    missScore: Math.max(0, CREDIT - band.missDeduction),
    widthApprox: band.widthApprox,
    riskLabel: band.riskLabel,
    tip: band.tip,
  };
}

export function scoreInterval(
  low: number,
  high: number,
  answer: number,
): ScoreBreakdown {
  if (
    !Number.isFinite(low) ||
    !Number.isFinite(high) ||
    !Number.isFinite(answer) ||
    low <= 0 ||
    high <= 0 ||
    answer <= 0 ||
    low > high
  ) {
    return {
      score: 0,
      hit: false,
      credit: CREDIT,
      basePoints: 0,
      baseLabel: "Entrada inválida",
      spread: 0,
      spreadLabel: "—",
      hitMultiplier: 0,
      missDeduction: CREDIT,
      logDist: Infinity,
      geoMean: 0,
    };
  }

  const spread = Math.log10(high) - Math.log10(low);
  const geoMean = Math.sqrt(low * high);
  const logDist = Math.abs(Math.log10(geoMean) - Math.log10(answer));
  const hit = answer >= low && answer <= high;
  const { points: basePoints, label: baseLabel } = baseFromLogDist(logDist);
  const band = spreadBand(spread);

  let score: number;
  if (hit) {
    score = Math.min(
      MAX_PER_QUESTION,
      CREDIT + basePoints * band.hitMultiplier,
    );
  } else {
    score = Math.max(0, CREDIT - band.missDeduction);
  }

  return {
    score: Math.round(score),
    hit,
    credit: CREDIT,
    basePoints,
    baseLabel,
    spread,
    spreadLabel: band.label,
    hitMultiplier: band.hitMultiplier,
    missDeduction: band.missDeduction,
    logDist,
    geoMean,
  };
}

export const MAX_SCORE_PER_QUESTION = MAX_PER_QUESTION;

export function maxPossibleScore(questionCount: number) {
  return questionCount * MAX_PER_QUESTION;
}
