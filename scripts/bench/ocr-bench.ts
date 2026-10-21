// Entwickler-Werkzeug: Texterkennung der Rapportkarte mit/ohne Bildaufbereitung vergleichen.
// Aufruf: [PREFIX=neu-] npx vite-node scripts/bench/ocr-bench.ts <ordner> [stufen, z. B. roh,aufbereitet,crop,M:aufbereitet+roh]
// <ordner> enthält simulierte Kamerabilder als rohe RGBA-Dateien bench-<name>.rgba (siehe BILDER).
// Die Bilder werden aus einer Beispiel-Rapportkarte erzeugt; die Karte liegt aus Datenschutzgründen
// nicht im Repository.
import fs from 'node:fs';
import { createWorker } from 'tesseract.js';
import { aufbereiten, ausschnitt, graustufen, skalieren, sucherRahmen, type Grau } from '../../src/lib/bild';
import { linesFromTesseract, parseCard, unvollstaendig, zusammenfuehren } from '../../src/lib/cardParser';
import type { Auftragsdaten } from '../../src/lib/types';

const DIR = process.argv[2];
const BILDER: [string, number, number][] = [
  ['iphone-gut', 720, 1280], ['iphone-unscharf', 720, 1280], ['iphone-schraeg', 720, 1280],
  ['iphone-dunkel', 720, 1280], ['android-gut', 1080, 1920], ['android-klein', 1080, 1920],
];
const SOLL: Record<string, string> = { kundeNr: '10868', strasse: 'Niemandslandstr. 1', ort: '68229 Mannheim', tel: '0621 / 4829-310', auftrag: 'A26333', auftragText: 'Testauftrag', pos: 'A26333-01', posText: 'Rapportposition Test' };
// Varianten der Aufbereitung zum Vergleich
const VARIANTEN: Record<string, Parameters<typeof aufbereiten>[4]> = {
  aufbereitet: {},
  ohneMaske: { papierMaske: 0 },
  ohneGamma: { gamma: 1 },
  ohneSchaerfe: { schaerfen: 0 },
  b1600: { breite: 1600 },
  b2400: { breite: 2400 },
  schaerfer: { schaerfen: 1.5 },
};
const pgm = (g: Grau) => Buffer.concat([Buffer.from(`P5\n${g.w} ${g.h}\n255\n`), Buffer.from(g.px)]);

const w = await createWorker('deu', 1, { langPath: process.cwd() + '/node_modules/@tesseract.js-data/deu/4.0.0_best_int', gzip: true, cachePath: DIR });
await w.setParameters({ tessedit_pageseg_mode: '4' as never, preserve_interword_spaces: '1' });
// Zusätzliche Varianten als JSON: {"name": {gamma, breite, schaerfen, papierMaske}}
if (process.env.VARIANTEN) Object.assign(VARIANTEN, JSON.parse(process.env.VARIANTEN));
const stufen = (process.argv[3] || 'roh,aufbereitet').split(',');
const summe: Record<string, number> = {};
for (const [name, W, H] of BILDER) {
  const rgba = new Uint8ClampedArray(fs.readFileSync(`${DIR}/bench-${process.env.PREFIX ?? ''}${name}.rgba`));
  // Sucher in der App: volle Breite, Seitenverhältnis 3:2
  const rahmen = sucherRahmen(W, H, 358, 239);
  const zeile: string[] = [];
  for (const st of stufen) {
    if (st.startsWith('M:')) {
      const t = Date.now();
      const teile: Partial<Auftragsdaten>[] = [];
      let n = 0;
      for (const v of st.slice(2).split('+')) {
        const gg = v === 'roh' ? graustufen(rgba, W, H) : aufbereiten(rgba, W, H, rahmen, VARIANTEN[v]);
        const { data } = await w.recognize(pgm(gg), {}, { text: true, blocks: true });
        teile.push(parseCard(linesFromTesseract(data as never)));
        n++;
        if (!unvollstaendig(zusammenfuehren(...teile))) break;
      }
      const d = zusammenfuehren(...teile);
      let ok = 0;
      const falsch: string[] = [];
      for (const [k, v] of Object.entries(SOLL)) ((d as Record<string, string>)[k] === v ? ok++ : falsch.push(`${k}=${JSON.stringify((d as Record<string, string>)[k] ?? '')}`));
      /Mustermann/.test(d.kunde ?? '') && /Kundenname folgt/.test(d.kunde ?? '') ? ok++ : falsch.push(`kunde=${JSON.stringify(d.kunde ?? '')}`);
      summe[st] = (summe[st] ?? 0) + ok;
      zeile.push(`${st}: ${ok}/9 (${n} Durchg., ${((Date.now() - t) / 1000).toFixed(1)} s) ${falsch.join(' ')}`);
      continue;
    }
    const crop = () => ausschnitt(graustufen(rgba, W, H), rahmen);
    const g =
      st === 'roh' ? graustufen(rgba, W, H)
      : st === 'crop' ? crop()
      : st.startsWith('cropScale') ? ((c) => skalieren(c, +st.slice(9), Math.round((c.h * +st.slice(9)) / c.w)))(crop())
      : aufbereiten(rgba, W, H, rahmen, VARIANTEN[st]);
    if (st === 'aufbereitet' && process.argv[4]) fs.writeFileSync(`${DIR}/auf-${name}.pgm`, pgm(g));
    const t = Date.now();
    const { data } = await w.recognize(pgm(g), {}, { text: true, blocks: true });
    const zeilen = linesFromTesseract(data as never);
    if (process.env.ZEILEN === name + ':' + st) {
      console.log(zeilen.slice(0, 12).map((l) => l.text + '   ⟨' + l.words.map((x) => `${x.text}@${x.x0},${x.y0}-${x.x1},${x.y1}`).join(' ') + '⟩').join('\n'));
      fs.writeFileSync(`${DIR}/zeilen-${name}-${st}.json`, JSON.stringify(zeilen));
    }
    const d = parseCard(zeilen);
    let ok = 0;
    const falsch: string[] = [];
    for (const [k, v] of Object.entries(SOLL)) ((d as Record<string, string>)[k] === v ? ok++ : falsch.push(`${k}=${JSON.stringify((d as Record<string, string>)[k] ?? '')}`));
    /Mustermann/.test(d.kunde ?? '') && /Kundenname folgt/.test(d.kunde ?? '') ? ok++ : falsch.push(`kunde=${JSON.stringify(d.kunde ?? '')}`);
    summe[st] = (summe[st] ?? 0) + ok;
    zeile.push(`${st}: ${ok}/9 (${((Date.now() - t) / 1000).toFixed(1)} s) ${falsch.join(' ')}`);
  }
  if (!process.env.STILL) console.log(name.padEnd(16), zeile.join('  |  '));
}
console.log('SUMME', JSON.stringify(summe), 'von', BILDER.length * 9);
await w.terminate();
