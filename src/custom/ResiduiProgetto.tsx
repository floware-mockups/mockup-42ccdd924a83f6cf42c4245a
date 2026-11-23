// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ResiduiProgetto");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ResiduiProgetto");
import { useState } from "react";
import { Card, TextInput, useTable, type SectionProps } from "../floware";

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
  const impegniValidi = impegni.every((n) => (__mk(), isFinite(n)));
  const liquidazioniValide = liquidazioni.every((n) => (__mk(), isFinite(n)));
  const impegnato = impegni.reduce((somma, n) => (__mk(), somma + n), 0);
  const liquidato = liquidazioni.reduce((somma, n) => (__mk(), somma + n), 0);
  const iniziale = importo(budget);
  const budgetValido = budget.trim() !== "" && isFinite(iniziale) && iniziale >= 0;
  const residuo = iniziale - impegnato;
  const euro = (n) => (__mk(), new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n));
  return <Card title="Budget e residui del progetto"><div className="space-y-4">
    <TextInput label="Budget iniziale di progetto (€)" value={budget} onChange={setBudget} placeholder="Es. 60.000,00" />
    <p className="text-sm text-(--mk-muted)">Usa il formato italiano, per esempio 1.234,50. Il budget iniziale non è presente nei dati di partenza.</p>
    {budget.trim() !== "" && !budgetValido && <p className="text-(--mk-danger)">Indicare un budget numerico maggiore o uguale a zero.</p>}
    <div className="grid gap-4 md:grid-cols-3">
      <Card title="Totale impegnato"><p className="text-2xl font-semibold text-(--mk-text)">{impegniValidi ? euro(impegnato) : "Importi da correggere"}</p><p className="text-sm text-(--mk-muted)">Somma del campo Importo impegnato.</p></Card>
      <Card title="Totale liquidato"><p className="text-2xl font-semibold text-(--mk-text)">{liquidazioniValide ? euro(liquidato) : "Importi da correggere"}</p><p className="text-sm text-(--mk-muted)">Somma del campo Importo liquidato.</p></Card>
      <Card title="Residuo del budget iniziale"><div className="space-y-2"><p className={budgetValido && impegniValidi && residuo < 0 ? "text-2xl font-semibold text-(--mk-danger)" : "text-2xl font-semibold text-(--mk-text)"}>{!budgetValido ? "Indicare il budget" : !impegniValidi ? "Importi da correggere" : euro(residuo)}</p><p className="text-sm">Budget iniziale usato: <strong>{budgetValido ? euro(iniziale) : "Non impostato"}</strong></p><p className="text-sm text-(--mk-muted)">{budgetValido && impegniValidi ? euro(iniziale) + " − " + euro(impegnato) + " = " + euro(residuo) : "Budget iniziale − totale impegnato"}</p>{budgetValido && impegniValidi && residuo < 0 && <p className="text-sm text-(--mk-danger)">Budget iniziale superato.</p>}</div></Card>
    </div>
    {(!impegniValidi || !liquidazioniValide) && <p className="text-(--mk-danger)">Correggere gli importi non numerici nel Registro spese.</p>}
    <p className="text-sm text-(--mk-muted)">Totali aggiornati su tutte le righe del Registro spese, anche dopo aggiunte o rimozioni. Gli importi vuoti valgono zero. Dati e budget restano solo in memoria.</p>
  </div></Card>;
}
