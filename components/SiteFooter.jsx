'use client';

import { useTranslation } from '../hooks/useTranslation';

export default function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footerInner">
        <div>© {year} Alien Signal Blog</div>
        <div>{t('greenSignal')} + {t('orangeAccent')} • {t('builtWith')} Next.js</div>
      </div>
    </footer>
  );
}
