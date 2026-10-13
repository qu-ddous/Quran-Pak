import { useState } from 'react';
import { Settings2, Type, Globe, Volume2, Moon, Sun, Trash2, Check, RefreshCw } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/ui/SharedComponents';
import { AVAILABLE_TRANSLATIONS } from '../api/quranApi';
import { KNOWN_RECITERS } from '../types/quran';
import { clearAllData } from '../db/userDb';

export default function SettingsPage() {
  const { settings, updateSetting } = useSettings();
  const { showToast } = useToast();
  const [clearing, setClearing] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const fontSizes: Array<{ value: 'sm' | 'md' | 'lg' | 'xl'; label: string; size: string }> = [
    { value: 'sm', label: 'Small', size: '1.25rem' },
    { value: 'md', label: 'Medium', size: '1.5rem' },
    { value: 'lg', label: 'Large (Default)', size: '1.875rem' },
    { value: 'xl', label: 'Extra Large', size: '2.25rem' },
  ];

  const handleClearData = async () => {
    try {
      setClearing(true);
      await clearAllData();
      showToast('All local bookmarks, notes, history, and offline data cleared.', 'success');
      setShowConfirmClear(false);
    } catch {
      showToast('Failed to clear data.', 'error');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="quran-page-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <PageHeader
        title="Settings & Preferences"
        subtitle="Customize script size, translation edition, reciter voices, and display preferences. All preferences are saved locally on your device."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Appearance & Mode */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Sun size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>Appearance</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>Dark Theme</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Comfortable reading in low-light environments</div>
            </div>
            <button
              onClick={() => updateSetting('darkMode', !settings.darkMode)}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px' }}
              aria-label="Toggle dark mode"
            >
              {settings.darkMode ? <Moon size={16} /> : <Sun size={16} />}
              <span>{settings.darkMode ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>

        {/* Reading Mode */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Settings2 size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>Reading Mode</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { id: 'both', label: 'Arabic & Translation', desc: 'Side-by-side or stacked view of both texts' },
              { id: 'arabic-only', label: 'Arabic Only', desc: 'Focus exclusively on the sacred Arabic text' },
              { id: 'translation-only', label: 'Translation Only', desc: 'Focus solely on the translated meaning' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  updateSetting('readingMode', mode.id as any);
                  showToast(`Reading mode set to ${mode.label}`, 'info');
                }}
                style={{
                  textAlign: 'left',
                  padding: 16,
                  borderRadius: 10,
                  border: `2px solid ${settings.readingMode === mode.id ? 'var(--color-brand)' : 'var(--color-border)'}`,
                  background: settings.readingMode === mode.id ? 'var(--color-cream-100)' : 'var(--color-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>{mode.label}</span>
                  {settings.readingMode === mode.id && <Check size={16} style={{ color: 'var(--color-brand)' }} />}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Arabic Font Size & Live Preview */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Type size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>Arabic Font Size</h2>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            {fontSizes.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  updateSetting('arabicFontSize', f.value);
                  showToast(`Arabic font size set to ${f.label}`, 'info');
                }}
                className={settings.arabicFontSize === f.value ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Live script preview */}
          <div style={{
            padding: 20,
            borderRadius: 10,
            background: 'var(--color-cream-100)',
            border: '1px solid var(--color-border)',
            textAlign: 'right',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 8, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Script Preview (Surah Al-Ikhlas: 1)
            </div>
            <p
              className={`arabic-text font-arabic-${settings.arabicFontSize}`}
              style={{ margin: 0, color: 'var(--color-brand)', lineHeight: 1.8 }}
              lang="ar"
              dir="rtl"
            >
              قُلْ هُوَ اللَّهُ أَحَدٌ
            </p>
          </div>
        </div>

        {/* Translation Edition Selection */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Globe size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>Translation Edition</h2>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
            Choose the translation edition to display during reading and search. All translations are sourced from verified public editions via Al Quran Cloud.
          </p>

          <div style={{ display: 'grid', gap: 10 }}>
            {AVAILABLE_TRANSLATIONS.map((ed) => (
              <label
                key={ed.identifier}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: `1.5px solid ${settings.translationEdition === ed.identifier ? 'var(--color-brand)' : 'var(--color-border)'}`,
                  background: settings.translationEdition === ed.identifier ? 'var(--color-cream-100)' : 'var(--color-surface)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="radio"
                    name="translation"
                    value={ed.identifier}
                    checked={settings.translationEdition === ed.identifier}
                    onChange={() => {
                      updateSetting('translationEdition', ed.identifier);
                      showToast(`Active translation: ${ed.name}`, 'info');
                    }}
                    style={{ accentColor: 'var(--color-brand)' }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        fontSize: ed.language === 'ur' ? '1.12rem' : '0.95rem',
                        fontFamily: ed.language === 'ur' ? 'var(--font-urdu)' : 'inherit',
                        lineHeight: ed.language === 'ur' ? 1.8 : 1.4,
                        direction: ed.language === 'ur' ? 'rtl' : 'ltr',
                      }}
                    >
                      {ed.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <span>Language: {ed.language.toUpperCase()} • Identifier: {ed.identifier}</span>
                      {ed.language === 'ur' && (
                        <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: 4, background: 'var(--color-gold-soft)', color: 'var(--color-brand)', fontWeight: 700 }}>
                          جمیل نوری نستعلیق
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Audio Reciter */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Volume2 size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>Default Reciter</h2>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
            Choose your preferred Qari for verse recitation and listen streams.
          </p>

          <div style={{ display: 'grid', gap: 10 }}>
            {KNOWN_RECITERS.map((r) => (
              <label
                key={r.identifier}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: `1.5px solid ${settings.reciterIdentifier === r.identifier ? 'var(--color-brand)' : 'var(--color-border)'}`,
                  background: settings.reciterIdentifier === r.identifier ? 'var(--color-cream-100)' : 'var(--color-surface)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="radio"
                    name="reciter"
                    value={r.identifier}
                    checked={settings.reciterIdentifier === r.identifier}
                    onChange={() => {
                      updateSetting('reciterIdentifier', r.identifier);
                      showToast(`Default reciter: ${r.name}`, 'info');
                    }}
                    style={{ accentColor: 'var(--color-brand)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{r.attribution}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Data & Storage Management */}
        <div className="card" style={{ padding: 24, border: '1px solid #fee2e2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Trash2 size={20} style={{ color: '#dc2626' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: '#dc2626' }}>Local Data & Storage</h2>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
            Noor Quran stores your bookmarks, reflections, reading history, and offline cached Surahs exclusively inside your browser's IndexedDB storage. No account is required and no telemetry is sent to external servers.
          </p>

          {!showConfirmClear ? (
            <button
              onClick={() => setShowConfirmClear(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid #f87171',
                background: '#fef2f2',
                color: '#b91c1c',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <Trash2 size={16} />
              Reset All Local Data
            </button>
          ) : (
            <div style={{ background: '#fef2f2', padding: 16, borderRadius: 8, border: '1px solid #fca5a5' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#991b1b', fontWeight: 600 }}>
                Are you sure? This will delete all saved bookmarks, reflection notes, history, and offline cached texts. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleClearData}
                  disabled={clearing}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  {clearing ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: '#fff',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
