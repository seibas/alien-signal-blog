'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Only show on blog post pages
  const isBlogPost = pathname?.startsWith('/blog/') && pathname !== '/blog';

  useEffect(() => {
    if (!isBlogPost) {
      setIsVisible(false);
      return;
    }

    const calculateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;

      if (documentHeight > 0) {
        const scrollProgress = (scrollTop / documentHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrollProgress)));
        setIsVisible(scrollTop > 100);
      }
    };

    // Initial calculation
    calculateProgress();

    // Throttled scroll handler
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [isBlogPost, pathname]);

  if (!isBlogPost) return null;

  return (
    <div
      className={`reading-progress-container ${isVisible ? 'visible' : ''}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="reading-progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
