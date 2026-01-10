'use client';

import { useState, useEffect } from 'react';

/**
 * Animated "Beam me up" back-to-top button
 * Appears when user scrolls down, smoothly scrolls to top on click
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <button
        onClick={scrollToTop}
        className={`back-to-top ${isVisible ? 'visible' : ''}`}
        aria-label="Beam me up (back to top)"
        title="Beam me up"
      >
        <span className="ufo">🛸</span>
        <span className="beam"></span>
        <span className="text">BEAM ME UP</span>
      </button>

      <style jsx>{`
        .back-to-top {
          position: fixed;
          bottom: 40px;
          right: 40px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0, 255, 140, 0.2), rgba(0, 255, 140, 0.1));
          border: 2px solid var(--color-green-primary);
          color: var(--color-green-primary);
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          transform: translateY(100px) scale(0.8);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 255, 140, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0;
          overflow: visible;
        }

        .back-to-top.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .back-to-top:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 12px 48px rgba(0, 255, 140, 0.4),
                      0 0 40px rgba(0, 255, 140, 0.3);
          border-color: var(--color-green-bright);
          background: linear-gradient(135deg, rgba(0, 255, 140, 0.3), rgba(0, 255, 140, 0.15));
        }

        .back-to-top:hover .beam {
          opacity: 1;
          height: 100px;
        }

        .back-to-top:hover .ufo {
          animation: ufoFloat 0.6s ease-in-out infinite alternate;
        }

        .back-to-top:active {
          transform: translateY(-6px) scale(1);
        }

        .ufo {
          font-size: 28px;
          display: block;
          z-index: 2;
          filter: drop-shadow(0 0 8px rgba(0, 255, 140, 0.6));
          margin-bottom: -4px;
        }

        .beam {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 0;
          background: linear-gradient(180deg,
            var(--color-green-primary) 0%,
            rgba(0, 255, 140, 0.6) 50%,
            transparent 100%
          );
          opacity: 0;
          transition: all 400ms ease;
          z-index: 1;
          box-shadow: 0 0 10px rgba(0, 255, 140, 0.8);
        }

        .text {
          position: absolute;
          bottom: -32px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.15em;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 200ms ease;
          font-family: 'Share Tech Mono', monospace;
          text-shadow: 0 0 10px rgba(0, 255, 140, 0.6);
        }

        .back-to-top:hover .text {
          opacity: 1;
        }

        @keyframes ufoFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }

        @media (max-width: 768px) {
          .back-to-top {
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
          }

          .ufo {
            font-size: 24px;
          }

          .text {
            font-size: 8px;
            bottom: -28px;
          }
        }
      `}</style>
    </>
  );
}
