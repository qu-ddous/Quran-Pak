import { Link } from 'react-router-dom';
import { BookOpen, Heart, Shield, Sparkles, Smartphone, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/ui/SharedComponents';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <PageHeader
        title="About Noor Quran"
        subtitle="A reverent, beautiful, and distraction-free sanctuary for reciting and understanding the Word of Allah."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Intro Hero Card */}
        <div className="card" style={{ padding: 32, background: 'linear-gradient(135deg, var(--color-surface), var(--color-cream-100))' }}>
          <p className="arabic-text" style={{ fontSize: '1.8rem', color: 'var(--color-brand)', marginBottom: 12, fontWeight: 600 }}>
            وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ
          </p>
          <blockquote style={{ margin: '0 0 16px 0', fontStyle: 'italic', color: 'var(--color-text)', borderLeft: '3px solid var(--color-brand)', paddingLeft: 16 }}>
            "And We send down of the Quran that which is healing and mercy for the believers." — Surah Al-Isra (17:82)
          </blockquote>
          <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
            <strong>Noor Quran</strong> was born out of a desire for a digital Quran reading experience free from intrusive advertisements, unnecessary trackers, and visual clutter. Our goal is to let the beauty, solemnity, and guidance of the Divine text take center stage.
          </p>
        </div>

        {/* Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Shield size={22} style={{ color: 'var(--color-brand)' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--color-text)' }}>Authenticity First</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              All verses and translations are fetched from verified canonical repositories via the Al Quran Cloud and Tanzil project. No modifications, AI alterations, or fabricated texts.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Sparkles size={22} style={{ color: 'var(--color-brand)' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--color-text)' }}>Quiet Elegance</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              Crafted with warm heritage paper tones, refined Islamic geometric accents, smooth typography, and tailored dark mode for late-night recitation.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Heart size={22} style={{ color: 'var(--color-brand)' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--color-text)' }}>Privacy by Default</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              Your personal reflections, bookmarks, reading history, and offline storage live only in your browser via IndexedDB. No login required, no third-party profiling.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Smartphone size={22} style={{ color: 'var(--color-brand)' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--color-text)' }}>Offline Ready</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              Easily save Surahs into offline memory so you can continue your daily Tilawat on travels, flights, or places with patchy connectivity.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="card" style={{ padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>Ready to begin your journey?</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Explore the 114 Surahs or continue where you left off.</p>
          </div>
          <Link to="/quran" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Browse Surahs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
