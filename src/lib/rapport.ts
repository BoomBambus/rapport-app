// Gemeinsames für die Rapport-Ausgabe: Nummer, Dateiname, Summen, Bilder, Teilen/Speichern.
import type { Rapport } from './types';

export const FUSSZEILE = 'Schlosserei Menge · Weiherstr. 12 · 78465 Konstanz-Dettingen · zertifiziert nach EN 1090';

export const DOCX_TYP = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const rapportNr = (d: Rapport, lfd: number) => 'R-' + (d.pos || d.auftrag || '0000') + '-' + lfd;
export const dateiname = (d: Rapport) => 'Rapport_' + (d.pos || d.auftrag || 'neu').replace(/[^\w-]/g, '_') + '_' + d.datum + '.docx';
export const summeStd = (d: Rapport) => d.stunden.reduce((a, r) => a + r.std, 0);
export const stundenZeilen = (d: Rapport) => d.stunden.filter((r) => r.name || r.std);

/** Bild (Data-URL/URL) auf feste Größe bringen und als Data-URL ausgeben; `cover` schneidet zu wie object-fit: cover. */
export function bildAufGroesse(src: string, w: number, h: number, type: string, cover = false): Promise<string | null> {
  return new Promise((res) => {
    const im = new Image();
    im.onload = () => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const x = c.getContext('2d')!;
      if (type !== 'image/png') {
        x.fillStyle = '#fff';
        x.fillRect(0, 0, w, h);
      }
      if (cover) {
        const r = Math.max(w / im.width, h / im.height);
        const iw = im.width * r;
        const ih = im.height * r;
        x.drawImage(im, (w - iw) / 2, (h - ih) / 2, iw, ih);
      } else x.drawImage(im, 0, 0, w, h);
      res(c.toDataURL(type, 0.85));
    };
    im.onerror = () => res(null);
    im.src = src;
  });
}

/** Data-URL → Bytes (für eingebettete Bilder im Word-Dokument). */
export function dataUrlBytes(url: string): Uint8Array {
  const b = atob(url.slice(url.indexOf(',') + 1));
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}

/**
 * Teilen-Menü (Handy) oder Download (Desktop/Android).
 * Hinweis: Android-Chrome lässt Word-Dateien nicht ins Teilen-Menü – dort wird heruntergeladen.
 */
export async function teilenOderSpeichern(blob: Blob, name: string): Promise<'geteilt' | 'gespeichert' | 'abgebrochen'> {
  const file = new File([blob], name, { type: blob.type || DOCX_TYP });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return 'geteilt';
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'abgebrochen';
      // Teilen nicht möglich → herunterladen
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return 'gespeichert';
}
