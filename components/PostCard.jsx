import Link from "next/link";
import Image from "next/image";
import SpatialBlurTitle from "./SpatialBlurTitle";

export default function PostCard({ post, index = 0 }) {
  // Gradient colors (cycles through these for variety)
  const gradients = [
    'linear-gradient(135deg, #00FF41 0%, #00CC33 100%)', // Matrix Green
    'linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)', // Orange
    'linear-gradient(135deg, #5B21B6 0%, #764ba2 100%)', // Purple
    'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 100%)', // Dark Blue
  ];
  
  // Pick gradient based on index for variety
  const defaultGradient = gradients[index % gradients.length];
  
  // Truncate excerpt to max 80 characters for cleaner display, skipping image markdown
  const getCleanExcerpt = () => {
    let excerpt = post.excerpt || '';
    // If excerpt is image markdown, try to get first non-image text from blocks/content
    const imageRegex = /^!\[.*\]\(.*\)$/;
    if (imageRegex.test(excerpt.trim())) {
      // Try blocks (new format)
      if (Array.isArray(post.blocks)) {
        for (const block of post.blocks) {
          if (block.type === 'text') {
            const lines = block.value.split(/\n+/).map(l => l.trim()).filter(Boolean);
            for (const line of lines) {
              if (!imageRegex.test(line)) return line;
            }
          }
        }
      }
      // Try content (old format)
      if (post.content) {
        const contentArr = Array.isArray(post.content) ? post.content : post.content.split(/\n+/);
        for (const line of contentArr) {
          if (!imageRegex.test(line.trim())) return line.trim();
        }
      }
      return '';
    }
    // Remove image markdown from excerpt if present
    excerpt = excerpt.replace(/!\[.*?\]\(.*?\)/g, '').trim();
    if (excerpt.length <= 80) return excerpt;
    return excerpt.substring(0, 80).trim() + '...';
  };

  // Extract first image from either blocks (new) or content (old)
  const getFirstImage = () => {
    // Check for featured image first
    if (post.featuredImage) {
      return post.featuredImage;
    }
    
    // New format: blocks
    if (Array.isArray(post.blocks)) {
      for (const block of post.blocks) {
        // Check for dedicated image blocks
        if (block.type === 'image' && block.src) {
          return block.src;
        }
        // Check for markdown images in text blocks
        if (block.type === 'text') {
          const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)/;
          const match = block.value && block.value.match(imageRegex);
          if (match) return match[2];
        }
      }
    }
    // Old format: content
    if (post.content) {
      const contentStr = Array.isArray(post.content) ? post.content.join(' ') : post.content;
      const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)/;
      const match = contentStr.match(imageRegex);
      if (match) return match[2];
    }
    return null;
  };

  const firstImage = getFirstImage();
  const hasCustomImage = firstImage !== null;

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="card postCard" style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer'
      }}>
        <div className="post-card-image-container">
          {hasCustomImage ? (
            <div style={{
              position: 'relative',
              width: '100%',
              height: '200px',
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.3)',
              borderBottom: '1px solid rgba(234,255,247,.1)'
            }}>
              <Image
                src={firstImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                loading="lazy"
                className="post-card-image"
              />
            </div>
          ) : (
            <div 
              className="post-card-default"
              style={{ background: defaultGradient }}
            >
              <div className="gradient-overlay">
                <span className="default-icon">🛸</span>
              </div>
            </div>
          )}
        </div>
        <div className="cardPad" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '180px'
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
          
          <SpatialBlurTitle 
            text={post.title} 
            as="h2"
            sparkleCount={4}
            delay={index * 0.15}
            className="post-card-title"
          />
          
          <p style={{ 
            fontSize: '13px', 
            lineHeight: '1.5',
            opacity: 0.65,
            marginBottom: '14px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '39px',
            flex: 1
          }}>
            {getCleanExcerpt()}
          </p>
          
          <div className="btn" style={{
            fontSize: '12px',
            padding: '8px 14px',
            marginTop: 'auto',
            display: 'inline-block',
            width: 'fit-content',
            textAlign: 'center'
          }}>
            Read entry →
          </div>
        </div>
      </article>
    </Link>
  );
}
