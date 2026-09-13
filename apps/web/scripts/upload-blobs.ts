import { config } from "dotenv";
import { put } from "@vercel/blob";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

config({ path: ".env" });
config({ path: ".env.local" });

const ROOT = path.join(process.cwd(), "public");

function contentTypeFor(file: string) {
  if (file.endsWith(".pdf")) return "application/pdf";
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".webp")) return "image/webp";
  if (file.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

async function uploadDir(relativeDir: string, prefix: string) {
  const abs = path.join(ROOT, relativeDir);
  const files = await readdir(abs);
  const map: Record<string, string> = {};

  for (const file of files) {
    if (!/\.(jpe?g|png|webp|gif|pdf)$/i.test(file)) continue;

    const localPath = path.join(abs, file);
    const blobPath = `${prefix}/${file}`;
    const body = await readFile(localPath);

    const blob = await put(blobPath, body, {
      access: "private",
      contentType: contentTypeFor(file),
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const publicPath = `/${relativeDir}/${file}`;
    map[publicPath] = blob.url;
    console.log(`✓ ${publicPath}`);
  }

  return map;
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Falta BLOB_READ_WRITE_TOKEN en .env");
  }

  const map = {
    ...(await uploadDir("images/games", "games")),
    ...(await uploadDir("rules", "rules")),
  };

  const out = path.join(process.cwd(), "src/db/blob-map.json");
  await writeFile(out, JSON.stringify(map, null, 2));
  console.log(`\nMapa: ${Object.keys(map).length} archivos → ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
