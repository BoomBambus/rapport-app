// Liest Auftragsdaten aus dem OCR-Ergebnis der Rapportkarte.
//
// Aufbau der Karte (Kopf):
//   Kunde:   10868          Niemandslandstr. 1
//            (Mustermann    68229 Mannheim
//             | …)          0621 / 4829-310
//   Projekt: …
//   Auftrag: A26333         Testauftrag
//   Pos | Beschreibung / Menge | Barcode
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

// Beschriftung, auch wenn die OCR den ersten Buchstaben verschluckt („rojekt:“)
const isLabel = (w: OcrWord, name: string) => new RegExp(`^(${name}|${name.slice(1)}):?$`, 'i').test(w.text.trim());
const STRASSE_RE = /(str\.?|straße|strasse|weg|platz|gasse|allee|ring|damm|ufer|steig|berg|hof)\b/i;
const yMitte = (w: OcrWord) => (w.y0 + w.y1) / 2;
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

  // Kunde: an der Adressspalte ausrichten. Die PLZ wird am zuverlässigsten erkannt; das kleine,
  // graue „Kunde:“ geht im Kamerabild oft verloren und dient nur als Zusatzhinweis.
  const kd = findLabel('Kunde');
  const grenze = (prj?.word ?? auf?.word)?.y0 ?? Infinity;
  const plzK = lines
    .flatMap((l) => l.words.map((w, i) => ({ l, w, i })))
    .filter(({ l, w, i }) => {
      const nach = l.words[i + 1];
      return PLZ_RE.test(fixPlz(w.text)) && nach && /^\p{Lu}/u.test(nach.text) && !STRASSE_RE.test(nach.text) && w.y0 < grenze;
    })
    .sort((x, y) => x.w.y0 - y.w.y0)[0];

  if (plzK) {
    const plz = plzK.w;
    const h = wordH(plz);
    const addrX = plz.x0;
    const inSpalte = (l: OcrLine) => {
      const ws = l.words.filter((w) => w.x0 >= addrX - h && w.x0 < addrX + h * 30);
      return ws.length ? segments(ws)[0] : [];
    };
    // Ort: PLZ und folgende Wörter
    const ortWs = segments(plzK.l.words.slice(plzK.i))[0];
    out.ort = [fixPlz(ortWs[0].text), ...ortWs.slice(1).map((w) => w.text)].join(' ');
    // Straße: nächste Zeile darüber in derselben Spalte
    const oben = lines
      .map((l) => ({ l, ws: inSpalte(l) }))
      .filter(({ ws }) => ws.length && yMitte(ws[0]) < plz.y0 - h * 0.3 && yMitte(ws[0]) > plz.y0 - h * 2.8 && /\p{L}/u.test(join(ws)))
      .sort((x, y) => yMitte(y.ws[0]) - yMitte(x.ws[0]))[0];
    if (oben) out.strasse = join(oben.ws);
    // Telefon: Zeile darunter
    const unten = lines
      .map((l) => inSpalte(l))
      .find((ws) => ws.length && yMitte(ws[0]) > plz.y1 + h * 0.2 && yMitte(ws[0]) < plz.y1 + h * 2.8 && TEL_RE.test(join(ws)) && (join(ws).match(/\d/g) || []).length >= 6);
    if (unten) out.tel = join(unten).replace(/\s*\/\s*/, ' / ');
    // Kunden-Nr.: Zahl links der Adressspalte, auf Höhe der Straße (bzw. nach „Kunde:“)
    const hoehe = oben ? yMitte(oben.ws[0]) : plz.y0 - h * 1.3;
    const nrKand = all.filter(
      (w) => /^\(?\d{3,8}\)?$/.test(w.text) && w.x1 < addrX - h && Math.abs(yMitte(w) - hoehe) < h * 1.3 && (!kd || w.x0 > kd.word.x0),
    );
    const nr = nrKand.sort((x, y) => y.x1 - x.x1)[0];
    if (nr) out.kundeNr = nr.text.replace(/[^\d]/g, '');
    // Name: schmale Spalte unter der Nummer bis vor Projekt/Auftrag
    const nameX = nr ? nr.x0 : kd ? kd.word.x1 + h : -Infinity;
    const start = nr ? nr.y1 - h * 0.3 : hoehe + h * 0.5;
    const ende = Math.min(grenze, plz.y1 + h * 7);
    const teile: string[] = [];
    for (const l of lines) {
      const ws = l.words.filter(
        (w) => w !== nr && w !== kd?.word && w.x0 >= nameX - h * 2 && w.x1 < addrX - h * 0.5 && w.y0 >= start && w.y1 <= ende && !isLabel(w, 'Kunde'),
      );
      if (ws.length) teile.push(join(ws));
    }
    const name = joinWrapped(teile);
    if (name) out.kunde = name;
  } else if (kd) {
    // Ohne erkennbare PLZ: wie bisher über „Kunde:“ und die Spalten dieser Zeile
    const after = kd.line.words.slice(kd.idx + 1);
    const nr = after.find((w) => /^\d{3,8}$/.test(w.text.replace(/[^\d]/g, '')) && /^\(?\d/.test(w.text));
    if (nr) out.kundeNr = nr.text.replace(/[^\d]/g, '');
    const kdSeg = segments(after);
    if (kdSeg.length > 1 && /\p{L}/u.test(join(kdSeg[1]))) out.strasse = join(kdSeg[1]);
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

/** Plausibilität je Feld – nur solche Werte werden aus weiteren Durchgängen übernommen. */
const PLAUSIBEL: Partial<Record<keyof Auftragsdaten, (v: string) => boolean>> = {
  kundeNr: (v) => /^\d{3,8}$/.test(v),
  strasse: (v) => /\p{L}{3}/u.test(v) && /\d/.test(v),
  ort: (v) => /^\d{5}\s+\p{Lu}\p{L}{2}/u.test(v),
  tel: (v) => (v.match(/\d/g) || []).length >= 6,
  auftrag: (v) => AUFTRAG_RE.test(v),
  pos: (v) => POS_RE.test(v),
};

/** Ergebnisse mehrerer Lesedurchgänge zusammenführen: erster plausibler Wert je Feld gewinnt. */
export function zusammenfuehren(...erg: Partial<Auftragsdaten>[]): Partial<Auftragsdaten> {
  const out: Partial<Auftragsdaten> = {};
  const felder = new Set(erg.flatMap((e) => Object.keys(e))) as Set<keyof Auftragsdaten>;
  for (const k of felder) {
    const ok = PLAUSIBEL[k];
    const werte = erg.map((e) => e[k]).filter((v): v is string => !!v);
    out[k] = (ok ? werte.find(ok) : undefined) ?? werte[0];
  }
  return out;
}

/** Fehlen noch wichtige Felder? Dann lohnt ein weiterer Lesedurchgang. */
export const unvollstaendig = (d: Partial<Auftragsdaten>) =>
  (['kundeNr', 'strasse', 'ort', 'auftrag', 'pos'] as const).some((k) => !d[k] || (PLAUSIBEL[k] && !PLAUSIBEL[k]!(d[k]!)));
