import { EstimacionPlay } from "../EstimacionPlay";

export const metadata = { title: "Jugando · Estimaciones" };

export default function EstimacionesJugarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-10">
      <EstimacionPlay />
    </div>
  );
}
