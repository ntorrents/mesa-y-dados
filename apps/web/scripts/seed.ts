import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import seedData from "../src/db/seed-data.json";
import blobMap from "../src/db/blob-map.json";
import { games } from "../src/db/schema";

config({ path: ".env" });
config({ path: ".env.local" });

type BlobMap = Record<string, string>;

function resolveAsset(path: string | null | undefined, map: BlobMap) {
  if (!path) return null;
  return map[path] ?? path;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("Falta DATABASE_URL en .env");
    process.exit(1);
  }

  const map = blobMap as BlobMap;
  const db = drizzle(neon(url));

  console.log("Limpiando tabla games…");
  await db.delete(games);

  const rows = seedData.games.map((g) => ({
    name: g.name,
    image: resolveAsset(g.image ?? null, map),
    players: g.players ?? null,
    minAge: g.minAge ?? null,
    duration: g.duration ?? null,
    categories: g.categories ?? [],
    difficulty: g.difficulty ?? null,
    rating: g.rating ?? null,
    description: g.description ?? null,
    review: g.review ?? null,
    externalLink: g.externalLink ?? null,
    pros: g.pros ?? [],
    cons: g.cons ?? [],
    featured: g.featured ?? false,
  }));

  console.log(`Insertando ${rows.length} juegos (imágenes → Blob)…`);
  await db.insert(games).values(rows);

  const withBlob = rows.filter((r) => r.image?.includes("blob.vercel-storage.com")).length;
  console.log(`Seed OK. ${withBlob}/${rows.length} con URL de Blob.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
