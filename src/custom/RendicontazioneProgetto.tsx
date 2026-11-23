// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("RendicontazioneProgetto");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("RendicontazioneProgetto");
import { useEffect, useState } from "react";
import { Button, Card, TextArea, useTable, type SectionProps } from "../floware";

function calcolaScadenza(testo) {__mk();
  const parti = testo.replaceAll("—", " ").split(" ");
  for (const parte of parti) {__mk();
    const token = parte.trim();
    const p = token.includes("/") ? token.split("/") : token.split("-");
    if (p.length === 3) {
      const iso = p[0].length === 4;
      const giorno = Number(iso ? p[2] : p[0]);
      const mese = Number(p[1]);
      const anno = Number(iso ? p[0] : p[2]);
      if (anno >= 1900 && anno <= 9999 && mese >= 1 && mese <= 12 && giorno >= 1 && giorno <= 31) {
        const data = new Date(Date.UTC(anno, mese - 1, giorno));
        if (data.getUTCFullYear() === anno && data.getUTCMonth() === mese - 1 && data.getUTCDate() === giorno) {
          data.setUTCDate(data.getUTCDate() + 30);
          return data.toLocaleDateString("it-IT", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });
        }
      }
    }
  }
  return "Da definire: data fattura assente o non valida";
}

function numero(testo) {__mk();
  const pulito = testo.replaceAll("€", "").split(".").join("").replace(",", ".").trim();
  return pulito === "" ? 0 : Number(pulito);
}

export default function RendicontazioneProgetto({ pageId }: SectionProps) {__mk();
  const table = useTable(pageId);
  const [testo, setTesto] = useState("");
  useEffect(() => {__mk();
    if (!table || table.column("N. e data fattura") < 0 || table.column("Scadenza pagamento") < 0) return;
    table.rows.forEach((riga, indice) => {__mk();
      const scadenza = calcolaScadenza(table.value(riga, "N. e data fattura"));
      if (table.value(riga, "Scadenza pagamento") !== scadenza) table.setCell(indice, "Scadenza pagamento", scadenza);
    });
  }, [table]);
  if (!table) return null;
  const richieste = ["Affidamento", "Preventivo", "Importo impegnato", "N. determina impegno", "N. e data fattura", "Importo liquidato", "Scadenza pagamento", "N. determina di liquidazione"];
  const mancanti = richieste.filter((nome) => (__mk(), table.column(nome) < 0));
  function genera() {__mk();
    const leggi = (riga, nome) => (__mk(), table.column(nome) >= 0 ? table.value(riga, nome) || "Non indicato" : "Colonna non disponibile");
    const euro = (n) => (__mk(), new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n));
    const impegni = table.rows.map((riga) => (__mk(), numero(table.value(riga, "Importo impegnato"))));
    const liquidazioni = table.rows.map((riga) => (__mk(), numero(table.value(riga, "Importo liquidato"))));
    const validi = impegni.every((n) => (__mk(), isFinite(n))) && liquidazioni.every((n) => (__mk(), isFinite(n)));
    const impegnato = impegni.reduce((somma, n) => (__mk(), somma + n), 0);
    const liquidato = liquidazioni.reduce((somma, n) => (__mk(), somma + n), 0);
    const dettagli = table.rows.map((riga, indice) => (__mk(), [
      String(indice + 1) + ". Affidamento: " + leggi(riga, "Affidamento") + ".",
      "Preventivo: " + leggi(riga, "Preventivo") + ".",
      "Importo impegnato: " + leggi(riga, "Importo impegnato") + "; determina di impegno: " + leggi(riga, "N. determina impegno") + ".",
      "Fattura (numero e data): " + leggi(riga, "N. e data fattura") + ".",
      "Scadenza pagamento: " + calcolaScadenza(leggi(riga, "N. e data fattura")) + " (30 giorni di calendario dalla data fattura).",
      "Importo liquidato: " + leggi(riga, "Importo liquidato") + "; determina di liquidazione: " + leggi(riga, "N. determina di liquidazione") + "."
    ].join("\n")));
    const riepilogo = validi ? "Totale impegnato: " + euro(impegnato) + ". Totale liquidato: " + euro(liquidato) + ". Residuo da liquidare: " + euro(impegnato - liquidato) + "." : "Totali non calcolabili: verificare gli importi nel Registro spese.";
    setTesto(["RENDICONTAZIONE DEL PROGETTO ESPOSITIVO", "Bozza dimostrativa generata dal Registro spese. Comprende tutte le " + table.rows.length + " registrazioni presenti al momento della generazione.", riepilogo, dettagli.join("\n\n"), "Le informazioni riportate provengono esclusivamente dal Registro spese; le altre pagine non sono sommate. Dati inventati, conservati solo in memoria."].join("\n\n"));
  }
  return <Card title="Rendicontazione dell’intero progetto"><div className="space-y-4">
    <p>La scadenza si aggiorna automaticamente anche dopo modifiche e aggiunte. La determina di liquidazione resta separata.</p>
    {mancanti.length > 0 && <p className="text-(--mk-danger)">Colonne mancanti: {mancanti.join(", ")}.</p>}
    <Button onClick={genera} disabled={mancanti.length > 0}>{testo ? "Rigenera rendicontazione" : "Genera rendicontazione"}</Button>
    {testo && <><TextArea label="Testo di rendicontazione modificabile" value={testo} onChange={setTesto} rows={18} /><p className="text-sm text-(--mk-muted)">Puoi selezionare e copiare il testo. Dopo modifiche alla tabella, rigeneralo per aggiornare la bozza: le modifiche manuali al testo saranno sostituite.</p></>}
  </div></Card>;
}
