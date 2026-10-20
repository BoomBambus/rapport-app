import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Camera, ImagePlus, Undo2 } from 'lucide-react';
import { Badge, Button, Checkbox, FieldError, Input } from '../ds';
import { Chip } from '../ui';
import { deDate, fmt, fmtHM, fmtStd, uhrzeit, uid } from '../lib/format';
import { blobToCanvas } from '../lib/ocr';
import { summeStd } from '../lib/pdf';
import { MIN_FOTOS, type Errors, type FeldFehler } from '../lib/pruefung';
import type { Art, Auftragsdaten, MaterialPos, Qualifikation, Rapport, StundenPos } from '../lib/types';

type Set = (p: Partial<Rapport>) => void;
type SetFn = (fn: (r: Rapport) => Partial<Rapport>) => void;

const pad16 = { padding: 16, display: 'flex', flexDirection: 'column' as const };

/** Rückgängig-Verlauf je Eintrag (Material-Zeile, Mitarbeiter): vorherige Werte als Stapel. */
function useVerlauf() {
  const [st, setSt] = useState<Record<string, number[]>>({});
  return {
    merke: (id: string, alt: number) => setSt((s) => ({ ...s, [id]: [...(s[id] ?? []), alt] })),
    zurueck: (id: string): number | undefined => {
      const stack = st[id];
      if (!stack?.length) return undefined;
      setSt((s) => ({ ...s, [id]: stack.slice(0, -1) }));
      return stack[stack.length - 1];
    },
    kann: (id: string) => !!st[id]?.length,
  };
}

