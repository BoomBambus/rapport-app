import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Badge, Button, Toast } from './ds';
import { BandFehler } from './ui';
import { isoDate, deDate, uid } from './lib/format';
import { buildPdf, dateiname, teilenOderSpeichern } from './lib/pdf';
import { loadEntwurf, loadGesendet, loadProfil, saveEntwurf, saveGesendet, saveProfil } from './lib/storage';
import type { Auftragsdaten, GesendeterRapport, Profil, Rapport } from './lib/types';
import { Start } from './screens/Start';
import { Scan } from './screens/Scan';
import { AuftragStep, ArbeitenStep, MaterialStep, StundenStep, FotosStep, UnterschriftStep } from './screens/Schritte';
import { PdfVorschau } from './screens/PdfVorschau';
import { KatalogSheet, ManuellSheet, ProfilSheet, Sheet } from './screens/Sheets';

export const STEPS = [
  ['auftrag', 'Auftrag', 'Auftragsdaten prüfen'],
  ['arbeiten', 'Arbeiten', 'Ausgeführte Arbeiten'],
  ['material', 'Material', 'Verwendetes Material'],
  ['stunden', 'Stunden', 'Arbeitszeit erfassen'],
  ['fotos', 'Fotos', 'Fotodokumentation'],
  ['unterschrift', 'Unterschrift', 'Abnahme vor Ort'],
  ['pdf', 'Rapport', 'Rapport prüfen'],
] as const;
export type StepId = (typeof STEPS)[number][0];
type Screen = 'start' | 'scan' | StepId;
type SheetId = 'katalog' | 'manuell' | 'profil' | null;
export type Errors = Partial<Record<'auftrag' | 'arbeiten', string>>;

const LEER: Auftragsdaten = { kundeNr: '', kunde: '', strasse: '', ort: '', tel: '', projekt: '', auftrag: '', auftragText: '', pos: '', posText: '' };
const PROFIL_LEER: Profil = { name: '', q: 'F', standort: 'Werkstatt Dettingen' };

function neuerRapport(base: Partial<Auftragsdaten>, profil: Profil, fromScan: boolean): Rapport {
  const datum = isoDate();
  return {
    ...LEER,
    ...base,
    id: uid(),
    datum,
    fromScan,
    arbeiten: '',
    bemerkungen: '',
    material: [],
    stunden: [{ id: uid(), name: profil.name, q: profil.q, datum: deDate(datum), art: 'Montage', std: 0 }],
    fotos: [],
    sigAG: null,
    sigAN: null,
    agAbwesend: false,
  };
}

function validate(id: StepId, d: Rapport): { errors?: Errors; bandErr?: string } | null {
  if (id === 'auftrag' && !d.auftrag.trim()) return { errors: { auftrag: 'Bitte geben Sie die Auftragsnummer ein.' } };
  if (id === 'arbeiten' && !d.arbeiten.trim()) return { errors: { arbeiten: 'Bitte beschreiben Sie die ausgeführten Arbeiten.' } };
  if (id === 'stunden' && !d.stunden.some((r) => r.name.trim() && r.std > 0)) return { bandErr: 'Bitte erfassen Sie mindestens einen Mitarbeiter mit Stunden.' };
  if (id === 'unterschrift') {
    if (!d.sigAN) return { bandErr: 'Bitte unterschreiben Sie als Auftragnehmer.' };
    if (!d.sigAG && !d.agAbwesend) return { bandErr: 'Unterschrift des Auftraggebers fehlt – oder „nicht anwesend“ wählen.' };
  }
  return null;
}

/** Laufende Nummer: wievielter Rapport zu dieser Position (aus den gesendeten der letzten Tage). */
const lfdNr = (d: Rapport, gesendet: GesendeterRapport[]) => {
  const key = d.pos || d.auftrag;
  const frueher = gesendet.filter((g) => (g.rapport.pos || g.rapport.auftrag) === key && g.rapport.id !== d.id).length;
  return frueher + 1;
};

