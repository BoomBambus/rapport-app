// Liest Auftragsdaten aus dem OCR-Ergebnis der Rapportkarte.
//
// Aufbau der Karte (Kopf):
//   Kunde:   10868          Niemandslandstr. 1
//            (Mustermann    68229 Mannheim
//             | …)          0621 / 4829-310
//   Projekt: …
//   Auftrag: A26333         Testauftrag
//   Pos | Bezeichnung | Barcode
//   A26333-01  Rapportposition Test
//
// Gearbeitet wird mit Wort-Rahmen (x/y), damit die schmale Kundenname-Spalte und die
// Adressspalte getrennt bleiben. Fehlt etwas, bleibt das Feld leer – der Mitarbeiter prüft.
import type { Auftragsdaten } from './types';

export interface OcrWord {
  text: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
export interface OcrLine {
  text: string;
  words: OcrWord[];
}

const POS_RE = /^[A-Z]{1,3}\d{4,}-\d{1,3}$/;
const AUFTRAG_RE = /^[A-Z]{1,3}\d{4,}$/;
const PLZ_RE = /^\d{5}$/;
const TEL_RE = /^(\+|0)[\d\s/()-]{5,}$/;

/** Typische OCR-Verwechslungen in Nummern (nach dem Buchstaben-Präfix) korrigieren. */
export function fixCode(raw: string): string {
  const t = raw.trim().replace(/[.,;:]+$/, '').toUpperCase();
  const m = /^([A-Z]{1,3})(.*)$/.exec(t);
  if (!m) return t;
  const rest = m[2].replace(/[O]/g, '0').replace(/[IL|]/g, '1').replace(/[–—]/g, '-');
  return m[1] + rest;
}

/** PLZ mit typischen OCR-Fehlern: „©8229“ → „68229“, „O“ → „0“. Nur wenn ≥ 4 echte Ziffern. */
export function fixPlz(t: string): string {
  if (t.length !== 5 || (t.match(/\d/g) || []).length < 4) return t;
  return t.replace(/[©]/g, '6').replace(/[OoD]/g, '0').replace(/[lI|]/g, '1').replace(/S/g, '5').replace(/B/g, '8');
}

const clean = (lines: OcrLine[]): OcrLine[] =>
  lines
    .map((l) => ({ text: l.text, words: l.words.filter((w) => w.text.trim()) }))
    .filter((l) => l.words.length);

const isLabel = (w: OcrWord, name: string) => new RegExp(`^${name}:?$`, 'i').test(w.text.trim());
const wordH = (w: OcrWord) => w.y1 - w.y0;
const join = (ws: OcrWord[]) => ws.map((w) => w.text).join(' ').replace(/\s+/g, ' ').trim();

/** Teilt Wörter einer Zeile an großen Lücken (Spaltenwechsel). */
function segments(words: OcrWord[]): OcrWord[][] {
  const sorted = [...words].sort((a, b) => a.x0 - b.x0);
  const out: OcrWord[][] = [];
  sorted.forEach((w, i) => {
    const prev = sorted[i - 1];
    const gap = prev ? w.x0 - prev.x1 : 0;
    if (!prev || gap > Math.max(wordH(w), wordH(prev)) * 1.6) out.push([w]);
    else out[out.length - 1].push(w);
  });
  return out;
}

/** Umbrochene Zeilen zusammenfügen: „Musterman“ + „n“ → „Mustermann“. */
function joinWrapped(parts: string[]): string {
  let s = '';
  for (const p of parts) {
    if (!s) s = p;
    else if (/\p{L}$/u.test(s) && /^\p{Ll}/u.test(p)) s += p;
    else s += ' ' + p;
  }
  return s
    .replace(/\s*\|\s*/g, ' | ')
    .replace(/^\(\s*/, '')
    .replace(/\s*\)$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseCard(rawLines: OcrLine[], barcode?: string | null): Partial<Auftragsdaten> {
  const lines = clean(rawLines);
  const out: Partial<Auftragsdaten> = {};
  const all = lines.flatMap((l) => l.words);

  const findLabel = (name: string) => {
    for (const l of lines) {
      const i = l.words.findIndex((w) => isLabel(w, name));
      if (i >= 0) return { line: l, idx: i, word: l.words[i] };
    }
    return null;
  };

  // Position: Barcode hat Vorrang, sonst Muster A26333-01 im Text.
  const posFromBarcode = barcode ? fixCode(barcode) : null;
  let posLine: OcrLine | null = null;
  let posWord: OcrWord | null = null;
  for (const l of lines) {
    for (const w of l.words) {
      const c = fixCode(w.text);
      if (POS_RE.test(c) && (!posFromBarcode || c === posFromBarcode)) {
        posLine = l;
        posWord = w;
        break;
      }
    }
    if (posLine) break;
  }
  if (posFromBarcode) out.pos = posFromBarcode;
  else if (posWord) out.pos = fixCode(posWord.text);
  if (posLine && posWord) {
    const rest = segments(posLine.words.filter((w) => w.x0 > posWord!.x1));
    if (rest.length) out.posText = join(rest[0]);
  }

  // Auftrag: Nummer nach „Auftrag:“, Rest der Zeile ist die Bezeichnung.
  const auf = findLabel('Auftrag');
  if (auf) {
    const after = auf.line.words.slice(auf.idx + 1);
    const nrIdx = after.findIndex((w) => AUFTRAG_RE.test(fixCode(w.text)));
    if (nrIdx >= 0) {
      out.auftrag = fixCode(after[nrIdx].text);
      const txt = after.slice(nrIdx + 1);
      if (txt.length) out.auftragText = join(segments(txt)[0]);
    }
  }
  if (!out.auftrag && out.pos) out.auftrag = out.pos.split('-')[0];

  // Projekt: Text nach „Projekt:“ in derselben Zeile.
  const prj = findLabel('Projekt');
  if (prj) {
    const after = prj.line.words.slice(prj.idx + 1);
    if (after.length) out.projekt = join(segments(after)[0]);
  }

  // Kunde: Nummer, Namensspalte darunter, Adressspalte rechts daneben.
  const kd = findLabel('Kunde');
  if (kd) {
    const after = kd.line.words.slice(kd.idx + 1);
    const nr = after.find((w) => /^\d{3,8}$/.test(w.text.replace(/[^\d]/g, '')) && /^\(?\d/.test(w.text));
    if (nr) out.kundeNr = nr.text.replace(/[^\d]/g, '');
    const top = kd.word.y0 - wordH(kd.word) * 0.5;
    const bottomWord = prj?.word ?? auf?.word;
    const bottom = bottomWord ? bottomWord.y0 - 2 : top + wordH(kd.word) * 8;
    const nameX = nr ? nr.x0 : kd.word.x1;
    const inBlock = all.filter((w) => w.y0 >= top && w.y1 <= bottom + wordH(w) && w.y0 < bottom);

    // Adressspalte: zweite Wortgruppe in der Kunde-Zeile (nach großer Lücke), sonst über die PLZ.
    const kdSeg = segments(after);
    const plz = inBlock.find((w) => PLZ_RE.test(fixPlz(w.text)) && w.x0 > nameX + 20);
    const addrStart = kdSeg.length > 1 ? kdSeg[1][0] : plz;
    const addrX = addrStart ? addrStart.x0 : Infinity;
    const tol = addrStart ? wordH(addrStart) : wordH(kd.word);

    // Zeilen im Block (OCR-Zeilen) getrennt nach Spalte.
    const nameParts: string[] = [];
    const addrParts: string[] = [];
    for (const l of lines) {
      const ws = l.words.filter((w) => inBlock.includes(w));
      if (!ws.length) continue;
      const nameWs = ws.filter((w) => w.x0 >= nameX - tol * 2 && w.x1 < addrX - tol * 0.5 && w !== nr && w !== kd.word);
      if (nameWs.length) nameParts.push(join(nameWs));
      const addrWs = ws.filter((w) => w.x0 >= addrX - tol);
      if (addrWs.length) addrParts.push(join(segments(addrWs)[0]));
    }
    const name = joinWrapped(nameParts);
    if (name) out.kunde = name;

    for (const raw of addrParts) {
      const [first, ...rest] = raw.split(' ');
      const a = PLZ_RE.test(fixPlz(first)) && rest.length ? [fixPlz(first), ...rest].join(' ') : raw;
      if (!out.ort && /^\d{5}\s+\S/.test(a)) out.ort = a;
      else if (!out.tel && TEL_RE.test(a) && (a.match(/\d/g) || []).length >= 6) out.tel = a.replace(/\s*\/\s*/, ' / ');
      else if (!out.strasse && !out.ort && /\p{L}/u.test(a)) out.strasse = a;
    }
  }

  // Rückfall ohne Spaltenerkennung: Regeln über den Fließtext.
  const text = lines.map((l) => l.text).join('\n');
  if (!out.ort) {
    const m = /\b(\d{5})\s+([A-ZÄÖÜ][\p{L}.\- ]+?)(?=\s{2,}|\n|$)/mu.exec(text);
    if (m) out.ort = `${m[1]} ${m[2].trim()}`;
  }
  if (!out.tel) {
    const m = /\b(0\d{2,5}\s*\/\s*[\d -]{3,}\d)/.exec(text);
    if (m) out.tel = m[1].replace(/\s*\/\s*/, ' / ');
  }

  // Linien und Rahmen der Tabelle werden gern als „_“, „|“ oder „—“ mitgelesen
  for (const k of Object.keys(out) as (keyof Auftragsdaten)[]) {
    const v = (out[k] ?? '').replace(/^[\s_|—–\-.,:;'"`~]+/, '').replace(/[\s_|—–\-,:;'"`~]+$/, '');
    if (v) out[k] = v;
    else delete out[k];
  }
  return out;
}

/** Tesseract-Seite → Zeilen mit Wort-Rahmen. */
export function linesFromTesseract(page: { blocks: Array<{ paragraphs: Array<{ lines: Array<{ text: string; words: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }> }> }> }> | null }): OcrLine[] {
  const out: OcrLine[] = [];
  for (const b of page.blocks || [])
    for (const p of b.paragraphs)
      for (const l of p.lines)
        out.push({ text: l.text.replace(/\n$/, ''), words: l.words.map((w) => ({ text: w.text, ...w.bbox })) });
  return out;
}
