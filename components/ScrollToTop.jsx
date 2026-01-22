'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  // Disable browser's automatic scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Scroll to top on route change - use useLayoutEffect for immediate execution
  useLayoutEffect(() => {
    // Immediate scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Also set after a small delay to handle any async rendering
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
