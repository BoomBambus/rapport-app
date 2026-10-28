// Erzeugt den Rapport als Word-Dokument (.docx, A4) im Layout der Rapportkarte – komplett im Browser.
import type { IParagraphOptions, ITableCellOptions, ParagraphChild } from 'docx';
import { LOGO_SRC } from '../ds';
import { code39Bars, code39Units } from './code39';
import { deDate, fmt, fmtHM, fmtStd } from './format';
import { bildAufGroesse, dataUrlBytes, dateiname, DOCX_TYP, FUSSZEILE, rapportNr, stundenZeilen, summeStd } from './rapport';
import { QUALI_LEGENDE, type Rapport } from './types';

// Maße: 1 mm = 56,7 Twips (Word-Einheit für Abstände/Breiten); Bilder in Pixel bei 96 dpi (1 mm = 3,78 px)
const MM = 56.7;
const PX = 3.7795;
const RAND_LR = Math.round(18 * MM); // Seitenrand links/rechts
const SEITE_B = 11906; // A4
const SATZ = SEITE_B - 2 * RAND_LR; // nutzbare Breite
const FONT = 'Arial';
const SCHWARZ = '231E20';
const LINIE = 'C3D3E8';
const GRAU = '5A5556';

/** Strichcode (Code 39) als PNG zeichnen. */
function strichcodeBild(code: string): string {
  const bars = code39Bars(code);
  const w = 900, h = 170;
  const unit = w / code39Units(bars);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const x = c.getContext('2d')!;
  x.fillStyle = '#fff';
  x.fillRect(0, 0, w, h);
  x.fillStyle = '#231e20';
  let cx = 0;
  for (const b of bars) {
    if (b.dark) x.fillRect(Math.round(cx), 0, Math.max(1, Math.round(cx + b.w * unit) - Math.round(cx)), h);
    cx += b.w * unit;
  }
  return c.toDataURL('image/png');
}

/** Roter Strich der Marke (Fläche), als kleines PNG. */
function roterStrich(): string {
  const c = document.createElement('canvas');
  c.width = 140;
  c.height = 14;
  const x = c.getContext('2d')!;
  x.fillStyle = '#ed1b24';
  x.fillRect(0, 0, 140, 14);
  return c.toDataURL('image/png');
}

