import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { contentPatches } from "../src/db/content-patches";
import { games } from "../src/db/schema";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

config({ path: ".env" });
config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta DATABASE_URL");

  const db = drizzle(neon(url));
  let updated = 0;
  const missing: string[] = [];

  for (const patch of contentPatches) {
    const result = await db
      .update(games)
      .set({
        description: patch.description,
        review: patch.review,
        categories: patch.categories,
        difficulty: patch.difficulty,
        pros: patch.pros,
        cons: patch.cons,
        featured: patch.featured ?? false,
        rulesSummary: patch.rulesSummary ?? null,
      })
      .where(eq(games.name, patch.name))
      .returning({ id: games.id, name: games.name });

    if (!result.length) missing.push(patch.name);
    else {
      updated += 1;
      console.log(`✓ ${patch.name}`);
    }
  }

  // Sync seed-data.json for local fallback
  const seedPath = path.join(process.cwd(), "src/db/seed-data.json");
  const seed = JSON.parse(readFileSync(seedPath, "utf8"));
  for (const patch of contentPatches) {
    const game = seed.games.find(
      (g: { name: string }) => g.name === patch.name,
    );
    if (!game) continue;
    Object.assign(game, {
      description: patch.description,
      review: patch.review,
      categories: patch.categories,
      difficulty: patch.difficulty,
      pros: patch.pros,
      cons: patch.cons,
      featured: patch.featured ?? false,
      rulesSummary: patch.rulesSummary,
    });
  }
  writeFileSync(seedPath, JSON.stringify(seed, null, 2));

  console.log(`\nActualizados: ${updated}/${contentPatches.length}`);
  if (missing.length) console.log("No encontrados:", missing.join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
