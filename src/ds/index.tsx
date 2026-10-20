// Komponenten des Schlosserei-Menge-Design-Systems (Port aus project/_ds/…/_ds_bundle.js).
// Werte und Varianten 1:1 übernommen; nur die in der App genutzten Komponenten.
import { useId, useState, type CSSProperties, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from 'react';
import logoSrc from '../assets/logo.svg';

export const LOGO_SRC = logoSrc;

export function Logo({ width = 240, style }: { width?: number; style?: CSSProperties }) {
  return (
    <img
      src={logoSrc}
      alt="Schlosserei Menge"
      width={width}
      style={{ display: 'block', height: 'auto', maxWidth: '100%', ...style }}
    />
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--type-sperrsatz-size)',
        lineHeight: 'var(--type-sperrsatz-line)',
        fontWeight: 'var(--type-sperrsatz-weight)' as CSSProperties['fontWeight'],
        letterSpacing: 'var(--type-sperrsatz-tracking)',
        textTransform: 'uppercase',
        color: 'var(--tiefschwarz)',
        margin: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const BADGE = {
  hell: ['var(--blau-hell)', 'var(--tiefschwarz)'],
  blau: ['var(--menge-blau)', 'var(--tiefschwarz)'],
  dunkel: ['var(--tiefschwarz)', 'var(--weiss)'],
  rahmen: ['var(--weiss)', 'var(--tiefschwarz)'],
} as const;

export type BadgeVariant = keyof typeof BADGE;

export function Badge({ variant = 'hell', children, style }: { variant?: BadgeVariant; children: ReactNode; style?: CSSProperties }) {
  const [bg, fg] = BADGE[variant] ?? BADGE.hell;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 24,
        padding: '0 8px',
        background: bg,
        color: fg,
        border: variant === 'rahmen' ? '1px solid var(--tiefschwarz)' : '1px solid transparent',
        borderRadius: 'var(--radius-2)',
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

const CARD = {
  rahmen: { background: 'var(--weiss)', border: '1px solid var(--linie)' },
  kasten: { background: 'var(--blau-hell)', border: '1px solid transparent' },
  band: { background: 'var(--menge-blau)', border: '1px solid transparent' },
} as const;

export function Card({
  variant = 'rahmen',
  eyebrow,
  title,
  stroke = false,
  footer,
  onClick,
  children,
  style,
}: {
  variant?: keyof typeof CARD;
  eyebrow?: ReactNode;
  title?: ReactNode;
  stroke?: boolean;
  footer?: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick()) : undefined}
      style={{
        ...CARD[variant],
        borderRadius: 'var(--radius-0)',
        color: 'var(--tiefschwarz)',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        borderColor: onClick && hover ? 'var(--tiefschwarz)' : undefined,
        ...style,
      }}
    >
      <div style={{ padding: 'var(--space-16)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', flex: 1 }}>
        {stroke && (
          <div
            aria-hidden="true"
            style={{ height: 'var(--stroke-klein)', width: 48, marginLeft: 'calc(-1 * var(--space-16))', background: 'var(--signalrot)' }}
          />
        )}
        {eyebrow && (
          <div style={{ fontSize: 12, lineHeight: '18px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase' }}>{eyebrow}</div>
        )}
        {title && (
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              lineHeight: '26px',
              fontWeight: 700,
              textDecoration: onClick && hover ? 'underline' : 'none',
              textUnderlineOffset: 4,
            }}
          >
            {title}
          </h3>
        )}
        {children && <div style={{ fontSize: 16, lineHeight: '24px' }}>{children}</div>}
        {footer && (
          <div
            style={{
              marginTop: 'auto',
              paddingTop: 'var(--space-8)',
              fontSize: 13,
              lineHeight: '18px',
              color: variant === 'band' ? 'var(--tiefschwarz)' : 'var(--tiefschwarz-gedaempft)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </article>
  );
}

export function Toast({
  title,
  children,
  tone = 'info',
  onClose,
  style,
}: {
  title?: ReactNode;
  children?: ReactNode;
  tone?: 'info' | 'fehler';
  onClose?: () => void;
  style?: CSSProperties;
}) {
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-16)',
        width: 360,
        maxWidth: '100%',
        boxSizing: 'border-box',
        padding: 'var(--space-16)',
        background: 'var(--tiefschwarz)',
        color: 'var(--weiss)',
        borderRadius: 'var(--radius-2)',
        boxShadow: 'var(--shadow-float)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{ width: 16, height: 4, marginTop: 10, flex: 'none', background: tone === 'fehler' ? 'var(--signalrot)' : 'var(--menge-blau)' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 16, lineHeight: '24px', fontWeight: 700 }}>{title}</div>}
        {children && <div style={{ fontSize: 14, lineHeight: '20px', overflowWrap: 'anywhere' }}>{children}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Schließen"
          style={{
            appearance: 'none',
            border: 0,
            background: 'none',
            color: 'var(--weiss)',
            cursor: 'pointer',
            fontSize: 22,
            lineHeight: '24px',
            padding: 0,
            fontFamily: 'inherit',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

const BTN_SIZES = { sm: { h: 36, px: 14, fs: 14 }, md: { h: 44, px: 20, fs: 16 }, lg: { h: 52, px: 28, fs: 18 } };
const BTN = {
  primary: { bg: 'var(--tiefschwarz)', bgH: 'var(--tiefschwarz-hover)', fg: 'var(--weiss)', bd: 'var(--tiefschwarz)' },
  secondary: { bg: 'var(--menge-blau)', bgH: 'var(--menge-blau-hover)', fg: 'var(--tiefschwarz)', bd: 'var(--menge-blau)' },
  outline: { bg: 'var(--weiss)', bgH: 'var(--blau-hell)', fg: 'var(--tiefschwarz)', bd: 'var(--tiefschwarz)' },
  ghost: { bg: 'transparent', bgH: 'transparent', fg: 'var(--tiefschwarz)', bd: 'transparent' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}: {
  variant?: keyof typeof BTN;
  size?: keyof typeof BTN_SIZES;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const s = BTN_SIZES[size];
  const v = BTN[variant];
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPress(false);
      }}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: s.h,
        padding: `0 ${s.px}px`,
        fontFamily: 'var(--font-sans)',
        fontSize: s.fs,
        fontWeight: 600,
        lineHeight: 1,
        background: hover && !disabled ? v.bgH : v.bg,
        color: v.fg,
        border: `2px solid ${v.bd}`,
        borderRadius: 'var(--radius-2)',
        textDecoration: variant === 'ghost' && hover && !disabled ? 'underline' : 'none',
        textUnderlineOffset: 4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transform: press && !disabled ? 'translateY(1px)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-standard)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Checkbox({ label, checked, onChange }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const toggle = () => onChange(!checked);
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: 12,
        fontFamily: 'var(--font-sans)',
        fontSize: 16,
        lineHeight: '24px',
        color: 'var(--tiefschwarz)',
        cursor: 'pointer',
      }}
    >
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggle();
          }
        }}
        style={{
          width: 20,
          height: 20,
          marginTop: 2,
          flex: 'none',
          boxSizing: 'border-box',
          border: '2px solid var(--tiefschwarz)',
          borderRadius: 'var(--radius-2)',
          background: checked ? 'var(--tiefschwarz)' : 'var(--weiss)',
          position: 'relative',
        }}
      >
        {checked && (
          <span
            style={{
              position: 'absolute',
              left: 5,
              top: 1,
              width: 5,
              height: 10,
              borderRight: '2px solid var(--weiss)',
              borderBottom: '2px solid var(--weiss)',
              transform: 'rotate(45deg)',
            }}
          />
        )}
      </span>
      <span
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
      >
        {label}
      </span>
    </label>
  );
}

