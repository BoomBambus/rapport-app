import { describe, expect, it } from 'vitest';
import { pruefe } from './pruefung';
import type { Rapport } from './types';

const basis: Rapport = {
  id: '1', datum: '2026-10-20', fromScan: true,
  kundeNr: '10868', kunde: 'Mustermann', strasse: 'Niemandslandstr. 1', ort: '68229 Mannheim', tel: '', projekt: '',
  auftrag: 'A26333', auftragText: '', pos: 'A26333-01', posText: '',
  arbeiten: 'Montiert.', bemerkungen: '', material: [], keinMaterial: false,
  stunden: [{ id: 's', name: 'J. Keller', q: 'F', datum: '20.10.2026', art: 'Montage', std: 1 }],
  fotos: [], sigAG: null, sigAN: null, agAbwesend: false,
};
const mit = (p: Partial<Rapport>) => ({ ...basis, ...p });

describe('Schritt 1 · Auftrag', () => {
  it('vollständig → weiter', () => expect(pruefe('auftrag', basis)).toBeNull());
  it('alle Pflichtfelder leer → je Feld ein Fehler', () => {
    const r = pruefe('auftrag', mit({ kunde: '', strasse: '', ort: '', auftrag: '', pos: '' }));
    expect(Object.keys(r!.errors!).sort()).toEqual(['auftrag', 'kunde', 'ort', 'pos', 'strasse']);
  });
  it('Straße ohne Hausnummer', () => expect(pruefe('auftrag', mit({ strasse: 'Weiherstraße' }))!.errors!.strasse).toMatch(/Hausnummer/));
  it('Ort ohne PLZ', () => expect(pruefe('auftrag', mit({ ort: 'Mannheim' }))!.errors!.ort).toBeTruthy());
  it('Schweizer PLZ ist erlaubt', () => expect(pruefe('auftrag', mit({ ort: 'CH-8280 Kreuzlingen' }))).toBeNull());
});

describe('Schritt 3 · Material', () => {
  it('nichts erfasst → Fehler', () => expect(pruefe('material', basis)?.bandErr).toMatch(/Kein Material/));
  it('„Kein Material benötigt“ → weiter', () => expect(pruefe('material', mit({ keinMaterial: true }))).toBeNull());
  it('Material erfasst → weiter', () =>
    expect(pruefe('material', mit({ material: [{ id: 'm', nr: '', name: 'Rohr', einheit: 'm', menge: 1, quelle: 'Händisch' }] }))).toBeNull());
});

describe('Schritt 5 · Fotos', () => {
  const foto = (name?: string) => ({ id: Math.random().toString(), name, zeit: '10:00', src: 'data:' });
  it('weniger als 2 → Fehler', () => expect(pruefe('fotos', mit({ fotos: [foto('A')] }))?.bandErr).toMatch(/mindestens 2/));
  it('unbenannt → Fehler', () => expect(pruefe('fotos', mit({ fotos: [foto('A'), foto(' ')] }))?.errors?.fotos).toBeTruthy());
  it('2 benannte → weiter', () => expect(pruefe('fotos', mit({ fotos: [foto('A'), foto('B')] }))).toBeNull());
});
