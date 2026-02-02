'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { translations, getTranslation } from '../lib/translations';

// Create Language Context
const LanguageContext = createContext();

// Language Provider Component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('alien-blog-language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('alien-blog-language', language);
    }
  }, [language, mounted]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'it' : 'en');
  };

  const t = (key) => {
    return getTranslation(key, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use translation
export function useTranslation() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  
  return context;
}

// Hook for translating blog post content via API
export function usePostTranslation(postSlug, originalContent) {
  const { language } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If English, use original content
    if (language === 'en') {
      setTranslatedContent(null);
      return;
    }

    // Check localStorage cache first
    const cacheKey = `translation-${postSlug}-${language}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        setTranslatedContent(JSON.parse(cached));
        return;
      } catch (err) {
        console.error('Error parsing cached translation:', err);
      }
    }

    // Translate via API
    const translateContent = async () => {
      setIsTranslating(true);
      setError(null);

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: originalContent,
            targetLanguage: language,
          }),
        });

        if (!response.ok) {
          throw new Error('Translation failed');
        }

        const data = await response.json();
        
        // Cache the translation
        localStorage.setItem(cacheKey, JSON.stringify(data.translatedContent));
        setTranslatedContent(data.translatedContent);
      } catch (err) {
        console.error('Translation error:', err);
        setError(err.message);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [language, postSlug, originalContent]);

  return {
    content: translatedContent || originalContent,
    isTranslating,
    error,
    isTranslated: translatedContent !== null,
  };
}
