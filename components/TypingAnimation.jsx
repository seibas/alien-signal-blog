'use client';

import { useState, useEffect } from 'react';

export default function TypingAnimation({ children, speed = 15 }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Convert children to plain text
  const fullText = typeof children === 'string' ? children : String(children);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, fullText, speed]);

  return (
    <>
      {displayedContent}
      {!isComplete && <span className="typing-cursor">|</span>}
    </>
  );
}