export async function buildDocx(d: Rapport, lfd = 1): Promise<{ blob: Blob; name: string }> {
  const D = await import('docx');
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, WidthType, BorderStyle, AlignmentType, Footer, PageNumber, TabStopType, VerticalAlign, TableLayoutType, HeightRule } = D;
  const datum = deDate(d.datum);

  // ---------- Bausteine ----------
  const t = (text: string, o: { b?: boolean; i?: boolean; pt?: number; farbe?: string; sperr?: number } = {}) =>
    new TextRun({ text, font: FONT, bold: o.b, italics: o.i, size: Math.round((o.pt ?? 10) * 2), color: o.farbe ?? SCHWARZ, characterSpacing: o.sperr });
  const p = (kinder: ParagraphChild[] | string, o: IParagraphOptions & { pt?: number; b?: boolean } = {}) => {
    const { pt, b, ...rest } = o;
    return new Paragraph({ spacing: { before: 0, after: 0 }, ...rest, children: typeof kinder === 'string' ? [t(kinder, { pt, b })] : kinder });
  };
  /** Mehrzeiliger Text: jede Zeile ein eigener Absatz (Word kennt kein „\n“ im Text). */
  const absaetze = (text: string, pt = 10) => (text.trim() ? text.split(/\r?\n/) : ['']).map((z) => p(z || ' ', { pt }));
  const bild = (url: string, typ: 'png' | 'jpg', wMm: number, hMm: number) =>
    new ImageRun({ type: typ, data: dataUrlBytes(url), transformation: { width: Math.round(wMm * PX), height: Math.round(hMm * PX) } });

  const ohne = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const keineRahmen = { top: ohne, bottom: ohne, left: ohne, right: ohne, insideHorizontal: ohne, insideVertical: ohne };
  const strich = (farbe: string, achtelPt = 4) => ({ style: BorderStyle.SINGLE, size: achtelPt, color: farbe });
  const zelle = (inhalt: (InstanceType<typeof Paragraph>)[], breite: number, o: Partial<ITableCellOptions> = {}) =>
    new TableCell({
      width: { size: breite, type: WidthType.DXA },
      margins: { top: 40, bottom: 40, left: 0, right: 80 },
      verticalAlign: VerticalAlign.TOP,
      borders: { top: ohne, bottom: ohne, left: ohne, right: ohne },
      ...o,
      children: inhalt,
    });
  const tabelle = (breiten: number[], zeilen: InstanceType<typeof TableRow>[]) =>
    new Table({ width: { size: SATZ, type: WidthType.DXA }, columnWidths: breiten, layout: TableLayoutType.FIXED, borders: keineRahmen, rows: zeilen });

  /** Datentabelle wie auf der Karte: Titel in Sperrschrift, Kopf mit schwarzer Linie, Zeilen mit hellblauer Linie. */
  const datentabelle = (titel: string, spalten: { t: string; w: number; rechts?: boolean }[], zeilen: string[][], summe?: [string, string]) => {
    const ausr = (i: number) => (spalten[i].rechts ? AlignmentType.RIGHT : AlignmentType.LEFT);
    const kopf = new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: spalten.map((s, i) => zelle([p([t(s.t, { b: true, pt: 8.5 })], { alignment: ausr(i) })], s.w, { borders: { top: strich(SCHWARZ, 6), bottom: strich(LINIE), left: ohne, right: ohne } })),
    });
    const rows = zeilen.map(
      (z) =>
        new TableRow({
          cantSplit: true,
          children: z.map((v, i) => zelle([p([t(v, { pt: 9 })], { alignment: ausr(i) })], spalten[i].w, { borders: { top: ohne, bottom: strich(LINIE), left: ohne, right: ohne } })),
        }),
    );
    if (summe) {
      const vorn = spalten.slice(0, -1).reduce((a, s) => a + s.w, 0);
      rows.push(
        new TableRow({
          cantSplit: true,
          children: [
            zelle([p([t(summe[0], { b: true, pt: 9 })])], vorn, { columnSpan: spalten.length - 1, borders: { top: strich(SCHWARZ, 6), bottom: ohne, left: ohne, right: ohne } }),
            zelle([p([t(summe[1], { b: true, pt: 9 })], { alignment: AlignmentType.RIGHT })], spalten[spalten.length - 1].w, { borders: { top: strich(SCHWARZ, 6), bottom: ohne, left: ohne, right: ohne } }),
          ],
        }),
      );
    } else if (rows.length) {
      // Abschlusslinie unten
      const letzte = zeilen[zeilen.length - 1];
      rows[rows.length - 1] = new TableRow({
        cantSplit: true,
        children: letzte.map((v, i) => zelle([p([t(v, { pt: 9 })], { alignment: ausr(i) })], spalten[i].w, { borders: { top: ohne, bottom: strich(SCHWARZ, 6), left: ohne, right: ohne } })),
      });
    }
    return [p([t(titel, { b: true, pt: 10, sperr: 40 })], { spacing: { before: 280, after: 60 }, keepNext: true }), tabelle(spalten.map((s) => s.w), [kopf, ...rows])];
  };

  // ---------- Bilder vorbereiten ----------
  const logo = await bildAufGroesse(LOGO_SRC, 1125, 402, 'image/png');
  const rot = roterStrich();
  const fotos = await Promise.all(d.fotos.map((f) => bildAufGroesse(f.src, 1200, 800, 'image/jpeg', true)));

  const inhalt: (InstanceType<typeof Paragraph> | InstanceType<typeof Table>)[] = [];

  // Kopf: Logo links, „Rapport“ rechts
  const halb = Math.round(SATZ / 2);
  inhalt.push(
    tabelle([halb, SATZ - halb], [
      new TableRow({
        children: [
          zelle([p(logo ? [bild(logo, 'png', 50, 17.9)] : [t('Schlosserei Menge', { b: true, pt: 16 })])], halb),
          zelle(
            [
              p([t('Rapport', { b: true, pt: 20 })], { alignment: AlignmentType.RIGHT }),
              p([t('Nr. ' + rapportNr(d, lfd), { pt: 9 })], { alignment: AlignmentType.RIGHT }),
              p([t('Datum ' + datum, { pt: 9 })], { alignment: AlignmentType.RIGHT }),
            ],
            SATZ - halb,
          ),
        ],
      }),
    ]),
  );
  // Roter Strich von der linken Blattkante
  inhalt.push(p([bild(rot, 'png', 14, 1.4)], { indent: { left: -RAND_LR }, spacing: { before: 120, after: 240 } }));

  // Kunde | Projekt/Auftrag
  const kundeZeilen = [d.kunde, d.strasse, d.ort, d.tel].filter(Boolean);
  inhalt.push(
    tabelle([Math.round(SATZ * 0.52), SATZ - Math.round(SATZ * 0.52)], [
      new TableRow({
        children: [
          zelle([p([t('Kunde: ' + (d.kundeNr || '–'), { b: true })]), ...kundeZeilen.map((z) => p(z))], Math.round(SATZ * 0.52)),
          zelle(
            [p([t('Projekt: ', { b: true }), t(d.projekt || '–')]), p([t('Auftrag: ', { b: true }), t(((d.auftrag || '') + ' ' + (d.auftragText || '')).trim() || '–')])],
            SATZ - Math.round(SATZ * 0.52),
          ),
        ],
      }),
    ]),
  );

  // Positionstabelle mit Strichcode
  const pw = [Math.round(34 * MM), Math.round(84 * MM)];
  pw.push(SATZ - pw[0] - pw[1]);
  const kopfRahmen = { top: strich(SCHWARZ, 6), bottom: strich(LINIE), left: ohne, right: ohne };
  const zeilRahmen = { top: ohne, bottom: strich(SCHWARZ, 6), left: ohne, right: ohne };
  inhalt.push(p(' ', { spacing: { before: 120 } }));
  inhalt.push(
    tabelle(pw, [
      new TableRow({ children: ['Pos', 'Bezeichnung', 'Barcode'].map((s, i) => zelle([p([t(s, { b: true })])], pw[i], { borders: kopfRahmen })) }),
      new TableRow({
        cantSplit: true,
        children: [
          zelle([p(d.pos || '–')], pw[0], { borders: zeilRahmen }),
          zelle([p(d.posText || '')], pw[1], { borders: zeilRahmen }),
          zelle(
            d.pos
              ? [p([bild(strichcodeBild(d.pos), 'png', 52, 10)]), p([t('*' + d.pos.toUpperCase() + '*', { pt: 7 })], { alignment: AlignmentType.CENTER })]
              : [p(' ')],
            pw[2],
            { borders: zeilRahmen },
          ),
        ],
      }),
    ]),
  );

  // Arbeiten und Bemerkungen
  inhalt.push(p([t('Ausgeführte Arbeiten:', { b: true })], { spacing: { before: 240, after: 40 }, keepNext: true }), ...absaetze(d.arbeiten));
  inhalt.push(p([t('Bemerkungen:', { b: true })], { spacing: { before: 200, after: 40 }, keepNext: true }), ...absaetze(d.bemerkungen));

  // Material, Stunden, Fahrt untereinander
  const mw = [Math.round(18 * MM), Math.round(18 * MM), Math.round(24 * MM)];
  mw.push(SATZ - mw[0] - mw[1] - mw[2]);
  inhalt.push(
    ...datentabelle(
      'MATERIAL',
      [{ t: 'Menge', w: mw[0], rechts: true }, { t: 'Einheit', w: mw[1] }, { t: 'Art.-Nr.', w: mw[2] }, { t: 'Bezeichnung', w: mw[3] }],
      d.material.length ? d.material.map((m) => [fmt(m.menge), m.einheit, m.nr || '–', m.name]) : [['', '', '', d.keinMaterial ? 'Kein Material benötigt' : '']],
    ),
  );
  const sw = [Math.round(66 * MM), Math.round(20 * MM), Math.round(28 * MM), Math.round(30 * MM)];
  sw.push(SATZ - sw.reduce((a, b) => a + b, 0));
  inhalt.push(
    ...datentabelle(
      'STUNDEN',
      [{ t: 'Name', w: sw[0] }, { t: 'Qualif.*', w: sw[1] }, { t: 'Datum', w: sw[2] }, { t: 'Art', w: sw[3] }, { t: 'Std', w: sw[4], rechts: true }],
      stundenZeilen(d).map((r) => [r.name, r.q, r.datum, r.art, fmtStd(r.std)]),
      ['Summe Arbeitszeit', fmtStd(summeStd(d)) + ' Std'],
    ),
    p([t('Reine Arbeitszeit vor Ort (zzgl. An-, Abfahrt und Rüstzeit)', { pt: 7.5 })], { spacing: { before: 60 } }),
    p([t('* ' + QUALI_LEGENDE, { pt: 7.5 })]),
  );
  const fw = [Math.round(84 * MM), Math.round(50 * MM)];
  fw.push(SATZ - fw[0] - fw[1]);
  inhalt.push(
    ...datentabelle(
      'FAHRT',
      [{ t: 'Hin- und Rückfahrt', w: fw[0] }, { t: 'Fahrzeit', w: fw[1] }, { t: 'Kilometer', w: fw[2], rechts: true }],
      [d.keineFahrt ? ['Keine Fahrt', '–', '–'] : ['Werkstatt – Kunde – Werkstatt', `${fmtStd(d.fahrzeit ?? 0)} Std (${fmtHM(d.fahrzeit ?? 0)})`, fmt(d.fahrKm ?? 0) + ' km']],
    ),
  );
  if (d.fotos.length) inhalt.push(p([t(`Fotodokumentation: ${d.fotos.length} ${d.fotos.length === 1 ? 'Foto' : 'Fotos'} im Anhang`, { pt: 7.5 })], { spacing: { before: 120 } }));

  // Unterschriften (zusammenhalten)
  const uw = [Math.round(SATZ * 0.46), 0, Math.round(SATZ * 0.46)];
  uw[1] = SATZ - uw[0] - uw[2];
  const sig = (url: string | null, abwesend = false) =>
    url && !abwesend ? [p([bild(url, 'png', 40, 16)])] : [p([t(abwesend ? 'Auftraggeber nicht anwesend' : ' ', { i: true, pt: 9 })], { spacing: { before: 600 } })];
  inhalt.push(p(' ', { spacing: { before: 360 }, keepNext: true }));
  inhalt.push(
    tabelle(uw, [
      new TableRow({
        cantSplit: true,
        height: { value: Math.round(18 * MM), rule: HeightRule.ATLEAST },
        children: [
          zelle(sig(d.sigAG, d.agAbwesend), uw[0], { verticalAlign: VerticalAlign.BOTTOM, borders: { top: ohne, bottom: strich(SCHWARZ, 6), left: ohne, right: ohne } }),
          zelle([p(' ')], uw[1]),
          zelle(sig(d.sigAN), uw[2], { verticalAlign: VerticalAlign.BOTTOM, borders: { top: ohne, bottom: strich(SCHWARZ, 6), left: ohne, right: ohne } }),
        ],
      }),
      new TableRow({
        cantSplit: true,
        children: [
          zelle([p([t(datum + ', Unterschrift Auftraggeber', { pt: 8 })])], uw[0]),
          zelle([p(' ')], uw[1]),
          zelle([p([t(datum + ', Unterschrift Auftragnehmer', { pt: 8 })])], uw[2]),
        ],
      }),
    ]),
  );

  // Anhang: Fotos zweispaltig, 3:2, mit Bezeichnung
  if (d.fotos.length) {
    inhalt.push(p([t('Fotodokumentation · ' + (d.pos || d.auftrag || ''), { b: true, pt: 12 })], { pageBreakBefore: true }));
    inhalt.push(p([bild(rot, 'png', 14, 1.4)], { indent: { left: -RAND_LR }, spacing: { before: 80, after: 240 } }));
    const bw = Math.round((SATZ - 6 * MM) / 2);
    const lw = SATZ - 2 * bw;
    const fotoMm = bw / MM;
    const zeilen: InstanceType<typeof TableRow>[] = [];
    for (let k = 0; k < d.fotos.length; k += 2) {
      const feld = (i: number) => {
        const f = d.fotos[i];
        if (!f) return [p(' ')];
        const img = fotos[i];
        const cap = ['Foto ' + (i + 1), f.name?.trim(), datum + ', ' + f.zeit].filter(Boolean).join(' · ');
        return [p(img ? [bild(img, 'jpg', fotoMm, (fotoMm * 2) / 3)] : [t('Foto ' + (i + 1))]), p([t(cap, { pt: 8 })], { spacing: { before: 60, after: 240 } })];
      };
      zeilen.push(new TableRow({ cantSplit: true, children: [zelle(feld(k), bw), zelle([p(' ')], lw), zelle(feld(k + 1), bw)] }));
    }
    inhalt.push(tabelle([bw, lw, bw], zeilen));
  }

  const doc = new Document({
    creator: 'Schlosserei Menge – Tagesrapport',
    title: 'Rapport ' + rapportNr(d, lfd),
    styles: { default: { document: { run: { font: FONT, size: 20, color: SCHWARZ } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: SEITE_B, height: 16838 },
            margin: { top: Math.round(12 * MM), bottom: Math.round(20 * MM), left: RAND_LR, right: RAND_LR, footer: Math.round(8 * MM) },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINIE, space: 4 } },
                tabStops: [{ type: TabStopType.RIGHT, position: SATZ }],
                children: [
                  t(FUSSZEILE, { pt: 7.5, farbe: GRAU }),
                  new TextRun({ children: ['\tSeite ', PageNumber.CURRENT, ' von ', PageNumber.TOTAL_PAGES], font: FONT, size: 15, color: GRAU }),
                ],
              }),
            ],
          }),
        },
        children: inhalt,
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  return { blob: new Blob([blob], { type: DOCX_TYP }), name: dateiname(d) };
}
