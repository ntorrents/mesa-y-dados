import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--night)] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
            Mesa<span className="text-[var(--signal)]">&</span>Dados
          </p>
          <p className="mt-2 max-w-sm text-sm text-white/55">
            Inventario vivo de la mesa de casa. Menos duda, más partida.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm font-medium text-white/70">
          <Link href="/juegos" className="hover:text-white">
            Colección
          </Link>
          <Link href="/recomendar" className="hover:text-white">
            Qué jugamos
          </Link>
          <Link href="/estimaciones" className="hover:text-white">
            Estimaciones
          </Link>
          <Link href="/azar" className="hover:text-white">
            Al azar
          </Link>
          <Link href="/ranking" className="hover:text-white">
            Ranking
          </Link>
          <Link href="/admin" className="hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
