"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { useState, useTransition } from "react";

const PLAYER_OPTIONS = [2, 3, 4, 5, 6, 7, 8];
const DURATION_OPTIONS = [
  { value: "", label: "Sin límite" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
  { value: "90", label: "90 min" },
];

type Props = {
  categories: string[];
  resultCount: number;
};

export function GamesFilters({ categories, resultCount }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const view = params.get("view") === "list" ? "list" : "grid";

  function push(next: URLSearchParams) {
    startTransition(() => {
      const qs = next.toString();
      router.push(qs ? `/juegos?${qs}` : "/juegos");
    });
  }

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  }

  function clearAll() {
    const next = new URLSearchParams();
    if (view === "list") next.set("view", "list");
    push(next);
    setOpen(false);
  }

  const hasFilters = Boolean(
    params.get("q") ||
      params.get("category") ||
      params.get("difficulty") ||
      params.get("players") ||
      params.get("maxMinutes") ||
      (params.get("sort") && params.get("sort") !== "name") ||
      params.get("featured"),
  );

  const panel = (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          update("q", String(fd.get("q") ?? "").trim());
          setOpen(false);
        }}
      >
        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--mark)]">
          Buscar
        </label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            name="q"
            defaultValue={params.get("q") ?? ""}
            placeholder="Nombre o palabra…"
            className="w-full border-b border-[var(--ink)] bg-transparent py-2 pl-7 text-sm outline-none"
          />
        </div>
      </form>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-widest text-[var(--mark)]">
          Jugadores
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterBtn
            active={!params.get("players")}
            onClick={() => update("players", "")}
          >
            Todos
          </FilterBtn>
          {PLAYER_OPTIONS.map((n) => (
            <FilterBtn
              key={n}
              active={params.get("players") === String(n)}
              onClick={() => update("players", String(n))}
            >
              {n}
            </FilterBtn>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-widest text-[var(--mark)]">
          Tiempo
        </legend>
        <div className="mt-3 space-y-1">
          {DURATION_OPTIONS.map((o) => (
            <button
              key={o.value || "any"}
              type="button"
              onClick={() => update("maxMinutes", o.value)}
              className={`block w-full border-b border-[var(--line)] py-2 text-left text-sm ${
                (params.get("maxMinutes") ?? "") === o.value
                  ? "font-bold text-[var(--signal)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-widest text-[var(--mark)]">
          Dificultad
        </legend>
        <div className="mt-3 space-y-1">
          {["", "Fácil", "Medio", "Difícil"].map((d) => (
            <button
              key={d || "any"}
              type="button"
              onClick={() => update("difficulty", d)}
              className={`block w-full border-b border-[var(--line)] py-2 text-left text-sm ${
                (params.get("difficulty") ?? "") === d
                  ? "font-bold text-[var(--signal)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {d || "Cualquiera"}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-widest text-[var(--mark)]">
          Categoría
        </legend>
        <div className="mt-3 max-h-48 space-y-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => update("category", "")}
            className={`block w-full py-1.5 text-left text-sm ${
              !params.get("category")
                ? "font-bold text-[var(--signal)]"
                : "text-[var(--muted)]"
            }`}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update("category", c)}
              className={`block w-full py-1.5 text-left text-sm ${
                params.get("category") === c
                  ? "font-bold text-[var(--signal)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-widest text-[var(--mark)]">
          Orden
        </legend>
        <select
          value={params.get("sort") ?? "name"}
          onChange={(e) => update("sort", e.target.value)}
          className="mt-2 w-full border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm"
        >
          <option value="name">Nombre</option>
          <option value="rating">Nota</option>
          <option value="duration">Duración</option>
          <option value="difficulty">Dificultad</option>
        </select>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={params.get("featured") === "1"}
          onChange={(e) => update("featured", e.target.checked ? "1" : "")}
        />
        Solo destacados
      </label>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--signal)]"
        >
          <X className="h-4 w-4" />
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className={pending ? "opacity-70" : ""}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <p className="text-sm text-[var(--muted)]">
          <span className="font-bold text-[var(--ink)]">{resultCount}</span>{" "}
          juegos
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-sm font-bold uppercase tracking-wider text-[var(--mark)] lg:hidden"
            onClick={() => setOpen(true)}
          >
            Afinar
          </button>
          <div className="flex gap-3 text-sm font-semibold">
            <Link
              href={`/juegos?${keepView(params, "grid")}`}
              className={
                view === "grid" ? "text-[var(--signal)]" : "text-[var(--muted)]"
              }
            >
              <span className="inline-flex items-center gap-1">
                <LayoutGrid className="h-4 w-4" /> Cuadrícula
              </span>
            </Link>
            <Link
              href={`/juegos?${keepView(params, "list")}`}
              className={
                view === "list" ? "text-[var(--signal)]" : "text-[var(--muted)]"
              }
            >
              <span className="inline-flex items-center gap-1">
                <List className="h-4 w-4" /> Lista
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">{panel}</div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--night)]/50"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto border-t border-[var(--line)] bg-[var(--bg)] px-4 py-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-[family-name:var(--font-display)] text-xl font-bold">
                Afinar búsqueda
              </p>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {panel}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-10 border px-3 py-1.5 text-sm font-semibold ${
        active
          ? "border-[var(--ink)] bg-[var(--ink)] text-white"
          : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function keepView(params: URLSearchParams, view: "grid" | "list") {
  const next = new URLSearchParams(params.toString());
  if (view === "list") next.set("view", "list");
  else next.delete("view");
  return next.toString();
}
