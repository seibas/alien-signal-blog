import Link from 'next/link';

export const metadata = {
  title: 'Signal Lost',
  description: 'Page not found',
};

export default function NotFound() {
  return (
    <section className="container">
      <div className="card cardPad" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.8 }}>
          🛸
        </div>

        <h1 className="h2" style={{ fontSize: 32, marginBottom: '16px' }}>
          Signal Lost
        </h1>

        <p className="p" style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.8 }}>
          The transmission you're looking for has drifted into deep space.
        </p>

        <p className="p" style={{ fontSize: '14px', marginBottom: '32px', opacity: 0.6 }}>
          Error 404 — Page not found
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btnPrimary">
            🏠 Return Home
          </Link>
          <Link href="/blog" className="btn btnGhost">
            📡 View Logbook
          </Link>
        </div>
      </div>
    </section>
  );
}
