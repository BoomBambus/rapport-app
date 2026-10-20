import { ScanBarcode } from 'lucide-react';
import { Badge, Card, Eyebrow, Logo } from '../ds';
import { fmtStd, langDatum } from '../lib/format';
import { summeStd } from '../lib/pdf';
import { QUALI_LANG, type GesendeterRapport, type Profil, type Rapport } from '../lib/types';

export function Start({
  profil,
  entwurf,
  heute,
  onScan,
  onManuell,
  onFortsetzen,
  onVerwerfen,
  onProfil,
  onTeilen,
}: {
  profil: Profil;
  entwurf: Rapport | null;
  heute: GesendeterRapport[];
  onScan: () => void;
  onManuell: () => void;
  onFortsetzen: () => void;
  onVerwerfen: () => void;
  onProfil: () => void;
  onTeilen: (g: GesendeterRapport) => void;
}) {
  return (
    <div className="scroll" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 8 }}>
        <Logo width={196} />
      </div>
      <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Eyebrow>Tagesrapport</Eyebrow>
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: '34px', fontWeight: 700 }}>{langDatum()}</h1>
      </div>

      <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {entwurf && (
          <Card variant="kasten" eyebrow="Entwurf" title={[entwurf.pos || entwurf.auftrag || 'Neuer Rapport', entwurf.posText || entwurf.auftragText].filter(Boolean).join(' · ')} onClick={onFortsetzen}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <span>{entwurf.kunde || 'Rapport fortsetzen'}</span>
              <button
                className="link-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Entwurf verwerfen? Eingaben, Fotos und Unterschriften gehen verloren.')) onVerwerfen();
                }}
              >
                Verwerfen
              </button>
            </div>
          </Card>
        )}
        <Card variant="band" stroke title="Auftragskarte scannen" onClick={onScan}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <span style={{ flex: 1 }}>Barcode der Rapportkarte erfassen. Kunde, Auftrag und Position werden übernommen.</span>
            <ScanBarcode size={40} strokeWidth={2} style={{ flex: 'none' }} aria-hidden />
          </div>
        </Card>
        <button
          onClick={onManuell}
          style={{
            appearance: 'none',
            border: 0,
            background: 'none',
            padding: '10px 0',
            minHeight: 44,
            textAlign: 'left',
            font: '600 16px/24px var(--font-sans)',
            color: 'var(--tiefschwarz)',
            textDecoration: 'underline',
            textUnderlineOffset: 4,
            cursor: 'pointer',
          }}
        >
          Ohne Karte beginnen →
        </button>
      </div>

      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <Eyebrow style={{ marginBottom: 8 }}>Heute</Eyebrow>
        {heute.length === 0 && <div className="klein-grau" style={{ padding: '14px 0', borderBottom: '1px solid var(--linie)' }}>Noch kein Rapport gesendet.</div>}
        {heute.map((g) => {
          const r = g.rapport;
          return (
            <button
              key={g.id}
              onClick={() => onTeilen(g)}
              title="PDF erneut teilen"
              style={{
                appearance: 'none',
                background: 'none',
                border: 0,
                borderBottom: '1px solid var(--linie)',
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: '14px 0',
                textAlign: 'left',
                cursor: 'pointer',
                color: 'var(--tiefschwarz)',
                font: 'inherit',
              }}
            >
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700 }}>
                  {r.pos || r.auftrag} · {r.posText || r.auftragText || 'Rapport'}
                </span>
                <span className="klein-grau">
                  {[r.kunde, r.ort.replace(/^\d+\s*/, '')].filter(Boolean).join(', ')} · {fmtStd(summeStd(r))} Std
                </span>
              </div>
              <Badge variant="blau">Gesendet</Badge>
            </button>
          );
        })}
      </div>

      <button
        onClick={onProfil}
        className="safe-bottom"
        style={{
          appearance: 'none',
          border: 0,
          marginTop: 'auto',
          paddingTop: 16,
          paddingLeft: 16,
          paddingRight: 16,
          background: 'var(--blau-hell)',
          font: '400 13px/18px var(--font-sans)',
          color: 'var(--tiefschwarz)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        {profil.name ? (
          <span>
            Angemeldet: <strong>{profil.name}</strong> · {QUALI_LANG[profil.q]}
          </span>
        ) : (
          <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>Bitte Namen eintragen →</span>
        )}
        <span>{profil.standort}</span>
      </button>
    </div>
  );
}
