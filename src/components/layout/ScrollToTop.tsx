import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures every page navigation opens smoothly from the very top (scroll: 0, 0),
 * resolving the SPA issue where new routes open near the footer or in the middle.
 * If a hash anchor is provided (e.g. #item-id), scrolls accurately to that anchor.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable browser's automatic stale scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!hash) {
      // Instantly reset scroll to the top of the viewport
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      // If navigating to a specific hash element, wait for render and scroll to it
      const timer = setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const navOffset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, elementPosition - navOffset),
            behavior: 'smooth',
          });
        }
      }, 90);
      return () => clearTimeout(timer);
    }
  }, [pathname, search, hash]);

  return null;
}
