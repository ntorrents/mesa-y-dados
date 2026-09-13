/** Convierte URL de Blob privado en ruta servida por /api/media */
export function mediaSrc(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("/")) return url;
  if (url.includes("blob.vercel-storage.com")) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }
  return url;
}
