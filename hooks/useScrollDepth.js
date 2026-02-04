import { useEffect, useRef } from 'react';
import { trackEvent } from '../components/GoogleAnalytics';

/**
 * Track scroll depth milestones
 * Fires analytics events when user reaches 25%, 50%, 75%, and 100% of page
 *
 * Usage:
 * useScrollDepth({ page: '/blog/my-post' });
 */
export function useScrollDepth({ page = null, enabled = true } = {}) {
  const milestonesRef = useRef({
    25: false,
    50: false,
    75: false,
    100: false
  });

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Calculate scroll percentage
      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = scrollableHeight > 0
        ? Math.min(100, Math.round((scrollTop / scrollableHeight) * 100))
        : 100;

      // Check milestones
      const milestones = [25, 50, 75, 100];

      for (const milestone of milestones) {
        if (scrollPercentage >= milestone && !milestonesRef.current[milestone]) {
          milestonesRef.current[milestone] = true;

          // Track the event
          trackEvent('scroll_depth', {
            depth: milestone,
            page: page || (typeof window !== 'undefined' ? window.location.pathname : 'unknown')
          });
        }
      }
    };

    // Throttle scroll events (fire at most once per 500ms)
    let timeoutId = null;
    const throttledScroll = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 500);
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // Check initial position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [page, enabled]);
}
