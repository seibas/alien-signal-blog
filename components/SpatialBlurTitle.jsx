'use client';

import { useEffect, useRef, useState } from 'react';
import '../styles/SpatialBlur.css';

export default function SpatialBlurTitle({ 
  text, 
  delay = 0, 
  sparkleCount = 6, 
  as = 'h2',
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const titleRef = useRef(null);

  // Generate sparkles with random properties - SUBTLE
  useEffect(() => {
    const generateSparkles = () => {
      // Reduce sparkles on mobile
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const count = isMobile ? Math.min(3, sparkleCount) : sparkleCount;
      
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200, // -100px to 100px
        y: (Math.random() - 0.5) * 200,
        size: Math.random() * 2 + 3, // 3px to 5px (SMALL)
        delay: Math.random() * 0.3 + 0.4, // 0.4s to 0.7s
        duration: Math.random() * 0.3 + 0.5, // 0.5s to 0.8s
        rotation: Math.random() * 20 // 0-20deg (subtle)
      }));
    };

    setSparkles(generateSparkles());
  }, [sparkleCount]);

  // Intersection Observer to trigger animation on scroll (once only)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
            // Disconnect after first trigger
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, [hasAnimated]);

  const Tag = as;

  return (
    <div 
      ref={titleRef}
      className={`spatial-blur-title-wrapper ${className}`}
      style={{ '--animation-delay': `${delay}s` }}
    >
      {/* Very subtle focus ring */}
      <div className={`focus-ring ${isVisible ? 'active' : ''}`} />
      
      {/* Main title - WHITE text */}
      <Tag className={`spatial-blur-title ${isVisible ? 'focused' : ''}`}>
        {text}
      </Tag>
      
      {/* Sparkle particles - SUBTLE */}
      {isVisible && sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            '--sparkle-x': `${sparkle.x}px`,
            '--sparkle-y': `${sparkle.y}px`,
            '--sparkle-size': `${sparkle.size}px`,
            '--sparkle-delay': `${sparkle.delay}s`,
            '--sparkle-duration': `${sparkle.duration}s`,
            '--sparkle-rotation': `${sparkle.rotation}deg`
          }}
        />
      ))}
    </div>
  );
}
