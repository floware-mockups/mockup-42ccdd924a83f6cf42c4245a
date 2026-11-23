// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("DettaglioAffidamento");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("DettaglioAffidamento");
import { useState } from "react";
import { Drawer, Button, Field, TextInput, useTable, usePrototype, type DetailProps } from "../floware";

function dataIso(testo) {__mk();
  const p = testo.trim().split("/");
  return p.length === 3 ? p[2] + "-" + p[1] + "-" + p[0] : "";
}
function dataIt(testo) {__mk();
  const p = testo.split("-");
  return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : "";
}
function termine(testo) {__mk();
  if (!testo) return "";
  const d = new Date(testo + "T12:00:00");
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString("it-IT");
}

export default function DettaglioAffidamento({ pageId, rowIndex, close }: DetailProps) {__mk();
  const table = useTable(pageId);
  const { notify } = usePrototype();
  const leggi = (nome) => (__mk(), table && table.rows[rowIndex] && table.column(nome) >= 0 ? table.value(rowIndex, nome) : "");
  const fattura = leggi("N. e data fattura").split(" — ");
  const liquidazione = leggi("Scadenza e determina di liquidazione").split(" — ");
  const [valori, setValori] = useState(() => (__mk(), [leggi("Preventivo"), leggi("Importo impegnato"), leggi("N. determina impegno"), fattura[0] || "", dataIso(fattura[1] || ""), leggi("Importo liquidato"), liquidazione.length > 1 ? liquidazione.slice(1).join(" — ") : liquidazione[0] || ""]));
  const campi = ["Preventivo", "Importo impegnato", "N. determina impegno", "Numero fattura", "Data fattura", "Importo liquidato", "N. determina liquidazione"];
  const colonne = ["Preventivo", "Importo impegnato", "N. determina impegno", "N. e data fattura", "Importo liquidato", "Scadenza e determina di liquidazione"];
  if (!table || !table.rows[rowIndex]) return <Drawer title="Affidamento non disponibile" onClose={close}><Button onClick={close}>Chiudi</Button></Drawer>;
  const completo = colonne.every((nome) => (__mk(), table.column(nome) >= 0));
  const scadenza = termine(valori[4]);
  function salva() {__mk();
    if (!completo) return;
    table.setCell(rowIndex, "Preventivo", valori[0]);
    table.setCell(rowIndex, "Importo impegnato", valori[1]);
    table.setCell(rowIndex, "N. determina impegno", valori[2]);
    table.setCell(rowIndex, "N. e data fattura", valori[3] + " — " + dataIt(valori[4]));
    table.setCell(rowIndex, "Importo liquidato", valori[5]);
    table.setCell(rowIndex, "Scadenza e determina di liquidazione", (scadenza || "Da definire") + " — " + valori[6]);
    notify("Affidamento aggiornato in memoria.");
    close();
  }
  return <Drawer title="Preventivo e movimenti dell’affidamento" onClose={close} footer={<><Button variant="secondary" onClick={close}>Annulla</Button><Button onClick={salva} disabled={!completo}>Salva</Button></>}>
    <div className="space-y-4">
      <Field label="Affidamento">{leggi("Affidamento") || "—"}</Field>
      {!completo && <p>Alcune colonne richieste non sono disponibili.</p>}
      {campi.map((nome, indice) => (__mk(), <TextInput key={nome} label={nome} type={indice === 4 ? "date" : "text"} value={valori[indice]} onChange={(testo) => (__mk(), setValori((prima) => (__mk(), prima.map((v, i) => (__mk(), i === indice ? testo : v)))))} />))}
      <Field label="Scadenza liquidazione: data fattura + 30 giorni">{scadenza || "Indicare la data fattura"}</Field>
      <p className="text-sm text-(--mk-muted)">Il Registro è la fonte degli importi del riepilogo. Il salvataggio non modifica le altre pagine. Numero e data fattura restano nella stessa colonna della tabella.</p>
    </div>
  </Drawer>;
}
