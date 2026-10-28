import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Badge, Button, Toast } from './ds';
import { BandFehler } from './ui';
import { isoDate, deDate, uid } from './lib/format';
import { teilenOderSpeichern, type Format } from './lib/rapport';
import { buildDocx } from './lib/word';
import { buildPdf } from './lib/pdf';
import { loadEntwurf, loadGesendet, loadProfil, saveEntwurf, saveGesendet, saveProfil } from './lib/storage';
import type { Auftragsdaten, GesendeterRapport, Profil, Rapport } from './lib/types';
import { pruefe, type Errors } from './lib/pruefung';
import { Start } from './screens/Start';
import { Scan, type ScanErgebnis } from './screens/Scan';
import { AuftragStep, ArbeitenStep, MaterialStep, StundenStep, FahrtStep, FotosStep, UnterschriftStep } from './screens/Schritte';
import { RapportVorschau } from './screens/RapportVorschau';
import { KatalogSheet, ManuellSheet, ProfilSheet, Sheet } from './screens/Sheets';

export const STEPS = [
  ['auftrag', 'Auftrag', 'Auftragsdaten prüfen'],
  ['arbeiten', 'Arbeiten', 'Ausgeführte Arbeiten'],
  ['material', 'Material', 'Verwendetes Material'],
  ['stunden', 'Stunden', 'Arbeitszeit erfassen'],
  ['fahrt', 'Fahrt', 'Fahrzeit erfassen'],
  ['fotos', 'Fotos', 'Fotodokumentation'],
  ['unterschrift', 'Unterschrift', 'Abnahme vor Ort'],
  ['pdf', 'Rapport', 'Rapport prüfen'],
] as const;
export type StepId = (typeof STEPS)[number][0];
type Screen = 'start' | 'scan' | StepId;
type SheetId = 'katalog' | 'manuell' | 'profil' | null;

const LEER: Auftragsdaten = { kundeNr: '', kunde: '', strasse: '', ort: '', tel: '', projekt: '', auftrag: '', auftragText: '', pos: '', posText: '' };
const PROFIL_LEER: Profil = { name: '', q: 'F', standort: 'Werkstatt Dettingen' };

