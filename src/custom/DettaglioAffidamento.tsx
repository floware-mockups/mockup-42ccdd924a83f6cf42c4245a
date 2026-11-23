// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("DettaglioAffidamento");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("DettaglioAffidamento");
import { useState } from "react";
import { Drawer, Button, Field, TextInput, Card, useTable, usePrototype, type DetailProps } from "../floware";

export default function DettaglioAffidamento({ pageId, rowIndex, close }: DetailProps) {__mk();
  const table = useTable(pageId);
  const preventivi = useTable("preventivi");
  const fatture = useTable("fatture-liquidazioni");
  const { notify, openDetail } = usePrototype();
  const chiavi = ["Progetto", "Ditta", "Servizio"];
  const valido = Boolean(table && table.rows[rowIndex] && chiavi.every((nome) => (__mk(), table.column(nome) >= 0 && table.value(rowIndex, nome).trim() !== "")));
  const trovati = preventivi && valido && chiavi.every((nome) => (__mk(), preventivi.column(nome) >= 0)) ? preventivi.rows.map((riga, indice) => ((__mk(), { riga, indice }))).filter((e) => (__mk(), chiavi.every((nome) => (__mk(), preventivi.value(e.riga, nome) === table.value(rowIndex, nome))))) : [];
  const indice = trovati.length === 1 ? trovati[0].indice : -1;
  const [importo, setImporto] = useState(preventivi && indice >= 0 && preventivi.column("Importo preventivo") >= 0 ? preventivi.value(indice, "Importo preventivo") : "");
  const [riferimento, setRiferimento] = useState(preventivi && indice >= 0 && preventivi.column("Riferimento preventivo") >= 0 ? preventivi.value(indice, "Riferimento preventivo") : "");
  if (!table || !table.rows[rowIndex]) return <Drawer title="Affidamento non disponibile" onClose={close}><Button onClick={close}>Chiudi</Button></Drawer>;
  const modificabile = valido && preventivi && chiavi.every((nome) => (__mk(), preventivi.column(nome) >= 0)) && preventivi.column("Importo preventivo") >= 0 && preventivi.column("Riferimento preventivo") >= 0 && trovati.length <= 1;
  const collegabile = valido && fatture && chiavi.every((nome) => (__mk(), fatture.column(nome) >= 0));
  const collegate = collegabile ? fatture.rows.map((riga, indice) => ((__mk(), { riga, indice }))).filter((e) => (__mk(), chiavi.every((nome) => (__mk(), fatture.value(e.riga, nome) === table.value(rowIndex, nome))))) : [];
  function salva() {__mk();
    if (!modificabile || !preventivi) return;
    if (indice >= 0) {
      preventivi.setCell(indice, "Importo preventivo", importo.trim());
      preventivi.setCell(indice, "Riferimento preventivo", riferimento.trim());
    } else {
      preventivi.addRow({ "Progetto": table.value(rowIndex, "Progetto"), "Ditta": table.value(rowIndex, "Ditta"), "Servizio": table.value(rowIndex, "Servizio"), "Importo preventivo": importo.trim(), "Riferimento preventivo": riferimento.trim() });
    }
    notify("Preventivo aggiornato in memoria.");
    close();
  }
  return <Drawer title="Dettaglio affidamento" onClose={close} footer={<><Button variant="secondary" onClick={close}>Chiudi</Button><Button onClick={salva} disabled={!modificabile}>Salva preventivo</Button></>}>
    <div className="space-y-4">
      <Card title="Affidamento e importi registrati"><div className="grid gap-3 sm:grid-cols-2">{table.columns.map((nome) => (__mk(), <Field key={nome} label={nome}>{table.value(rowIndex, nome) || "—"}</Field>))}</div></Card>
      <Card title="Preventivo dell’affidamento">
        <p className="text-sm text-(--mk-muted)">Il preventivo è collegato per progetto, ditta e servizio. Il salvataggio non modifica impegni e liquidazioni.</p>
        {modificabile ? <div className="space-y-3"><TextInput label="Riferimento preventivo" value={riferimento} onChange={setRiferimento} placeholder="PREV-24-011" /><TextInput label="Importo preventivo" value={importo} onChange={setImporto} placeholder="€ 12.000" /></div> : <p>Controllare le colonne di collegamento o eventuali preventivi duplicati nella pagina Preventivi.</p>}
      </Card>
      <Card title="Fatture e liquidazioni collegate">
        <p className="text-sm text-(--mk-muted)">Solo registrazioni dello stesso progetto, ditta e servizio. Gli importi elencati non sostituiscono il totale liquidato del Registro spese.</p>
        {!collegabile && <p>Colonne di collegamento non disponibili.</p>}
        {collegabile && collegate.length === 0 && <p>Nessuna registrazione collegata.</p>}
        {fatture && collegate.map((e) => (__mk(), <div key={e.indice} className="my-3 space-y-2 rounded border border-(--mk-border) p-3">{["N. fattura", "Importo fattura", "N. determina liquidazione", "Importo liquidato", "Controllo"].filter((nome) => (__mk(), fatture.column(nome) >= 0)).map((nome) => (__mk(), <Field key={nome} label={nome}>{fatture.value(e.riga, nome) || "—"}</Field>))}<Button variant="link" onClick={() => {__mk(); close(); openDetail("fatture-liquidazioni", e.indice); }}>Apri registrazione</Button></div>))}
      </Card>
    </div>
  </Drawer>;
}
