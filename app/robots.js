/**
 * Optimized robots.txt for SEO
 * Allows all major search engines with specific rules
 * Blocks admin areas and API endpoints
 */
export default function robots() {
  const baseUrl = 'https://alien-signal-blog.vercel.app';

  return {
    rules: [
      // Allow all good bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/settings',
          '/settings/*',
          '/api/',
          '/api/*',
          '/_next/static/development/', // Block dev assets
        ],
      },
      // Special rules for Google
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/settings', '/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/admin', '/settings'],
      },
      // Allow Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/settings', '/api/'],
      },
      // Block bad bots
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'BLEXBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