function neuerRapport(base: Partial<Auftragsdaten> & Partial<Pick<Rapport, 'scanBild' | 'scanQuelle'>>, profil: Profil, fromScan: boolean): Rapport {
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
    keinMaterial: false,
    fahrzeit: 0,
    fahrKm: 0,
    keineFahrt: false,
    stunden: [{ id: uid(), name: profil.name, q: profil.q, datum: deDate(datum), art: 'Montage', std: 0 }],
    fotos: [],
    sigAG: null,
    sigAN: null,
    agAbwesend: false,
  };
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
  /** Angetippter gesendeter Rapport (Auswahl: bearbeiten oder erneut teilen) */
  const [auswahl, setAuswahl] = useState<GesendeterRapport | null>(null);
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
    const ok = () => flash('Offline bereit', 'Die App funktioniert jetzt auch ohne Internet – Scannen und Rapport eingeschlossen.');
    window.addEventListener('offline-bereit', ok);
    return () => window.removeEventListener('offline-bereit', ok);
  }, [flash]);

  const clearError = useCallback((k: keyof Errors) => {
    setErrors((e) => {
      if (!e[k]) return e;
      const n = { ...e };
      delete n[k];
      return n;
    });
  }, []);

  const set = useCallback((p: Partial<Rapport>) => setD((s) => (s ? { ...s, ...p } : s)), []);
  const setFn = useCallback((fn: (r: Rapport) => Partial<Rapport>) => setD((s) => (s ? { ...s, ...fn(s) } : s)), []);

  const go = (s: Screen) => {
    setScreen(s);
    setErrors({});
    setBandErr(null);
    setSheet(null);
    scrollRef.current?.scrollTo(0, 0);
  };

  const starten = (base: Partial<Auftragsdaten> | ScanErgebnis, fromScan: boolean) => {
    setD(neuerRapport(base, profil, fromScan));
    go('auftrag');
  };

  const stepIdx = STEPS.findIndex((x) => x[0] === screen);
  const inFlow = stepIdx >= 0 && d;

  const format: Format = profil.format ?? 'docx';
  const formatWaehlen = (f: Format) => {
    const p = { ...profil, format: f };
    setProfil(p);
    saveProfil(p).catch(() => {});
  };

  /** Ist der aktuelle Entwurf die Korrektur eines bereits gesendeten Rapports? */
  const istKorrektur = !!d && gesendet.some((g) => g.rapport.id === d.id);

  const dokumentErzeugen = async (r: Rapport) => {
    const lfd = lfdNr(r, gesendet);
    const dateien: { blob: Blob; name: string }[] = [];
    if (format !== 'pdf') dateien.push(await buildDocx(r, lfd));
    if (format !== 'docx') dateien.push(await buildPdf(r, lfd));
    return dateien;
  };

  const gespeichertTitel = format === 'beide' ? 'Dateien gespeichert' : format === 'pdf' ? 'PDF gespeichert' : 'Word-Dokument gespeichert';

  /** Gesendeten Rapport wieder öffnen – beim erneuten Senden entsteht eine korrigierte Fassung. */
  const bearbeiten = (g: GesendeterRapport) => {
    setAuswahl(null);
    if (d && d.id === g.rapport.id) return go('auftrag');
    if (d && !confirm('Der angefangene Entwurf wird verworfen. Trotzdem bearbeiten?')) return;
    setD({ ...g.rapport, korrektur: (g.rapport.korrektur ?? 0) + 1 });
    go('auftrag');
  };

  const senden = async () => {
    if (!d || busy) return;
    setBusy(true);
    try {
      const dateien = await dokumentErzeugen(d);
      const ergebnis = await teilenOderSpeichern(dateien);
      if (ergebnis === 'abgebrochen') return;
      const name = dateien.map((x) => x.name).join(', ');
      const rapport = { ...d, scanBild: undefined };
      const jetzt = new Date().toISOString();
      const neu: GesendeterRapport[] = istKorrektur
        ? gesendet.map((g) => (g.rapport.id === d.id ? { ...g, dateiname: name, korrigiertAm: jetzt, rapport } : g))
        : [{ id: uid(), gesendetAm: jetzt, dateiname: name, rapport }, ...gesendet];
      setGesendet(neu);
      await saveGesendet(neu).catch(() => {});
      setD(null);
      go('start');
      flash(ergebnis === 'geteilt' ? (istKorrektur ? 'Korrektur gesendet' : 'Rapport gesendet') : gespeichertTitel, name);
    } catch {
      flash('Rapport konnte nicht erstellt werden', 'Bitte versuchen Sie es erneut.', 'fehler');
    } finally {
      setBusy(false);
    }
  };

  const teilen = async (r: Rapport) => {
    if (busy) return;
    setBusy(true);
    try {
      const dateien = await dokumentErzeugen(r);
      const e = await teilenOderSpeichern(dateien);
      if (e === 'gespeichert') flash(gespeichertTitel, dateien.map((x) => x.name).join(', '));
    } catch {
      flash('Rapport konnte nicht erstellt werden', 'Bitte versuchen Sie es erneut.', 'fehler');
    } finally {
      setBusy(false);
    }
  };

  const primary = () => {
    if (!d) return;
    if (screen === 'pdf') return senden();
    const err = pruefe(screen, d);
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
  const primaryLabel = busy ? 'Rapport wird erstellt …' : screen === 'pdf' ? (istKorrektur ? 'Korrektur senden' : 'Rapport senden') : STEPS[stepIdx + 1]?.[0] === 'pdf' ? 'Rapport erzeugen' : 'Weiter';

  return (
    <div className={'app' + (screen === 'scan' ? ' dunkel' : '')}>
      {screen === 'start' && (
        <Start
          profil={profil}
          entwurf={d}
          entwurfIstKorrektur={istKorrektur}
          heute={gesendet.filter((g) => g.gesendetAm.slice(0, 10) === heute || g.rapport.datum === heute)}
          onScan={() => go('scan')}
          onManuell={() => starten({}, false)}
          onFortsetzen={() => go('auftrag')}
          onVerwerfen={() => setD(null)}
          onProfil={() => setSheet('profil')}
          onAuswahl={setAuswahl}
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
            {screen === 'auftrag' && <AuftragStep d={d} set={set} errors={errors} clearError={clearError} />}
            {screen === 'arbeiten' && <ArbeitenStep d={d} set={set} errors={errors} clearError={clearError} />}
            {screen === 'material' && (
              <MaterialStep d={d} setFn={setFn} clearBand={() => setBandErr(null)} onKatalog={() => setSheet('katalog')} onManuell={() => setSheet('manuell')} />
            )}
            {screen === 'stunden' && <StundenStep d={d} setFn={setFn} clearBand={() => setBandErr(null)} />}
            {screen === 'fahrt' && <FahrtStep d={d} setFn={setFn} errors={errors} clearError={clearError} clearBand={() => setBandErr(null)} />}
            {screen === 'fotos' && (
              <FotosStep
                d={d}
                setFn={setFn}
                errors={errors}
                clearBand={() => setBandErr(null)}
                onFehler={(t) => flash('Foto konnte nicht geladen werden', t, 'fehler')}
              />
            )}
            {screen === 'unterschrift' && <UnterschriftStep d={d} set={set} clearBand={() => setBandErr(null)} />}
            {screen === 'pdf' && <RapportVorschau d={d} lfd={lfdNr(d, gesendet)} format={format} onFormat={formatWaehlen} />}
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
          <KatalogSheet
            d={d}
            setFn={(fn) => {
              setFn((r) => ({ ...fn(r), keinMaterial: false }));
              setBandErr(null);
            }}
            onManuell={() => setSheet('manuell')}
            onFertig={() => setSheet(null)}
          />
        </Sheet>
      )}
      {sheet === 'manuell' && d && (
        <Sheet title="Material händisch erfassen" onClose={() => setSheet(null)}>
          <ManuellSheet
            onSave={(m) => {
              setFn((r) => ({ material: [...r.material, m], keinMaterial: false }));
              setBandErr(null);
              setSheet(null);
            }}
          />
        </Sheet>
      )}
      {auswahl && (
        <Sheet title={[auswahl.rapport.pos || auswahl.rapport.auftrag, auswahl.rapport.posText || auswahl.rapport.auftragText].filter(Boolean).join(' · ') || 'Rapport'} onClose={() => setAuswahl(null)}>
          <div style={{ padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="klein-grau">
              Gesendet {new Date(auswahl.gesendetAm).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
              {auswahl.korrigiertAm && ` · korrigiert ${new Date(auswahl.korrigiertAm).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`}
            </span>
            <Button variant="primary" fullWidth onClick={() => bearbeiten(auswahl)}>
              Bearbeiten
            </Button>
            <span className="klein-grau">Nach dem Bearbeiten wird der Rapport als „Korrigierte Fassung“ neu gesendet.</span>
            <Button
              variant="outline"
              fullWidth
              disabled={busy}
              onClick={() => {
                const r = auswahl.rapport;
                setAuswahl(null);
                teilen(r);
              }}
            >
              Erneut teilen ({format === 'beide' ? 'Word + PDF' : format === 'pdf' ? 'PDF' : 'Word'})
            </Button>
          </div>
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

