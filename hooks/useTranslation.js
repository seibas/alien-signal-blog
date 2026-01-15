'use client';

import { useState, useEffect } from 'react';

export function useTranslation(slug, blocks, title) {
  const [displayContent, setDisplayContent] = useState(blocks);
  const [displayTitle, setDisplayTitle] = useState(title);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  // For now, just return the original content without translation
  // Translation functionality can be added later
  useEffect(() => {
    setDisplayContent(blocks);
    setDisplayTitle(title);
  }, [blocks, title]);

  return {
    displayContent,
    displayTitle,
    isTranslating,
    error
  };
}
