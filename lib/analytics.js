export async function trackTranslatorUsage(data) {
  // Track in your analytics system
  const event = {
    type: 'alien_translator_used',
    question: data.question,
    language: data.language,
    timestamp: new Date().toISOString(),
    responseReceived: !!data.response,
    error: data.error || null
  };
  
  // Send to your analytics (PostHog, Mixpanel, GA4, etc.)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'alien_translator_query', {
      language: data.language,
      success: !data.error
    });
  }
  
  // Or send to your own API
  try {
    await fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
  } catch (err) {
    console.error('Analytics tracking failed:', err);
  }
}
