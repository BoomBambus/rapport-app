// Erzeugt den Rapport als A4-PDF im Layout der Rapportkarte (Port aus dem Prototyp „Rapport App“).
import type { jsPDF as JsPDFType } from 'jspdf';
import { LOGO_SRC } from '../ds';
import { code39Bars, code39Units } from './code39';
import { deDate, fmt, fmtStd } from './format';
import type { Rapport } from './types';

export const FUSSZEILE = 'Schlosserei Menge · Weiherstr. 12 · 78465 Konstanz-Dettingen · zertifiziert nach EN 1090';

export const rapportNr = (d: Rapport, lfd: number) => 'R-' + (d.pos || d.auftrag || '0000') + '-' + lfd;
export const dateiname = (d: Rapport) => 'Rapport_' + (d.pos || d.auftrag || 'neu').replace(/[^\w-]/g, '_') + '_' + d.datum + '.pdf';
export const summeStd = (d: Rapport) => d.stunden.reduce((a, r) => a + r.std, 0);
export const stundenZeilen = (d: Rapport) => d.stunden.filter((r) => r.name || r.std);

function toImg(src: string, w: number, h: number, type: string, cover = false): Promise<string | null> {
  return new Promise((res) => {
    const im = new Image();
    im.onload = () => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const x = c.getContext('2d')!;
      x.fillStyle = '#fff';
      x.fillRect(0, 0, w, h);
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

function barcode(doc: JsPDFType, code: string, x: number, y: number, w: number, h: number) {
  const bars = code39Bars(code);
  const unit = w / code39Units(bars);
  let cx = x;
  doc.setFillColor(35, 30, 32);
  for (const b of bars) {
    if (b.dark) doc.rect(cx, y, b.w * unit, h, 'F');
    cx += b.w * unit;
  }
}

export async function buildPdf(d: Rapport, lfd = 1): Promise<{ blob: Blob; name: string }> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const L = 18, R = 192, W = R - L;
  const datum = deDate(d.datum);
  const bold = () => doc.setFont('helvetica', 'bold');
  const norm = () => doc.setFont('helvetica', 'normal');
  const rule = (yy: number, strong: boolean, x1 = L, x2 = R) => {
    if (strong) {
      doc.setDrawColor(35, 30, 32);
      doc.setLineWidth(0.3);
    } else {
      doc.setDrawColor(195, 211, 232);
      doc.setLineWidth(0.2);
    }
    doc.line(x1, yy, x2, yy);
  };
  let y = 0;
  const ensure = (h: number) => {
    if (y + h > 278) {
      doc.addPage();
      y = 20;
      return true;
    }
    return false;
  };

  doc.setTextColor(35, 30, 32);
  norm();

  // Kopf: Logo links, „Rapport“ rechts, roter Strich von der linken Kante.
  const logo = await toImg(LOGO_SRC, 1125, 402, 'image/png');
  if (logo) doc.addImage(logo, 'PNG', L, 12, 50, 17.9);
  bold();
  doc.setFontSize(20);
  doc.text('Rapport', R, 20, { align: 'right' });
  norm();
  doc.setFontSize(9);
  doc.text('Nr. ' + rapportNr(d, lfd), R, 26, { align: 'right' });
  doc.text('Datum ' + datum, R, 30.5, { align: 'right' });
  doc.setFillColor(237, 27, 36);
  doc.rect(0, 36, 14, 1.4, 'F');

  // Kunde / Projekt / Auftrag
  y = 46;
  doc.setFontSize(10);
  bold();
  doc.text('Kunde: ' + (d.kundeNr || '–'), L, y);
  norm();
  let ky = y;
  for (const t of [d.kunde, d.strasse, d.ort, d.tel].filter(Boolean)) {
    for (const l of doc.splitTextToSize(t, 86) as string[]) doc.text(l, L, (ky += 5));
  }
  bold();
  doc.text('Projekt:', 110, y);
  doc.text('Auftrag:', 110, y + 5);
  norm();
  doc.text((doc.splitTextToSize(d.projekt || '–', 65) as string[])[0], 127, y);
  doc.text(doc.splitTextToSize(((d.auftrag || '') + ' ' + (d.auftragText || '')).trim() || '–', 65) as string[], 127, y + 5);

  // Positionstabelle mit Barcode
  y = Math.max(74, ky + 6);
  rule(y, true);
  bold();
  doc.text('Pos', L, y + 5);
  doc.text('Beschreibung / Menge', 52, y + 5);
  doc.text('Barcode', 140, y + 5);
  rule(y + 7.5, false);
  norm();
  doc.text(d.pos || '–', L, y + 14);
  doc.text(doc.splitTextToSize(d.posText || '', 84) as string[], 52, y + 14);
  if (d.pos) {
    barcode(doc, d.pos, 140, y + 9.5, 52, 10);
    doc.setFontSize(7);
    doc.text('*' + d.pos.toUpperCase() + '*', 166, y + 22.5, { align: 'center' });
    doc.setFontSize(10);
  }
  y += 25;
  rule(y, true);

  const block = (label: string, text: string, minLines: number) => {
    y += 8;
    ensure(10);
    bold();
    doc.text(label, L, y);
    norm();
    const ls = doc.splitTextToSize(text || '', W) as string[];
    for (const l of ls) {
      y += 4.8;
      ensure(5);
      doc.text(l, L, y);
    }
    y += Math.max(0, minLines - ls.length) * 4.8;
  };
  block('Ausgeführte Arbeiten:', d.arbeiten, 3);
  block('Bemerkungen:', d.bemerkungen, 2);

  // Material | Stunden nebeneinander
  y += 10;
  ensure(20);
  const hdr = () => {
    doc.setFontSize(10);
    bold();
    doc.text('MATERIAL', L, y, { charSpace: 1 });
    doc.text('STUNDEN', 110, y, { charSpace: 1 });
    y += 3;
    rule(y, true, L, 102);
    rule(y, true, 110, R);
    doc.setFontSize(8.5);
    doc.text('Menge', L, y + 4.5);
    doc.text('Einh.', L + 15, y + 4.5);
    doc.text('Bezeichnung', L + 27, y + 4.5);
    doc.text('Name', 110, y + 4.5);
    doc.text('*', 141, y + 4.5);
    doc.text('Datum', 146, y + 4.5);
    doc.text('Art', 163, y + 4.5);
    doc.text('Std', R, y + 4.5, { align: 'right' });
    y += 6.5;
    norm();
  };
  hdr();
  const mat = d.material;
  const std = stundenZeilen(d);
  const n = Math.max(mat.length, std.length, 3);
  for (let k = 0; k < n; k++) {
    const m = mat[k];
    const r = std[k];
    const ml = m ? (doc.splitTextToSize(m.name, 57) as string[]) : [];
    const h = Math.max(1, ml.length) * 3.8 + 2;
    if (ensure(h + 2)) hdr();
    rule(y, false, L, 102);
    rule(y, false, 110, R);
    if (m) {
      doc.text(fmt(m.menge), L, y + 4);
      doc.text(m.einheit, L + 15, y + 4);
      doc.text(ml, L + 27, y + 4);
    }
    if (r) {
      doc.text((doc.splitTextToSize(r.name, 30) as string[])[0] || '', 110, y + 4);
      doc.text(r.q, 141, y + 4);
      doc.text(r.datum.slice(0, 6), 146, y + 4);
      doc.text(r.art, 163, y + 4);
      doc.text(fmtStd(r.std), R, y + 4, { align: 'right' });
    }
    y += h;
  }
  rule(y, true, L, 102);
  rule(y, true, 110, R);
  bold();
  doc.text('Summe', 110, y + 4.5);
  doc.text(fmtStd(summeStd(d)) + ' Std', R, y + 4.5, { align: 'right' });
  norm();
  doc.setFontSize(7.5);
  doc.text('reine Arbeitszeit vor Ort (zzgl. An-, Abfahrt und Rüstzeit)', 110, y + 9);
  doc.text('* M = Meister, F = Facharbeiter, H = Helfer', 110, y + 12.5);
  if (d.fotos.length) doc.text('Fotodokumentation: ' + d.fotos.length + (d.fotos.length === 1 ? ' Foto' : ' Fotos') + ' im Anhang', L, y + 9);
  y += 14;
  doc.setFontSize(9);

  // Unterschriften unten auf der Seite
  let sy = Math.max(y + 8, 250);
  if (sy + 24 > 280) {
    doc.addPage();
    sy = 30;
  }
  if (d.sigAG && !d.agAbwesend) doc.addImage(d.sigAG, 'PNG', L, sy, 40, 16);
  if (d.agAbwesend) {
    doc.setFont('helvetica', 'italic');
    doc.text('Auftraggeber nicht anwesend', L, sy + 13);
    norm();
  }
  if (d.sigAN) doc.addImage(d.sigAN, 'PNG', 110, sy, 40, 16);
  rule(sy + 17, true, L, 100);
  rule(sy + 17, true, 110, R);
  doc.setFontSize(8);
  doc.text(datum + ', Unterschrift Auftraggeber', L, sy + 21);
  doc.text(datum + ', Unterschrift Auftragnehmer', 110, sy + 21);

  // Anhang: Fotos zweispaltig im Format 3:2
  if (d.fotos.length) {
    doc.addPage();
    y = 20;
    bold();
    doc.setFontSize(12);
    doc.text('Fotodokumentation · ' + (d.pos || d.auftrag || ''), L, y);
    norm();
    doc.setFillColor(237, 27, 36);
    doc.rect(0, y + 4, 14, 1.4, 'F');
    y += 12;
    const fw = (W - 6) / 2;
    const fh = (fw * 2) / 3;
    for (let k = 0; k < d.fotos.length; k++) {
      const f = d.fotos[k];
      const col = k % 2;
      if (col === 0 && k > 0) y += fh + 10;
      if (col === 0) ensure(fh + 8);
      const x = L + col * (fw + 6);
      const img = await toImg(f.src, 1200, 800, 'image/jpeg', true);
      if (img) doc.addImage(img, 'JPEG', x, y, fw, fh);
      else {
        doc.setFillColor(232, 239, 248);
        doc.rect(x, y, fw, fh, 'F');
      }
      doc.setFontSize(8);
      doc.text('Foto ' + (k + 1) + ' · ' + datum + ', ' + f.zeit, x, y + fh + 4);
    }
  }

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    rule(283, false);
    doc.setFontSize(7.5);
    doc.setTextColor(90, 85, 86);
    doc.text(FUSSZEILE, L, 287);
    doc.text('Seite ' + p + ' von ' + pages, R, 287, { align: 'right' });
  }
  return { blob: doc.output('blob'), name: dateiname(d) };
}

/** Teilen-Menü (Handy) oder Download (Desktop). Gibt false zurück, wenn der Nutzer abbricht. */
export async function teilenOderSpeichern(blob: Blob, name: string): Promise<'geteilt' | 'gespeichert' | 'abgebrochen'> {
  const file = new File([blob], name, { type: 'application/pdf' });
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
