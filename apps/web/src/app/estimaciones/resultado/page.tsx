import { redirect } from "next/navigation";
import { EstimacionResultado } from "../EstimacionResultado";
import { getEstimationResults } from "../actions";
import { getPlayerSession } from "@/lib/estimation/player-auth";

export const metadata = { title: "Resultado · Estimaciones" };
export const dynamic = "force-dynamic";

export default async function EstimacionesResultadoPage() {
  const results = await getEstimationResults();
  if (!results) redirect("/estimaciones");
  const session = await getPlayerSession();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <EstimacionResultado
        results={results}
        session={
          session
            ? { nickname: session.nickname, email: session.email }
            : null
        }
      />
    </div>
  );
}
