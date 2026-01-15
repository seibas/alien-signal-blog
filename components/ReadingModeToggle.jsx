'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ReadingModeToggle() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Only show on blog post pages (e.g., /blog/my-post)
  const isOnBlogPost = pathname?.startsWith('/blog/') && pathname !== '/blog';

  // Mount check to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clean up reading mode when leaving blog posts
  useEffect(() => {
    if (!isMounted) return;
    
    if (!isOnBlogPost) {
      // Turn off reading mode when not on blog post
      document.documentElement.classList.remove('reading-mode');
      localStorage.removeItem('readingMode');
      setIsReadingMode(false);
    }
  }, [isOnBlogPost, isMounted]);

  // Initialize reading mode from localStorage
  useEffect(() => {
    if (!isMounted) return;
    
    const saved = localStorage.getItem('readingMode');
    if (saved === 'true') {
      setIsReadingMode(true);
      document.documentElement.classList.add('reading-mode');
    }
    
    // Show button immediately after mount
    setIsVisible(true);
  }, [isMounted]);

  // Handle scroll - hide button when scrolling
  useEffect(() => {
    if (!isMounted) return;
    
    let scrollTimer;
    let idleTimer;
    
    const handleScroll = () => {
      // Hide button when scrolling
      setIsVisible(false);
      setIsIdle(false);
      
      // Clear existing timers
      clearTimeout(scrollTimer);
      clearTimeout(idleTimer);
      
      // Show button again after 1 second of no scrolling
      scrollTimer = setTimeout(() => {
        setIsVisible(true);
        
        // Fade to 30% after 10 seconds of being still
        idleTimer = setTimeout(() => {
          setIsIdle(true);
        }, 10000);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial idle timer
    idleTimer = setTimeout(() => {
      setIsIdle(true);
    }, 10000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
      clearTimeout(idleTimer);
    };
  }, [isMounted]);

  // Handle mouse movement near button - wake it up
  const handleMouseEnter = () => {
    setIsIdle(false);
  };

  // Toggle reading mode with smooth transition
  const toggleReadingMode = () => {
    setIsTransitioning(true);
    
    // Start transition
    setTimeout(() => {
      const newMode = !isReadingMode;
      setIsReadingMode(newMode);
      
      // Save preference
      localStorage.setItem('readingMode', newMode.toString());
      
      // Toggle class on html element
      if (newMode) {
        document.documentElement.classList.add('reading-mode');
      } else {
        document.documentElement.classList.remove('reading-mode');
      }
      
      // End transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 150);
  };

  // Keyboard shortcut: Cmd/Ctrl + Shift + R
  useEffect(() => {
    if (!isMounted) return;
    
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'r') {
        e.preventDefault();
        toggleReadingMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isReadingMode, isMounted]);

  // Don't render if not on a blog post or not mounted
  if (!isOnBlogPost || !isMounted) return null;

  return (
    <>
      {/* Transition overlay */}
      <div className={`reading-mode-transition ${isTransitioning ? 'active' : ''}`} />

      {/* Floating button */}
      <button
        className={`reading-mode-toggle ${isVisible ? 'visible' : ''} ${isIdle ? 'idle' : ''}`}
        onClick={toggleReadingMode}
        onMouseEnter={handleMouseEnter}
        onFocus={handleMouseEnter}
        aria-label={isReadingMode ? 'Exit reading mode' : 'Enter reading mode'}
        title={isReadingMode ? 'Exit reading mode' : 'Enter reading mode (Ctrl+Shift+R)'}
      >
        <span className="toggle-icon" aria-hidden="true">
          {isReadingMode ? '🌙' : '📖'}
        </span>
        <span className="toggle-tooltip">
          {isReadingMode ? 'Dark' : 'Read'}
        </span>
      </button>
    </>
  );
}
