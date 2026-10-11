import { BookOpen, ExternalLink, ShieldCheck, Database, Headphones, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/ui/SharedComponents';

export default function SourcesPage() {
  return (
    <div className="quran-page-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <PageHeader
        title="Sources, Text Integrity & Methodology"
        subtitle="Full transparency regarding where our Quran text, translations, recitations, and scholarly boundaries originate."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Core Guarantee */}
        <div className="card" style={{ padding: 24, borderLeft: '4px solid var(--color-brand)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <ShieldCheck size={24} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
              Sacred Text Integrity Guarantee
            </h2>
          </div>
          <p style={{ margin: '0 0 12px 0', lineHeight: 1.6, color: 'var(--color-text)' }}>
            <strong>Noor Quran does not fabricate, generate, alter, or summarize the text of the Holy Quran.</strong> Every Arabic word, diacritical mark (tashkeel), verse numbering, Surah boundary, and Sajda indicator is retrieved directly from canonical digitized Quran manuscripts verified by Islamic scholars.
          </p>
          <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            When searching, indexing, or offline caching, verses are preserved character-for-character using standard Unicode representations without algorithmic interference or generative rewriting.
          </p>
        </div>

        {/* Primary Data Provider */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Database size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>
              Primary API & Data Infrastructure
            </h2>
          </div>

          <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
            All Quranic metadata, Arabic script editions, verse translations, and audio endpoints are provided by the <strong>Al Quran Cloud API v1</strong>, maintained by <strong>Islamic Network</strong>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div style={{ background: 'var(--color-cream-100)', padding: 16, borderRadius: 8 }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>Al Quran Cloud</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                REST API v1 serving complete Quran text, editions, translations, and search indexes.
              </div>
              <a
                href="https://alquran.cloud/api"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-brand)', fontWeight: 600, fontSize: '0.85rem' }}
              >
                API Documentation <ExternalLink size={13} />
              </a>
            </div>

            <div style={{ background: 'var(--color-cream-100)', padding: 16, borderRadius: 8 }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>Islamic Network</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                Non-profit community maintaining open-source Islamic data APIs and global CDN services.
              </div>
              <a
                href="https://islamic.network"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-brand)', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Visit Islamic Network <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Text Editions & Tanzil Project */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <BookOpen size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>
              Arabic Script & Tanzil Project Foundation
            </h2>
          </div>

          <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
            The default Arabic text used in Noor Quran is the <code>quran-uthmani</code> edition, which traces its lineage to the verified, cross-checked text compiled by the internationally recognized <strong>Tanzil Project</strong>.
          </p>

          <ul style={{ margin: '0 0 16px 0', paddingLeft: 20, color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.9rem' }}>
            <li><strong>Script Type:</strong> Medina Mushaf Uthmani Script (عثماني) with full vocalization (Harakat).</li>
            <li><strong>Cross-Validation:</strong> Tanzil text underwent multi-year auditing against authoritative printed Medina Mushafs and King Fahd Glorious Quran Printing Complex releases.</li>
            <li><strong>Ayah Count:</strong> Exactly 6,236 Ayahs across 114 Surahs, adhering to the Kufic counting standard accepted by the vast majority of the Muslim world.</li>
          </ul>

          <a
            href="https://tanzil.net"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-brand)', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Read about Tanzil Quran Project <ExternalLink size={13} />
          </a>
        </div>

        {/* Audio Reciters Attribution */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Headphones size={20} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>
              Audio Recitations & CDN Attribution
            </h2>
          </div>

          <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
            All audio files are streamed directly via Islamic Network's high-speed CDN and EveryAyah audio archives. We give credit and gratitude to the venerable Qaris whose voices accompany our reading:
          </p>

          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { name: 'Mishary Rashid Alafasy', role: 'Qari & Imam (Kuwait)', note: 'Crystal-clear Murattal recitation, popular globally for clarity and Tajweed precision.' },
              { name: 'Abdurrahmaan As-Sudais', role: 'Imam of the Grand Mosque in Mecca', note: 'Emotional, reverent recitation recorded in the Holy Sanctuary of Makkah.' },
              { name: 'Mahmoud Khalil Al-Husary', role: 'Renowned Master of Tajweed (Egypt)', note: 'Canonical reference for standard Tajweed teaching and classical Egyptian recitation.' },
              { name: 'Mohamed Siddiq Al-Minshawi', role: 'Legendary Qari (Egypt)', note: 'Famed for poignant, soulful Murattal recitation with flawless maqam adherence.' },
            ].map((q) => (
              <div key={q.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 8, background: 'var(--color-cream-100)' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>{q.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-brand)', fontWeight: 500, marginBottom: 2 }}>{q.role}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>{q.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
