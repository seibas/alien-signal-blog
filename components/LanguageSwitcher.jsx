'use client';

import { useState, useEffect } from 'react';
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ onLanguageChange }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('blog_language') || 'en';
    console.log('LanguageSwitcher: Initial language:', saved);
    setLanguage(saved);
    if (onLanguageChange) {
      onLanguageChange(saved);
    }
  }, [onLanguageChange]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'it' : 'en';
    console.log('LanguageSwitcher: Toggling language from', language, 'to', newLang);
    setLanguage(newLang);
    localStorage.setItem('blog_language', newLang);
    
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    
    // Dispatch custom event for other components to listen
    console.log('LanguageSwitcher: Dispatching languageChanged event with:', newLang);
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
