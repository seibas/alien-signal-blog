import HeroText from "@/components/HeroText";
import { getAllPosts } from "@/content/posts";
import HomeContent from "@/components/HomeContent";

export default async function Home() {
  const allPosts = await getAllPosts();
  const latest = allPosts
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  return (
    <>
      <HeroText
        headline="Broadcasting my coding journey"
        rotating={["JavaScript", "Python", "React", "Next.js", "AI tools"]}
      />

      <HomeContent latest={latest} />
    </>
  );
}
