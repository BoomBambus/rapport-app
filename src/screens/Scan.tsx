import { useEffect, useRef, useState } from 'react';
import { Flashlight, FlashlightOff } from 'lucide-react';
import { blobToCanvas, prepareOcr, readCard } from '../lib/ocr';
import { sucherRahmen } from '../lib/bild';
import { bildSchaerfe, codesFinden, fuerTexterkennung, vorschauBild, zeichnen } from '../lib/scanner';
import { leseQr, qrVollstaendig } from '../lib/qr';
import { unvollstaendig, zusammenfuehren } from '../lib/cardParser';
import type { Auftragsdaten } from '../lib/types';

export type ScanErgebnis = Partial<Auftragsdaten> & { scanBild?: string; scanQuelle: 'qr' | 'text' };
type Phase = 'kamera' | 'lesen' | 'erkannt';
type Bild = { c: HTMLCanvasElement; schaerfe: number; t: number };

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

const ecke = (pos: Record<string, number>, seiten: string[]) => (
  <div style={{ position: 'absolute', width: 36, height: 36, ...pos, ...Object.fromEntries(seiten.map((s) => [`border${s}`, '4px solid var(--weiss)'])) }} />
);

/** Aus mehreren Kamerabildern das schärfste der letzten Sekunde (gegen Verwackeln). */
const PUFFER_MS = 1200;

