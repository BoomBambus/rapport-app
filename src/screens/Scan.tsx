import { useEffect, useRef, useState } from 'react';
import { barcodeReader, blobToCanvas, decodeBarcode, prepareOcr, readCard } from '../lib/ocr';
import type { Auftragsdaten } from '../lib/types';

type Phase = 'kamera' | 'lesen' | 'erkannt';

const corner = (pos: Record<string, number>, sides: string[]) => (
  <div
    style={{
      position: 'absolute',
      width: 36,
      height: 36,
      ...pos,
      ...Object.fromEntries(sides.map((s) => [`border${s}`, '4px solid var(--weiss)'])),
    }}
  />
);

const darkBtn = {
  appearance: 'none' as const,
  border: 0,
  background: 'none',
  color: 'var(--weiss)',
  font: '600 16px/24px var(--font-sans)',
  minHeight: 44,
  cursor: 'pointer',
  padding: 0,
};

export function Scan({ onAbbrechen, onErkannt, onManuell }: { onAbbrechen: () => void; onErkannt: (f: Partial<Auftragsdaten>) => void; onManuell: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const galerieRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const [kamera, setKamera] = useState<'start' | 'an' | 'aus'>('start');
  const [phase, setPhase] = useState<Phase>('kamera');
  const [barcodeGefunden, setBarcodeGefunden] = useState(false);
  const [fortschritt, setFortschritt] = useState(0);
  const [hinweis, setHinweis] = useState<string | null>(null);
  const [ergebnis, setErgebnis] = useState<Partial<Auftragsdaten> | null>(null);
  const weiterRef = useRef(onErkannt);
  weiterRef.current = onErkannt;

  /** Standbild auswerten: Barcode + Text. */
  const auswerten = async (canvas: HTMLCanvasElement, barcode: string | null) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setPhase('lesen');
    setHinweis(null);
    setFortschritt(0);
    const code = barcode ?? (await decodeBarcode(canvas));
    if (code) setBarcodeGefunden(true);
    let felder: Partial<Auftragsdaten> = {};
    try {
      felder = await readCard(canvas, code, setFortschritt);
    } catch {
      // OCR nicht verfügbar (z. B. erster Start offline) – mit Barcode allein weiter
      if (code) felder = { pos: code, auftrag: code.split('-')[0] };
    }
    if (!felder.pos && !felder.auftrag && !felder.kundeNr) {
      busyRef.current = false;
      setBarcodeGefunden(false);
      setPhase('kamera');
      setHinweis('Karte nicht erkannt. Bitte die Karte flach und gut beleuchtet in den Rahmen halten und erneut versuchen.');
      return;
    }
    setErgebnis(felder);
    setPhase('erkannt');
    window.setTimeout(() => weiterRef.current(felder), 1400);
  };

  const standbild = async (): Promise<HTMLCanvasElement | null> => {
    const v = videoRef.current;
    const track = streamRef.current?.getVideoTracks()[0];
    // Volle Kameraauflösung, wo möglich (Android Chrome)
    const IC = (window as unknown as { ImageCapture?: new (t: MediaStreamTrack) => { takePhoto(): Promise<Blob> } }).ImageCapture;
    if (track && IC) {
      try {
        return await blobToCanvas(await new IC(track).takePhoto());
      } catch {
        /* Rückfall auf Videobild */
      }
    }
    if (!v || !v.videoWidth) return null;
    const c = document.createElement('canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d')!.drawImage(v, 0, 0);
    return c;
  };

  const ausloesen = async (barcode: string | null) => {
    const c = await standbild();
    if (c) await auswerten(c, barcode);
  };

  // Kamera starten, Barcode laufend suchen
  useEffect(() => {
    let stop = false;
    let controls: { stop(): void } | null = null;
    prepareOcr().catch(() => {});
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('keine Kamera');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (stop) return stream.getTracks().forEach((t) => t.stop());
        streamRef.current = stream;
        setKamera('an');
        const reader = await barcodeReader();
        if (stop || !videoRef.current) return;
        controls = await reader.decodeFromStream(stream, videoRef.current, (res) => {
          if (res && !busyRef.current && !stop) {
            setBarcodeGefunden(true);
            ausloesen(res.getText().replace(/^\*|\*$/g, ''));
          }
        });
      } catch {
        if (!stop) setKamera('aus');
      }
    })();
    return () => {
      stop = true;
      controls?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const text =
    phase === 'lesen'
      ? `Karte wird gelesen … ${Math.round(fortschritt * 100)} %`
      : phase === 'erkannt'
        ? 'Auftragskarte erkannt. Daten werden übernommen …'
        : kamera === 'aus'
          ? 'Kamera nicht verfügbar. Fotografieren Sie die Karte oder wählen Sie ein Foto.'
          : 'Halten Sie den Kopf der Rapportkarte mit Barcode in den Rahmen.';

  return (
    <div
      className="safe-bottom"
      style={{ flex: 1, minHeight: 0, background: 'var(--tiefschwarz)', color: 'var(--weiss)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 0', gap: 24 }}
    >
      <div style={{ alignSelf: 'stretch', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onAbbrechen} style={darkBtn}>
          Abbrechen
        </button>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase' }}>Scannen</span>
        <span style={{ width: 72 }} />
      </div>

      <div style={{ flex: 1, minHeight: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: 320, maxWidth: '100%', height: 210 }}>
          <video
            ref={videoRef}
            playsInline
            muted
            style={{
              position: 'absolute',
              inset: 4,
              width: 'calc(100% - 8px)',
              height: 'calc(100% - 8px)',
              objectFit: 'cover',
              display: kamera === 'an' ? 'block' : 'none',
              opacity: phase === 'kamera' ? 1 : 0.5,
            }}
          />
          {kamera !== 'an' && (
            <div
              style={{
                position: 'absolute',
                left: 24,
                right: 24,
                top: 24,
                bottom: 24,
                border: '1px dashed var(--tiefschwarz-gedaempft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                color: 'var(--linie)',
                textAlign: 'center',
                padding: 16,
              }}
            >
              {kamera === 'start' ? 'Kamera wird gestartet …' : 'Kamerabild · Rapportkarte mit Barcode'}
            </div>
          )}
          {corner({ left: 0, top: 0 }, ['Left', 'Top'])}
          {corner({ right: 0, top: 0 }, ['Right', 'Top'])}
          {corner({ left: 0, bottom: 0 }, ['Left', 'Bottom'])}
          {corner({ right: 0, bottom: 0 }, ['Right', 'Bottom'])}
          {barcodeGefunden && <div style={{ position: 'absolute', left: 24, right: 24, top: 103, height: 4, background: 'var(--signalrot)' }} />}
        </div>
        <div style={{ textAlign: 'center', fontSize: 16, lineHeight: '24px', maxWidth: 300 }} aria-live="polite">
          {text}
        </div>
        {hinweis && (
          <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, lineHeight: '20px', fontWeight: 600, maxWidth: 320 }}>
            <span style={{ width: 16, height: 4, marginTop: 8, background: 'var(--signalrot)', flex: 'none' }} />
            {hinweis}
          </div>
        )}
        {phase === 'kamera' && (
          <button
            onClick={() => (kamera === 'an' ? ausloesen(null) : fileRef.current?.click())}
            style={{
              ...darkBtn,
              border: '2px solid var(--weiss)',
              borderRadius: 2,
              padding: '0 20px',
              height: 44,
            }}
          >
            {kamera === 'an' ? 'Karte lesen' : 'Karte fotografieren'}
          </button>
        )}
      </div>

      {phase === 'erkannt' && ergebnis && (
        <div style={{ alignSelf: 'stretch', padding: 16, background: 'var(--weiss)', color: 'var(--tiefschwarz)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase' }}>Erkannt</span>
          <span style={{ fontSize: 20, lineHeight: '26px', fontWeight: 700 }}>{[ergebnis.pos || ergebnis.auftrag, ergebnis.posText || ergebnis.auftragText].filter(Boolean).join(' · ')}</span>
          {(ergebnis.kundeNr || ergebnis.kunde) && (
            <span style={{ fontSize: 14, lineHeight: '20px' }}>
              {[ergebnis.kundeNr && 'Kunde ' + ergebnis.kundeNr, [ergebnis.kunde, ergebnis.ort?.replace(/^\d+\s*/, '')].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}
            </span>
          )}
        </div>
      )}

      {[fileRef, galerieRef].map((ref, i) => (
        <input
          key={i}
          ref={ref}
          type="file"
          accept="image/*"
          capture={i === 0 ? 'environment' : undefined}
          style={{ display: 'none' }}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f) auswerten(await blobToCanvas(f), null);
          }}
        />
      ))}
      {phase === 'kamera' && (
        <button onClick={() => galerieRef.current?.click()} style={{ ...darkBtn, fontWeight: 400, fontSize: 14, minHeight: 32, marginTop: -12 }}>
          Foto aus Galerie wählen
        </button>
      )}
      <button onClick={onManuell} style={{ ...darkBtn, textDecoration: 'underline', textUnderlineOffset: 4 }}>
        Auftragsdaten manuell eingeben
      </button>
    </div>
  );
}
