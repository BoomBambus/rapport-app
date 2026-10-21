// Bildaufbereitung für die Texterkennung der Rapportkarte.
// Reine Funktionen auf Graustufen-Arrays – laufen im Browser und in Tests gleich.
//
// Ablauf: Ausschnitt (nur der Sucherrahmen) → Graustufen → auf Arbeitsbreite skalieren →
// Schatten/Helligkeitsverlauf herausrechnen → Kontrast strecken.

export interface Grau {
  w: number;
  h: number;
  /** 0 = schwarz, 255 = weiß */
  px: Uint8ClampedArray;
}

export interface Rechteck {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** RGBA (ImageData) → Graustufen nach Helligkeit. */
export function graustufen(rgba: Uint8ClampedArray, w: number, h: number): Grau {
  const px = new Uint8ClampedArray(w * h);
  for (let i = 0, j = 0; i < px.length; i++, j += 4) px[i] = (rgba[j] * 299 + rgba[j + 1] * 587 + rgba[j + 2] * 114) / 1000;
  return { w, h, px };
}

export function ausschnitt(g: Grau, r: Rechteck): Grau {
  const x0 = Math.max(0, Math.round(r.x));
  const y0 = Math.max(0, Math.round(r.y));
  const w = Math.min(g.w - x0, Math.round(r.w));
  const h = Math.min(g.h - y0, Math.round(r.h));
  const px = new Uint8ClampedArray(w * h);
  for (let y = 0; y < h; y++) px.set(g.px.subarray((y0 + y) * g.w + x0, (y0 + y) * g.w + x0 + w), y * w);
  return { w, h, px };
}

/** Bilinear skalieren. */
export function skalieren(g: Grau, w: number, h: number): Grau {
  const px = new Uint8ClampedArray(w * h);
  const sx = g.w / w;
  const sy = g.h / h;
  for (let y = 0; y < h; y++) {
    const fy = Math.max(0, (y + 0.5) * sy - 0.5);
    const y1 = Math.min(g.h - 1, Math.floor(fy));
    const y2 = Math.min(g.h - 1, y1 + 1);
    const dy = fy - y1;
    for (let x = 0; x < w; x++) {
      const fx = Math.max(0, (x + 0.5) * sx - 0.5);
      const x1 = Math.min(g.w - 1, Math.floor(fx));
      const x2 = Math.min(g.w - 1, x1 + 1);
      const dx = fx - x1;
      const a = g.px[y1 * g.w + x1], b = g.px[y1 * g.w + x2], c = g.px[y2 * g.w + x1], d = g.px[y2 * g.w + x2];
      px[y * w + x] = (a * (1 - dx) + b * dx) * (1 - dy) + (c * (1 - dx) + d * dx) * dy;
    }
  }
  return { w, h, px };
}

/** Kastenfilter über Integralbild (Radius r), für die Hintergrundschätzung. */
function kastenfilter(src: Float32Array, w: number, h: number, r: number): Float32Array {
  const ii = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let zeile = 0;
    for (let x = 0; x < w; x++) {
      zeile += src[y * w + x];
      ii[(y + 1) * (w + 1) + x + 1] = ii[y * (w + 1) + x + 1] + zeile;
    }
  }
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const ya = Math.max(0, y - r), yb = Math.min(h, y + r + 1);
    for (let x = 0; x < w; x++) {
      const xa = Math.max(0, x - r), xb = Math.min(w, x + r + 1);
      const s = ii[yb * (w + 1) + xb] - ii[ya * (w + 1) + xb] - ii[yb * (w + 1) + xa] + ii[ya * (w + 1) + xa];
      out[y * w + x] = s / ((yb - ya) * (xb - xa));
    }
  }
  return out;
}

/** Hellste Werte in der Umgebung (Papierweiß) – Schrift fällt dabei weg. */
function maxFilter(g: Grau, r: number): Float32Array {
  const { w, h, px } = g;
  const tmp = new Float32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let m = 0;
      for (let k = Math.max(0, x - r); k <= Math.min(w - 1, x + r); k += 2) m = Math.max(m, px[y * w + k]);
      tmp[y * w + x] = m;
    }
  const out = new Float32Array(w * h);
  for (let x = 0; x < w; x++)
    for (let y = 0; y < h; y++) {
      let m = 0;
      for (let k = Math.max(0, y - r); k <= Math.min(h - 1, y + r); k += 2) m = Math.max(m, tmp[k * w + x]);
      out[y * w + x] = m;
    }
  return out;
}