export function Scan({ onAbbrechen, onErkannt, onManuell }: { onAbbrechen: () => void; onErkannt: (f: ScanErgebnis) => void; onManuell: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const galerieRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const pufferRef = useRef<Bild[]>([]);
  const qrRef = useRef<Partial<Auftragsdaten> | null>(null);
  const [kamera, setKamera] = useState<'start' | 'an' | 'aus'>('start');
  const [licht, setLicht] = useState<boolean | null>(null); // null = nicht verfügbar
  const [phase, setPhase] = useState<Phase>('kamera');
  const [codeGefunden, setCodeGefunden] = useState(false);
  const [fortschritt, setFortschritt] = useState(0);
  const [hinweis, setHinweis] = useState<string | null>(null);
  const [ergebnis, setErgebnis] = useState<ScanErgebnis | null>(null);
  const weiterRef = useRef(onErkannt);
  weiterRef.current = onErkannt;

  const fertig = (e: ScanErgebnis) => {
    setErgebnis(e);
    setPhase('erkannt');
    window.setTimeout(() => weiterRef.current(e), e.scanQuelle === 'qr' ? 900 : 1400);
  };

  /** Ausschnitt (Kartenkopf) per Texterkennung lesen, mit QR-/Strichcode-Daten zusammenführen. */
  const auswerten = async (ausschnitt: HTMLCanvasElement, strichcode: string | null) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setPhase('lesen');
    setHinweis(null);
    setFortschritt(0);
    let code = strichcode;
    if (!code) {
      const codes = await codesFinden(ausschnitt).catch(() => []);
      const qr = codes.find((c) => c.format === 'qr');
      const qd = qr ? leseQr(qr.text) : null;
      if (qd) qrRef.current = qd;
      code = codes.find((c) => c.format === 'strich')?.text ?? null;
    }
    if (code || qrRef.current) setCodeGefunden(true);
    const qd = qrRef.current;
    if (qd && qrVollstaendig(qd)) return fertig({ ...qd, scanQuelle: 'qr', scanBild: vorschauBild(ausschnitt) });
    let text: Partial<Auftragsdaten> = {};
    try {
      const aufbereitet = fuerTexterkennung(ausschnitt);
      text = await readCard(aufbereitet, code, (p) => setFortschritt(p * 0.5));
      // Fehlt noch etwas Wichtiges? Zweiter Durchgang auf dem unbearbeiteten Bild.
      if (unvollstaendig(text)) text = zusammenfuehren(text, await readCard(ausschnitt, code, (p) => setFortschritt(0.5 + p * 0.25)));
      // Positionszeile fehlt (steht neben dem Strichcode)? Dritter Durchgang im Streutext-Modus.
      if (!text.pos || !text.posText) text = zusammenfuehren(text, await readCard(aufbereitet, code, (p) => setFortschritt(0.75 + p * 0.25), '11'));
    } catch {
      // Texterkennung nicht verfügbar – mit Codes allein weiter
      if (code) text = { pos: code, auftrag: code.split('-')[0] };
    }
    const felder = zusammenfuehren(...(qd ? [qd] : []), text);
    if (!felder.pos && !felder.auftrag && !felder.kundeNr) {
      busyRef.current = false;
      setCodeGefunden(false);
      setPhase('kamera');
      setHinweis('Karte nicht erkannt. Bitte den Kartenkopf flach, gut beleuchtet und ausfüllend in den Rahmen halten und erneut versuchen.');
      return;
    }
    // QR unvollständig + Texterkennung ergänzt → wie Texterkennung behandeln (bitte prüfen)
    fertig({ ...felder, scanQuelle: 'text', scanBild: vorschauBild(ausschnitt) });
  };

  /** Sichtbaren Sucherausschnitt aus dem Video holen. */
  const ausschnittVomVideo = (maxBreite: number) => {
    const v = videoRef.current;
    // Erst auswerten, wenn Video und Sucher sichtbar sind (sonst Breite 0)
    if (!v || !v.videoWidth || !v.clientWidth || !v.clientHeight) return null;
    const r = sucherRahmen(v.videoWidth, v.videoHeight, v.clientWidth, v.clientHeight);
    return zeichnen(v, v.videoWidth, v.videoHeight, r, maxBreite);
  };

  /** „Karte lesen“: schärfstes Bild der letzten Sekunde verwenden. */
  const ausloesen = async (strichcode: string | null) => {
    const jetzt = Date.now();
    const kandidaten = pufferRef.current.filter((b) => jetzt - b.t < PUFFER_MS);
    const bestes = kandidaten.sort((a, b) => b.schaerfe - a.schaerfe)[0]?.c ?? ausschnittVomVideo(1600);
    if (bestes) await auswerten(bestes, strichcode);
  };

  // Kamera starten; laufend Codes suchen und scharfe Bilder puffern
  useEffect(() => {
    let stop = false;
    let timer = 0;
    prepareOcr().catch(() => {});
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('keine Kamera');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 2560 }, height: { ideal: 1440 } },
          audio: false,
        });
        if (stop) return stream.getTracks().forEach((t) => t.stop());
        streamRef.current = stream;
        const track = stream.getVideoTracks()[0];
        // Dauer-Autofokus und Taschenlampe, wo das Gerät es anbietet (Android)
        const caps = (track.getCapabilities?.() ?? {}) as MediaTrackCapabilities & { torch?: boolean; focusMode?: string[] };
        if (caps.focusMode?.includes('continuous')) track.applyConstraints({ advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet] }).catch(() => {});
        if (caps.torch) setLicht(false);
        const v = videoRef.current!;
        v.srcObject = stream;
        await v.play().catch(() => {});
        setKamera('an');
        let laeuft = false;
        const takt = async () => {
          if (stop) return;
          if (!laeuft && !busyRef.current && v.videoWidth) {
            laeuft = true;
            try {
              const c = ausschnittVomVideo(1600);
              if (c) {
                const jetzt = Date.now();
                pufferRef.current = [...pufferRef.current.filter((b) => jetzt - b.t < PUFFER_MS), { c, schaerfe: bildSchaerfe(c), t: jetzt }];
                // Codes im ganzen Bild suchen (QR kann auch außerhalb des Rahmens liegen).
                // Bei niedriger Kameraauflösung doppelt vergrößert – sonst sind kleine QR-Module zu fein.
                const klein = v.videoWidth < 1000;
                const codes = await codesFinden(zeichnen(v, v.videoWidth, v.videoHeight, null, klein ? v.videoWidth * 2 : 1920, klein));
                const qr = codes.map((x) => (x.format === 'qr' ? leseQr(x.text) : null)).find(Boolean);
                const strich = codes.find((x) => x.format === 'strich');
                if (!busyRef.current && !stop) {
                  if (qr) {
                    qrRef.current = qr;
                    setCodeGefunden(true);
                    if (qrVollstaendig(qr)) {
                      busyRef.current = true;
                      fertig({ ...qr, scanQuelle: 'qr', scanBild: vorschauBild(c) });
                    } else ausloesen(null);
                  } else if (strich) {
                    setCodeGefunden(true);
                    ausloesen(strich.text);
                  }
                }
              }
            } catch {
              /* einzelnes Bild fehlerhaft – nächster Takt */
            } finally {
              laeuft = false;
            }
          }
          timer = window.setTimeout(takt, 250);
        };
        takt();
      } catch {
        if (!stop) setKamera('aus');
      }
    })();
    return () => {
      stop = true;
      clearTimeout(timer);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lichtUmschalten = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track || licht === null) return;
    const an = !licht;
    track.applyConstraints({ advanced: [{ torch: an } as MediaTrackConstraintSet] }).then(() => setLicht(an), () => setLicht(null));
  };

  const text =
    phase === 'lesen'
      ? `Karte wird gelesen … ${Math.round(fortschritt * 100)} %`
      : phase === 'erkannt'
        ? ergebnis?.scanQuelle === 'qr'
          ? 'QR-Code erkannt. Daten werden übernommen …'
          : 'Auftragskarte erkannt. Daten werden übernommen …'
        : kamera === 'aus'
          ? 'Kamera nicht verfügbar. Fotografieren Sie die Karte oder wählen Sie ein Foto.'
          : 'QR-Code oder Kartenkopf (Kunde bis Position) ausfüllend in den Rahmen halten.';

  return (
    <div
      className="safe-bottom"
      style={{ flex: 1, minHeight: 0, background: 'var(--tiefschwarz)', color: 'var(--weiss)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 0', gap: 20 }}
    >
      <div style={{ alignSelf: 'stretch', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onAbbrechen} style={darkBtn}>
          Abbrechen
        </button>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase' }}>Scannen</span>
        {licht !== null ? (
          <button onClick={lichtUmschalten} style={{ ...darkBtn, width: 72, display: 'flex', justifyContent: 'flex-end' }} aria-label={licht ? 'Licht aus' : 'Licht an'} aria-pressed={licht}>
            {licht ? <FlashlightOff size={24} aria-hidden /> : <Flashlight size={24} aria-hidden />}
          </button>
        ) : (
          <span style={{ width: 72 }} />
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        {/* Sucher: volle Breite, 3:2 – passt zum Kartenkopf */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '3 / 2' }}>
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
              {kamera === 'start' ? 'Kamera wird gestartet …' : 'Kamerabild · Rapportkarte'}
            </div>
          )}
          {ecke({ left: 0, top: 0 }, ['Left', 'Top'])}
          {ecke({ right: 0, top: 0 }, ['Right', 'Top'])}
          {ecke({ left: 0, bottom: 0 }, ['Left', 'Bottom'])}
          {ecke({ right: 0, bottom: 0 }, ['Right', 'Bottom'])}
          {codeGefunden && <div style={{ position: 'absolute', left: 24, right: 24, top: 'calc(50% - 2px)', height: 4, background: 'var(--signalrot)' }} />}
        </div>
        <div style={{ textAlign: 'center', fontSize: 16, lineHeight: '24px', maxWidth: 320 }} aria-live="polite">
          {text}
        </div>
        {hinweis && (
          <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, lineHeight: '20px', fontWeight: 600, maxWidth: 340 }}>
            <span style={{ width: 16, height: 4, marginTop: 8, background: 'var(--signalrot)', flex: 'none' }} />
            {hinweis}
          </div>
        )}
        {phase === 'kamera' && (
          <button
            onClick={() => (kamera === 'an' ? ausloesen(null) : fileRef.current?.click())}
            style={{ ...darkBtn, border: '2px solid var(--weiss)', borderRadius: 2, padding: '0 20px', height: 44 }}
          >
            {kamera === 'an' ? 'Karte lesen' : 'Karte fotografieren'}
          </button>
        )}
      </div>

      {phase === 'erkannt' && ergebnis && (
        <div style={{ alignSelf: 'stretch', padding: 16, background: 'var(--weiss)', color: 'var(--tiefschwarz)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase' }}>{ergebnis.scanQuelle === 'qr' ? 'QR-Code' : 'Erkannt'}</span>
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
            if (!f) return;
            // Foto: QR im ganzen Bild suchen, Texterkennung auf dem ganzen Foto
            const c = await blobToCanvas(f, 2400);
            const codes = await codesFinden(c).catch(() => []);
            const qr = codes.map((x) => (x.format === 'qr' ? leseQr(x.text) : null)).find(Boolean);
            if (qr) qrRef.current = qr;
            auswerten(c, codes.find((x) => x.format === 'strich')?.text ?? null);
          }}
        />
      ))}
      {phase === 'kamera' && (
        <button onClick={() => galerieRef.current?.click()} style={{ ...darkBtn, fontWeight: 400, fontSize: 14, minHeight: 32, marginTop: -8 }}>
          Foto aus Galerie wählen
        </button>
      )}
      <button onClick={onManuell} style={{ ...darkBtn, textDecoration: 'underline', textUnderlineOffset: 4 }}>
        Auftragsdaten manuell eingeben
      </button>
    </div>
  );
}
