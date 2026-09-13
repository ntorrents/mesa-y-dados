import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import { estimationPlayers } from "@/db/schema";

const COOKIE = "md_estimator";

function secret() {
  const value = process.env.JWT_SECRET ?? "dev-only-secret-change-me";
  return new TextEncoder().encode(value);
}

export type PlayerSession = {
  playerId: number;
  email: string;
  nickname: string;
};

export async function createPlayerSession(player: PlayerSession) {
  const token = await new SignJWT({
    role: "estimator",
    playerId: player.playerId,
    email: player.email,
    nickname: player.nickname,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearPlayerSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getPlayerSession(): Promise<PlayerSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role !== "estimator") return null;
    const playerId = Number(payload.playerId);
    const email = String(payload.email ?? "");
    const nickname = String(payload.nickname ?? "");
    if (!playerId || !email || !nickname) return null;
    return { playerId, email, nickname };
  } catch {
    return null;
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeNickname(nickname: string) {
  return nickname.trim().slice(0, 40);
}

export async function upsertPlayer(emailRaw: string, nicknameRaw: string) {
  if (!hasDatabase()) {
    throw new Error("Necesitas DATABASE_URL para guardar puntuaciones.");
  }
  const email = normalizeEmail(emailRaw);
  const nickname = normalizeNickname(nicknameRaw);
  if (!email.includes("@") || nickname.length < 2) {
    throw new Error("Correo o apodo no válidos.");
  }

  const db = getDb();
  const existing = await db
    .select()
    .from(estimationPlayers)
    .where(eq(estimationPlayers.email, email))
    .limit(1);

  if (existing[0]) {
    const [updated] = await db
      .update(estimationPlayers)
      .set({ nickname })
      .where(eq(estimationPlayers.id, existing[0].id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(estimationPlayers)
    .values({ email, nickname })
    .returning();
  return created;
}
