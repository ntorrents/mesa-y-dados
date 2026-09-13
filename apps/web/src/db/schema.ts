import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export type RulesSection = {
  icon?: string;
  title: string;
  content: string;
};

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  image: varchar("image", { length: 255 }),
  players: varchar("players", { length: 20 }),
  minAge: integer("min_age"),
  duration: varchar("duration", { length: 20 }),
  categories: text("categories").array(),
  difficulty: varchar("difficulty", { length: 20 }),
  rating: real("rating"),
  description: text("description"),
  review: text("review"),
  externalLink: varchar("external_link", { length: 255 }),
  pros: text("pros").array(),
  cons: text("cons").array(),
  featured: boolean("featured").default(false),
  rulesSummary: text("rules_summary"),
  rulesFile: varchar("rules_file", { length: 255 }),
  rulesSections: jsonb("rules_sections").$type<
    RulesSection[] | Record<string, RulesSection>
  >(),
});

/** Jugadores del juego de estimaciones (correo + apodo, sin contraseña) */
export const estimationPlayers = pgTable("estimation_players", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  nickname: varchar("nickname", { length: 40 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type EstimationAnswerRow = {
  questionId: string;
  low: number;
  high: number;
  score: number;
  hit: boolean;
  answer?: number;
  baseLabel?: string;
  spreadLabel?: string;
};

/** Partida en curso o terminada — las respuestas correctas solo viven en servidor */
export const estimationRuns = pgTable("estimation_runs", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  playerId: integer("player_id").references(() => estimationPlayers.id),
  questionIds: jsonb("question_ids").$type<string[]>().notNull(),
  answers: jsonb("answers")
    .$type<EstimationAnswerRow[]>()
    .notNull()
    .$defaultFn(() => []),
  showHints: boolean("show_hints").notNull().default(true),
  secondsPerQuestion: integer("seconds_per_question"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  totalScore: integer("total_score").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
});

/** Contadores agregados por pregunta (calibración de dificultad) */
export const estimationQuestionStats = pgTable("estimation_question_stats", {
  questionId: varchar("question_id", { length: 64 }).primaryKey(),
  attempts: integer("attempts").notNull().default(0),
  hits: integer("hits").notNull().default(0),
  misses: integer("misses").notNull().default(0),
  skips: integer("skips").notNull().default(0),
  scoreSum: integer("score_sum").notNull().default(0),
  /** Suma de spread log10 de intervalos enviados (no skips) */
  spreadSum: real("spread_sum").notNull().default(0),
  spreadSamples: integer("spread_samples").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type EstimationPlayer = typeof estimationPlayers.$inferSelect;
export type EstimationRun = typeof estimationRuns.$inferSelect;
export type EstimationQuestionStat = typeof estimationQuestionStats.$inferSelect;
