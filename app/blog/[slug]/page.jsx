import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/content/posts";
import EditableBlogPost from "@/components/EditableBlogPost";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return (
      <section className="container">
        <div className="card cardPad">
          <h1 className="h2">Signal lost</h1>
          <p className="p">That log entry was not found.</p>
          <div style={{ height: 14 }} />
          <Link className="btn btnPrimary" href="/blog">Back to Logbook</Link>
        </div>
      </section>
    );
  }

  return <EditableBlogPost post={post} />;
}
