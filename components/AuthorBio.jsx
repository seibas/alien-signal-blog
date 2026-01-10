'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AuthorBio() {
  const [authorName, setAuthorName] = useState('Alien Signal');
  const [authorTitle, setAuthorTitle] = useState('Cosmic Explorer & Digital Storyteller');
  const [authorBio, setAuthorBio] = useState('Transmitting signals from the depths of space and code. Exploring the intersection of technology, creativity, and the unknown. 每個故事都是一次旅程 🛸');

  useEffect(() => {
    // Load settings from localStorage
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('author_name');
      const savedTitle = localStorage.getItem('author_title');
      const savedBio = localStorage.getItem('author_bio');
      
      if (savedName) setAuthorName(savedName);
      if (savedTitle) setAuthorTitle(savedTitle);
      if (savedBio) setAuthorBio(savedBio);
    }
  }, []);

  return (
    <div className="author-bio">
      <div className="author-bio-content">
        <div className="author-avatar">
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            <Image
              src="/images/avatar.jpg"
              alt="Author Avatar"
              width={80}
              height={80}
              style={{
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                // Fallback to alien emoji if image doesn't exist
                e.target.style.display = 'none';
                const fallback = e.target.parentElement?.nextSibling;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          </div>
          <div className="avatar-fallback">👽</div>
        </div>
        <div className="author-info">
          <h3 className="author-name">{authorName}</h3>
          <p className="author-title">{authorTitle}</p>
          <p className="author-description">
            {authorBio}
          </p>
        </div>
      </div>

      <style jsx>{`
        .author-bio {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid rgba(234,255,247,.12);
        }

        .author-bio-content {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .author-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .author-avatar > div:first-child {
          border: 2px solid rgba(0,255,136,.3);
          box-shadow: 0 4px 16px rgba(0,255,136,.2);
          border-radius: 50%;
        }

        .avatar-fallback {
          display: none;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0,255,136,.2), rgba(255,140,0,.2));
          border: 2px solid rgba(0,255,136,.3);
          align-items: center;
          justify-content: center;
          font-size: 40px;
          box-shadow: 0 4px 16px rgba(0,255,136,.2);
        }

        .author-info {
          flex: 1;
        }

        .author-name {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 700;
          color: #eafff7;
          letter-spacing: -0.01em;
        }

        .author-title {
          margin: 0 0 12px;
          font-size: 13px;
          color: rgba(0,255,136,.9);
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .author-description {
          margin: 0;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(234,255,247,.75);
        }

        @media (max-width: 600px) {
          .author-bio-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .author-avatar > div:first-child {
            width: 100px !important;
            height: 100px !important;
          }

          .avatar-fallback {
            width: 100px;
            height: 100px;
            font-size: 50px;
          }
        }
      `}</style>
    </div>
  );
}
