// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ScadenzaFattura");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ScadenzaFattura");
import { useTable, type CellProps } from "../floware";

export default function ScadenzaFattura({ pageId, rowIndex, value }: CellProps) {__mk();
  const table = useTable(pageId);
  const testo = table && table.column("N. e data fattura") >= 0 ? table.value(rowIndex, "N. e data fattura") : "";
  const parti = testo.split(" — ");
  const p = (parti[1] || "").trim().split("/");
  const data = new Date(p.length === 3 ? p[2] + "-" + p[1] + "-" + p[0] + "T12:00:00" : "");
  const valida = !isNaN(data.getTime());
  if (valida) data.setDate(data.getDate() + 30);
  return <div className="space-y-1"><div>{value}</div><div className="text-sm text-(--mk-muted)">{valida ? "Termine calcolato: " + data.toLocaleDateString("it-IT") : "Indicare la data fattura nel dettaglio"}</div></div>;
}
