# Mesa & Dados

Catálogo personal de juegos de mesa con **Next.js + Neon + Vercel Blob**.

## Stack

- App: `apps/web` (Next.js App Router)
- DB: Neon Postgres (Drizzle)
- Imágenes/PDFs: Vercel Blob (store privado + proxy `/api/media`)

## Local

```bash
cd apps/web
# .env con DATABASE_URL, BLOB_READ_WRITE_TOKEN, ADMIN_*, JWT_SECRET
npm install
npm run db:push   # tablas
npm run db:seed   # 26 juegos (usa blob-map.json)
npm run dev
```

http://localhost:3000

## Scripts útiles

| Comando | Uso |
|---------|-----|
| `npm run db:push` | Schema → Neon |
| `npm run blob:upload` | Sube `public/` media → Blob (si vuelves a añadir archivos locales) |
| `npm run db:seed` | Resetea e inserta juegos con URLs Blob |

## Vercel

Añade en el proyecto las mismas env vars del `.env` local (`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`).
