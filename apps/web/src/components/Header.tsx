"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/juegos", label: "Colección" },
  { href: "/recomendar", label: "Qué jugamos" },
  { href: "/azar", label: "Al azar" },
  { href: "/ranking", label: "Ranking" },
  { href: "/favoritos", label: "Favoritos" },
];

export function Header() {
  const pathname = usePathname();
  const onHero = pathname === "/";
  const onEstimaciones = pathname.startsWith("/estimaciones");

  return (
    <header
      className={
        onHero
          ? "absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-transparent"
          : "sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span
            className={`font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight sm:text-2xl ${
              onHero ? "text-white" : "text-[var(--ink)]"
            }`}
          >
            Mesa
            <span className="text-[var(--signal)]">&</span>
            Dados
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                onHero
                  ? "text-white/70 hover:text-white"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/estimaciones"
          className={`text-xs font-bold uppercase tracking-wider sm:text-sm ${
            onEstimaciones
              ? "border-2 border-[var(--night)] bg-[var(--night)] px-3 py-2 text-white"
              : onHero
                ? "border-2 border-[var(--signal)] bg-[var(--signal)] px-3 py-2 text-white"
                : "border-2 border-[var(--night)] bg-[var(--night)] px-3 py-2 text-white hover:bg-[var(--signal)] hover:border-[var(--signal)]"
          }`}
        >
          Estimaciones
        </Link>
      </div>

      <nav
        className={`flex flex-wrap gap-x-4 gap-y-1 border-t px-4 py-2 md:hidden ${
          onHero ? "border-white/10" : "border-[var(--line)]"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xs font-semibold uppercase tracking-wider ${
              onHero ? "text-white/65" : "text-[var(--muted)]"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/estimaciones"
          className="text-xs font-semibold uppercase tracking-wider text-[var(--signal)]"
        >
          Estimaciones
        </Link>
      </nav>
    </header>
  );
}
