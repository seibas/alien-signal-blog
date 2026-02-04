'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Table of Contents component for blog posts
 * Scans the article content for headings and tracks scroll position
 * Only shows for posts with enough content (>1500 words or 2+ headings)
 */
export default function TableOfContents({ contentRef, minHeadings = 2, minWords = 1500 }) {
  const { t } = useTranslation();
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Scan for headings in the content
  const scanHeadings = useCallback(() => {
    if (!contentRef?.current) return;

    // Count words in the content
    const textContent = contentRef.current.textContent || '';
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);

    // Look for strong elements that act as section headers
    const elements = contentRef.current.querySelectorAll('strong, h2, h3');
    const extractedHeadings = [];

    elements.forEach((el, index) => {
      const text = el.textContent?.trim();
      if (!text || text.length < 3 || text.length > 80) return;

      // Skip if it's a small inline bold text (not a heading)
      // Check if the strong element is at the start of its parent's text
      if (el.tagName === 'STRONG') {
        const parentText = el.parentElement?.textContent?.trim() || '';
        // Only consider as heading if strong starts the paragraph and is significant
        if (!parentText.startsWith(text) || text.split(' ').length < 2) {
          return;
        }
      }

      // Generate unique ID
      const id = `section-${index}`;
      el.id = id;

      extractedHeadings.push({
        id,
        text: text.length > 50 ? text.slice(0, 47) + '...' : text,
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });

    setHeadings(extractedHeadings);
  }, [contentRef]);

  // Scan for headings after content loads
  useEffect(() => {
    const timer = setTimeout(scanHeadings, 800);
    return () => clearTimeout(timer);
  }, [scanHeadings]);

  // Track scroll position to highlight active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find(entry => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-10% 0% -80% 0%',
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // Don't render if not enough headings or content is too short
  if (headings.length < minHeadings || wordCount < minWords) return null;

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
      setIsExpanded(false);
    }
  };

  return (
    <nav className="toc" aria-label="Table of contents">
      <button
        className="toc-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <svg
          className="toc-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
        <span>{t('tableOfContents') || 'Contents'}</span>
        <span className="toc-count">({headings.length})</span>
        <svg
          className={`toc-chevron ${isExpanded ? 'expanded' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </button>

      <ol className={`toc-list ${isExpanded ? 'expanded' : ''}`}>
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={`toc-item toc-level-${level} ${activeId === id ? 'active' : ''}`}
          >
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className="toc-link"
            >
              {text}
            </a>
          </li>
        ))}
      </ol>

      <style jsx>{`
        .toc {
          background: linear-gradient(135deg, rgba(18, 22, 31, 0.95) 0%, rgba(12, 15, 20, 0.9) 100%);
          border: 1px solid rgba(0, 255, 65, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin: 24px 0;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 255, 65, 0.1);
        }

        .toc-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-height: 48px;
          padding: 12px 16px;
          background: rgba(0, 255, 65, 0.08);
          border: 1px solid rgba(0, 255, 65, 0.2);
          border-radius: 8px;
          color: #00FF41;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .toc-toggle:hover {
          background: rgba(0, 255, 65, 0.15);
          border-color: rgba(0, 255, 65, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 255, 65, 0.2);
        }

        .toc-toggle:active {
          transform: translateY(0);
        }

        .toc-icon {
          flex-shrink: 0;
          color: #00FF41;
        }

        .toc-count {
          margin-left: auto;
          font-size: 13px;
          color: #ff9100;
          font-weight: 500;
        }

        .toc-chevron {
          flex-shrink: 0;
          transition: transform 0.3s ease;
          color: #00FF41;
        }

        .toc-chevron.expanded {
          transform: rotate(180deg);
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease;
          opacity: 0;
        }

        .toc-list.expanded {
          max-height: 600px;
          opacity: 1;
          margin-top: 16px;
        }

        .toc-item {
          margin: 0;
          padding: 0;
        }

        .toc-link {
          display: block;
          padding: 10px 16px;
          color: rgba(232, 233, 237, 0.85);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 14px;
          line-height: 1.5;
          border-left: 2px solid transparent;
        }

        .toc-link:hover {
          background: rgba(0, 255, 65, 0.08);
          color: #00FF41;
          border-left-color: #00FF41;
          padding-left: 20px;
        }

        .toc-item.active .toc-link {
          background: rgba(0, 255, 65, 0.12);
          color: #00FF41;
          border-left-color: #00FF41;
          font-weight: 600;
        }

        .toc-level-2 .toc-link {
          padding-left: 16px;
        }

        .toc-level-3 .toc-link {
          padding-left: 32px;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .toc {
            margin: 16px 0;
            padding: 12px;
          }

          .toc-toggle {
            font-size: 15px;
            padding: 10px 14px;
          }

          .toc-link {
            font-size: 13px;
            padding: 8px 12px;
          }

          .toc-level-3 .toc-link {
            padding-left: 24px;
            font-size: 12px;
          }
        }
      `}</style>
    </nav>
  );
}
