import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';

// Pages (lazy-loaded)
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './components/ui/SharedComponents';

const HomePage = lazy(() => import('./pages/HomePage'));
const QuranBrowserPage = lazy(() => import('./pages/QuranBrowserPage'));
const SurahReaderPage = lazy(() => import('./pages/SurahReaderPage'));
const JuzBrowserPage = lazy(() => import('./pages/JuzBrowserPage'));
const JuzReaderPage = lazy(() => import('./pages/JuzReaderPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ListenPage = lazy(() => import('./pages/ListenPage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SourcesPage = lazy(() => import('./pages/SourcesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-enter" style={{ minHeight: '60vh' }}>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <ToastProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg)' }}>
            <Header />
            <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
              <Suspense fallback={<LoadingSpinner text="Loading page…" />}>
                <Routes>
                  <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
                  <Route path="/quran" element={<PageWrapper><QuranBrowserPage /></PageWrapper>} />
                  <Route path="/surah/:surahNumber" element={<PageWrapper><SurahReaderPage /></PageWrapper>} />
                  <Route path="/juz" element={<PageWrapper><JuzBrowserPage /></PageWrapper>} />
                  <Route path="/juz/:juzNumber" element={<PageWrapper><JuzReaderPage /></PageWrapper>} />
                  <Route path="/search" element={<PageWrapper><SearchPage /></PageWrapper>} />
                  <Route path="/listen" element={<PageWrapper><ListenPage /></PageWrapper>} />
                  <Route path="/bookmarks" element={<PageWrapper><BookmarksPage /></PageWrapper>} />
                  <Route path="/notes" element={<PageWrapper><NotesPage /></PageWrapper>} />
                  <Route path="/progress" element={<PageWrapper><ProgressPage /></PageWrapper>} />
                  <Route path="/downloads" element={<PageWrapper><DownloadsPage /></PageWrapper>} />
                  <Route path="/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
                  <Route path="/sources" element={<PageWrapper><SourcesPage /></PageWrapper>} />
                  <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
                  <Route path="/privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
                  <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </ToastProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
