'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

/**
 * Web Vitals Monitoring Component
 * Tracks Core Web Vitals (LCP, FID/INP, CLS) and other performance metrics
 * Sends data to console (can be extended to send to analytics service)
 */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value), metric.rating);
    }

    // Send to analytics service (Google Analytics, Vercel Analytics, etc.)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Store in localStorage for debugging
    try {
      const vitals = JSON.parse(localStorage.getItem('web_vitals') || '[]');
      vitals.push({
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
        timestamp: new Date().toISOString(),
      });
      // Keep only last 50 measurements
      localStorage.setItem('web_vitals', JSON.stringify(vitals.slice(-50)));
    } catch (error) {
      // Ignore localStorage errors
    }
  });

  // Optional: Display Web Vitals badge in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log stored vitals on mount
      const storedVitals = localStorage.getItem('web_vitals');
      if (storedVitals) {
        console.log('[Web Vitals] Recent measurements:', JSON.parse(storedVitals));
      }
    }
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Helper: Get Web Vitals ratings
 * Returns color and status based on metric thresholds
 */
export function getVitalsRating(name, value) {
  const thresholds = {
    LCP: { good: 2500, needsImprovement: 4000 },
    FID: { good: 100, needsImprovement: 300 },
    INP: { good: 200, needsImprovement: 500 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    TTFB: { good: 800, needsImprovement: 1800 },
    FCP: { good: 1800, needsImprovement: 3000 },
  };

  const threshold = thresholds[name];
  if (!threshold) return { rating: 'unknown', color: 'gray' };

  if (value <= threshold.good) {
    return { rating: 'good', color: '#00FF41' };
  } else if (value <= threshold.needsImprovement) {
    return { rating: 'needs-improvement', color: '#ff9100' };
  } else {
    return { rating: 'poor', color: '#ff4444' };
  }
}
