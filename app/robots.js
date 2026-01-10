export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/settings', '/api/'],
      },
    ],
    sitemap: 'https://alien-signal-blog.vercel.app/sitemap.xml',
  };
}
