// Blog section layout with SEO metadata
export const metadata = {
  title: 'Logbook | Alien Signal Blog',
  description: 'Entries from my coding journey—what I learn, what I build, and what I discover along the way. Explore tutorials, tips, and insights on web development, JavaScript, React, and more.',
  keywords: ['blog', 'coding', 'web development', 'javascript', 'react', 'nextjs', 'tutorials'],
  openGraph: {
    title: 'Logbook | Alien Signal Blog',
    description: 'Entries from my coding journey—what I learn, what I build, and what I discover along the way.',
    type: 'website',
  },
};

export default function BlogLayout({ children }) {
  return children;
}
