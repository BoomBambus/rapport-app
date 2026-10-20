import type { ReactNode } from 'react';

export function Chip({ on, onClick, children, klein }: { on: boolean; onClick: () => void; children: ReactNode; klein?: boolean }) {
  return (
    <button type="button" className={'chip' + (klein ? ' klein' : '')} aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}

export function Stepper({ value, unit, onDec, onInc, gross, label }: { value: string; unit?: string; onDec: () => void; onInc: () => void; gross?: boolean; label: string }) {
  return (
    <div className={'stepper' + (gross ? ' gross' : '')} role="group" aria-label={label}>
      <button type="button" aria-label="weniger" onClick={onDec}>
        −
      </button>
      <div className="wert" aria-live="polite">
        {value}
        {unit && <span style={{ fontWeight: 400, fontSize: 13 }}>{unit}</span>}
      </div>
      <button type="button" aria-label="mehr" onClick={onInc}>
        +
      </button>
    </div>
  );
}

/** Fehlermeldung mit rotem Strich (im blauen Band unten). */
export function BandFehler({ children }: { children: ReactNode }) {
  return (
    <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, lineHeight: '20px', fontWeight: 600 }}>
      <span style={{ width: 16, height: 4, background: 'var(--signalrot)', flex: 'none' }} />
      {children}
    </div>
  );
}
