'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Breadcrumb navigation component
 * Automatically generates breadcrumbs based on current path
 */
export default function Breadcrumb({ customTitle }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Don't show breadcrumb on homepage
  if (pathname === '/') return null;

  // Build breadcrumb items from path
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;

    // Format segment name
    let label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    // Use custom title for last item if provided (for blog post titles)
    if (isLast && customTitle) {
      label = customTitle;
    }

    // Translate known segments
    const translations = {
      'Blog': t('blog') || 'Blog',
      'About': t('about') || 'About',
      'Skills': t('skills') || 'Skills',
      'Settings': t('settings') || 'Settings',
    };

    if (translations[label]) {
      label = translations[label];
    }

    return { href, label, isLast };
  });

  // Add home at the beginning
  const items = [
    { href: '/', label: t('home') || 'Home', isLast: false },
    ...breadcrumbItems
  ];

  // Schema.org BreadcrumbList structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': `https://alien-signal-blog.vercel.app${item.href}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {items.map((item, index) => (
            <li key={item.href} className="breadcrumb-item">
              {!item.isLast ? (
                <>
                  <Link href={item.href} className="breadcrumb-link">
                    {index === 0 && (
                      <svg
                        className="breadcrumb-home-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    )}
                    <span>{item.label}</span>
                  </Link>
                  <span className="breadcrumb-separator" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </span>
                </>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>

        <style jsx>{`
          .breadcrumb {
            margin: 0 0 24px 0;
            padding: 0;
          }

          .breadcrumb-list {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            list-style: none;
            padding: 0;
            margin: 0;
            font-size: 14px;
          }

          .breadcrumb-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .breadcrumb-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            color: #00FF41;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.2s ease;
            font-weight: 500;
            min-height: 32px;
          }

          .breadcrumb-link:hover {
            background: rgba(0, 255, 65, 0.12);
            color: #00ff8c;
            transform: translateX(-2px);
          }

          .breadcrumb-link:active {
            transform: translateX(0);
          }

          .breadcrumb-home-icon {
            color: #00FF41;
            flex-shrink: 0;
          }

          .breadcrumb-separator {
            display: inline-flex;
            align-items: center;
            color: #ff9100;
            opacity: 0.6;
            flex-shrink: 0;
          }

          .breadcrumb-current {
            color: rgba(232, 233, 237, 0.95);
            font-weight: 600;
            padding: 6px 10px;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          @media (max-width: 768px) {
            .breadcrumb {
              margin: 0 0 16px 0;
            }

            .breadcrumb-list {
              font-size: 13px;
              gap: 6px;
            }

            .breadcrumb-link {
              padding: 4px 8px;
              min-height: 28px;
            }

            .breadcrumb-home-icon {
              width: 12px;
              height: 12px;
            }

            .breadcrumb-separator svg {
              width: 10px;
              height: 10px;
            }

            .breadcrumb-current {
              max-width: 200px;
              padding: 4px 8px;
              font-size: 13px;
            }
          }

          @media (max-width: 480px) {
            .breadcrumb-current {
              max-width: 150px;
            }
          }
        `}</style>
      </nav>
    </>
  );
}
