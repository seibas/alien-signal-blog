import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article className="card postCard">
      <div className="cardPad">
        <div className="postMeta">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="postTitle">{post.title}</h3>
        <p className="postExcerpt">{post.excerpt}</p>
        <div style={{ marginTop: 14 }}>
          <Link className="btn" href={`/blog/${post.slug}`}>
            Read entry
          </Link>
        </div>
      </div>
    </article>
  );
}
