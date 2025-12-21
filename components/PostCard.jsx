import Link from "next/link";

export default function PostCard({ post }) {
  // Truncate excerpt to max 80 characters for cleaner display
  const truncateExcerpt = (text) => {
    if (!text) return '';
    if (text.length <= 80) return text;
    return text.substring(0, 80).trim() + '...';
  };

  return (
    <article className="card postCard" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div className="cardPad" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          marginBottom: '12px',
          display: 'flex',
          gap: '12px',
          fontSize: '11px',
          opacity: 0.5,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        
        <h3 style={{ 
          fontSize: '16px', 
          marginBottom: '10px',
          lineHeight: '1.3',
          fontWeight: '600',
          color: '#eaffef',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          height: '42px'
        }}>
          {post.title}
        </h3>
        
        <p style={{ 
          fontSize: '13px', 
          lineHeight: '1.5',
          opacity: 0.65,
          marginBottom: 'auto',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          height: '39px'
        }}>
          {truncateExcerpt(post.excerpt)}
        </p>
        
        <Link className="btn" href={`/blog/${post.slug}`} style={{
          fontSize: '12px',
          padding: '6px 14px',
          marginTop: '14px',
          display: 'inline-block',
          width: 'fit-content'
        }}>
          Read entry
        </Link>
      </div>
    </article>
  );
}
