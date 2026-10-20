import { describe, expect, it } from 'vitest';
import { fmtHM, fmtStd } from './format';

describe('Stundenformat', () => {
  it('zeigt Viertelstunden genau', () => {
    expect(fmtStd(6)).toBe('6,0');
    expect(fmtStd(6.25)).toBe('6,25');
    expect(fmtStd(6.5)).toBe('6,5');
    expect(fmtStd(6.75)).toBe('6,75');
  });
  it('Stunden und Minuten', () => {
    expect(fmtHM(0)).toBe('0 min');
    expect(fmtHM(0.25)).toBe('15 min');
    expect(fmtHM(2)).toBe('2 h');
    expect(fmtHM(6.75)).toBe('6 h 45 min');
  });
});
