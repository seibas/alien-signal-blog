'use client';

import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';

export default function NotFoundContent() {
  const { t } = useTranslation();

  return (
    <section className="container">
      <div className="card cardPad" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.8 }}>
          🛸
        </div>

        <h1 className="h2" style={{ fontSize: 32, marginBottom: '16px' }}>
          {t('signalLost')}
        </h1>

        <p className="p" style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.8 }}>
          {t('transmissionNotFound')}
        </p>

        <p className="p" style={{ fontSize: '14px', marginBottom: '32px', opacity: 0.6 }}>
          Error 404 — {t('notFound')}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btnPrimary">
            {t('backToBase')}
          </Link>
          <Link href="/blog" className="btn btnGhost">
            {t('logbook')}
          </Link>
        </div>
      </div>
    </section>
  );
}
