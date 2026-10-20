import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Camera } from 'lucide-react';
import { Badge, Button, Checkbox, Input } from '../ds';
import { Chip, Stepper } from '../ui';
import { TEXTBAUSTEINE } from '../data/katalog';
import { deDate, fmt, fmtStd, uhrzeit, uid } from '../lib/format';
import { blobToCanvas } from '../lib/ocr';
import { summeStd } from '../lib/pdf';
import type { Art, Auftragsdaten, MaterialPos, Qualifikation, Rapport, StundenPos } from '../lib/types';
import type { Errors } from '../App';

type Set = (p: Partial<Rapport>) => void;
type SetFn = (fn: (r: Rapport) => Partial<Rapport>) => void;

const pad16 = { padding: 16, display: 'flex', flexDirection: 'column' as const };

// ---------- 1 · Auftrag ----------
export function AuftragStep({ d, set, errors, clearErrors }: { d: Rapport; set: Set; errors: Errors; clearErrors: () => void }) {
  const f = (k: keyof Auftragsdaten) => ({
    value: d[k],
    onValue: (v: string) => {
      set({ [k]: v });
      if (errors.auftrag && k === 'auftrag') clearErrors();
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
        <Input label="Kunde" {...f('kunde')} />
      </div>
      <Input label="Straße" {...f('strasse')} />
      <div className="grid-2">
        <Input label="PLZ, Ort" {...f('ort')} />
        <Input label="Telefon" type="tel" {...f('tel')} />
      </div>
      <Input label="Projekt" placeholder="optional" {...f('projekt')} />
      <div className="grid-nr">
        <Input label="Auftrag" required error={errors.auftrag} autoCapitalize="characters" {...f('auftrag')} />
        <Input label="Bezeichnung" {...f('auftragText')} />
      </div>
      <div className="grid-nr">
        <Input label="Position" autoCapitalize="characters" {...f('pos')} />
        <Input label="Beschreibung" {...f('posText')} />
      </div>
    </div>
  );
}

// ---------- 2 · Arbeiten ----------
export function ArbeitenStep({ d, set, errors, clearErrors }: { d: Rapport; set: Set; errors: Errors; clearErrors: () => void }) {
  const baustein = (t: string) => {
    const a = d.arbeiten;
    set({ arbeiten: (a ? a.replace(/\s*$/, '') + (/[.!]$/.test(a.trim()) ? ' ' : '. ') : '') + t + '.' });
    if (errors.arbeiten) clearErrors();
  };
  return (
    <div style={{ ...pad16, gap: 24 }}>
      <Input
        label="Ausgeführte Arbeiten"
        required
        multiline
        rows={7}
        placeholder="Was wurde heute gemacht?"
        value={d.arbeiten}
        onValue={(v) => {
          set({ arbeiten: v });
          if (errors.arbeiten) clearErrors();
        }}
        error={errors.arbeiten}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {TEXTBAUSTEINE.map((t) => (
          <button key={t} type="button" className="baustein" onClick={() => baustein(t)}>
            + {t}
          </button>
        ))}
      </div>
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
const schritt = (m: MaterialPos) => (m.einheit === 'Stk' || m.einheit === 'Psch' ? 1 : 0.5);

export function MaterialStep({ d, setFn, onKatalog, onManuell }: { d: Rapport; setFn: SetFn; onKatalog: () => void; onManuell: () => void }) {
  const upd = (id: string, fn: (m: MaterialPos) => MaterialPos) => setFn((r) => ({ material: r.material.map((x) => (x.id === id ? fn(x) : x)) }));
  return (
    <div style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column' }}>
      {!d.material.length && (
        <div style={{ padding: '24px 16px', background: 'var(--blau-hell)', marginTop: 8, fontSize: 16, lineHeight: '24px' }}>
          Noch kein Material erfasst. Wählen Sie aus dem Katalog oder erfassen Sie eine Position von Hand.
        </div>
      )}
      {d.material.map((m) => (
        <div key={m.id} className="zeile">
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span className="titel">{m.name}</span>
            <span className="meta">{(m.nr ? m.nr + ' · ' : '') + m.quelle}</span>
          </div>
          <Stepper
            label={'Menge ' + m.name}
            value={fmt(m.menge)}
            unit={m.einheit}
            onDec={() => upd(m.id, (x) => ({ ...x, menge: Math.max(schritt(x), x.menge - schritt(x)) }))}
            onInc={() => upd(m.id, (x) => ({ ...x, menge: x.menge + schritt(x) }))}
          />
          <button
            className="x-btn"
            aria-label="entfernen"
            style={{ width: 32, fontSize: 24 }}
            onClick={() => setFn((r) => ({ material: r.material.filter((x) => x.id !== m.id) }))}
          >
            ×
          </button>
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

export function StundenStep({ d, setFn, clearBand }: { d: Rapport; setFn: SetFn; clearBand: () => void }) {
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span className="feld-titel">Stunden</span>
            <Stepper
              gross
              label={'Stunden ' + (r.name || 'Mitarbeiter')}
              value={fmtStd(r.std)}
              onDec={() => upd(r.id, { std: Math.max(0, r.std - 0.5) })}
              onInc={() => upd(r.id, { std: Math.min(16, r.std + 0.5) })}
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
export function FotosStep({ d, setFn, onFehler }: { d: Rapport; setFn: SetFn; onFehler: (t: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const n = d.fotos.length;
  return (
    <div style={{ ...pad16, gap: 16 }}>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        style={{ display: 'none' }}
        onChange={async (e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = '';
          const z = uhrzeit();
          for (const f of files) {
            try {
              // Verkleinern, damit Entwurf und PDF handlich bleiben
              const src = (await blobToCanvas(f, 1600)).toDataURL('image/jpeg', 0.85);
              setFn((r) => ({ fotos: [...r.fotos, { id: uid(), zeit: z, src }] }));
            } catch {
              onFehler(f.name);
            }
          }
        }}
      />
      <div className="grid-3">
        {d.fotos.map((f, i) => (
          <div key={f.id} style={{ position: 'relative', aspectRatio: '1', background: 'var(--blau-hell)', overflow: 'hidden' }}>
            <img src={f.src} alt={'Foto ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', left: 0, bottom: 0, padding: '2px 6px', background: 'var(--weiss)', fontSize: 12, lineHeight: '16px' }}>{f.zeit}</div>
            <button
              aria-label="Foto entfernen"
              onClick={() => setFn((r) => ({ fotos: r.fotos.filter((x) => x.id !== f.id) }))}
              style={{ appearance: 'none', position: 'absolute', right: 0, top: 0, width: 32, height: 32, border: 0, background: 'var(--weiss)', font: '400 20px/1 var(--font-sans)', color: 'var(--tiefschwarz)', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          className="baustein"
          onClick={() => ref.current?.click()}
          style={{ aspectRatio: '1', border: '2px dashed var(--tiefschwarz)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, font: '600 14px/18px var(--font-sans)' }}
        >
          <Camera size={28} strokeWidth={2} aria-hidden />
          Foto
        </button>
      </div>
      <div className="klein-grau">{n ? `${n} ${n === 1 ? 'Foto wird' : 'Fotos werden'} dem Rapport als Anhang beigefügt.` : 'Optional. Fotos werden dem Rapport als Anhang beigefügt.'}</div>
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
