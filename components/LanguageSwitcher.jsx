'use client';
import { useTranslation } from '../hooks/useTranslation';
import { playAlienSound } from '../lib/alienSound';
import './LanguageSwitcher.css';

// SVG Flag Icons (work on all systems!)
const USFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" style={{ borderRadius: '2px' }}>
    <rect width="20" height="15" fill="#B22234"/>
    <rect y="1.15" width="20" height="1.15" fill="#fff"/>
    <rect y="3.46" width="20" height="1.15" fill="#fff"/>
    <rect y="5.77" width="20" height="1.15" fill="#fff"/>
    <rect y="8.08" width="20" height="1.15" fill="#fff"/>
    <rect y="10.38" width="20" height="1.15" fill="#fff"/>
    <rect y="12.69" width="20" height="1.15" fill="#fff"/>
    <rect width="8" height="8.08" fill="#3C3B6E"/>
  </svg>
);

const ITFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" style={{ borderRadius: '2px' }}>
    <rect width="6.67" height="15" fill="#009246"/>
    <rect x="6.67" width="6.67" height="15" fill="#fff"/>
    <rect x="13.33" width="6.67" height="15" fill="#CE2B37"/>
  </svg>
);

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useTranslation();

  const handleToggle = () => {
    playAlienSound();
    toggleLanguage();
  };

  return (
    <button
      onClick={handleToggle}
      className="language-switcher"
      aria-label={`Switch to ${language === 'en' ? 'Italian' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'Italian' : 'English'}`}
    >
      <span className="flag-icon">
        {language === 'en' ? <USFlag /> : <ITFlag />}
      </span>
      <span className="language-code">{language.toUpperCase()}</span>
    </button>
  );
}
