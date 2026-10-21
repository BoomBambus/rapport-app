import { describe, expect, it } from 'vitest';
import { fixCode, parseCard, type OcrLine } from './cardParser';
import scan from './__fixtures__/karte-scan.json';
import foto from './__fixtures__/karte-foto.json';
import kamera from './__fixtures__/karte-kamera.json';
import dunkel from './__fixtures__/karte-kamera-dunkel.json';
import weit from './__fixtures__/karte-kamera-weit.json';
import schraeg from './__fixtures__/karte-kamera-schraeg.json';
import formularKamera from './__fixtures__/formular-kamera.json';
import formularSchraeg from './__fixtures__/formular-schraeg.json';

// Fixtures: Tesseract-Ergebnis (PSM 4) der Beispiel-Rapportkarte (Testkunde „Mustermann“;
// die Karte selbst liegt aus Datenschutzgründen nicht im Repository) –
// sauber gerendert, als „Handyfoto“ (Ausschnitt, gedreht, unscharf, kontrastarm) und als
// 1280×720-Kamerabild (Kartenkopf auf grauem Grund; OCR liest die PLZ als „©8229“).

describe('parseCard', () => {
  for (const [name, lines] of [['Scan', scan], ['Foto', foto], ['Kamera', kamera]] as const) {
    it(`liest die Beispielkarte (${name})`, () => {
      const d = parseCard(lines as OcrLine[]);
      expect(d.kundeNr).toBe('10868');
      expect(d.strasse).toBe('Niemandslandstr. 1');
      expect(d.ort).toBe('68229 Mannheim');
      expect(d.tel).toBe('0621 / 4829-310');
      expect(d.auftrag).toBe('A26333');
      expect(d.auftragText).toBe('Testauftrag');
      expect(d.pos).toBe('A26333-01');
      expect(d.posText).toBe('Rapportposition Test');
      expect(d.projekt).toBeUndefined();
      expect(d.kunde).toMatch(/^\(?Musterman/);
      expect(d.kunde).not.toMatch(/SCHLOSSEREI|Niemandsland|\d/);
      expect(d.kunde).toMatch(/Kundenname folgt!/);
    });
  }

  // Hochkant-Handybilder nach Bildaufbereitung (src/lib/bild.ts): Beschriftung „Kunde:“ fehlt dort
  // teils ganz – Kunden-Nr., Straße und Telefon werden über die PLZ-Spalte gefunden.
  for (const [name, lines] of [['dunkel/Schatten', dunkel], ['zu weit weg', weit], ['schräg gehalten', schraeg]] as const) {
    it(`Kamerabild ${name}: Adressblock ohne „Kunde:“-Beschriftung`, () => {
      const d = parseCard(lines as OcrLine[]);
      expect(d.kundeNr).toBe('10868');
      expect(d.strasse).toBe('Niemandslandstr. 1');
      expect(d.ort).toBe('68229 Mannheim');
      expect(d.tel).toBe('0621 / 4829-310');
      expect(d.pos).toBe('A26333-01');
      expect(d.auftrag).toBe('A26333');
    });
  }

  it('Barcode hat Vorrang vor OCR-Position', () => {
    const d = parseCard(scan as OcrLine[], 'A26333-02');
    expect(d.pos).toBe('A26333-02');
    expect(d.auftrag).toBe('A26333');
  });

  it('nur Barcode, kein Text: Auftrag aus Position', () => {
    expect(parseCard([], 'A26333-01')).toEqual({ pos: 'A26333-01', auftrag: 'A26333' });
  });
});

// Vorschlag neue Rapportkarte (docs/Rapportkarte-Gestaltung.md): eine Angabe pro Zeile, „Beschriftung: Wert“.
describe('Formular-Layout', () => {
  for (const [name, lines] of [['Kamerabild', formularKamera], ['schräg gehalten', formularSchraeg]] as const) {
    it(`liest alle Felder (${name})`, () => {
      expect(parseCard(lines as OcrLine[])).toEqual({
        kundeNr: '10868',
        kunde: 'Mustermann | Kundenname folgt!',
        strasse: 'Niemandslandstr. 1',
        ort: '68229 Mannheim',
        tel: '0621 / 4829-310',
        auftrag: 'A26333',
        auftragText: 'Testauftrag',
        pos: 'A26333-01',
        posText: 'Rapportposition Test',
      });
    });
  }

  it('fehlender Anfangsbuchstabe der Beschriftung („unde:“) wird toleriert', () => {
    const w = (text: string, x0: number, y: number) => ({ text, x0, y0: y, x1: x0 + text.length * 12, y1: y + 20 });
    const z = (y: number, ...ws: [string, number][]) => ({ text: ws.map((x) => x[0]).join(' '), words: ws.map(([t, x]) => w(t, x, y)) });
    const d = parseCard([z(0, ['unde:', 0], ['Huber', 200], ['GmbH', 280]), z(40, ['Straße:', 0], ['Hauptstr.', 200], ['5', 320]), z(80, ['PLZ', 0], ['/', 50], ['Ort:', 70], ['78465', 200], ['Konstanz', 280])]);
    expect(d).toMatchObject({ kunde: 'Huber GmbH', strasse: 'Hauptstr. 5', ort: '78465 Konstanz' });
  });
});

it('entfernt Tabellenlinien am Rand', () => {
  const w = (text: string, x0: number) => ({ text, x0, y0: 0, x1: x0 + text.length * 10, y1: 20 });
  const d = parseCard([{ text: 'A26333-01 _Rapportposition Test |', words: [w('A26333-01', 0), w('_Rapportposition', 120), w('Test', 290), w('|', 340)] }]);
  expect(d.posText).toBe('Rapportposition Test');
});

describe('fixCode', () => {
  it('korrigiert O/0 und l/1 nach dem Präfix', () => {
    expect(fixCode('A26333-O1')).toBe('A26333-01');
    expect(fixCode('a2633l')).toBe('A26331');
  });
});