export default function App() {
  const [geladen, setGeladen] = useState(false);
  const [screen, setScreen] = useState<Screen>('start');
  const [d, setD] = useState<Rapport | null>(null);
  const [profil, setProfil] = useState<Profil>(PROFIL_LEER);
  const [gesendet, setGesendet] = useState<GesendeterRapport[]>([]);
  const [sheet, setSheet] = useState<SheetId>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [bandErr, setBandErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ title: string; text: string; tone: 'info' | 'fehler' } | null>(null);
  const toastTimer = useRef<number>();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Laden aus IndexedDB
  useEffect(() => {
    Promise.all([loadEntwurf(), loadGesendet(), loadProfil()])
      .then(([e, g, p]) => {
        if (e) setD(e);
        setGesendet(g);
        if (p) setProfil(p);
      })
      .catch(() => {})
      .finally(() => setGeladen(true));
  }, []);

  // Entwurf bei jeder Änderung sichern (leicht verzögert)
  useEffect(() => {
    if (!geladen) return;
    const t = window.setTimeout(() => saveEntwurf(d).catch(() => {}), 400);
    return () => clearTimeout(t);
  }, [d, geladen]);

  const flash = useCallback((title: string, text: string, tone: 'info' | 'fehler' = 'info') => {
    setToast({ title, text, tone });
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4500);
  }, []);

  useEffect(() => {
    const ok = () => flash('Offline bereit', 'Die App funktioniert jetzt auch ohne Internet – Scannen und PDF eingeschlossen.');
    window.addEventListener('offline-bereit', ok);
    return () => window.removeEventListener('offline-bereit', ok);
  }, [flash]);

  const set = useCallback((p: Partial<Rapport>) => setD((s) => (s ? { ...s, ...p } : s)), []);
  const setFn = useCallback((fn: (r: Rapport) => Partial<Rapport>) => setD((s) => (s ? { ...s, ...fn(s) } : s)), []);

  const go = (s: Screen) => {
    setScreen(s);
    setErrors({});
    setBandErr(null);
    setSheet(null);
    scrollRef.current?.scrollTo(0, 0);
  };

  const starten = (base: Partial<Auftragsdaten>, fromScan: boolean) => {
    setD(neuerRapport(base, profil, fromScan));
    go('auftrag');
  };

  const stepIdx = STEPS.findIndex((x) => x[0] === screen);
  const inFlow = stepIdx >= 0 && d;

  const pdfErzeugen = async (r: Rapport) => {
    const lfd = lfdNr(r, gesendet);
    return buildPdf(r, lfd);
  };

  const senden = async () => {
    if (!d || busy) return;
    setBusy(true);
    try {
      const { blob, name } = await pdfErzeugen(d);
      const ergebnis = await teilenOderSpeichern(blob, name);
      if (ergebnis === 'abgebrochen') return;
      const neu: GesendeterRapport[] = [{ id: uid(), gesendetAm: new Date().toISOString(), dateiname: name, rapport: d }, ...gesendet];
      setGesendet(neu);
      await saveGesendet(neu).catch(() => {});
      setD(null);
      go('start');
      flash(ergebnis === 'geteilt' ? 'Rapport gesendet' : 'PDF heruntergeladen', name);
    } catch {
      flash('PDF konnte nicht erstellt werden', 'Bitte versuchen Sie es erneut.', 'fehler');
    } finally {
      setBusy(false);
    }
  };

  const teilen = async (r: Rapport) => {
    if (busy) return;
    setBusy(true);
    try {
      const { blob, name } = await pdfErzeugen(r);
      const e = await teilenOderSpeichern(blob, name);
      if (e === 'gespeichert') flash('PDF heruntergeladen', name);
    } catch {
      flash('PDF konnte nicht erstellt werden', 'Bitte versuchen Sie es erneut.', 'fehler');
    } finally {
      setBusy(false);
    }
  };

  const primary = () => {
    if (!d) return;
    if (screen === 'pdf') return senden();
    const err = validate(screen as StepId, d);
    if (err) {
      setErrors(err.errors ?? {});
      setBandErr(err.bandErr ?? null);
      return;
    }
    go(STEPS[stepIdx + 1][0]);
  };

  const back = () => go(stepIdx > 0 ? STEPS[stepIdx - 1][0] : 'start');

  const profilSpeichern = (p: Profil) => {
    setProfil(p);
    saveProfil(p).catch(() => {});
    // Leeren ersten Stunden-Eintrag im Entwurf mit dem Namen füllen
    setD((s) => (s && s.stunden[0] && !s.stunden[0].name ? { ...s, stunden: s.stunden.map((r, i) => (i === 0 ? { ...r, name: p.name, q: p.q } : r)) } : s));
    setSheet(null);
  };

  if (!geladen) return <div className="app" />;

  const heute = isoDate();
  const primaryLabel = busy ? 'PDF wird erstellt …' : screen === 'pdf' ? 'Rapport senden' : stepIdx === 5 ? 'Rapport erzeugen' : 'Weiter';

  return (
    <div className={'app' + (screen === 'scan' ? ' dunkel' : '')}>
      {screen === 'start' && (
        <Start
          profil={profil}
          entwurf={d}
          heute={gesendet.filter((g) => g.gesendetAm.slice(0, 10) === heute || g.rapport.datum === heute)}
          onScan={() => go('scan')}
          onManuell={() => starten({}, false)}
          onFortsetzen={() => go('auftrag')}
          onVerwerfen={() => setD(null)}
          onProfil={() => setSheet('profil')}
          onTeilen={(g) => teilen(g.rapport)}
        />
      )}

      {screen === 'scan' && <Scan onAbbrechen={() => go('start')} onErkannt={(f) => starten(f, true)} onManuell={() => starten({}, false)} />}

      {inFlow && (
        <>
          <div style={{ flex: 'none', borderBottom: '1px solid var(--linie)' }}>
            <div style={{ height: 52, padding: '0 16px 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={back}
                style={{
                  appearance: 'none',
                  border: 0,
                  background: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  minHeight: 44,
                  padding: '0 8px',
                  font: '600 16px/24px var(--font-sans)',
                  color: 'var(--tiefschwarz)',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={20} strokeWidth={2} aria-hidden />
                Zurück
              </button>
              <Badge variant="rahmen">{d.pos || d.auftrag || 'Neu'}</Badge>
            </div>
            <div style={{ padding: '4px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4 }} aria-hidden>
                {STEPS.map((_, n) => (
                  <div key={n} style={{ flex: 1, height: 4, background: n <= stepIdx ? 'var(--tiefschwarz)' : 'var(--linie)' }} />
                ))}
              </div>
              <div className="sperr" style={{ marginTop: 4 }}>
                Schritt {stepIdx + 1} von {STEPS.length}
              </div>
              <h1 style={{ margin: 0, fontSize: 24, lineHeight: '30px', fontWeight: 700 }}>{STEPS[stepIdx][2]}</h1>
            </div>
            <div style={{ width: 48, height: 4, background: 'var(--signalrot)', margin: '12px 0 0' }} />
          </div>

          <div className="scroll" ref={scrollRef}>
            {screen === 'auftrag' && <AuftragStep d={d} set={set} errors={errors} clearErrors={() => setErrors({})} />}
            {screen === 'arbeiten' && <ArbeitenStep d={d} set={set} errors={errors} clearErrors={() => setErrors({})} />}
            {screen === 'material' && <MaterialStep d={d} setFn={setFn} onKatalog={() => setSheet('katalog')} onManuell={() => setSheet('manuell')} />}
            {screen === 'stunden' && <StundenStep d={d} setFn={setFn} clearBand={() => setBandErr(null)} />}
            {screen === 'fotos' && <FotosStep d={d} setFn={setFn} onFehler={(t) => flash('Foto konnte nicht geladen werden', t, 'fehler')} />}
            {screen === 'unterschrift' && <UnterschriftStep d={d} set={set} clearBand={() => setBandErr(null)} />}
            {screen === 'pdf' && <PdfVorschau d={d} lfd={lfdNr(d, gesendet)} name={dateiname(d)} />}
          </div>

          <div className="safe-bottom" style={{ flex: 'none', background: 'var(--menge-blau)', paddingTop: 16, paddingLeft: 16, paddingRight: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bandErr && <BandFehler>{bandErr}</BandFehler>}
            <div style={{ display: 'flex', gap: 12 }}>
              {screen === 'pdf' && (
                <Button variant="outline" onClick={() => teilen(d)} disabled={busy}>
                  Teilen
                </Button>
              )}
              <div style={{ flex: 1 }}>
                <Button variant="primary" fullWidth onClick={primary} disabled={busy}>
                  {primaryLabel}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {sheet === 'katalog' && d && (
        <Sheet title="Materialkatalog" onClose={() => setSheet(null)}>
          <KatalogSheet d={d} setFn={setFn} onManuell={() => setSheet('manuell')} onFertig={() => setSheet(null)} />
        </Sheet>
      )}
      {sheet === 'manuell' && d && (
        <Sheet title="Material händisch erfassen" onClose={() => setSheet(null)}>
          <ManuellSheet
            onSave={(m) => {
              setFn((r) => ({ material: [...r.material, m] }));
              setSheet(null);
            }}
          />
        </Sheet>
      )}
      {sheet === 'profil' && (
        <Sheet title="Angemeldet als" onClose={() => setSheet(null)}>
          <ProfilSheet profil={profil} onSave={profilSpeichern} />
        </Sheet>
      )}

      {toast && (
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 'calc(24px + env(safe-area-inset-bottom))', zIndex: 20 }}>
          <Toast title={toast.title} tone={toast.tone} onClose={() => setToast(null)} style={{ width: '100%' }}>
            {toast.text}
          </Toast>
        </div>
      )}
    </div>
  );
}

