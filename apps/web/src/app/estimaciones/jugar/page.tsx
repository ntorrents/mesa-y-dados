import { EstimacionPlay } from "../EstimacionPlay";

export const metadata = { title: "Jugando · Estimaciones" };

export default function EstimacionesJugarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <EstimacionPlay />
    </div>
  );
}
