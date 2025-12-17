"use client";

import { useEffect, useMemo, useState } from "react";

export default function HeroText({
  headline = "Broadcasting my coding journey",
  rotating = ["JavaScript", "Python", "React", "Next.js", "AI tools"],
}) {
  const words = useMemo(() => rotating.filter(Boolean), [rotating]);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [words]);

  const activeWord = words[wordIndex] || "";

  return (
    <section className="hero hero--alien" aria-label="Hero">
      <div className="heroGrid" aria-hidden="true" />
      <div className="heroScan" aria-hidden="true" />

      <div className="heroInner">
        <p className="kicker">
          <span className="statusDot" aria-hidden="true" />
          <span>SIGNAL ONLINE</span>
          <span className="kickerSep" aria-hidden="true">/</span>
          <span className="kickerMeta">LOG: 001</span>
        </p>

        <h1 className="heroTitle">
          <span className="glitch" data-text={headline}>
            {headline}
          </span>
        </h1>

        <p className="heroSub">
          Decoding the unknown:{" "}
          <span className="chip" aria-live="polite">
            <span key={activeWord} className="chipWord">
              {activeWord}
            </span>
            <span className="cursor" aria-hidden="true" />
          </span>
        </p>

        <div className="heroCtas">
          <a className="btn btnPrimary" href="/blog">Enter Logbook</a>
          <a className="btn btnGhost" href="/about">About the Explorer</a>
        </div>

        <div className="heroMicro">
          <span className="heroMicroTag">Green Signal</span>
          <span className="heroMicroDot" aria-hidden="true" />
          <span className="heroMicroTag heroMicroTagOrange">Orange Accent</span>
        </div>
      </div>
    </section>
  );
}
