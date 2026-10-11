import { Lock, EyeOff, HardDrive, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/ui/SharedComponents';

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <PageHeader
        title="Privacy Policy"
        subtitle="Noor Quran is built with privacy as a foundational principle. We believe worship and reflection are between you and Allah alone."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <EyeOff size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>Zero Tracking & Zero Ads</h2>
          </div>
          <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)', margin: 0 }}>
            Noor Quran contains no tracking pixels, no advertising beacons, and no behavioral profiling scripts. We do not sell, monetize, or broker any user data.
          </p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <HardDrive size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>Local Storage Only (IndexedDB)</h2>
          </div>
          <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)', margin: '0 0 12px 0' }}>
            All of the following information is saved strictly inside your local web browser's storage engine (IndexedDB):
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.9rem' }}>
            <li><strong>Bookmarks:</strong> The ayahs you choose to save for future review.</li>
            <li><strong>Personal Reflections / Notes:</strong> Your private study thoughts and notes.</li>
            <li><strong>Reading Progress:</strong> The record of your most recently recited chapters.</li>
            <li><strong>Offline Text Cache:</strong> Arabic Surah text stored locally so you can read without network access.</li>
          </ul>
          <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)', marginTop: 12, marginBottom: 0, fontSize: '0.9rem' }}>
            None of this information is ever uploaded to a server or synchronised to a third party.
          </p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Lock size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>External Network Requests</h2>
          </div>
          <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)', margin: 0 }}>
            When you browse Surahs, search, or listen to recitations, requests are made directly to the public <strong>Al Quran Cloud API</strong> (api.alquran.cloud) and their content delivery network to stream audio. These requests carry standard HTTP browser headers necessary to retrieve the requested media.
          </p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <ShieldCheck size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>Complete Data Control</h2>
          </div>
          <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)', margin: 0 }}>
            You maintain 100% ownership over your data. You can delete individual bookmarks or notes at any time, or use the <strong>Reset All Local Data</strong> button in <a href="/settings" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Settings</a> to instantly purge all stored records from your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