export function FieldError({ children }: { children: ReactNode }) {
  return (
    <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, lineHeight: '18px', color: 'var(--tiefschwarz)', fontWeight: 600 }}>
      <span style={{ width: 16, height: 4, background: 'var(--signalrot)', flex: 'none' }} />
      {children}
    </div>
  );
}

type InputProps = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  value: string;
  onValue: (v: string) => void;
  style?: CSSProperties;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'style'>;

export function Input({ label, hint, error, required = false, multiline = false, rows = 4, disabled = false, id, value, onValue, placeholder, type = 'text', style, ...rest }: InputProps) {
  const [focus, setFocus] = useState(false);
  const autoId = useId();
  const fid = id || autoId;
  const fieldStyle: CSSProperties = {
    height: multiline ? 'auto' : 44,
    padding: multiline ? '10px 12px' : '0 12px',
    fontFamily: 'inherit',
    fontSize: 16,
    lineHeight: '24px',
    color: 'var(--tiefschwarz)',
    background: disabled ? 'var(--blau-hell)' : 'var(--weiss)',
    border: '1px solid var(--tiefschwarz)',
    borderBottom: error ? '4px solid var(--signalrot)' : '1px solid var(--tiefschwarz)',
    borderRadius: 'var(--radius-2)',
    outline: focus ? '2px solid var(--focus-ring)' : 'none',
    outlineOffset: 2,
    resize: 'vertical',
    opacity: disabled ? 0.6 : 1,
    boxSizing: 'border-box',
    width: '100%',
  };
  const common = {
    id: fid,
    value,
    placeholder,
    disabled,
    required,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    'aria-invalid': !!error,
    style: fieldStyle,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', fontFamily: 'var(--font-sans)', minWidth: 0, ...style }}>
      {label && (
        <label htmlFor={fid} style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600, color: 'var(--tiefschwarz)' }}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      {multiline ? (
        <textarea {...common} rows={rows} onChange={(e) => onValue(e.target.value)} />
      ) : (
        <input {...common} {...rest} type={type} onChange={(e) => onValue(e.target.value)} />
      )}
      {error ? <FieldError>{error}</FieldError> : hint ? <div style={{ fontSize: 13, lineHeight: '18px', color: 'var(--tiefschwarz-gedaempft)' }}>{hint}</div> : null}
    </div>
  );
}
