// Pflichtangaben je Schritt. Ohne sie geht es nicht zum nächsten Schritt.
import type { Rapport } from './types';

export type FeldFehler = 'kunde' | 'strasse' | 'ort' | 'auftrag' | 'pos' | 'arbeiten' | 'fotos';
export type Errors = Partial<Record<FeldFehler, string>>;
export type Pruefung = { errors?: Errors; bandErr?: string } | null;

export const MIN_FOTOS = 2;

/** PLZ (4–5 Ziffern, auch CH/A) gefolgt vom Ort: „78465 Konstanz“, „CH-8280 Kreuzlingen“ */
const PLZ_ORT = /^((D|CH|A)\s*-\s*)?\d{4,5}\s+\S/i;

export function pruefe(id: string, d: Rapport): Pruefung {
  if (id === 'auftrag') {
    const e: Errors = {};
    if (!d.kunde.trim()) e.kunde = 'Bitte geben Sie den Kunden ein.';
    if (!d.strasse.trim()) e.strasse = 'Bitte geben Sie Straße und Hausnummer ein.';
    else if (!/\d/.test(d.strasse)) e.strasse = 'Bitte ergänzen Sie die Hausnummer.';
    if (!d.ort.trim()) e.ort = 'Bitte geben Sie PLZ und Ort ein.';
    else if (!PLZ_ORT.test(d.ort.trim())) e.ort = 'Bitte PLZ und Ort angeben, z. B. „78465 Konstanz“.';
    if (!d.auftrag.trim()) e.auftrag = 'Bitte geben Sie die Auftragsnummer ein.';
    if (!d.pos.trim()) e.pos = 'Bitte geben Sie die Position ein.';
    return Object.keys(e).length ? { errors: e } : null;
  }
  if (id === 'arbeiten' && !d.arbeiten.trim()) return { errors: { arbeiten: 'Bitte beschreiben Sie die ausgeführten Arbeiten.' } };
  if (id === 'material' && !d.material.length && !d.keinMaterial) return { bandErr: 'Bitte Material erfassen oder „Kein Material benötigt“ wählen.' };
  if (id === 'stunden' && !d.stunden.some((r) => r.name.trim() && r.std > 0)) return { bandErr: 'Bitte erfassen Sie mindestens einen Mitarbeiter mit Stunden.' };
  if (id === 'fotos') {
    if (d.fotos.length < MIN_FOTOS) return { bandErr: `Bitte mindestens ${MIN_FOTOS} Fotos aufnehmen (bisher ${d.fotos.length}).` };
    if (d.fotos.some((f) => !f.name?.trim())) return { errors: { fotos: 'Bitte benennen Sie das Foto.' }, bandErr: 'Bitte geben Sie jedem Foto eine Bezeichnung.' };
  }
  if (id === 'unterschrift') {
    if (!d.sigAN) return { bandErr: 'Bitte unterschreiben Sie als Auftragnehmer.' };
    if (!d.sigAG && !d.agAbwesend) return { bandErr: 'Unterschrift des Auftraggebers fehlt – oder „nicht anwesend“ wählen.' };
  }
  return null;
}
