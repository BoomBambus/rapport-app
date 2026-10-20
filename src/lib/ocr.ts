// Texterkennung der Rapportkarte (Tesseract, Deutsch) und Barcode-Lesen (ZXing, Code 39/128).
// Alles läuft auf dem Gerät; Dateien liegen unter /ocr (siehe scripts/copy-ocr.mjs).
import type { Worker } from 'tesseract.js';
import { linesFromTesseract, parseCard } from './cardParser';
import type { Auftragsdaten } from './types';

const BASE = import.meta.env.BASE_URL;
let workerP: Promise<Worker> | null = null;
let progressCb: ((p: number) => void) | null = null;

/** Startet den OCR-Worker (einmalig). Früh aufrufen, damit der Scan schneller ist. */
export function prepareOcr(): Promise<Worker> {
  if (!workerP) {
    workerP = (async () => {
      const { createWorker } = await import('tesseract.js');
      const w = await createWorker('deu', 1, {
        workerPath: BASE + 'ocr/worker.min.js',
        corePath: BASE + 'ocr/',
        langPath: BASE + 'ocr/lang',
        gzip: true,
        logger: (m) => {
          if (m.status === 'recognizing text' && progressCb) progressCb(m.progress);
        },
      });
      // PSM 4: eine Spalte variabler Textgrößen – liefert die Kartenzeilen am saubersten.
      await w.setParameters({ tessedit_pageseg_mode: '4' as never, preserve_interword_spaces: '1' });
      return w;
    })().catch((e) => {
      workerP = null;
      throw e;
    });
  }
  return workerP;
}

export async function readCard(img: HTMLCanvasElement, barcode: string | null, onProgress?: (p: number) => void): Promise<Partial<Auftragsdaten>> {
  const w = await prepareOcr();
  progressCb = onProgress ?? null;
  try {
    const { data } = await w.recognize(img, {}, { text: true, blocks: true });
    return parseCard(linesFromTesseract(data as never), barcode);
  } finally {
    progressCb = null;
  }
}

// ---------- Barcode ----------
type Reader = import('@zxing/browser').BrowserMultiFormatOneDReader;
let readerP: Promise<Reader> | null = null;

export function barcodeReader(): Promise<Reader> {
  if (!readerP)
    readerP = (async () => {
      const [{ BrowserMultiFormatOneDReader }, { DecodeHintType, BarcodeFormat }] = await Promise.all([import('@zxing/browser'), import('@zxing/library')]);
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_39, BarcodeFormat.CODE_128]);
      // Nur 1D-Leser: schneller, und ohne die Warnungen des MultiFormatReader bei jedem Bild
      return new BrowserMultiFormatOneDReader(hints, { delayBetweenScanAttempts: 250 });
    })();
  return readerP;
}

/** Barcode in einem Standbild suchen; null wenn keiner gefunden. */
export async function decodeBarcode(canvas: HTMLCanvasElement): Promise<string | null> {
  try {
    const r = await barcodeReader();
    return r.decodeFromCanvas(canvas).getText().replace(/^\*|\*$/g, '');
  } catch {
    return null;
  }
}

/** Bild (Datei/Blob) in ein Canvas laden, längste Seite höchstens maxSide. */
export async function blobToCanvas(blob: Blob, maxSide = 2400): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(blob);
  try {
    const im = new Image();
    im.src = url;
    await im.decode();
    const r = Math.min(1, maxSide / Math.max(im.naturalWidth, im.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(im.naturalWidth * r);
    c.height = Math.round(im.naturalHeight * r);
    c.getContext('2d')!.drawImage(im, 0, 0, c.width, c.height);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}
