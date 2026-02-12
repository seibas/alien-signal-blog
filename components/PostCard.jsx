'use client';

import Link from "next/link";
import Image from "next/image";
import SpatialBlurTitle from "./SpatialBlurTitle";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

export default function PostCard({ post, index = 0 }) {
  const { t } = useTranslation();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  // Gradient backgrounds for variety
  const gradients = [
    'linear-gradient(135deg, rgba(0, 255, 65, 0.12), rgba(0, 204, 51, 0.06))', // Green
    'linear-gradient(135deg, rgba(255, 107, 53, 0.12), rgba(255, 140, 0, 0.06))', // Orange
    'linear-gradient(135deg, rgba(91, 33, 182, 0.12), rgba(118, 75, 162, 0.06))', // Purple
    'linear-gradient(135deg, rgba(10, 14, 26, 0.95), rgba(26, 31, 46, 0.85))', // Dark Blue
  ];
  
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

  // Lazy load video with IntersectionObserver
  useEffect(() => {
    if (hasCustomImage || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [hasCustomImage]);

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
              aspectRatio: '16/9',
              minHeight: '150px',
              maxHeight: '200px',
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
              ref={videoRef}
              className="post-image-placeholder" 
              style={{ 
                background: defaultGradient,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isVideoLoaded && (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.6,
                    pointerEvents: 'none'
                  }}
                >
                  <source src="/Nano-Banana-Pro-UFO.mp4" type="video/mp4" />
                </video>
              )}
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
          
          <div className="btn post-card-read-btn" style={{
            fontSize: '12px',
            padding: '8px 14px',
            marginTop: 'auto',
            display: 'inline-block',
            width: 'fit-content',
            textAlign: 'center'
          }}>
            {t('readEntryArrow')}
          </div>
        </div>
      </article>
    </Link>
  );
}
