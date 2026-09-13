"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  verifyAdminCredentials,
} from "@/lib/auth";
import { createGame, deleteGame, updateGame } from "@/lib/games";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const ok = await verifyAdminCredentials(username, password);
  if (!ok) {
    redirect("/admin?error=1");
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function createGameAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const categories = String(formData.get("categories") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const pros = String(formData.get("pros") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const cons = String(formData.get("cons") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await createGame({
    name: String(formData.get("name") ?? ""),
    players: String(formData.get("players") ?? "") || null,
    minAge: Number(formData.get("minAge") || 0) || null,
    duration: String(formData.get("duration") ?? "") || null,
    categories,
    difficulty: String(formData.get("difficulty") ?? "") || null,
    rating: Number(formData.get("rating") || 0) || null,
    description: String(formData.get("description") ?? "") || null,
    review: String(formData.get("review") ?? "") || null,
    image: String(formData.get("image") ?? "") || null,
    featured: formData.get("featured") === "on",
    pros,
    cons,
  });

  revalidatePath("/");
  revalidatePath("/juegos");
  revalidatePath("/ranking");
  redirect("/admin?created=1");
}

export async function deleteGameAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (id) await deleteGame(id);
  revalidatePath("/");
  revalidatePath("/juegos");
  revalidatePath("/ranking");
  redirect("/admin");
}

export async function updateRatingAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  const rating = Number(formData.get("rating"));
  if (id && !Number.isNaN(rating)) {
    await updateGame(id, { rating });
  }
  revalidatePath("/ranking");
  revalidatePath("/");
  redirect("/admin");
}
