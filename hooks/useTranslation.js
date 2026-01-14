'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTranslation(postSlug, originalContent, originalTitle) {
  const [language, setLanguage] = useState('en');
  const [translatedContent, setTranslatedContent] = useState(null);
  const [translatedTitle, setTranslatedTitle] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  // Translation function
  const translatePost = useCallback(async () => {
    if (isTranslating || !originalContent || !postSlug) {
      return;
    }
    
    setIsTranslating(true);
    setError(null);
    console.log('Starting translation for:', postSlug);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: originalContent,
          targetLanguage: 'it',
          postTitle: originalTitle,
        }),
      });

      console.log('Translation response status:', response.status);

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      console.log('Translation data received:', data);
      
      if (data.success) {
        setTranslatedContent(data.translatedContent);
        
        // Also translate title
        const titleResponse = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: [{ type: 'text', value: originalTitle }],
            targetLanguage: 'it',
            postTitle: originalTitle,
          }),
        });
        
        if (titleResponse.ok) {
          const titleData = await titleResponse.json();
          const translatedTitleText = titleData.translatedContent[0]?.value || titleData.translatedContent[0]?.text || originalTitle;
          setTranslatedTitle(translatedTitleText);
          
          // Cache both
          const cacheData = {
            content: data.translatedContent,
            title: translatedTitleText,
            timestamp: Date.now(),
          };
          localStorage.setItem(`post_${postSlug}_it`, JSON.stringify(cacheData));
        }
      } else {
        throw new Error(data.error || 'Translation failed');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message);
    } finally {
      setIsTranslating(false);
    }
  }, [postSlug, originalContent, originalTitle, isTranslating]);

  // Load cached translation function
  const loadCachedTranslation = useCallback(() => {
    if (!postSlug) return;
    
    const cached = localStorage.getItem(`post_${postSlug}_it`);
    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setTranslatedContent(parsed.content);
        setTranslatedTitle(parsed.title);
      } catch (err) {
        console.error('Failed to load cached translation:', err);
        // If cache is corrupted, fetch new translation
        translatePost();
      }
    } else {
      // No cache, need to translate
      translatePost();
    }
  }, [postSlug, translatePost]);

  // Load saved language preference on mount
  useEffect(() => {
    if (!postSlug) return;
    
    const saved = localStorage.getItem('blog_language') || 'en';
    setLanguage(saved);
    
    // Load cached translation if exists
    if (saved === 'it') {
      loadCachedTranslation();
    }
  }, [postSlug, loadCachedTranslation]);

  // Listen for language changes
  useEffect(() => {
    if (!postSlug) return;
    
    const handleLanguageChange = (event) => {
      const newLang = event.detail;
      setLanguage(newLang);
      
      if (newLang === 'it') {
        loadCachedTranslation();
      } else {
        // Switch back to English
        setTranslatedContent(null);
        setTranslatedTitle(null);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, [postSlug, loadCachedTranslation]);

  // Determine what content/title to show
  const displayContent = language === 'it' && translatedContent 
    ? translatedContent 
    : originalContent;
    
  const displayTitle = language === 'it' && translatedTitle 
    ? translatedTitle 
    : originalTitle;

  return {
    language,
    displayContent,
    displayTitle,
    isTranslating,
    error,
  };
}
