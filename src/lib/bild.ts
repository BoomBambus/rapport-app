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
  /** Lange Tabellenlinien entfernen (Text in umrandeten Zellen wird sonst übersprungen) */
  linien?: boolean;
  /** Schräglage messen und Bild gerade drehen */
  geradeRichten?: boolean;
}
// Werte aus dem Vergleich mit simulierten Handybildern (scripts/bench/ocr-bench.ts):
// ohne Aufbereitung 23/54 Felder, mit diesen Werten 43/54.
export const STANDARD: Required<Optionen> = { papierMaske: 0.38, gamma: 1.2, schaerfen: 2.5, linien: false, geradeRichten: true };

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
  if (o.linien) linienEntfernen(px, w, h);
  if (o.geradeRichten) {
    const a = schraeglage({ w, h, px });
    if (Math.abs(a) >= 0.4) return drehen({ w, h, px }, a);
  }
  return { w, h, px };
}

/**
 * Schräglage in Grad schätzen (−8° … +8°): Bei richtigem Winkel liegen die dunklen Pixel
 * (Schriftzeilen, Linien) in wenigen, scharf getrennten Zeilen – das Zeilenprofil ist dann am „spitzesten“.
 */
export function schraeglage(g: Grau): number {
  const f = Math.min(1, 600 / g.w);
  const k = f < 1 ? skalieren(g, Math.round(g.w * f), Math.round(g.h * f)) : g;
  const pts: number[] = [];
  for (let y = 0; y < k.h; y++) for (let x = 0; x < k.w; x++) if (k.px[y * k.w + x] < 110) pts.push(x, y);
  let best = 0, bestScore = -1;
  const bins = new Float64Array(k.h * 2 + k.w);
  for (let a = -8; a <= 8.001; a += 0.25) {
    const t = Math.tan((a * Math.PI) / 180);
    bins.fill(0);
    for (let i = 0; i < pts.length; i += 2) bins[Math.round(pts[i + 1] - pts[i] * t + k.w * 0.15 + k.h * 0.5)]++;
    let score = 0;
    for (let i = 0; i < bins.length; i++) score += bins[i] * bins[i];
    if (score > bestScore) (bestScore = score), (best = a);
  }
  return best;
}

/** Um den Mittelpunkt drehen (Grad, positiv = gegen den Uhrzeigersinn im Bild), Rand weiß. */
export function drehen(g: Grau, grad: number): Grau {
  const { w, h } = g;
  const r = (grad * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  const cx = w / 2, cy = h / 2;
  const px = new Uint8ClampedArray(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const sx = c * (x - cx) - s * (y - cy) + cx;
      const sy = s * (x - cx) + c * (y - cy) + cy;
      const x0 = Math.floor(sx), y0 = Math.floor(sy);
      if (x0 < 0 || y0 < 0 || x0 >= w - 1 || y0 >= h - 1) {
        px[y * w + x] = 255;
        continue;
      }
      const dx = sx - x0, dy = sy - y0, i = y0 * w + x0;
      px[y * w + x] = (g.px[i] * (1 - dx) + g.px[i + 1] * dx) * (1 - dy) + (g.px[i + w] * (1 - dx) + g.px[i + w + 1] * dx) * dy;
    }
  return { w, h, px };
}

/**
 * Waagrechte und senkrechte Linien entfernen: dunkle Läufe, die viel länger sind als jedes
 * Schriftzeichen, werden weiß. Schrift bleibt stehen, Tabellenrahmen verschwinden.
 */
export function linienEntfernen(px: Uint8ClampedArray, w: number, h: number, schwelle = 140) {
  const minW = Math.round(w / 12); // waagrecht: länger als ~ 1/12 der Breite
  const minH = Math.round(h / 8); // senkrecht: länger als ~ 1/8 der Höhe
  const weg = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    let start = -1;
    for (let x = 0; x <= w; x++) {
      const dunkel = x < w && px[y * w + x] < schwelle;
      if (dunkel && start < 0) start = x;
      if (!dunkel && start >= 0) {
        if (x - start >= minW) for (let k = start; k < x; k++) weg[y * w + k] = 1;
        start = -1;
      }
    }
  }
  for (let x = 0; x < w; x++) {
    let start = -1;
    for (let y = 0; y <= h; y++) {
      const dunkel = y < h && px[y * w + x] < schwelle;
      if (dunkel && start < 0) start = y;
      if (!dunkel && start >= 0) {
        if (y - start >= minH) for (let k = start; k < y; k++) weg[k * w + x] = 1;
        start = -1;
      }
    }
  }
  // Ränder der Linien (Kantenglättung) mit erfassen
  for (let i = 0; i < weg.length; i++) if (weg[i]) {
    px[i] = 255;
    if (i % w > 0 && px[i - 1] < 220) px[i - 1] = 255;
    if (i % w < w - 1 && px[i + 1] < 220) px[i + 1] = 255;
    if (i >= w && px[i - w] < 220) px[i - w] = 255;
    if (i < px.length - w && px[i + w] < 220) px[i + w] = 255;
  }
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
