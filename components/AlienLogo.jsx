'use client';

import { useState, useEffect } from 'react';

const alienSymbols = [
  // Triangle with eye
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5L35 32H5L20 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="20" cy="22" r="4" fill="currentColor"/>
  </svg>,
  
  // Circular signal
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2"/>
    <circle cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="2"/>
    <circle cx="20" cy="20" r="3" fill="currentColor"/>
  </svg>,
  
  // Hexagon with dot
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5L32 12.5V27.5L20 35L8 27.5V12.5L20 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="20" cy="20" r="3" fill="currentColor"/>
    <line x1="20" y1="20" x2="20" y2="12" stroke="currentColor" strokeWidth="2"/>
  </svg>,
  
  // Alien head
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="20" rx="12" ry="15" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="15" cy="18" rx="2.5" ry="4" fill="currentColor"/>
    <ellipse cx="25" cy="18" rx="2.5" ry="4" fill="currentColor"/>
  </svg>,
  
  // Star burst
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8L22 18L32 20L22 22L20 32L18 22L8 20L18 18L20 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="20" cy="20" r="3" fill="currentColor"/>
  </svg>,
  
  // Diamond with waves
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L34 20L20 34L6 20L20 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M13 20H27" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 13V27" stroke="currentColor" strokeWidth="2"/>
  </svg>
];

export default function AlienLogo() {
  const [currentSymbol, setCurrentSymbol] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSymbol((prev) => (prev + 1) % alienSymbols.length);
        setIsTransitioning(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`alien-logo ${isTransitioning ? 'transitioning' : ''}`}>
      {alienSymbols[currentSymbol]}
    </div>
  );
}
