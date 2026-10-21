// Codes (QR, Code 39/128) im Kamerabild finden und Kamerabilder für die Texterkennung vorbereiten.
// Nutzt den eingebauten BarcodeDetector des Browsers (Android/Chrome), sonst ZXing.
import { aufbereiten, graustufen, schaerfe, skalieren, type Grau, type Rechteck } from './bild';

type Erkannt = { text: string; format: 'qr' | 'strich' };

interface NativerDetector {
  detect(src: CanvasImageSource): Promise<{ rawValue: string; format: string }[]>;
}
let nativP: Promise<NativerDetector | null> | null = null;

function nativ(): Promise<NativerDetector | null> {
  if (!nativP)
    nativP = (async () => {
      const BD = (window as unknown as { BarcodeDetector?: { new (o: { formats: string[] }): NativerDetector; getSupportedFormats(): Promise<string[]> } }).BarcodeDetector;
      if (!BD) return null;
      try {
        const da = await BD.getSupportedFormats();
        const formats = ['qr_code', 'code_39', 'code_128'].filter((f) => da.includes(f));
        return formats.includes('qr_code') ? new BD({ formats }) : null;
      } catch {
        return null;
      }
    })();
  return nativP;
}

type Zx = {
  qr: import('@zxing/library').QRCodeReader;
  strich: import('@zxing/library').MultiFormatOneDReader;
  lib: typeof import('@zxing/library');
  Quelle: typeof import('@zxing/browser').HTMLCanvasElementLuminanceSource;
  hints: Map<import('@zxing/library').DecodeHintType, unknown>;
  qrHints: Map<import('@zxing/library').DecodeHintType, unknown>;
};
let zxP: Promise<Zx> | null = null;
function zxing(): Promise<Zx> {
  if (!zxP)
    zxP = (async () => {
      const [lib, br] = await Promise.all([import('@zxing/library'), import('@zxing/browser')]);
      const hints = new Map<import('@zxing/library').DecodeHintType, unknown>([[lib.DecodeHintType.POSSIBLE_FORMATS, [lib.BarcodeFormat.CODE_39, lib.BarcodeFormat.CODE_128]]]);
      // Gründlicher Modus für QR: findet auch kleine Codes (≈ 2 px je Modul), kostet nur wenige ms
      const qrHints = new Map<import('@zxing/library').DecodeHintType, unknown>([[lib.DecodeHintType.TRY_HARDER, true]]);
      return { qr: new lib.QRCodeReader(), strich: new lib.MultiFormatOneDReader(hints), lib, Quelle: br.HTMLCanvasElementLuminanceSource, hints, qrHints };
    })();
  return zxP;
}

/** Alle lesbaren Codes in einem Bild – QR zuerst. */
export async function codesFinden(c: HTMLCanvasElement): Promise<Erkannt[]> {
  const n = await nativ();
  if (n) {
    try {
      const r = await n.detect(c);
      return r
        .map((x) => ({ text: x.rawValue, format: (x.format === 'qr_code' ? 'qr' : 'strich') as Erkannt['format'] }))
        .sort((a, b) => (a.format === 'qr' ? -1 : 1) - (b.format === 'qr' ? -1 : 1));
    } catch {
      /* weiter mit ZXing */
    }
  }
  const z = await zxing();
  const bild = () => new z.lib.BinaryBitmap(new z.lib.HybridBinarizer(new z.Quelle(c)));
  const out: Erkannt[] = [];
  try {
    out.push({ text: z.qr.decode(bild(), z.qrHints).getText(), format: 'qr' });
  } catch {
    /* kein QR */
  }
  try {
    out.push({ text: z.strich.decode(bild(), z.hints).getText().replace(/^\*|\*$/g, ''), format: 'strich' });
  } catch {
    /* kein Strichcode */
  }
  return out;
}

/** Leinwand in gewünschter Größe aus einer Bildquelle (Video, Bild) mit optionalem Ausschnitt. */
export function zeichnen(src: CanvasImageSource, sw: number, sh: number, r: Rechteck | null, maxBreite: number, vergroessern = false): HTMLCanvasElement {
  const q = r ?? { x: 0, y: 0, w: sw, h: sh };
  const f = vergroessern ? maxBreite / q.w : Math.min(1, maxBreite / q.w);
  const c = document.createElement('canvas');
  c.width = Math.round(q.w * f);
  c.height = Math.round(q.h * f);
  c.getContext('2d', { willReadFrequently: true })!.drawImage(src, q.x, q.y, q.w, q.h, 0, 0, c.width, c.height);
  return c;
}

const pixel = (c: HTMLCanvasElement) => c.getContext('2d', { willReadFrequently: true })!.getImageData(0, 0, c.width, c.height).data;

/** Schärfe eines Bildes (verkleinert gemessen, damit es im Kameratakt schnell geht). */
export function bildSchaerfe(c: HTMLCanvasElement): number {
  const g = graustufen(pixel(c), c.width, c.height);
  const f = 360 / g.w;
  return schaerfe(f < 1 ? skalieren(g, 360, Math.round(g.h * f)) : g);
}

/** Bild für die Texterkennung aufbereiten (Ausschnitt ist schon gewählt). */
export function fuerTexterkennung(c: HTMLCanvasElement): HTMLCanvasElement {
  return grauZuCanvas(aufbereiten(pixel(c), c.width, c.height, null));
}

export function grauZuCanvas(g: Grau): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = g.w;
  c.height = g.h;
  const ctx = c.getContext('2d')!;
  const id = ctx.createImageData(g.w, g.h);
  for (let i = 0, j = 0; i < g.px.length; i++, j += 4) {
    id.data[j] = id.data[j + 1] = id.data[j + 2] = g.px[i];
    id.data[j + 3] = 255;
  }
  ctx.putImageData(id, 0, 0);
  return c;
}

/** Kleines JPEG des Kartenausschnitts zum Gegenprüfen in Schritt 1 (bleibt nur auf dem Gerät). */
export const vorschauBild = (c: HTMLCanvasElement) => zeichnen(c, c.width, c.height, null, 900).toDataURL('image/jpeg', 0.7);
