'use client';

import { useState, useEffect } from 'react';
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ onLanguageChange }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('blog_language') || 'en';
    setLanguage(saved);
    if (onLanguageChange) {
      onLanguageChange(saved);
    }
  }, [onLanguageChange]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'it' : 'en';
    setLanguage(newLang);
    localStorage.setItem('blog_language', newLang);
    
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLang }));
  };

  return (
    <button 
      className="language-switcher"
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === 'en' ? 'Italian' : 'English'}`}
    >
      <span className={`flag ${language === 'en' ? 'active' : ''}`}>🇺🇸</span>
      <span className="separator">/</span>
      <span className={`flag ${language === 'it' ? 'active' : ''}`}>🇮🇹</span>
    </button>
  );
}
