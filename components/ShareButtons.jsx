'use client';

import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Social sharing buttons component
 * Supports Twitter/X, LinkedIn, and copy link
 */
export default function ShareButtons({ title, slug }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Build the full URL (works on client side)
  const getUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/blog/${slug}`;
  };

  const shareTwitter = () => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(title);
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(getUrl());
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="share-buttons">
      <span className="share-label">{t('share')}</span>

      <button
        onClick={shareTwitter}
        className="share-btn share-twitter"
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>

      <button
        onClick={shareLinkedIn}
        className="share-btn share-linkedin"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>

      <button
        onClick={copyLink}
        className={`share-btn share-copy ${copied ? 'copied' : ''}`}
        aria-label="Copy link"
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
          </svg>
        )}
      </button>

      <style jsx>{`
        .share-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          padding: 16px 0;
          border-top: 1px solid var(--border-primary);
        }

        .share-label {
          font-size: 13px;
          color: var(--text-dimmed);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 1px solid var(--border-primary);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .share-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-2px);
        }

        .share-twitter:hover {
          border-color: #1DA1F2;
          color: #1DA1F2;
          box-shadow: 0 4px 12px rgba(29, 161, 242, 0.2);
        }

        .share-linkedin:hover {
          border-color: #0A66C2;
          color: #0A66C2;
          box-shadow: 0 4px 12px rgba(10, 102, 194, 0.2);
        }

        .share-copy:hover {
          border-color: var(--color-green-primary);
          color: var(--color-green-primary);
          box-shadow: 0 4px 12px rgba(0, 255, 140, 0.2);
        }

        .share-copy.copied {
          border-color: var(--color-green-primary);
          background: rgba(0, 255, 140, 0.1);
          color: var(--color-green-primary);
        }

        @media (max-width: 480px) {
          .share-buttons {
            flex-wrap: wrap;
          }

          .share-label {
            width: 100%;
            margin-bottom: 4px;
          }
        }
      `}</style>
    </div>
  );
}
