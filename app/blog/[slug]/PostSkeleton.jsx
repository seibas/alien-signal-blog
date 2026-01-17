/**
 * Loading skeleton for blog post
 * Shows layout immediately while content streams in
 *
 * Rule 6.3: Hoist Static JSX Elements
 */

// Hoisted static elements outside component
const skeletonLine = (width) => (
  <div
    className="post-skeleton-line"
    style={{
      height: '1em',
      width,
      background: 'rgba(0, 255, 140, 0.1)',
      borderRadius: '4px',
      marginBottom: '0.75em',
      animation: 'shimmer 1.5s ease-in-out infinite',
    }}
  />
);

const skeletonParagraph = (
  <div style={{ marginBottom: '1.5em' }}>
    {skeletonLine('100%')}
    {skeletonLine('95%')}
    {skeletonLine('88%')}
    {skeletonLine('92%')}
  </div>
);

export default function PostSkeleton() {
  return (
    <article className="article">
      <div className="card cardPad">
        {/* Meta skeleton */}
        <div className="postMeta" style={{ opacity: 0.5 }}>
          <span style={{ background: 'rgba(0, 255, 140, 0.1)', borderRadius: '4px', padding: '4px 12px' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span style={{ background: 'rgba(0, 255, 140, 0.1)', borderRadius: '4px', padding: '4px 12px' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>

        {/* Title skeleton */}
        <div
          style={{
            height: '2.5em',
            width: '80%',
            background: 'rgba(0, 255, 140, 0.15)',
            borderRadius: '8px',
            margin: '1em 0 1.5em',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />

        {/* Tags skeleton */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2em' }}>
          <span style={{ background: 'rgba(0, 255, 140, 0.1)', borderRadius: '12px', padding: '4px 16px' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span style={{ background: 'rgba(0, 255, 140, 0.1)', borderRadius: '12px', padding: '4px 16px' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>

        {/* Content skeleton */}
        <div className="articleContent" style={{ opacity: 0.6 }}>
          {skeletonParagraph}
          {skeletonParagraph}
          {skeletonParagraph}
        </div>
      </div>
    </article>
  );
}
