'use client';

import { useState, useEffect } from 'react';

export default function ReadingModeToggle() {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Load saved preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('readingMode');
      if (saved === 'true') {
        document.documentElement.classList.add('reading-mode');
        setIsReadingMode(true);
      }
    } catch (error) {
      console.error('Reading mode error:', error);
    }
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + Shift + R
  useEffect(() => {
    const handleKeyboard = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'r') {
        e.preventDefault();
        toggleReadingMode();
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  const toggleReadingMode = () => {
    // Show transition overlay
    setShowOverlay(true);

    setTimeout(() => {
      const html = document.documentElement;
      const newMode = !isReadingMode;

      if (newMode) {
        html.classList.add('reading-mode');
      } else {
        html.classList.remove('reading-mode');
      }

      setIsReadingMode(newMode);
      
      try {
        localStorage.setItem('readingMode', newMode.toString());
      } catch (error) {
        console.error('Failed to save reading mode:', error);
      }

      // Hide overlay after animation
      setTimeout(() => {
        setShowOverlay(false);
      }, 600);
    }, 150);
  };

  return (
    <>
      {/* Transition Overlay */}
      <div className={`reading-transition-overlay ${showOverlay ? 'active' : ''}`} />

      {/* Toggle Button */}
      <button
        className="reading-mode-toggle"
        onClick={toggleReadingMode}
        aria-label={isReadingMode ? 'Switch to dark mode' : 'Switch to reading mode'}
        title={isReadingMode ? 'Dark Mode (Ctrl+Shift+R)' : 'Reading Mode (Ctrl+Shift+R)'}
      >
        <span className="toggle-icon">{isReadingMode ? '🌙' : '📖'}</span>
        <span className="toggle-tooltip">{isReadingMode ? 'Dark' : 'Read'}</span>
      </button>
    </>
  );
}
