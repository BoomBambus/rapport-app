import { useEffect, useState, type ReactNode } from 'react';
import { Button, Input } from '../ds';
import { Chip } from '../ui';
import { EINHEITEN, KATALOG, KATEGORIEN, type Artikel } from '../data/katalog';
import { fmt, parseZahl, uid } from '../lib/format';
import type { MaterialPos, Profil, Qualifikation, Rapport } from '../lib/types';

/** Untere Ebene mit Overlay, rotem Strich und Titel. */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--overlay)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', zIndex: 10 }}>
      <div onClick={onClose} style={{ flex: 1 }} />
      <div role="dialog" aria-modal="true" aria-label={title} style={{ background: 'var(--weiss)', boxShadow: 'var(--shadow-float)', maxHeight: '88%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 48, height: 4, background: 'var(--signalrot)' }} />
        <div style={{ padding: '12px 8px 8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, lineHeight: '26px', fontWeight: 700 }}>{title}</span>
          <button className="x-btn" aria-label="Schließen" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function KatalogSheet({ d, setFn, onManuell, onFertig }: { d: Rapport; setFn: (fn: (r: Rapport) => Partial<Rapport>) => void; onManuell: () => void; onFertig: () => void }) {
  const [suche, setSuche] = useState('');
  const [filter, setFilter] = useState('Alle');
  const q = suche.trim().toLowerCase();
  const rows = KATALOG.filter((k) => (filter === 'Alle' || k.kat === filter) && (!q || (k.name + ' ' + k.nr).toLowerCase().includes(q)));
  const add = (k: Artikel) =>
    setFn((r) => {
      const ex = r.material.find((x) => x.nr === k.nr);
      return {
        material: ex
          ? r.material.map((x) => (x === ex ? { ...x, menge: x.menge + 1 } : x))
          : [...r.material, { id: uid(), nr: k.nr, name: k.name, einheit: k.einheit, menge: 1, quelle: 'Katalog' }],
      };
    });
  return (
    <>
      <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--linie)' }}>
        <Input placeholder="Suchen: Rohr, M12, 100224 …" aria-label="Katalog durchsuchen" enterKeyHint="search" value={suche} onValue={setSuche} />
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {KATEGORIEN.map((c) => (
            <Chip key={c} klein on={filter === c} onClick={() => setFilter(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>
      <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '0 16px' }}>
        {rows.map((k) => {
          const ex = d.material.find((x) => x.nr === k.nr);
          return (
            <div key={k.nr} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--linie)' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 600 }}>{k.name}</span>
                <span className="klein-grau">
                  {k.nr} · {k.einheit}
                  {ex && ` · ${fmt(ex.menge)} ${k.einheit} im Rapport`}
                </span>
              </div>
              <button
                className="chip"
                aria-pressed={!!ex}
                aria-label={k.name + ' hinzufügen'}
                onClick={() => add(k)}
                style={{ flex: 'none', minWidth: 44, padding: '0 10px', borderWidth: 2 }}
              >
                {ex ? '+1' : '+'}
              </button>
            </div>
          );
        })}
        {!rows.length && <div style={{ padding: '24px 0', fontSize: 16, lineHeight: '24px' }}>Kein Artikel gefunden. Erfassen Sie das Material von Hand.</div>}
      </div>
      <div className="grid-2 safe-bottom" style={{ paddingTop: 12, paddingLeft: 16, paddingRight: 16, borderTop: '1px solid var(--linie)' }}>
        <Button variant="outline" fullWidth onClick={onManuell}>
          Händisch erfassen
        </Button>
        <Button variant="primary" fullWidth onClick={onFertig}>
          Fertig
        </Button>
      </div>
    </>
  );
}

export function ManuellSheet({ onSave }: { onSave: (m: MaterialPos) => void }) {
  const [bez, setBez] = useState('');
  const [menge, setMenge] = useState('1');
  const [einheit, setEinheit] = useState('Stk');
  const [err, setErr] = useState<string | undefined>();
  return (
    <div className="safe-bottom" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
      <Input
        label="Bezeichnung"
        required
        placeholder="z. B. Abdeckkappe Ø 42"
        value={bez}
        onValue={(v) => {
          setBez(v);
          setErr(undefined);
        }}
        error={err}
      />
      <Input label="Menge" inputMode="decimal" value={menge} onValue={setMenge} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="feld-titel">Einheit</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
          {EINHEITEN.map((u) => (
            <Chip key={u} on={einheit === u} onClick={() => setEinheit(u)}>
              <span style={{ fontSize: 14 }}>{u}</span>
            </Chip>
          ))}
        </div>
      </div>
      <Button
        variant="primary"
        fullWidth
        onClick={() => {
          if (!bez.trim()) return setErr('Bitte geben Sie eine Bezeichnung ein.');
          const mg = parseZahl(menge);
          onSave({ id: uid(), nr: '', name: bez.trim(), einheit, menge: mg > 0 ? mg : 1, quelle: 'Händisch' });
        }}
      >
        Übernehmen
      </Button>
    </div>
  );
}

export function ProfilSheet({ profil, onSave }: { profil: Profil; onSave: (p: Profil) => void }) {
  const [p, setP] = useState(profil);
  const [err, setErr] = useState<string | undefined>();
  const Q: [Qualifikation, string][] = [
    ['M', 'Meister'],
    ['F', 'Facharb.'],
    ['H', 'Helfer'],
  ];
  return (
    <div className="safe-bottom" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        label="Name"
        required
        placeholder="z. B. J. Keller"
        autoComplete="name"
        value={p.name}
        onValue={(v) => {
          setP({ ...p, name: v });
          setErr(undefined);
        }}
        error={err}
        hint="Wird als Auftragnehmer und im ersten Stunden-Eintrag vorbelegt."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="feld-titel">Qualifikation</span>
        <div className="grid-3">
          {Q.map(([k, l]) => (
            <Chip key={k} on={p.q === k} onClick={() => setP({ ...p, q: k })}>
              {l}
            </Chip>
          ))}
        </div>
      </div>
      <Input label="Standort" value={p.standort} onValue={(v) => setP({ ...p, standort: v })} />
      <Button variant="primary" fullWidth onClick={() => (p.name.trim() ? onSave({ ...p, name: p.name.trim() }) : setErr('Bitte geben Sie Ihren Namen ein.'))}>
        Speichern
      </Button>
    </div>
  );
}
