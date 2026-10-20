// Kopiert Tesseract-Worker, WASM-Kern und deutsche Sprachdaten nach public/ocr,
// damit die Texterkennung ohne CDN und offline funktioniert. Läuft vor dev/build.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const nm = (p) => path.join(root, 'node_modules', p);
const dest = path.join(root, 'public', 'ocr');
fs.mkdirSync(path.join(dest, 'lang'), { recursive: true });

const files = [
  [nm('tesseract.js/dist/worker.min.js'), 'worker.min.js'],
  [nm('tesseract.js-core/tesseract-core-lstm.wasm.js'), 'tesseract-core-lstm.wasm.js'],
  [nm('tesseract.js-core/tesseract-core-simd-lstm.wasm.js'), 'tesseract-core-simd-lstm.wasm.js'],
  [nm('@tesseract.js-data/deu/4.0.0_best_int/deu.traineddata.gz'), 'lang/deu.traineddata.gz'],
];
for (const [src, rel] of files) {
  const to = path.join(dest, rel);
  if (!fs.existsSync(to) || fs.statSync(to).size !== fs.statSync(src).size) fs.copyFileSync(src, to);
}
console.log('OCR-Dateien in public/ocr bereit.');
