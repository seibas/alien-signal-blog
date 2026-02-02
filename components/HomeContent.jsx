'use client';

import Link from "next/link";
import PostCard from "@/components/PostCard";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomeContent({ latest }) {
  const { t } = useTranslation();

  return (
    <section className="container">
      <div className="card cardPad">
        <h2 className="h2">{t('latestTransmissions')}</h2>
        <p className="p">
          {t('latestTransmissionsDesc')}
        </p>

        <div style={{ height: 14 }} />

        <div className="postGrid">
          {latest.map((p, index) => (
            <PostCard key={p.slug} post={p} index={index} />
          ))}
        </div>

        <div style={{ height: 12 }} />

        <div className="btnRow">
          <Link className="btn btnPrimary" href="/blog">{t('viewAllLogs')}</Link>
          <Link className="btn btnGhost" href="/about">{t('aboutThisMission')}</Link>
        </div>
      </div>
    </section>
  );
}
