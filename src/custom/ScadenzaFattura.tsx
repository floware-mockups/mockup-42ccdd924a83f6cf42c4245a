// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ScadenzaFattura");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ScadenzaFattura");
import { type CellProps } from "../floware";

export default function ScadenzaFattura({ value }: CellProps) {__mk();
  return <div className="space-y-1"><div>{value}</div><p className="text-sm text-(--mk-muted)">Data fattura + 30 giorni</p></div>;
}
