import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Compass, Headphones, Bookmark } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  arabic: string;
  icon: typeof Home;
}

const BOTTOM_TABS: NavItem[] = [
  { to: '/', label: 'Home', arabic: 'الرئيسية', icon: Home },
  { to: '/quran', label: 'Quran', arabic: 'القرآن', icon: BookOpen },
  { to: '/juz', label: 'Juz', arabic: 'الأجزاء', icon: Compass },
  { to: '/listen', label: 'Listen', arabic: 'استماع', icon: Headphones },
  { to: '/bookmarks', label: 'Saved', arabic: 'المحفوظات', icon: Bookmark },
];

export default function MobileBottomNav() {
  const location = useLocation();

  // Hide the global mobile bottom nav on reading pages so reader controls have full focus
  const isReadingPage = 
    location.pathname.startsWith('/surah/') || 
    (location.pathname.startsWith('/juz/') && location.pathname !== '/juz');

  if (isReadingPage) {
    return null;
  }

  return (
    <nav 
      className="mobile-bottom-nav" 
      aria-label="Mobile Bottom Navigation"
    >
      {BOTTOM_TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => 
            `mobile-nav-tab ${isActive ? 'mobile-nav-tab-active' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <div className="mobile-tab-icon-wrap">
                <Icon 
                  size={21} 
                  className={isActive ? 'shiny-icon tab-icon-active' : 'tab-icon'} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && <span className="mobile-tab-indicator" />}
              </div>
              <span className="mobile-tab-label">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
