'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Enable View Transitions for supported browsers
    if ('startViewTransition' in document) {
      // Mark that view transitions are available
      document.documentElement.classList.add('view-transitions-enabled');
    }
  }, []);

  return <div className="page-content">{children}</div>;
}
