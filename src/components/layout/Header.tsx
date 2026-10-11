import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Headphones, Bookmark, BarChart2,
  Settings, Info, Menu, X, Moon, Sun, Download, Home,
  FileText, Shield, ChevronRight, Sparkles,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/quran', label: 'Quran', icon: BookOpen },
  { to: '/juz', label: 'Juz', icon: FileText },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/listen', label: 'Listen', icon: Headphones },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/progress', label: 'Progress', icon: BarChart2 },
];

const SECONDARY_LINKS = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/downloads', label: 'Downloads', icon: Download },
  { to: '/sources', label: 'Sources', icon: Info },
  { to: '/about', label: 'About', icon: Sparkles },
  { to: '/privacy', label: 'Privacy', icon: Shield },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings, updateSetting } = useSettings();
  const navigate = useNavigate();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '10px 16px 6px' }}>
        <header
          role="banner"
          className="floating-navbar"
          style={{
            maxWidth: 1260,
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            height: 64,
            gap: 20,
          }}
        >
          {/* Logo with Shiny Emblem */}
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}
            aria-label="Noor Quran — Go to home"
          >
            <div className="icon-badge-shiny" style={{ width: 40, height: 40, borderRadius: 12 }}>
              <BookOpen size={20} className="shiny-icon" aria-hidden="true" />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-brand)', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>Noor Quran</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
              </div>
              <div className="arabic-text" style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700, lineHeight: 1.2 }}>نور القرآن</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}
            className="desktop-nav"
          >
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }: { isActive: boolean }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '7px 14px',
                  textDecoration: 'none',
                  borderRadius: 10,
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
                  background: isActive ? 'var(--color-gold-soft, rgba(212, 175, 55, 0.12))' : 'transparent',
                  border: isActive ? '1px solid rgba(212, 175, 55, 0.45)' : '1px solid transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(212, 175, 55, 0.18)' : 'none',
                  transition: 'all 0.15s ease',
                })}
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    <Icon size={16} className={isActive ? 'shiny-icon' : undefined} style={{ color: isActive ? 'var(--color-accent)' : 'inherit' }} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Quick search shortcut */}
            <button
              onClick={() => navigate('/search')}
              aria-label="Search Quran"
              className="btn-ghost"
              style={{
                width: 38,
                height: 38,
                padding: 0,
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Search Quran"
            >
              <Search size={17} className="shiny-icon" style={{ color: 'var(--color-brand)' }} />
            </button>

            {/* Dark mode toggle with shiny styling */}
            <button
              onClick={() => updateSetting('darkMode', !settings.darkMode)}
              aria-label={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="btn-ghost"
              style={{
                width: 38,
                height: 38,
                padding: 0,
                borderRadius: 10,
                border: '1px solid var(--color-border-gold)',
                background: settings.darkMode ? 'rgba(212, 175, 55, 0.15)' : 'rgba(254, 240, 138, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {settings.darkMode ? (
                <Sun size={18} className="shiny-icon" style={{ color: 'var(--color-accent)' }} />
              ) : (
                <Moon size={18} className="shiny-icon" style={{ color: 'var(--color-brand)' }} />
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              className="btn-ghost mobile-menu-btn"
              style={{
                width: 38,
                height: 38,
                padding: 0,
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '82%',
          maxWidth: 320,
          background: 'var(--color-surface)',
          zIndex: 200,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: mobileOpen ? '0 0 40px rgba(0,0,0,0.35)' : 'none',
          borderRight: '1.5px solid var(--color-border-gold)',
          overflowY: 'auto',
        }}
      >
        {/* Mobile Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="icon-badge-shiny" style={{ width: 34, height: 34, borderRadius: 8 }}>
              <BookOpen size={16} className="shiny-icon" />
            </div>
            <div style={{ fontWeight: 800, color: 'var(--color-brand)', fontSize: '1rem' }}>Noor Quran</div>
          </div>
          <button onClick={closeMobile} aria-label="Close menu" className="btn-ghost" style={{ padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav aria-label="Mobile navigation" style={{ padding: '12px 8px' }}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={closeMobile}
              style={({ isActive }: { isActive: boolean }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                margin: '2px 0',
                borderRadius: 10,
                textDecoration: 'none',
                color: isActive ? 'var(--color-brand)' : 'var(--color-text)',
                background: isActive ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.95rem',
                border: isActive ? '1px solid var(--color-border-gold)' : '1px solid transparent',
                transition: 'all 0.15s ease',
              })}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <Icon size={18} className={isActive ? 'shiny-icon' : undefined} style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-brand)' }} />
                  <span>{label}</span>
                  <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Secondary links */}
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '12px 8px', marginTop: 'auto' }}>
          <div style={{ padding: '6px 16px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)' }}>
            Settings & Transparency
          </div>
          {SECONDARY_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobile}
              style={({ isActive }: { isActive: boolean }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderRadius: 8,
                textDecoration: 'none',
                color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
                background: isActive ? 'rgba(45, 106, 79, 0.08)' : 'transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
              })}
            >
              <Icon size={16} className="shiny-icon" style={{ color: 'var(--color-brand)' }} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', zIndex: 150 }}
        />
      )}
    </>
  );
}
