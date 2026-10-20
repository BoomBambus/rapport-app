import { describe, expect, it } from 'vitest';
import { fixCode, parseCard, type OcrLine } from './cardParser';
import scan from './__fixtures__/karte-scan.json';
import foto from './__fixtures__/karte-foto.json';
import kamera from './__fixtures__/karte-kamera.json';

// Fixtures: Tesseract-Ergebnis (PSM 4) der Beispielkarte aus project/uploads –
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

  it('Barcode hat Vorrang vor OCR-Position', () => {
    const d = parseCard(scan as OcrLine[], 'A26333-02');
    expect(d.pos).toBe('A26333-02');
    expect(d.auftrag).toBe('A26333');
  });

  it('nur Barcode, kein Text: Auftrag aus Position', () => {
    expect(parseCard([], 'A26333-01')).toEqual({ pos: 'A26333-01', auftrag: 'A26333' });
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
