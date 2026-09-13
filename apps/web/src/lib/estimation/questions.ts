import "server-only";

import type { PublicQuestion } from "./types";

export type { PublicQuestion };

export type QuestionStyle = "fermi" | "cultura";

export type EstimationQuestion = {
  id: string;
  prompt: string;
  unit: string;
  /** Respuesta correcta — nunca se envía al cliente hasta el resultado final */
  answer: number;
  style: QuestionStyle;
  category: string;
  hint?: string;
};

/**
 * Mix:
 * - fermi: incertidumbre real (hábitos, magnitudes) — no es solo multiplicar
 * - cultura: datos concretos de cultura general / ciencia / geo
 */
export const ESTIMATION_BANK: EstimationQuestion[] = [
  // ——— Fermi (con margen de duda) ———
  {
    id: "water-year",
    prompt:
      "¿Cuántos litros de agua bebe una persona adulta en un año (solo bebida)?",
    unit: "litros",
    answer: 730,
    style: "fermi",
    category: "vida",
    hint: "Parte de un consumo diario razonable",
  },
  {
    id: "showers-month",
    prompt: "¿Cuántas duchas se da, de media, una persona adulta en un mes?",
    unit: "duchas",
    answer: 22,
    style: "fermi",
    category: "casa",
  },
  {
    id: "shower-liters",
    prompt: "¿Cuántos litros gasta de media una ducha doméstica en España?",
    unit: "litros",
    answer: 70,
    style: "fermi",
    category: "casa",
    hint: "Minutos × caudal típico",
  },
  {
    id: "steps-day",
    prompt: "¿Cuántos pasos da al día, de media, un adulto urbano?",
    unit: "pasos",
    answer: 5500,
    style: "fermi",
    category: "vida",
  },
  {
    id: "phone-checks-day",
    prompt: "¿Cuántas veces mira el móvil al día una persona adulta, de media?",
    unit: "veces",
    answer: 96,
    style: "fermi",
    category: "vida",
  },
  {
    id: "coffee-cups-year",
    prompt:
      "¿Cuántas tazas de café bebe al año un consumidor habitual de café en España?",
    unit: "tazas",
    answer: 550,
    style: "fermi",
    category: "comida",
  },
  {
    id: "sleep-hours-night",
    prompt: "¿Cuántas horas duerme de media un adulto por noche en España?",
    unit: "horas",
    answer: 7,
    style: "fermi",
    category: "vida",
  },
  {
    id: "commute-minutes",
    prompt:
      "¿Cuántos minutos dura, de media, el trayecto al trabajo (solo ida) en una gran ciudad española?",
    unit: "minutos",
    answer: 40,
    style: "fermi",
    category: "ciudad",
  },
  {
    id: "supermarket-spend",
    prompt:
      "¿Cuántos euros gasta al mes en supermercado un hogar de 2 personas en España (aprox.)?",
    unit: "euros",
    answer: 350,
    style: "fermi",
    category: "casa",
  },
  {
    id: "tv-hours-week",
    prompt:
      "¿Cuántas horas de vídeo/TV (streaming incluido) ve a la semana un adulto, de media?",
    unit: "horas",
    answer: 18,
    style: "fermi",
    category: "tiempo",
  },
  {
    id: "books-year",
    prompt: "¿Cuántos libros lee al año, de media, una persona lectora habitual?",
    unit: "libros",
    answer: 12,
    style: "fermi",
    category: "tiempo",
  },
  {
    id: "hair-cm-year",
    prompt: "¿Cuántos centímetros crece el pelo humano en un año, de media?",
    unit: "cm",
    answer: 15,
    style: "fermi",
    category: "vida",
  },
  {
    id: "dog-walk-min",
    prompt: "¿Cuántos minutos dura, de media, un paseo con el perro en ciudad?",
    unit: "minutos",
    answer: 25,
    style: "fermi",
    category: "vida",
  },
  {
    id: "olive-oil-month",
    prompt:
      "¿Cuántos ml de aceite de oliva consume al mes un hogar mediterráneo típico?",
    unit: "ml",
    answer: 750,
    style: "fermi",
    category: "comida",
  },
  {
    id: "whatsapp-day",
    prompt:
      "¿Cuántos mensajes de chat (WhatsApp u similar) envía al día un usuario intensivo?",
    unit: "mensajes",
    answer: 80,
    style: "fermi",
    category: "vida",
  },

  // ——— Cultura general / datos ———
  {
    id: "fifa-wc-first",
    prompt: "¿En qué año se celebró el primer Mundial de fútbol de la FIFA?",
    unit: "año",
    answer: 1930,
    style: "cultura",
    category: "deporte",
  },
  {
    id: "eu-countries",
    prompt: "¿Cuántos países forman la Unión Europea actualmente?",
    unit: "países",
    answer: 27,
    style: "cultura",
    category: "geo",
  },
  {
    id: "eiffel-m",
    prompt: "¿Cuántos metros mide la Torre Eiffel hasta la antena?",
    unit: "m",
    answer: 330,
    style: "cultura",
    category: "cultura",
  },
  {
    id: "earth-circ-km",
    prompt: "¿Cuántos kilómetros mide aproximadamente el ecuador terrestre?",
    unit: "km",
    answer: 40075,
    style: "cultura",
    category: "ciencia",
  },
  {
    id: "moon-km",
    prompt: "¿A cuántos kilómetros está la Luna de la Tierra (distancia media)?",
    unit: "km",
    answer: 384400,
    style: "cultura",
    category: "ciencia",
  },
  {
    id: "everest-m",
    prompt: "¿Cuántos metros mide el Everest sobre el nivel del mar?",
    unit: "m",
    answer: 8849,
    style: "cultura",
    category: "geo",
  },
  {
    id: "piano-keys",
    prompt: "¿Cuántas teclas tiene un piano de cola estándar?",
    unit: "teclas",
    answer: 88,
    style: "cultura",
    category: "cultura",
  },
  {
    id: "olympic-rings",
    prompt: "¿Cuántos aros tiene el símbolo olímpico?",
    unit: "aros",
    answer: 5,
    style: "cultura",
    category: "deporte",
  },
  {
    id: "spain-pop",
    prompt: "¿Cuántos habitantes tiene España aproximadamente?",
    unit: "personas",
    answer: 48000000,
    style: "cultura",
    category: "geo",
  },
  {
    id: "light-speed",
    prompt: "¿A cuántos km/s viaja la luz en el vacío (aprox.)?",
    unit: "km/s",
    answer: 300000,
    style: "cultura",
    category: "ciencia",
  },
  {
    id: "azul-year",
    prompt: "¿En qué año se publicó el juego de mesa Azul?",
    unit: "año",
    answer: 2017,
    style: "cultura",
    category: "juegos",
  },
  {
    id: "chess-squares",
    prompt: "¿Cuántas casillas tiene un tablero de ajedrez?",
    unit: "casillas",
    answer: 64,
    style: "cultura",
    category: "juegos",
  },
  {
    id: "uno-cards",
    prompt: "¿Cuántas cartas tiene una baraja estándar de UNO?",
    unit: "cartas",
    answer: 108,
    style: "cultura",
    category: "juegos",
  },
  {
    id: "sound-speed",
    prompt: "¿A cuántos m/s viaja el sonido en el aire a ~20 °C?",
    unit: "m/s",
    answer: 343,
    style: "cultura",
    category: "ciencia",
  },
  {
    id: "elements-table",
    prompt: "¿Cuántos elementos químicos hay en la tabla periódica actual?",
    unit: "elementos",
    answer: 118,
    style: "cultura",
    category: "ciencia",
  },
  {
    id: "human-bones",
    prompt: "¿Cuántos huesos tiene el cuerpo humano adulto, de media?",
    unit: "huesos",
    answer: 206,
    style: "cultura",
    category: "ciencia",
  },
  {
    id: "madrid-capital-year",
    prompt: "¿En qué siglo se convirtió Madrid en capital de España? (número del siglo, ej. 16)",
    unit: "siglo",
    answer: 16,
    style: "cultura",
    category: "historia",
    hint: "Felipe II",
  },
  {
    id: "amazon-km",
    prompt: "¿Cuántos km de longitud tiene el Amazonas aproximadamente?",
    unit: "km",
    answer: 6400,
    style: "cultura",
    category: "geo",
  },
  {
    id: "dna-chromosomes",
    prompt: "¿Cuántos pares de cromosomas tiene un ser humano?",
    unit: "pares",
    answer: 23,
    style: "cultura",
    category: "ciencia",
  },
  {
    id: "week-hours",
    prompt: "¿Cuántas horas tiene una semana?",
    unit: "horas",
    answer: 168,
    style: "cultura",
    category: "datos",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function getQuestionById(id: string): EstimationQuestion | undefined {
  return ESTIMATION_BANK.find((q) => q.id === id);
}

/** Mezcla ~50/50 fermi y cultura cuando hay suficientes de ambos. */
export function pickQuestionIds(count: number): string[] {
  const n = Math.min(count, ESTIMATION_BANK.length);
  const fermi = shuffle(ESTIMATION_BANK.filter((q) => q.style === "fermi"));
  const cultura = shuffle(ESTIMATION_BANK.filter((q) => q.style === "cultura"));

  const half = Math.ceil(n / 2);
  const fromFermi = fermi.slice(0, Math.min(half, fermi.length));
  const fromCultura = cultura.slice(
    0,
    Math.min(n - fromFermi.length, cultura.length),
  );

  let picked = [...fromFermi, ...fromCultura];

  if (picked.length < n) {
    const used = new Set(picked.map((q) => q.id));
    const rest = shuffle(ESTIMATION_BANK.filter((q) => !used.has(q.id)));
    picked = [...picked, ...rest.slice(0, n - picked.length)];
  }

  return shuffle(picked)
    .slice(0, n)
    .map((q) => q.id);
}

export function toPublicQuestion(
  q: EstimationQuestion,
  index: number,
  total: number,
  showHint: boolean,
): PublicQuestion {
  return {
    id: q.id,
    prompt: q.prompt,
    unit: q.unit,
    hint: showHint ? q.hint : undefined,
    index,
    total,
  };
}
