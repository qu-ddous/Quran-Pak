import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Headphones, Bookmark, BarChart2,
  Settings, Info, Menu, X, Moon, Sun, Download, Home,
  FileText, Shield, ChevronRight,
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
  { to: '/about', label: 'About', icon: Info },
  { to: '/privacy', label: 'Privacy', icon: Shield },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings, updateSetting } = useSettings();
  const navigate = useNavigate();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        role="banner"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(253, 250, 245, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64, gap: 24 }}>
          {/* Logo */}
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
            aria-label="Noor Quran — Go to home"
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--color-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={20} color="white" aria-hidden="true" />
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-brand)' }}>Noor Quran</div>
              <div className="arabic-text" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>نور القرآن</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}
            className="desktop-nav"
          >
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  padding: '6px 12px',
                  textDecoration: 'none',
                  borderRadius: 6,
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
                  background: isActive ? 'var(--color-primary-50)' : 'transparent',
                  transition: 'all 0.15s',
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Dark mode toggle */}
            <button
              onClick={() => updateSetting('darkMode', !settings.darkMode)}
              aria-label={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="btn-ghost"
              style={{ padding: '8px' }}
            >
              {settings.darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>

            {/* Search shortcut */}
            <button
              onClick={() => navigate('/search')}
              aria-label="Search Quran"
              className="btn-ghost"
              style={{ padding: '8px', display: 'none' }}
              id="header-search-btn"
            >
              <Search size={18} aria-hidden="true" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              className="btn-ghost mobile-menu-btn"
              style={{ padding: '8px' }}
            >
              {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!mobileOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          visibility: mobileOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Backdrop */}
        <div
          onClick={closeMobile}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            opacity: mobileOpen ? 1 : 0,
            transition: 'opacity 0.25s',
          }}
          aria-hidden="true"
        />
        {/* Panel */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 280,
            background: 'var(--color-surface)',
            borderLeft: '1px solid var(--color-border)',
            overflowY: 'auto',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Close */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-brand)' }}>Noor Quran</div>
            <button onClick={closeMobile} aria-label="Close menu" className="btn-ghost" style={{ padding: 6 }}>
              <X size={18} />
            </button>
          </div>

          {/* Nav links */}
          <nav aria-label="Mobile navigation" style={{ padding: '12px 0' }}>
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={closeMobile}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 20px',
                  textDecoration: 'none',
                  color: isActive ? 'var(--color-brand)' : 'var(--color-text)',
                  background: isActive ? 'var(--color-primary-50)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.95rem',
                  borderLeft: isActive ? '3px solid var(--color-brand)' : '3px solid transparent',
                  transition: 'all 0.15s',
                })}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
                <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} aria-hidden="true" />
              </NavLink>
            ))}
          </nav>

          {/* Secondary links */}
          <div style={{ borderTop: '1px solid var(--color-border)', padding: '12px 0' }}>
            <div style={{ padding: '8px 20px 4px', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>More</div>
            {SECONDARY_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobile}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 20px',
                  textDecoration: 'none',
                  color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
                  background: isActive ? 'var(--color-primary-50)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s',
                })}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Dark mode toggle in mobile */}
          <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid var(--color-border)' }}>
            <button
              onClick={() => { updateSetting('darkMode', !settings.darkMode); }}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {settings.darkMode ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              {settings.darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .mobile-menu-btn { display: none !important; }
          #header-search-btn { display: flex !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
