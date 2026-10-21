import { describe, expect, it } from 'vitest';
import { leseQr, qrVollstaendig, QR_BEISPIEL } from './qr';

const ERWARTET = {
  kundeNr: '10868',
  kunde: 'Mustermann GmbH',
  strasse: 'Niemandslandstr. 1',
  ort: '68229 Mannheim',
  tel: '0621 / 4829-310',
  auftrag: 'A26333',
  auftragText: 'Testauftrag',
  pos: 'A26333-01',
  posText: 'Rapportposition Test',
};

describe('QR-Code der Rapportkarte', () => {
  it('liest das Standardformat', () => {
    const d = leseQr(QR_BEISPIEL)!;
    expect(d).toEqual(ERWARTET);
    expect(qrVollstaendig(d)).toBe(true);
  });

  it('toleriert Semikolon, Doppelpunkt, Kleinschreibung, Windows-Zeilenenden', () => {
    expect(leseQr('kundennr: 10868; kunde: Mustermann GmbH; strasse=Niemandslandstr. 1; plz=68229; ort=Mannheim; tel=0621 / 4829-310; auftrag=A26333; auftragtext=Testauftrag; pos=A26333-01; postext=Rapportposition Test')).toEqual(ERWARTET);
    expect(leseQr(QR_BEISPIEL.replace(/\n/g, '\r\n'))).toEqual(ERWARTET);
  });

  it('liest JSON', () => {
    expect(leseQr(JSON.stringify({ ...ERWARTET, ort: 'Mannheim', plz: '68229' }))).toEqual(ERWARTET);
  });

  it('Umlaute und Sonderzeichen bleiben erhalten', () => {
    expect(leseQr('KUNDE=Müller & Söhne | Bauträger\nSTRASSE=Hauptstraße 5a\nPOS=A1234-02')).toMatchObject({ kunde: 'Müller & Söhne | Bauträger', strasse: 'Hauptstraße 5a', auftrag: 'A1234' });
  });

  it('nur Position → Auftrag abgeleitet, aber nicht vollständig', () => {
    const d = leseQr('POS=A26333-01')!;
    expect(d).toEqual({ pos: 'A26333-01', auftrag: 'A26333' });
    expect(qrVollstaendig(d)).toBe(false);
  });

  it('fremder QR-Code (z. B. Webadresse) → null', () => {
    expect(leseQr('https://www.schlosserei-menge.de')).toBeNull();
    expect(leseQr('{kaputt')).toBeNull();
  });
});
