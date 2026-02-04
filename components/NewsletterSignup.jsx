'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { trackEvent } from './GoogleAnalytics';

/**
 * Newsletter signup component
 * Can be placed inline in blog posts or at the end of articles
 */
export default function NewsletterSignup({ variant = 'default' }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  // Track newsletter form view
  useEffect(() => {
    trackEvent('newsletter_view', {
      variant: variant,
      location: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });
  }, [variant]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage(t('invalidEmail') || 'Please enter a valid email address');
      trackEvent('newsletter_error', {
        error_type: 'invalid_email',
        variant: variant
      });
      return;
    }

    setStatus('loading');
    trackEvent('newsletter_submit', {
      variant: variant,
      location: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });

    try {
      // Store in localStorage for now (can be replaced with actual API)
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');

      if (subscribers.includes(email)) {
        setStatus('error');
        setMessage(t('alreadySubscribed') || 'This email is already subscribed!');
        trackEvent('newsletter_error', {
          error_type: 'already_subscribed',
          variant: variant
        });
        return;
      }

      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setStatus('success');
      setMessage(t('subscribeSuccess') || 'Welcome aboard! You\'ll receive cosmic updates soon.');
      setEmail('');

      // Track successful subscription
      trackEvent('newsletter_success', {
        variant: variant,
        location: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
      });

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (error) {
      setStatus('error');
      setMessage(t('subscribeError') || 'Something went wrong. Please try again.');
      trackEvent('newsletter_error', {
        error_type: 'api_error',
        variant: variant,
        error_message: error.message
      });
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div className={`newsletter ${isCompact ? 'newsletter-compact' : ''}`}>
      <div className="newsletter-content">
        {!isCompact && (
          <div className="newsletter-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
        )}

        <div className="newsletter-text">
          <h3 className="newsletter-title">
            {t('newsletterTitle') || 'Join the Signal'}
          </h3>
          <p className="newsletter-desc">
            {t('newsletterDesc') || 'Get notified when new posts are transmitted. No spam, just cosmic coding insights.'}
          </p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="newsletter-success">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <span>{message}</span>
        </div>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <div className="newsletter-input-wrap">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder') || 'your@email.com'}
              className="newsletter-input"
              disabled={status === 'loading'}
              aria-label="Email address"
            />
            <button
              type="submit"
              className="newsletter-btn"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="newsletter-loading">...</span>
              ) : (
                <>
                  <span>{t('subscribe') || 'Subscribe'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </>
              )}
            </button>
          </div>

          {status === 'error' && (
            <p className="newsletter-error">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
