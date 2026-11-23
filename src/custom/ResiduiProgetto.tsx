// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ResiduiProgetto");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ResiduiProgetto");
import { useState } from "react";
import { Card, TextInput, Button, Badge, useTable, usePrototype, type SectionProps } from "../floware";

function importo(testo) {__mk();
  const pulito = testo.replaceAll("€", "").split(".").join("").replace(",", ".").trim();
  return pulito === "" ? 0 : Number(pulito);
}

export default function ResiduiProgetto({ pageId }: SectionProps) {__mk();
  const table = useTable(pageId);
  const { openDetail } = usePrototype();
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
  const stati = table.rows.map((riga, i) => {__mk();
    const presente = table.value(riga, "Importo impegnato").trim() !== "" && table.value(riga, "Importo liquidato").trim() !== "";
    const valido = presente && isFinite(impegni[i]) && isFinite(liquidazioni[i]);
    return { valido, concluso: valido && liquidazioni[i] >= impegni[i] };
  });
  return <div className="space-y-4"><Card title="Budget e residui del progetto"><div className="space-y-4">
    <TextInput label="Budget iniziale di progetto (€)" value={budget} onChange={setBudget} placeholder="Es. 60.000,00" />
    <p className="text-sm text-(--mk-muted)">Usa il formato italiano, per esempio 1.234,50. Il budget iniziale non è presente nei dati di partenza.</p>
    {budget.trim() !== "" && !budgetValido && <p className="text-(--mk-danger)">Indicare un budget numerico maggiore o uguale a zero.</p>}
    <div className="grid gap-4 md:grid-cols-3">
      <Card title="Totale impegnato"><p className="text-2xl font-semibold">{impegniValidi ? euro(impegnato) : "Importi da correggere"}</p><p className="text-sm text-(--mk-muted)">Somma del campo Importo impegnato.</p></Card>
      <Card title="Totale liquidato"><p className="text-2xl font-semibold">{liquidazioniValide ? euro(liquidato) : "Importi da correggere"}</p><p className="text-sm text-(--mk-muted)">Somma del campo Importo liquidato.</p></Card>
      <Card title="Residuo del budget iniziale"><div className="space-y-2"><p className={budgetValido && impegniValidi && residuo < 0 ? "text-2xl font-semibold text-(--mk-danger)" : "text-2xl font-semibold text-(--mk-text)"}>{!budgetValido ? "Indicare il budget" : !impegniValidi ? "Importi da correggere" : euro(residuo)}</p><p className="text-sm">Budget iniziale usato: <strong>{budgetValido ? euro(iniziale) : "Non impostato"}</strong></p><p className="text-sm text-(--mk-muted)">{budgetValido && impegniValidi ? euro(iniziale) + " − " + euro(impegnato) + " = " + euro(residuo) : "Budget iniziale − totale impegnato"}</p>{budgetValido && impegniValidi && residuo < 0 && <p className="text-sm text-(--mk-danger)">Budget iniziale superato.</p>}</div></Card>
    </div>
    {(!impegniValidi || !liquidazioniValide) && <p className="text-(--mk-danger)">Correggere gli importi non numerici nel Registro spese.</p>}
    <p className="text-sm text-(--mk-muted)">Totali aggiornati su tutte le righe. Nei totali gli importi vuoti valgono zero. Dati e budget restano in memoria.</p>
  </div></Card>
  <Card title="Avanzamento degli affidamenti"><div className="space-y-3">
    <p>Le righe con sfondo evidenziato indicano un importo liquidato maggiore o uguale all’impegnato. Il confronto numerico si aggiorna a ogni modifica.</p>
    <Badge tone="primary">Conclusi: {stati.filter((stato) => (__mk(), stato.concluso)).length} di {table.rows.length}</Badge>
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-(--mk-subtle) text-(--mk-text)"><tr><th className="p-3 text-left">Affidamento</th><th className="p-3 text-left">Importo impegnato</th><th className="p-3 text-left">Importo liquidato</th><th className="p-3 text-left">Esito</th><th className="p-3 text-left">Dettaglio</th></tr></thead><tbody>
    {table.rows.map((riga, i) => (__mk(), <tr key={i} className={stati[i].concluso ? "bg-(--mk-primary) text-(--mk-on-primary)" : "bg-(--mk-surface) text-(--mk-text)"}>
      <td className="p-3 border-b border-(--mk-divider)">{table.column("Affidamento") >= 0 ? table.value(riga, "Affidamento") : "Affidamento"}</td>
      <td className="p-3 border-b border-(--mk-divider)">{table.value(riga, "Importo impegnato")}</td>
      <td className="p-3 border-b border-(--mk-divider)">{table.value(riga, "Importo liquidato")}</td>
      <td className="p-3 border-b border-(--mk-divider)">{stati[i].concluso ? "Concluso" : stati[i].valido ? "Da completare" : "Importi da verificare"}</td>
      <td className="p-3 border-b border-(--mk-divider)"><Button variant="secondary" onClick={() => (__mk(), openDetail(pageId, i))}>Apri</Button></td>
    </tr>))}
    </tbody></table></div>
    {table.rows.length === 0 && <p>Nessun affidamento presente.</p>}
    <p className="text-sm text-(--mk-muted)">Importi vuoti o non validi non attivano l’evidenziazione. Il riepilogo usa esclusivamente i dati del Registro spese.</p>
  </div></Card></div>;
}
