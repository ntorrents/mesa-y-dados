import { hasDatabase } from "@/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllGames } from "@/lib/games";
import {
  createGameAction,
  deleteGameAction,
  loginAction,
  logoutAction,
  updateRatingAction,
} from "./actions";

export const metadata = { title: "Admin" };

type Props = {
  searchParams: Promise<{ error?: string; created?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const authed = await isAdminAuthenticated();
  const dbReady = hasDatabase();

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Admin
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Acceso para gestionar la colección.
        </p>
        {params.error && (
          <p className="mt-4 rounded-xl bg-red-100 px-3 py-2 text-sm text-red-800">
            Usuario o contraseña incorrectos.
          </p>
        )}
        <form action={loginAction} className="mt-6 space-y-4">
          <label className="block text-sm">
            Usuario
            <input
              name="username"
              required
              className="mt-1 w-full rounded-xl border border-[var(--ink)]/10 bg-[var(--surface)] px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Contraseña
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-xl border border-[var(--ink)]/10 bg-[var(--surface)] px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--felt)] py-2.5 text-sm font-semibold text-[var(--parchment)]"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  const games = await getAllGames();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">
            Panel
          </h1>
          <p className="text-sm text-[var(--ink-muted)]">
            {dbReady
              ? "Conectado a Neon"
              : "Sin DATABASE_URL — lectura en local; escritura desactivada"}
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full border border-[var(--ink)]/15 px-4 py-2 text-sm"
          >
            Salir
          </button>
        </form>
      </div>

      {params.created && (
        <p className="mt-4 rounded-xl bg-[var(--felt)]/15 px-3 py-2 text-sm">
          Juego creado.
        </p>
      )}

      <section className="mt-10 rounded-3xl bg-[var(--surface)] p-6 ring-1 ring-[var(--ink)]/8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Añadir juego
        </h2>
        <form
          action={createGameAction}
          className="mt-4 grid gap-3 sm:grid-cols-2"
        >
          <input
            name="name"
            required
            placeholder="Nombre"
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm"
          />
          <input
            name="players"
            placeholder="Jugadores (2-4)"
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm"
          />
          <input
            name="duration"
            placeholder="Duración"
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm"
          />
          <input
            name="difficulty"
            placeholder="Dificultad"
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm"
          />
          <input
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="Nota"
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm"
          />
          <input
            name="minAge"
            type="number"
            placeholder="Edad mín."
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm"
          />
          <input
            name="categories"
            placeholder="Categorías (coma)"
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm sm:col-span-2"
          />
          <input
            name="image"
            placeholder="Ruta imagen (/images/games/...)"
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm sm:col-span-2"
          />
          <textarea
            name="description"
            placeholder="Descripción corta"
            rows={2}
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm sm:col-span-2"
          />
          <textarea
            name="review"
            placeholder="Reseña"
            rows={3}
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm sm:col-span-2"
          />
          <textarea
            name="pros"
            placeholder="Pros (una por línea)"
            rows={3}
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm"
          />
          <textarea
            name="cons"
            placeholder="Contras (una por línea)"
            rows={3}
            className="rounded-xl border border-[var(--ink)]/10 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input name="featured" type="checkbox" /> Destacado
          </label>
          <button
            type="submit"
            disabled={!dbReady}
            className="rounded-full bg-[var(--felt)] py-2.5 text-sm font-semibold text-[var(--parchment)] disabled:opacity-40 sm:col-span-2"
          >
            Guardar en Neon
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Juegos ({games.length})
        </h2>
        <ul className="mt-4 divide-y divide-[var(--ink)]/8 rounded-3xl bg-[var(--surface)] ring-1 ring-[var(--ink)]/8">
          {games.map((game) => (
            <li
              key={game.id}
              className="flex flex-wrap items-center gap-3 px-4 py-3"
            >
              <span className="min-w-0 flex-1 font-medium">{game.name}</span>
              <form action={updateRatingAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={game.id} />
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  defaultValue={game.rating ?? 0}
                  className="w-16 rounded-lg border border-[var(--ink)]/10 px-2 py-1 text-sm"
                />
                <button
                  type="submit"
                  disabled={!dbReady}
                  className="text-xs font-semibold text-[var(--felt)] disabled:opacity-40"
                >
                  Nota
                </button>
              </form>
              <form action={deleteGameAction}>
                <input type="hidden" name="id" value={game.id} />
                <button
                  type="submit"
                  disabled={!dbReady}
                  className="text-xs font-semibold text-red-700 disabled:opacity-40"
                >
                  Borrar
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