export interface Optionen {
  /** Nicht-Papier-Flächen (Tisch, Hand) weiß machen: Anteil der Papierhelligkeit, darunter gilt es als „kein Papier“; 0 = aus */
  papierMaske?: number;
  /** > 1 dunkelt Mitteltöne ab (dünne, graue Schrift wird kräftiger) */
  gamma?: number;
  /** Unscharf-Maskierung, Stärke 0 = aus */
  schaerfen?: number;
}
// Werte aus dem Vergleich mit simulierten Handybildern (scripts/bench/ocr-bench.ts):
// ohne Aufbereitung 23/54 Felder, mit diesen Werten 43/54.
export const STANDARD: Required<Optionen> = { papierMaske: 0.38, gamma: 1.2, schaerfen: 2.5 };

/**
 * Schatten und Helligkeitsverlauf entfernen: Bild durch geschätzten Papierhintergrund teilen,
 * danach Kontrast strecken, Mitteltöne abdunkeln und leicht schärfen.
 */
export function ausgleichen(g: Grau, opt: Optionen = STANDARD): Grau {
  const o = { ...STANDARD, ...opt };
  const { w, h } = g;
  // Papierweiß schätzen: Maximum über ~ 1/60 der Breite (größer als Schrifthöhe), dann glätten
  const r = Math.max(4, Math.round(w / 60));
  const bg = kastenfilter(maxFilter(g, r), w, h, r * 2);
  // Typische Papierhelligkeit (80 %-Perzentil des Hintergrunds)
  const sortiert = Float32Array.from(bg).sort();
  const papier = sortiert[Math.floor(sortiert.length * 0.8)];
  let src: Float32Array = Float32Array.from(g.px);
  if (o.schaerfen > 0) {
    const weich = kastenfilter(src, w, h, Math.max(1, Math.round(w / 1000)));
    for (let i = 0; i < src.length; i++) src[i] = src[i] + o.schaerfen * (src[i] - weich[i]);
  }
  const px = new Uint8ClampedArray(w * h);
  const schwarz = 0.3;
  const weiss = 0.9;
  for (let i = 0; i < px.length; i++) {
    if (o.papierMaske && bg[i] < papier * o.papierMaske) {
      px[i] = 255; // kein Papier
      continue;
    }
    const n = Math.min(1, Math.max(0, (src[i] / Math.max(24, bg[i]) - schwarz) / (weiss - schwarz)));
    px[i] = Math.pow(n, o.gamma) * 255;
  }
  return { w, h, px };
}

/** Arbeitsbreite für die Texterkennung (Sucherausschnitt), ergab im Vergleich die besten Ergebnisse. */
export const ARBEITSBREITE = 1200;

/** Kompletter Ablauf für ein Kamerabild. `rahmen` = sichtbarer Sucherbereich (Bildpixel) oder null. */
export function aufbereiten(rgba: Uint8ClampedArray, w: number, h: number, rahmen: Rechteck | null, opt?: Optionen & { breite?: number }): Grau {
  let g = graustufen(rgba, w, h);
  if (rahmen) g = ausschnitt(g, rahmen);
  const f = (opt?.breite ?? ARBEITSBREITE) / g.w;
  if (f > 1.15 || f < 0.7) g = skalieren(g, Math.round(g.w * f), Math.round(g.h * f));
  return ausgleichen(g, opt);
}

/**
 * Sichtbaren Bereich eines Videos mit object-fit: cover im Sucher berechnen (in Videopixeln),
 * mit etwas Rand, damit knapp angelegte Karten nicht abgeschnitten werden.
 */
export function sucherRahmen(vw: number, vh: number, ew: number, eh: number, rand = 0.08): Rechteck {
  const s = Math.max(ew / vw, eh / vh);
  const sw = ew / s, sh = eh / s;
  const w = Math.min(vw, sw * (1 + 2 * rand));
  const hh = Math.min(vh, sh * (1 + 2 * rand));
  return { x: (vw - w) / 2, y: (vh - hh) / 2, w, h: hh };
}

/** Schärfemaß (Varianz des Laplace-Filters) auf verkleinertem Graubild – für die Wahl des schärfsten Kamerabilds. */
export function schaerfe(g: Grau): number {
  const { w, h, px } = g;
  let s = 0, s2 = 0, n = 0;
  for (let y = 1; y < h - 1; y += 2)
    for (let x = 1; x < w - 1; x += 2) {
      const i = y * w + x;
      const l = 4 * px[i] - px[i - 1] - px[i + 1] - px[i - w] - px[i + w];
      s += l;
      s2 += l * l;
      n++;
    }
  return n ? s2 / n - (s / n) ** 2 : 0;
}
