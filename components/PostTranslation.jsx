'use client';
import { usePostTranslation, useTranslation } from '../hooks/useTranslation';

export default function PostTranslation({ postSlug, children, originalTitle, originalExcerpt }) {
  const { language, t } = useTranslation();
  
  // Extract original content from children
  const originalContent = typeof children === 'string' ? children : null;
  
  const { content, isTranslating, error, isTranslated } = usePostTranslation(
    postSlug,
    originalContent
  );

  // If English or no translation needed, render original
  if (language === 'en' || !originalContent) {
    return <>{children}</>;
  }

  // Show loading state
  if (isTranslating) {
    return (
      <div className="translation-loading">
        <div className="spinner"></div>
        <p>{t('translating')}</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="translation-error">
        <p>{t('error')}: {error}</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
          {t('originalLanguage')}:
        </p>
        {children}
      </div>
    );
  }

  // Show translated content
  return (
    <>
      {isTranslated && (
        <div className="translation-badge">
          <span>🇮🇹</span> {t('translated')}
        </div>
      )}
      {content || children}
    </>
  );
}

// Component to translate simple text (titles, excerpts)
export function TranslatedText({ text, postSlug, field = 'text' }) {
  const { language } = useTranslation();
  
  if (language === 'en') {
    return <>{text}</>;
  }

  // Check cache
  const cacheKey = `translation-${postSlug}-${field}-${language}`;
  const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
  
  if (cached) {
    return <>{cached}</>;
  }

  // If not cached, return original and trigger background translation
  if (typeof window !== 'undefined') {
    // Translate in background
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: text,
        targetLanguage: language,
      }),
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem(cacheKey, data.translatedContent);
        // Force re-render by dispatching custom event
        window.dispatchEvent(new CustomEvent('translation-ready'));
      })
      .catch(err => console.error('Translation error:', err));
  }

  return <>{text}</>;
}
