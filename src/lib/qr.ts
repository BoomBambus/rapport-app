// QR-Code auf der Rapportkarte: enthält alle Auftragsdaten, damit keine Texterkennung nötig ist.
// Format siehe docs/QR-Code-Rapportkarte.md. Bewusst einfach, damit jedes Warenwirtschafts-
// oder Druckprogramm es erzeugen kann:
//
//   RAPPORT
//   KUNDENNR=10868
//   KUNDE=Mustermann GmbH
//   STRASSE=Niemandslandstr. 1
//   PLZ=68229
//   ORT=Mannheim
//   ...
//
// Toleriert: Groß-/Kleinschreibung der Schlüssel, „:“ statt „=“, „;“ statt Zeilenumbruch, JSON.
import type { Auftragsdaten } from './types';

const SCHLUESSEL: Record<string, keyof Auftragsdaten | 'plz'> = {
  KUNDENNR: 'kundeNr', KUNDENR: 'kundeNr', KUNDENNUMMER: 'kundeNr', KDNR: 'kundeNr',
  KUNDE: 'kunde', NAME: 'kunde',
  STRASSE: 'strasse', STRAßE: 'strasse', STR: 'strasse',
  PLZ: 'plz',
  ORT: 'ort',
  TEL: 'tel', TELEFON: 'tel',
  PROJEKT: 'projekt',
  AUFTRAG: 'auftrag', AUFTRAGSNR: 'auftrag',
  AUFTRAGTEXT: 'auftragText', AUFTRAGBEZ: 'auftragText', BEZEICHNUNG: 'auftragText',
  POS: 'pos', POSITION: 'pos',
  POSTEXT: 'posText', POSBEZ: 'posText',
};

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
    const zeilen = /[\r\n]/.test(t) ? t.split(/\r?\n|\r/) : t.split(';');
    for (const z of zeilen) {
      const m = /^\s*([\p{L}.]+)\s*[=:]\s*(.*?)\s*$/u.exec(z);
      if (m) roh[m[1].toUpperCase().replace(/\./g, '')] = m[2];
    }
  }
  const d: Partial<Auftragsdaten> & { plz?: string } = {};
  for (const [k, v] of Object.entries(roh)) {
    const feld = SCHLUESSEL[k] ?? SCHLUESSEL[k.replace('Ä', 'AE').replace('Ü', 'UE').replace('Ö', 'OE')];
    if (feld && v.trim()) d[feld] = v.trim();
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
