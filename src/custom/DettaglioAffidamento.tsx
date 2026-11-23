// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("DettaglioAffidamento");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("DettaglioAffidamento");
import { useState } from "react";
import { Drawer, Button, Field, TextInput, useTable, usePrototype, type DetailProps } from "../floware";

export default function DettaglioAffidamento({ pageId, rowIndex, close }: DetailProps) {__mk();
  const table = useTable(pageId);
  const { notify } = usePrototype();
  const campi = ["Affidamento", "Preventivo", "Importo impegnato", "N. determina impegno", "N. e data fattura", "Importo liquidato", "N. determina di liquidazione"];
  const [valori, setValori] = useState(() => (__mk(), campi.map((nome) => (__mk(), table && table.column(nome) >= 0 && table.rows[rowIndex] ? table.value(rowIndex, nome) : ""))));
  if (!table || !table.rows[rowIndex]) return <Drawer title="Affidamento non disponibile" onClose={close}><Button onClick={close}>Chiudi</Button></Drawer>;
  const completo = campi.every((nome) => (__mk(), table.column(nome) >= 0));
  function salva() {__mk();
    if (!completo) return;
    campi.forEach((nome, i) => (__mk(), table.setCell(rowIndex, nome, valori[i])));
    notify("Affidamento aggiornato in memoria.");
    close();
  }
  return <Drawer title="Dati dell’affidamento" onClose={close} footer={<><Button variant="secondary" onClick={close}>Annulla</Button><Button onClick={salva} disabled={!completo}>Salva</Button></>}><div className="space-y-4">
    {!completo && <p>Alcune colonne richieste non sono disponibili.</p>}
    {campi.map((nome, i) => (__mk(), <TextInput key={nome} label={nome} value={valori[i]} onChange={(testo) => (__mk(), setValori((prima) => (__mk(), prima.map((v, indice) => (__mk(), indice === i ? testo : v)))))} />))}
    <Field label="Scadenza pagamento">Calcolata automaticamente al salvataggio: data fattura + 30 giorni di calendario.</Field>
    <p className="text-sm text-(--mk-muted)">Nel campo fattura usa il formato «FAT-2024-044 — 16/10/2024». La determina di liquidazione rimane un campo distinto. Le modifiche riguardano solo il Registro spese.</p>
  </div></Drawer>;
}
