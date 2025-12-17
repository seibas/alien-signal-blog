import HeroText from "@/components/HeroText";
import Link from "next/link";
import { getAllPosts } from "@/content/posts";
import PostCard from "@/components/PostCard";

export default function Home() {
  const latest = getAllPosts().slice(0, 2);

  return (
    <>
      <HeroText
        headline="Broadcasting my coding journey"
        rotating={["JavaScript", "Python", "React", "Next.js", "AI tools"]}
      />

      <section className="container">
        <div className="card cardPad">
          <h2 className="h2">Latest transmissions</h2>
          <p className="p">
            New log entries from my learning journey—projects, notes, and small discoveries.
          </p>

          <div style={{ height: 14 }} />

          <div className="postGrid">
            {latest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>

          <div style={{ height: 12 }} />

          <div className="btnRow">
            <Link className="btn btnPrimary" href="/blog">View all logs</Link>
            <Link className="btn btnGhost" href="/about">About this mission</Link>
          </div>
        </div>
      </section>
    </>
  );
}
