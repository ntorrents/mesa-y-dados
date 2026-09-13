import { EstimacionLobby } from "./EstimacionLobby";
import { getLeaderboard, getPlayerStats } from "./actions";

export const metadata = {
  title: "Estimaciones",
  description:
    "El juego de la casa: estima cantidades cotidianas con un intervalo. Cuanto más te la juegas, más puntos si aciertas.",
};

export const dynamic = "force-dynamic";

export default async function EstimacionesPage() {
  const [{ session, stats }, leaderboard] = await Promise.all([
    getPlayerStats(),
    getLeaderboard(10),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <p className="section-label">El juego de la casa</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-6xl">
          Estimaciones
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Mitad Fermi (hábitos con incertidumbre real) y mitad cultura general.
          Pones un rango; si la verdad cae dentro, sumas. Al final ves puntuación
          y ranking.
        </p>
      </header>

      <EstimacionLobby
        session={
          session
            ? { nickname: session.nickname, email: session.email }
            : null
        }
        stats={stats}
        leaderboard={leaderboard}
      />

      <section className="mt-14 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--ink)]">
          Reglas en corto
        </h2>
        <ol className="mt-4 space-y-4 text-[var(--muted)]">
          <li>
            <span className="font-bold text-[var(--ink)]">1. Elige un rango.</span>{" "}
            Mínimo y máximo entre los que crees que está la respuesta.
          </li>
          <li>
            <span className="font-bold text-[var(--ink)]">
              2. El ancho fija el riesgo.
            </span>{" "}
            Rango estrecho → multiplicador alto (hasta ×1,5) si aciertas, pero 0
            si fallas. Rango ancho → menos bonus, pero conservas puntos si fallas.
          </li>
          <li>
            <span className="font-bold text-[var(--ink)]">
              3. Acertar = respuesta dentro del rango.
            </span>{" "}
            Además, cuanto más cerca esté el “centro” de tu intervalo, más
            puntos base (hasta 200 por pregunta).
          </li>
          <li>
            <span className="font-bold text-[var(--ink)]">4. Sin spoiler.</span>{" "}
            No verás si acertaste ni la solución hasta el resultado final. Saltar
            o agotar el tiempo = 0.
          </li>
        </ol>

        <div className="mt-8 overflow-x-auto border border-[var(--line)] bg-[var(--panel)]">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="border-b border-[var(--line)] text-xs uppercase tracking-wider text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Anchura</th>
                <th className="px-4 py-3 font-semibold">Si aciertas</th>
                <th className="px-4 py-3 font-semibold">Si fallas</th>
              </tr>
            </thead>
            <tbody className="text-[var(--ink)]">
              <tr className="border-b border-[var(--line)]">
                <td className="px-4 py-3">máx ≤ 2× el mín</td>
                <td className="px-4 py-3 font-bold text-[var(--mark)]">×1,5</td>
                <td className="px-4 py-3">0 pts</td>
              </tr>
              <tr className="border-b border-[var(--line)]">
                <td className="px-4 py-3">2× – 3×</td>
                <td className="px-4 py-3 font-bold text-[var(--mark)]">×1,2</td>
                <td className="px-4 py-3">20 pts</td>
              </tr>
              <tr className="border-b border-[var(--line)]">
                <td className="px-4 py-3">3× – 10×</td>
                <td className="px-4 py-3 font-bold text-[var(--mark)]">×1,0</td>
                <td className="px-4 py-3">35 pts</td>
              </tr>
              <tr>
                <td className="px-4 py-3">&gt; 10×</td>
                <td className="px-4 py-3 font-bold text-[var(--mark)]">×0,8</td>
                <td className="px-4 py-3">40 pts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
