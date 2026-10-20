import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Logo } from '../ds';
import { code39Bars } from '../lib/code39';
import { deDate, fmt, fmtStd } from '../lib/format';
import { FUSSZEILE, rapportNr, stundenZeilen, summeStd } from '../lib/pdf';
import type { Rapport } from '../lib/types';

// HTML-Vorschau der ersten PDF-Seite (595 px = A4-Breite in pt), auf Bildschirmbreite skaliert.
const cell: CSSProperties = { padding: '3px 0' };
const MAT_COLS = '40px 36px 1fr';
const STD_COLS = '1fr 18px 58px 52px 28px';

export function PdfVorschau({ d, lfd, name }: { d: Rapport; lfd: number; name: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.56);
  useLayoutEffect(() => {
    const el = wrap.current!;
    const ro = new ResizeObserver(() => setZoom(Math.min(1, el.clientWidth / 595)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const datum = deDate(d.datum);
  const bars = code39Bars(d.pos || '');
  const std = stundenZeilen(d);
  const nFotos = d.fotos.length;

  return (
    <div style={{ padding: 16, background: 'var(--blau-hell)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, lineHeight: '18px' }}>
        <span style={{ overflowWrap: 'anywhere' }}>{name}</span>
        <span style={{ flex: 'none' }}>A4 · {nFotos ? 'inkl. Fotoanhang' : '1 Seite'}</span>
      </div>
      <div ref={wrap}>
        <div
          style={{
            zoom,
            width: 595,
            minHeight: 842,
            background: 'var(--weiss)',
            padding: '36px 40px 28px',
            fontSize: 10,
            lineHeight: '14px',
            color: 'var(--tiefschwarz)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Logo width={150} />
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 24, lineHeight: '28px', fontWeight: 700 }}>Rapport</span>
              <span>Nr. {rapportNr(d, lfd)}</span>
              <span>Datum {datum}</span>
            </div>
          </div>
          <div style={{ width: 40, height: 4, background: 'var(--signalrot)', marginLeft: -40 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontWeight: 700 }}>Kunde: {d.kundeNr}</span>
              <span>{d.kunde}</span>
              <span>{d.strasse}</span>
              <span>{d.ort}</span>
              <span>{d.tel}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span>
                <strong>Projekt:</strong> {d.projekt}
              </span>
              <span>
                <strong>Auftrag:</strong> {d.auftrag} {d.auftragText}
              </span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 120px', borderTop: '1px solid var(--tiefschwarz)', borderBottom: '1px solid var(--tiefschwarz)' }}>
            <span style={{ padding: '4px 0', fontWeight: 700 }}>Pos</span>
            <span style={{ padding: '4px 0', fontWeight: 700 }}>Beschreibung / Menge</span>
            <span style={{ padding: '4px 0', fontWeight: 700 }}>Barcode</span>
            <span style={{ padding: '4px 0', borderTop: '1px solid var(--linie)' }}>{d.pos}</span>
            <span style={{ padding: '4px 0', borderTop: '1px solid var(--linie)' }}>{d.posText}</span>
            <span style={{ padding: '4px 0', borderTop: '1px solid var(--linie)', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {d.pos && (
                <>
                  <span style={{ display: 'flex', height: 22, alignItems: 'stretch' }}>
                    {bars.map((b, i) => (
                      <span key={i} style={{ width: b.w * 0.72, background: b.dark ? 'var(--tiefschwarz)' : 'transparent' }} />
                    ))}
                  </span>
                  <span style={{ fontSize: 7, textAlign: 'center' }}>*{d.pos.toUpperCase()}*</span>
                </>
              )}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontWeight: 700 }}>Ausgeführte Arbeiten:</span>
            <span style={{ minHeight: 42, whiteSpace: 'pre-wrap' }}>{d.arbeiten}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontWeight: 700 }}>Bemerkungen:</span>
            <span style={{ minHeight: 28, whiteSpace: 'pre-wrap' }}>{d.bemerkungen}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, letterSpacing: '.3em', paddingBottom: 4 }}>MATERIAL</span>
              <div style={{ display: 'grid', gridTemplateColumns: MAT_COLS, borderTop: '1px solid var(--tiefschwarz)' }}>
                <span style={{ ...cell, fontWeight: 700 }}>Menge</span>
                <span style={{ ...cell, fontWeight: 700 }}>Einh.</span>
                <span style={{ ...cell, fontWeight: 700 }}>Bezeichnung</span>
              </div>
              {!d.material.length && d.keinMaterial && (
                <div style={{ borderTop: '1px solid var(--linie)', ...cell }}>Kein Material benötigt</div>
              )}
              {d.material.map((m) => (
                <div key={m.id} style={{ display: 'grid', gridTemplateColumns: MAT_COLS, borderTop: '1px solid var(--linie)' }}>
                  <span style={cell}>{fmt(m.menge)}</span>
                  <span style={cell}>{m.einheit}</span>
                  <span style={cell}>{m.name}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, letterSpacing: '.3em', paddingBottom: 4 }}>STUNDEN</span>
              <div style={{ display: 'grid', gridTemplateColumns: STD_COLS, borderTop: '1px solid var(--tiefschwarz)' }}>
                <span style={{ ...cell, fontWeight: 700 }}>Name</span>
                <span style={{ ...cell, fontWeight: 700 }}>*</span>
                <span style={{ ...cell, fontWeight: 700 }}>Datum</span>
                <span style={{ ...cell, fontWeight: 700 }}>Art</span>
                <span style={{ ...cell, fontWeight: 700, textAlign: 'right' }}>Std</span>
              </div>
              {std.map((r) => (
                <div key={r.id} style={{ display: 'grid', gridTemplateColumns: STD_COLS, borderTop: '1px solid var(--linie)' }}>
                  <span style={cell}>{r.name}</span>
                  <span style={cell}>{r.q}</span>
                  <span style={cell}>{r.datum.slice(0, 6)}</span>
                  <span style={cell}>{r.art}</span>
                  <span style={{ ...cell, textAlign: 'right' }}>{fmtStd(r.std)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--tiefschwarz)', padding: '3px 0', fontWeight: 700 }}>
                <span>Summe</span>
                <span>{fmtStd(summeStd(d))} Std</span>
              </div>
              <span style={{ fontSize: 8, lineHeight: '11px' }}>
                reine Arbeitszeit vor Ort (zzgl. An-, Abfahrt und Rüstzeit)
                <br />* M = Meister, F = Facharbeiter, H = Helfer
              </span>
            </div>
          </div>
          {nFotos > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontWeight: 700 }}>Fotodokumentation ({nFotos}) · Anhang</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {d.fotos.map((f) => (
                  <div key={f.id} style={{ width: 84, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ width: 84, height: 56, background: 'var(--blau-hell)', overflow: 'hidden' }}>
                      <img src={f.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontSize: 8, lineHeight: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, paddingTop: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ height: 50, display: 'flex', alignItems: 'flex-end' }}>
                {d.sigAG && !d.agAbwesend && <img src={d.sigAG} alt="" style={{ height: 50 }} />}
                {d.agAbwesend && <span style={{ fontStyle: 'italic' }}>Auftraggeber nicht anwesend</span>}
              </div>
              <div style={{ borderTop: '1px solid var(--tiefschwarz)', paddingTop: 2 }}>{datum}, Unterschrift Auftraggeber</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ height: 50, display: 'flex', alignItems: 'flex-end' }}>{d.sigAN && <img src={d.sigAN} alt="" style={{ height: 50 }} />}</div>
              <div style={{ borderTop: '1px solid var(--tiefschwarz)', paddingTop: 2 }}>{datum}, Unterschrift Auftragnehmer</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--linie)', paddingTop: 6, fontSize: 8, color: 'var(--tiefschwarz-gedaempft)' }}>{FUSSZEILE}</div>
        </div>
      </div>
    </div>
  );
}
