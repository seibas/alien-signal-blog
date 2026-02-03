import HeroText from "@/components/HeroText";
import { getAllPosts } from "@/content/posts";
import HomeContent from "@/components/HomeContent";

// Website Schema for SEO
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Alien Signal Blog",
  "description": "A futuristic coding journal exploring JavaScript, React, Next.js, and web development.",
  "url": "https://alien-signal-blog.vercel.app",
  "author": {
    "@type": "Person",
    "name": "Sebastiano"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://alien-signal-blog.vercel.app/blog?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default async function Home() {
  const allPosts = await getAllPosts();
  const latest = allPosts
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  return (
    <>
      {/* Website Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <HeroText
        headline="Broadcasting my coding journey"
        rotating={["JavaScript", "Python", "React", "Next.js", "AI tools"]}
      />

      <HomeContent latest={latest} />
    </>
  );
}
