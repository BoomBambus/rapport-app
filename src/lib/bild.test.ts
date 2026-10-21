import { describe, expect, it } from 'vitest';
import { drehen, schraeglage, type Grau } from './bild';

// Testbild: drei waagrechte „Textzeilen“ aus dunklen Balken
function zeilenbild(): Grau {
  const w = 400, h = 300, px = new Uint8ClampedArray(w * h).fill(255);
  for (const y0 of [80, 150, 220]) for (let y = y0; y < y0 + 8; y++) for (let x = 40; x < 360; x++) if (x % 9 < 6) px[y * w + x] = 20;
  return { w, h, px };
}

describe('Schräglage', () => {
  it('gerades Bild → 0°', () => expect(Math.abs(schraeglage(zeilenbild()))).toBeLessThanOrEqual(0.25));
  for (const a of [-5, -2, 3, 6]) {
    it(`um ${a}° gedreht wird erkannt und ausgeglichen`, () => {
      const schief = drehen(zeilenbild(), a);
      const gemessen = schraeglage(schief);
      expect(Math.abs(Math.abs(gemessen) - Math.abs(a))).toBeLessThanOrEqual(0.5);
      expect(Math.abs(schraeglage(drehen(schief, gemessen)))).toBeLessThanOrEqual(0.5);
    });
  }
});
