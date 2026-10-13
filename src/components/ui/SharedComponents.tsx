/** Shared UI components */
import React from 'react';
import { Loader2, WifiOff, AlertTriangle, BookOpen } from 'lucide-react';

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export function LoadingSpinner({ text = 'Loading…' }: { text?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '64px 24px' }}>
      <Loader2 size={36} style={{ color: 'var(--color-brand)', animation: 'spin 0.7s linear infinite' }} aria-hidden="true" />
      <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem' }}>{text}</p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '64px 24px', textAlign: 'center' }}>
      <AlertTriangle size={40} style={{ color: '#c0392b' }} aria-hidden="true" />
      <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)' }}>Something went wrong</h2>
      <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: 360, lineHeight: 1.5 }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary" style={{ marginTop: 8 }}>
          Try again
        </button>
      )}
    </div>
  );
}

// ─── Offline State ────────────────────────────────────────────────────────────
export function OfflineState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '64px 24px', textAlign: 'center' }}>
      <WifiOff size={40} style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
      <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)' }}>You are offline</h2>
      <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: 360, lineHeight: 1.5 }}>
        This content requires an internet connection. Connect to the internet and try again, or visit a Surah you have previously cached under Downloads.
      </p>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ title, message, icon }: { title: string; message: string; icon?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '48px 24px', textAlign: 'center' }}>
      {icon || <BookOpen size={40} style={{ color: 'var(--color-text-muted)', opacity: 0.5 }} aria-hidden="true" />}
      <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text)' }}>{title}</h3>
      <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: 320, fontSize: '0.9rem', lineHeight: 1.5 }}>{message}</p>
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, arabic }: { title: string; subtitle?: string; arabic?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {arabic && (
        <p className="arabic-text" style={{ fontSize: '1.6rem', color: 'var(--color-brand)', marginBottom: 4, fontWeight: 600 }}>
          {arabic}
        </p>
      )}
      <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>{title}</h1>
      {subtitle && (
        <p style={{ marginTop: 8, color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{subtitle}</p>
      )}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ label, variant = 'default' }: { label: string; variant?: 'default' | 'green' | 'gold' | 'muted' }) {
  const bgMap = {
    default: 'var(--color-cream-200)',
    green: 'var(--color-primary-100)',
    gold: '#fef3c7',
    muted: 'var(--color-cream-300)',
  };
  const colorMap = {
    default: 'var(--color-text-muted)',
    green: 'var(--color-primary-700)',
    gold: '#92400e',
    muted: 'var(--color-ink-500)',
  };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 20,
      fontSize: '0.72rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      background: bgMap[variant],
      color: colorMap[variant],
    }}>
      {label}
    </span>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider() {
  return (
    <div style={{ height: 1, background: 'var(--color-border)', margin: '12px 0' }} role="separator" />
  );
}

// ─── Bismillah ───────────────────────────────────────────────────────────────
export function Bismillah() {
  return (
    <div style={{ textAlign: 'center', padding: '24px 16px', marginBottom: 8 }}>
      <p
        className="arabic-text"
        style={{ fontSize: '2rem', margin: 0, color: 'var(--color-brand)', fontWeight: 600, direction: 'rtl' }}
        lang="ar"
        aria-label="Bismillah ir-Rahman ir-Rahim"
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
    </div>
  );
}
