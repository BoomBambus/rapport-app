// QR-Code auf der Rapportkarte: enthält die Auftragsdaten, damit keine Texterkennung nötig ist.
// Festgelegtes Format der Karte (Oktober 2026), siehe docs/QR-Code-Rapportkarte.md:
//   Kunde - … ; Straße - … ; PLZ Ort - … ; Auftragsnr - … ; Auftragsbez … ; Pos - … ; Posbez …
// Daneben weiter verstanden: das ältere Vorschlagsformat:
//
//   RAPPORT
//   KUNDENNR=10868
//   KUNDE=Mustermann GmbH
//   STRASSE=Niemandslandstr. 1
//   PLZ=68229
//   ORT=Mannheim
//   ...
//
// Toleriert: Groß-/Kleinschreibung, Trenner „-“, „=“, „:“ oder keiner, „;“ oder Zeilenumbruch, JSON.
import type { Auftragsdaten } from './types';

// Schlüssel → Feld. Leer- und Sonderzeichen in Schlüsseln werden vor dem Vergleich entfernt
// („PLZ Ort“ → PLZORT, „Kunden-Nr.“ → KUNDENNR).
const SCHLUESSEL: Record<string, keyof Auftragsdaten | 'plz'> = {
  KUNDENNR: 'kundeNr', KUNDENR: 'kundeNr', KUNDENNUMMER: 'kundeNr', KDNR: 'kundeNr',
  KUNDE: 'kunde', NAME: 'kunde', KUNDENNAME: 'kunde',
  STRASSE: 'strasse', STRAßE: 'strasse', STR: 'strasse',
  PLZ: 'plz',
  ORT: 'ort', PLZORT: 'ort',
  TEL: 'tel', TELEFON: 'tel',
  PROJEKT: 'projekt',
  AUFTRAG: 'auftrag', AUFTRAGSNR: 'auftrag', AUFTRAGNR: 'auftrag', AUFTRAGSNUMMER: 'auftrag',
  AUFTRAGTEXT: 'auftragText', AUFTRAGBEZ: 'auftragText', AUFTRAGSBEZ: 'auftragText', AUFTRAGSBEZEICHNUNG: 'auftragText', BEZEICHNUNG: 'auftragText',
  POS: 'pos', POSITION: 'pos', POSNR: 'pos',
  POSTEXT: 'posText', POSBEZ: 'posText', POSITIONSBEZ: 'posText', POSITIONSBEZEICHNUNG: 'posText',
};
const norm = (k: string) => k.toUpperCase().replace(/Ä/g, 'AE').replace(/Ö/g, 'OE').replace(/Ü/g, 'UE').replace(/[^A-Z0-9ß]/g, '');
/** Schlüssel als Muster, längste zuerst („Posbez“ vor „Pos“); Wörter dürfen durch Leerzeichen/Punkte getrennt sein. */
const MUSTER = Object.keys(SCHLUESSEL)
  .sort((a, b) => b.length - a.length)
  .map((k) => ({ k, re: new RegExp('^' + k.split('').join('[\\s.\\-]*') + '(?![\\p{L}\\d])', 'iu') }));

/** „Schlüssel = Wert“, „Schlüssel: Wert“, „Schlüssel - Wert“ oder „Schlüssel Wert“ (ohne Trennzeichen). */
function eintrag(z: string): [string, string] | null {
  const t = z.trim();
  for (const { k, re } of MUSTER) {
    const m = re.exec(t);
    if (!m) continue;
    const wert = t.slice(m[0].length).replace(/^[\s.]*[=:\-–—]?\s*/, '').replace(/\s+/g, ' ').trim();
    return [k, /^[-–—]$/.test(wert) ? '' : wert];
  }
  return null;
}

/** Liest Auftragsdaten aus dem QR-Inhalt. Gibt null zurück, wenn es kein Rapport-QR ist. */
export function leseQr(text: string): Partial<Auftragsdaten> | null {
  const roh: Record<string, string> = {};
  const t = text.trim().replace(/^﻿/, '');
  if (t.startsWith('{')) {
    try {
      for (const [k, v] of Object.entries(JSON.parse(t))) if (v != null) roh[k.toUpperCase()] = String(v);
    } catch {
      return null;
    }
  } else {
    // Trenner zwischen Einträgen: Zeilenumbruch, sonst „;“
    const zeilen = /[\r\n]/.test(t) ? t.split(/\r?\n|\r/) : t.split(';');
    for (const z of zeilen) {
      const e = eintrag(z);
      if (e) roh[e[0]] = e[1];
    }
  }
  const d: Partial<Auftragsdaten> & { plz?: string } = {};
  for (const [k, v] of Object.entries(roh)) {
    const feld = SCHLUESSEL[norm(k)];
    if (feld && v.trim() && !d[feld]) d[feld] = v.trim();
  }
  // PLZ und Ort zusammenführen („68229“ + „Mannheim“ → „68229 Mannheim“)
  if (d.plz) {
    d.ort = d.ort && !d.ort.startsWith(d.plz) ? `${d.plz} ${d.ort}` : d.ort || d.plz;
    delete d.plz;
  }
  if (!d.auftrag && d.pos) d.auftrag = d.pos.split('-')[0];
  // Nur gültig, wenn mindestens Position oder Auftrag und ein Kundenmerkmal enthalten sind
  if (!(d.pos || d.auftrag)) return null;
  return d;
}

/** Enthält der QR-Code alles, was Schritt 1 als Pflicht verlangt? Dann ist keine Texterkennung nötig. */
export const qrVollstaendig = (d: Partial<Auftragsdaten>) => !!(d.kunde && d.strasse && d.ort && d.auftrag && d.pos);

/** Beispiel-Inhalt (für Doku und Tests). */
export const QR_BEISPIEL = [
  'RAPPORT',
  'KUNDENNR=10868',
  'KUNDE=Mustermann GmbH',
  'STRASSE=Niemandslandstr. 1',
  'PLZ=68229',
  'ORT=Mannheim',
  'TEL=0621 / 4829-310',
  'PROJEKT=',
  'AUFTRAG=A26333',
  'AUFTRAGTEXT=Testauftrag',
  'POS=A26333-01',
  'POSTEXT=Rapportposition Test',
].join('\n');
