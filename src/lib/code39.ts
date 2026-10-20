// Code 39: je Zeichen 9 Elemente (Strich/Lücke abwechselnd), n = schmal, w = breit.
const P39: Record<string, string> = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn', '4': 'nnnwwnnnw',
  '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw', '8': 'wnnwnnwnn', '9': 'nnwwnnwnn',
  A: 'wnnnnwnnw', B: 'nnwnnwnnw', C: 'wnwnnwnnn', D: 'nnnnwwnnw', E: 'wnnnwwnnn',
  F: 'nnwnwwnnn', G: 'nnnnnwwnw', H: 'wnnnnwwnn', I: 'nnwnnwwnn', J: 'nnnnwwwnn',
  K: 'wnnnnnnww', L: 'nnwnnnnww', M: 'wnwnnnnwn', N: 'nnnnwnnww', O: 'wnnnwnnwn',
  P: 'nnwnwnnwn', Q: 'nnnnnnwww', R: 'wnnnnnwwn', S: 'nnwnnnwwn', T: 'nnnnwnwwn',
  U: 'wwnnnnnnw', V: 'nwwnnnnnw', W: 'wwwnnnnnn', X: 'nwnnwnnnw', Y: 'wwnnwnnnn',
  Z: 'nwwnwnnnn', '-': 'nwnnnnwnw', '*': 'nwnnwnwnn',
};

export const WIDE_RATIO = 2.5;

export interface Bar {
  /** Breite in Moduleinheiten */
  w: number;
  dark: boolean;
}

/** Code-39-Elemente für einen Text (Start/Stopp „*“ inklusive). Nicht kodierbare Zeichen entfallen. */
export function code39Bars(code: string): Bar[] {
  const chars = ('*' + code.toUpperCase().replace(/[^0-9A-Z-]/g, '') + '*').split('');
  const out: Bar[] = [];
  chars.forEach((ch, ci) => {
    P39[ch].split('').forEach((m, k) => out.push({ w: m === 'w' ? WIDE_RATIO : 1, dark: k % 2 === 0 }));
    if (ci < chars.length - 1) out.push({ w: 1, dark: false }); // Zeichenlücke
  });
  return out;
}

export const code39Units = (bars: Bar[]) => bars.reduce((a, b) => a + b.w, 0);
