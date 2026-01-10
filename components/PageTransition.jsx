'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Page transition wrapper with fade effect
 * Triggers on route changes for smooth transitions
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    // When pathname changes, start fade out
    setTransitionStage('fadeOut');
  }, [pathname]);

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timer = setTimeout(() => {
        // Update children and start fade in
        setDisplayChildren(children);
        setTransitionStage('fadeIn');
      }, 150); // Match transition duration

      return () => clearTimeout(timer);
    }
  }, [transitionStage, children]);

  return (
    <div className={`page-transition ${transitionStage}`}>
      {displayChildren}

      <style jsx>{`
        .page-transition {
          animation: fadeIn 200ms ease-out;
        }

        .page-transition.fadeOut {
          opacity: 0;
        }

        .page-transition.fadeIn {
          opacity: 1;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
