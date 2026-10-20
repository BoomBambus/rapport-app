/** Menge mit deutschem Komma, max. 2 Nachkommastellen. */
export const fmt = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');
/** Stunden immer mit einer Nachkommastelle: 6,5 */
export const fmtStd = (n: number) => n.toFixed(1).replace('.', ',');

const pad = (n: number) => String(n).padStart(2, '0');

export const isoDate = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** 2026-10-20 → 20.10.2026 */
export const deDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};
export const uhrzeit = (d = new Date()) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
/** Dienstag, 20. Oktober */
export const langDatum = (d = new Date()) => d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));

/** Zahl aus Eingabe wie „2,5“ lesen. */
export const parseZahl = (s: string) => parseFloat(String(s).replace(',', '.'));
