import { config } from "dotenv";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { games } from "../src/db/schema";

config({ path: ".env" });
config({ path: ".env.local" });

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MesaDados/1.0";

/** ID BGG o URL directa de carátula */
const sources: Record<
  string,
  { bggId?: number; imageUrl?: string; bggSlug?: string }
> = {
  Azul: { bggId: 230802, bggSlug: "azul" },
  Pandemic: { bggId: 30549, bggSlug: "pandemic" },
  "Código Secreto": { bggId: 178900, bggSlug: "codenames" },
  "Aventureros al tren": { bggId: 9209, bggSlug: "ticket-ride" },
  "7 Wonders": { bggId: 68448, bggSlug: "7-wonders" },
  "7 Wonders Duel": { bggId: 173346, bggSlug: "7-wonders-duel" },
  Catan: { bggId: 13, bggSlug: "catan" },
  "Catan (cartas)": { bggId: 278, bggSlug: "catan-card-game" },
  Ciudadelas: { bggId: 478, bggSlug: "citadels" },
  Coloretto: { bggId: 5782, bggSlug: "coloretto" },
  Cortex: { bggId: 206175, bggSlug: "braintopia" },
  "Blind Business": { bggId: 371973, bggSlug: "blind-business" },
  "Deep Sea Adventure": { bggId: 169654, bggSlug: "deep-sea-adventure" },
  "Desierto Prohibido": { bggId: 136063, bggSlug: "forbidden-desert" },
  "Exploding Kittens": { bggId: 172225, bggSlug: "exploding-kittens" },
  "Exploding Kittens: Edición 2 jugadores": {
    bggId: 356226,
    bggSlug: "exploding-kittens-2-player-edition",
  },
  "Fantasma Blitz": { bggId: 83195, bggSlug: "ghost-blitz" },
  "High Society": { bggId: 220, bggSlug: "high-society" },
  Jaipur: { bggId: 54043, bggSlug: "jaipur" },
  Jerusalem: { bggId: 63632, bggSlug: "jerusalem" },
  "Splendor Duel": { bggId: 364073, bggSlug: "splendor-duel" },
  Symbiose: { bggId: 432451, bggSlug: "symbiosis" },
  Trio: { bggId: 352515, bggSlug: "trio" },
  "¡Toma 6!": { bggId: 432, bggSlug: "6-nimmt" },
  Manchas: {
    imageUrl:
      "https://quejuegosdemesa.com/wp-content/uploads/2024/05/manchas-juego-de-mesa.jpg",
  },
  Pelusas: {
    imageUrl: "https://ludosaurus.com/2376-large_default/pelusas.jpg",
  },
};

function slugify(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fetchBggCover(bggId: number): Promise<string> {
  const res = await fetch(
    `https://api.geekdo.com/api/geekitems?objectid=${bggId}&objecttype=thing`,
    { headers: { "User-Agent": UA, Accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`BGG ${bggId}: HTTP ${res.status}`);
  const data = (await res.json()) as {
    item?: { images?: { original?: string; previewthumb?: string }; imageurl?: string };
  };
  const url =
    data.item?.images?.original ||
    data.item?.images?.previewthumb ||
    data.item?.imageurl;
  if (!url) throw new Error(`BGG ${bggId}: sin imagen`);
  return url;
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Download ${url}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Carátula uniforme 900×1200 sobre fondo pergamino */
async function normalizeCover(input: Buffer): Promise<Buffer> {
  const W = 900;
  const H = 1200;
  const PAD = 48;
  const bg = "#f3ebe0";

  const fitted = await sharp(input)
    .rotate()
    .resize(W - PAD * 2, H - PAD * 2, {
      fit: "inside",
      withoutEnlargement: false,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const meta = await sharp(fitted).metadata();
  const left = Math.round((W - (meta.width ?? 0)) / 2);
  const top = Math.round((H - (meta.height ?? 0)) / 2);

  return sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: bg,
    },
  })
    .composite([{ input: fitted, left, top }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL");
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Falta BLOB_READ_WRITE_TOKEN");
  }

  const db = drizzle(neon(process.env.DATABASE_URL));
  const rows = await db.select().from(games);
  const outDir = path.join(process.cwd(), ".tmp-covers");
  mkdirSync(outDir, { recursive: true });

  const blobMap: Record<string, string> = {};
  let ok = 0;

  for (const row of rows) {
    const src = sources[row.name];
    if (!src) {
      console.warn(`⚠ Sin fuente para: ${row.name}`);
      continue;
    }

    try {
      const remote =
        src.imageUrl ?? (await fetchBggCover(src.bggId!));
      console.log(`↓ ${row.name}`);
      const raw = await download(remote);
      const normalized = await normalizeCover(raw);

      const slug = slugify(row.name);
      const localPath = path.join(outDir, `${slug}.jpg`);
      writeFileSync(localPath, normalized);

      const blob = await put(`covers/${slug}.jpg`, normalized, {
        access: "private",
        contentType: "image/jpeg",
        addRandomSuffix: false,
        allowOverwrite: true,
      });

      await db
        .update(games)
        .set({
          image: blob.url,
          externalLink: src.bggId
            ? `https://boardgamegeek.com/boardgame/${src.bggId}/${src.bggSlug ?? slug}`
            : row.externalLink,
        })
        .where(eq(games.id, row.id));

      blobMap[`/images/games/${slug}.jpg`] = blob.url;
      ok += 1;
      console.log(`✓ ${row.name} → covers/${slug}.jpg`);
      await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      console.error(`✗ ${row.name}:`, err);
    }
  }

  writeFileSync(
    path.join(process.cwd(), "src/db/blob-map.json"),
    JSON.stringify(blobMap, null, 2),
  );
  console.log(`\nListo: ${ok}/${rows.length} carátulas actualizadas.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