/** Schnellknöpfe (+1 / +5 … oder +15 min …) und Rückgängig in einer Reihe. */
function Schnellwahl({ schritte, onAdd, onUndo, kannUndo, label }: { schritte: [string, number][]; onAdd: (n: number) => void; onUndo: () => void; kannUndo: boolean; label: string }) {
  return (
    <div className="schnell" role="group" aria-label={label}>
      {schritte.map(([t, n]) => (
        <button key={t} type="button" onClick={() => onAdd(n)}>
          {t}
        </button>
      ))}
      <button type="button" onClick={onUndo} disabled={!kannUndo} aria-label="Rückgängig" title="Rückgängig">
        <Undo2 size={20} strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}

// ---------- 1 · Auftrag ----------
export function AuftragStep({ d, set, errors, clearError }: { d: Rapport; set: Set; errors: Errors; clearError: (k: FeldFehler) => void }) {
  const f = (k: keyof Auftragsdaten) => ({
    value: d[k],
    error: errors[k as FeldFehler],
    onValue: (v: string) => {
      set({ [k]: v });
      clearError(k as FeldFehler);
    },
  });
  return (
    <div style={{ ...pad16, gap: 16 }}>
      {d.fromScan && (
        <div style={{ background: 'var(--blau-hell)', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', fontSize: 14, lineHeight: '20px' }}>
          <Badge variant="blau">Aus Scan</Badge>
          <span>Felder aus der Auftragskarte übernommen. Bitte prüfen.</span>
        </div>
      )}
      <div className="grid-nr">
        <Input label="Kunden-Nr." inputMode="numeric" {...f('kundeNr')} />
        <Input label="Kunde" required {...f('kunde')} />
      </div>
      <Input label="Straße und Hausnummer" required placeholder="z. B. Weiherstr. 12" {...f('strasse')} />
      <Input label="PLZ, Ort" required placeholder="z. B. 78465 Konstanz" {...f('ort')} />
      <Input label="Telefon" type="tel" placeholder="optional" {...f('tel')} />
      <Input label="Projekt" placeholder="optional" {...f('projekt')} />
      <div className="grid-nr">
        <Input label="Auftrag" required autoCapitalize="characters" {...f('auftrag')} />
        <Input label="Bezeichnung" {...f('auftragText')} />
      </div>
      <div className="grid-nr">
        <Input label="Position" required autoCapitalize="characters" {...f('pos')} />
        <Input label="Beschreibung" {...f('posText')} />
      </div>
    </div>
  );
}

// ---------- 2 · Arbeiten ----------
export function ArbeitenStep({ d, set, errors, clearError }: { d: Rapport; set: Set; errors: Errors; clearError: (k: FeldFehler) => void }) {
  return (
    <div style={{ ...pad16, gap: 24 }}>
      <Input
        label="Ausgeführte Arbeiten"
        required
        multiline
        rows={8}
        placeholder="Was wurde heute gemacht?"
        value={d.arbeiten}
        onValue={(v) => {
          set({ arbeiten: v });
          clearError('arbeiten');
        }}
        error={errors.arbeiten}
      />
      <Input
        label="Bemerkungen"
        multiline
        rows={4}
        placeholder="Mängel, offene Punkte, Nachlieferungen"
        hint="Erscheint im Rapport für den Kunden sichtbar."
        value={d.bemerkungen}
        onValue={(v) => set({ bemerkungen: v })}
      />
    </div>
  );
}

// ---------- 3 · Material ----------
const MENGE_SCHRITTE: [string, number][] = [
  ['+1', 1],
  ['+5', 5],
  ['+10', 10],
];

export function MaterialStep({ d, setFn, clearBand, onKatalog, onManuell }: { d: Rapport; setFn: SetFn; clearBand: () => void; onKatalog: () => void; onManuell: () => void }) {
  const verlauf = useVerlauf();
  const setMenge = (id: string, menge: number) => setFn((r) => ({ material: r.material.map((x) => (x.id === id ? { ...x, menge } : x)) }));
  return (
    <div style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column' }}>
      {!d.material.length && (
        <div style={{ padding: '16px', background: 'var(--blau-hell)', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 16, lineHeight: '24px' }}>
          <span>Noch kein Material erfasst. Wählen Sie aus dem Katalog oder erfassen Sie eine Position von Hand.</span>
          <Checkbox
            label="Kein Material benötigt"
            checked={!!d.keinMaterial}
            onChange={(v) => {
              setFn(() => ({ keinMaterial: v }));
              clearBand();
            }}
          />
        </div>
      )}
      {d.material.map((m: MaterialPos) => (
        <div key={m.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--linie)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="titel" style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700, overflowWrap: 'anywhere' }}>
                {m.name}
              </span>
              <span className="klein-grau">{(m.nr ? m.nr + ' · ' : '') + m.quelle}</span>
            </div>
            <span style={{ fontSize: 22, lineHeight: '28px', fontWeight: 700, whiteSpace: 'nowrap' }} aria-live="polite">
              {fmt(m.menge)} <span style={{ fontSize: 14, fontWeight: 400 }}>{m.einheit}</span>
            </span>
            <button
              className="x-btn"
              aria-label={m.name + ' entfernen'}
              style={{ width: 32, height: 28, fontSize: 24 }}
              onClick={() => setFn((r) => ({ material: r.material.filter((x) => x.id !== m.id) }))}
            >
              ×
            </button>
          </div>
          <Schnellwahl
            label={'Menge ' + m.name}
            schritte={MENGE_SCHRITTE}
            onAdd={(n) => {
              verlauf.merke(m.id, m.menge);
              setMenge(m.id, m.menge + n);
            }}
            onUndo={() => {
              const alt = verlauf.zurueck(m.id);
              if (alt !== undefined) setMenge(m.id, alt);
            }}
            kannUndo={verlauf.kann(m.id)}
          />
        </div>
      ))}
      <div className="grid-2" style={{ marginTop: 16 }}>
        <Button variant="outline" fullWidth onClick={onKatalog}>
          Aus Katalog
        </Button>
        <Button variant="outline" fullWidth onClick={onManuell}>
          Händisch
        </Button>
      </div>
    </div>
  );
}

// ---------- 4 · Stunden ----------
const QUALI: [Qualifikation, string][] = [
  ['M', 'Meister'],
  ['F', 'Facharb.'],
  ['H', 'Helfer'],
];
const ARTEN: Art[] = ['Werkstatt', 'Montage', 'Intern'];
const ZEIT_SCHRITTE: [string, number][] = [
  ['+15 min', 0.25],
  ['+30 min', 0.5],
  ['+1 h', 1],
];
const MAX_STD = 24;

export function StundenStep({ d, setFn, clearBand }: { d: Rapport; setFn: SetFn; clearBand: () => void }) {
  const verlauf = useVerlauf();
  const upd = (id: string, p: Partial<StundenPos>) => {
    setFn((r) => ({ stunden: r.stunden.map((x) => (x.id === id ? { ...x, ...p } : x)) }));
    clearBand();
  };
  return (
    <div style={{ ...pad16, gap: 16 }}>
      <div className="klein-grau">Reine Arbeitszeit vor Ort (zzgl. An-, Abfahrt und Rüstzeit).</div>
      {d.stunden.map((r) => (
        <div key={r.id} style={{ border: '1px solid var(--linie)', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 120px', gap: 12, alignItems: 'end' }}>
            <Input label="Name" placeholder="Mitarbeiter" value={r.name} onValue={(v) => upd(r.id, { name: v })} />
            <Input label="Datum" inputMode="numeric" value={r.datum} onValue={(v) => upd(r.id, { datum: v })} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="feld-titel">Qualifikation</span>
            <div className="grid-3">
              {QUALI.map(([k, l]) => (
                <Chip key={k} on={r.q === k} onClick={() => upd(r.id, { q: k })}>
                  {l}
                </Chip>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="feld-titel">Art</span>
            <div className="grid-3">
              {ARTEN.map((a) => (
                <Chip key={a} on={r.art === a} onClick={() => upd(r.id, { art: a })}>
                  {a}
                </Chip>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <span className="feld-titel">Stunden</span>
              <span aria-live="polite" style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span className="klein-grau">{fmtHM(r.std)}</span>
                <span style={{ fontSize: 22, lineHeight: '28px', fontWeight: 700 }}>{fmtStd(r.std)} Std</span>
              </span>
            </div>
            <Schnellwahl
              label={'Stunden ' + (r.name || 'Mitarbeiter')}
              schritte={ZEIT_SCHRITTE}
              onAdd={(n) => {
                verlauf.merke(r.id, r.std);
                upd(r.id, { std: Math.min(MAX_STD, r.std + n) });
              }}
              onUndo={() => {
                const alt = verlauf.zurueck(r.id);
                if (alt !== undefined) upd(r.id, { std: alt });
              }}
              kannUndo={verlauf.kann(r.id)}
            />
          </div>
          {d.stunden.length > 1 && (
            <button className="link-btn" style={{ alignSelf: 'flex-start' }} onClick={() => setFn((x) => ({ stunden: x.stunden.filter((y) => y.id !== r.id) }))}>
              Eintrag entfernen
            </button>
          )}
        </div>
      ))}
      <Button
        variant="outline"
        fullWidth
        onClick={() => setFn((x) => ({ stunden: [...x.stunden, { id: uid(), name: '', q: 'H', datum: deDate(x.datum), art: x.stunden[0]?.art ?? 'Montage', std: 0 }] }))}
      >
        + Mitarbeiter hinzufügen
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 16px', background: 'var(--blau-hell)' }}>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase' }}>Summe</span>
        <span style={{ fontSize: 20, fontWeight: 700 }}>{fmtStd(summeStd(d))} Std</span>
      </div>
    </div>
  );
}

// ---------- 5 · Fotos ----------
export function FotosStep({ d, setFn, errors, clearBand, onFehler }: { d: Rapport; setFn: SetFn; errors: Errors; clearBand: () => void; onFehler: (t: string) => void }) {
  const kameraRef = useRef<HTMLInputElement>(null);
  const galerieRef = useRef<HTMLInputElement>(null);
  const n = d.fotos.length;
  const laden = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = '';
    const z = uhrzeit();
    for (const f of files) {
      try {
        // Verkleinern, damit Entwurf und PDF handlich bleiben
        const src = (await blobToCanvas(f, 1600)).toDataURL('image/jpeg', 0.85);
        setFn((r) => ({ fotos: [...r.fotos, { id: uid(), name: '', zeit: z, src }] }));
        clearBand();
      } catch {
        onFehler(f.name);
      }
    }
  };
  const fehlt = Math.max(0, MIN_FOTOS - n);
  return (
    <div style={{ ...pad16, gap: 16 }}>
      <input ref={kameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={laden} />
      <input ref={galerieRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={laden} />
      {d.fotos.map((f, i) => {
        const leer = !f.name?.trim();
        return (
          <div key={f.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid var(--linie)' }}>
            <div style={{ position: 'relative', width: 96, flex: 'none', aspectRatio: '3 / 2', background: 'var(--blau-hell)', overflow: 'hidden', marginTop: 28 }}>
              <img src={f.src} alt={f.name || 'Foto ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Input
                label={`Foto ${i + 1} · ${f.zeit}`}
                required
                placeholder="z. B. Pfosten unten links"
                value={f.name ?? ''}
                onValue={(v) => {
                  setFn((r) => ({ fotos: r.fotos.map((x) => (x.id === f.id ? { ...x, name: v } : x)) }));
                  clearBand();
                }}
              />
              {errors.fotos && leer && <FieldError>{errors.fotos}</FieldError>}
            </div>
            <button className="x-btn" aria-label={'Foto ' + (i + 1) + ' entfernen'} style={{ width: 32, fontSize: 24, marginTop: 28 }} onClick={() => setFn((r) => ({ fotos: r.fotos.filter((x) => x.id !== f.id) }))}>
              ×
            </button>
          </div>
        );
      })}
      <div className="grid-2">
        <button className="foto-btn" onClick={() => kameraRef.current?.click()}>
          <Camera size={24} strokeWidth={2} aria-hidden />
          Foto aufnehmen
        </button>
        <button className="foto-btn" onClick={() => galerieRef.current?.click()}>
          <ImagePlus size={24} strokeWidth={2} aria-hidden />
          Aus Galerie
        </button>
      </div>
      <div className="klein-grau">
        {fehlt ? `Mindestens ${MIN_FOTOS} Fotos mit Bezeichnung – noch ${fehlt} ${fehlt === 1 ? 'Foto' : 'Fotos'}.` : `${n} Fotos · werden dem Rapport als Anhang beigefügt.`}
      </div>
    </div>
  );
}

// ---------- 6 · Unterschrift ----------
function SignaturPad({ value, onChange, label }: { value: string | null; onChange: (v: string | null) => void; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const changeRef = useRef(onChange);
  changeRef.current = onChange;

  useEffect(() => {
    const el = ref.current!;
    const ctx = el.getContext('2d')!;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#231e20';
    if (value) {
      const im = new Image();
      im.onload = () => ctx.drawImage(im, 0, 0);
      im.src = value;
    }
    let on = false;
    const pt = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return [((e.clientX - r.left) * el.width) / r.width, ((e.clientY - r.top) * el.height) / r.height] as const;
    };
    const down = (e: PointerEvent) => {
      on = true;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* egal */
      }
      const [x, y] = pt(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.1, y);
      ctx.stroke();
    };
    const move = (e: PointerEvent) => {
      if (!on) return;
      const [x, y] = pt(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    const end = () => {
      if (!on) return;
      on = false;
      changeRef.current(el.toDataURL('image/png'));
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointercancel', end);
    };
    // Nur beim Einhängen: danach zeichnet das Canvas selbst
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={ref}
      width={700}
      height={280}
      aria-label={label}
      style={{ width: '100%', height: 140, display: 'block', border: '1px solid var(--tiefschwarz)', borderRadius: 2, background: 'var(--weiss)', touchAction: 'none', cursor: 'crosshair' }}
    />
  );
}

export function UnterschriftStep({ d, set, clearBand }: { d: Rapport; set: Set; clearBand: () => void }) {
  // Zähler je Feld: „Löschen“ hängt das Canvas neu und leer ein
  const [neu, setNeu] = useState({ sigAG: 0, sigAN: 0 });
  const datum = deDate(d.datum);
  const block = (titel: string, key: 'sigAG' | 'sigAN', unten: ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="feld-titel">{titel}</span>
        <button
          className="link-btn"
          onClick={() => {
            set({ [key]: null });
            setNeu((n) => ({ ...n, [key]: n[key] + 1 }));
          }}
        >
          Löschen
        </button>
      </div>
      <SignaturPad
        key={neu[key]}
        label={'Unterschrift ' + titel}
        value={d[key]}
        onChange={(v) => {
          set({ [key]: v });
          clearBand();
        }}
      />
      {unten}
    </div>
  );
  return (
    <div style={{ ...pad16, gap: 24 }}>
      {block(
        'Auftraggeber',
        'sigAG',
        <>
          <span className="klein-grau">
            {datum}, {d.kunde || 'Auftraggeber'}
          </span>
          <Checkbox
            label="Auftraggeber nicht anwesend"
            checked={d.agAbwesend}
            onChange={(v) => {
              set({ agAbwesend: v });
              clearBand();
            }}
          />
        </>,
      )}
      {block(
        'Auftragnehmer',
        'sigAN',
        <span className="klein-grau">
          {datum}, {d.stunden[0]?.name || 'Auftragnehmer'}
        </span>,
      )}
    </div>
  );
}
