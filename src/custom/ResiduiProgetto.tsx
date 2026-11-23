// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ResiduiProgetto");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ResiduiProgetto");
import { useState } from "react";
import { Card, Field, TextInput, useTable, type SectionProps } from "../floware";

function importo(testo) {__mk();
  const pulito = testo.replaceAll("€", "").split(".").join("").replace(",", ".").trim();
  return pulito === "" ? 0 : Number(pulito);
}

export default function ResiduiProgetto({ pageId }: SectionProps) {__mk();
  const table = useTable(pageId);
  const [budget, setBudget] = useState("");
  if (!table) return null;
  if (table.column("Importo impegnato") < 0 || table.column("Importo liquidato") < 0) return <p>Colonne degli importi non disponibili.</p>;
  const impegni = table.rows.map((riga) => (__mk(), importo(table.value(riga, "Importo impegnato"))));
  const liquidazioni = table.rows.map((riga) => (__mk(), importo(table.value(riga, "Importo liquidato"))));
  const validi = impegni.every((n) => (__mk(), isFinite(n))) && liquidazioni.every((n) => (__mk(), isFinite(n)));
  const impegnato = impegni.reduce((somma, n) => (__mk(), somma + n), 0);
  const liquidato = liquidazioni.reduce((somma, n) => (__mk(), somma + n), 0);
  const totale = importo(budget);
  const budgetValido = budget.trim() !== "" && isFinite(totale) && totale >= 0;
  const euro = (n) => (__mk(), new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n));
  return <Card title="Budget e residui del progetto"><div className="space-y-4">
    <TextInput label="Budget totale del progetto (€)" value={budget} onChange={setBudget} placeholder="Es. 60.000,00" />
    <p className="text-sm text-(--mk-muted)">Indica il budget totale, non presente nei dati iniziali. Usa importi nel formato italiano, per esempio 1.234,50. I campi vuoti valgono zero.</p>
    {!validi ? <p className="text-(--mk-danger)">Correggere gli importi non numerici nel Registro spese.</p> : <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Totale impegnato">{euro(impegnato)}</Field>
      <Field label="Totale liquidato">{euro(liquidato)}</Field>
      <Field label="Budget residuo dopo gli impegni">{budgetValido ? euro(totale - impegnato) : "Indicare un budget valido"}</Field>
      <Field label="Residuo da liquidare (impegnato − liquidato)">{euro(impegnato - liquidato)}</Field>
      <Field label="Budget al netto delle liquidazioni">{budgetValido ? euro(totale - liquidato) : "Indicare un budget valido"}</Field>
    </div>}
    <p className="text-sm text-(--mk-muted)">Totali ricalcolati sulle righe attuali, anche dopo aggiunte o rimozioni. I valori negativi indicano un superamento. Dati e budget restano solo in memoria.</p>
  </div></Card>;
}
