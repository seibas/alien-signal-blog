'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TypingAnimation from './TypingAnimation';
import ImageUpload from './ImageUpload';
import AuthorBio from './AuthorBio';
import AvatarUploadWidget from './AvatarUploadWidget';

export default function EditableBlogPost({ post }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post.title,
    date: post.date,
    readTime: post.readTime,
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
    content: Array.isArray(post.content) ? post.content.join('\n\n') : post.content || ''
  });

  // Function to render content with image support
  const renderContent = (text) => {
    // Match markdown image syntax: ![alt text](image-url)
    const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = imageRegex.exec(text)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
      }
      // Add the image
      parts.push({ type: 'image', alt: match[1], src: match[2] });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  useEffect(() => {
    // Check if user is authenticated
    const auth = sessionStorage.getItem('admin_authenticated');
    setIsAdmin(auth === 'true');

    // Initialize with current post data
    setEditedPost({
      title: post.title,
      date: post.date,
      readTime: post.readTime,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      content: Array.isArray(post.content) ? post.content.join('\n\n') : post.content || ''
    });
  }, [post]);

  const handleImageInsert = (imageMarkdown) => {
    // Insert image markdown at the end of content with proper spacing
    const currentContent = editedPost.content;
    const newContent = currentContent 
      ? `${currentContent}\n\n${imageMarkdown}\n\n`
      : `${imageMarkdown}\n\n`;
    setEditedPost({...editedPost, content: newContent});
  };

  const playAlienSound = () => {
    // Create an alien "beep-boop" sound effect using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // First beep (higher pitch)
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    oscillator1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    oscillator1.frequency.value = 800;
    oscillator1.type = 'sine';
    gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.15);
    
    // Second beep (lower pitch)
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    oscillator2.frequency.value = 600;
    oscillator2.type = 'sine';
    gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.35);
    oscillator2.start(audioContext.currentTime + 0.15);
    oscillator2.stop(audioContext.currentTime + 0.35);
    
    // Third beep (middle pitch - cute finish)
    const oscillator3 = audioContext.createOscillator();
    const gainNode3 = audioContext.createGain();
    oscillator3.connect(gainNode3);
    gainNode3.connect(audioContext.destination);
    oscillator3.frequency.value = 700;
    oscillator3.type = 'sine';
    gainNode3.gain.setValueAtTime(0.3, audioContext.currentTime + 0.35);
    gainNode3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator3.start(audioContext.currentTime + 0.35);
    oscillator3.stop(audioContext.currentTime + 0.5);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/posts/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: post.slug,
          title: editedPost.title,
          date: editedPost.date,
          readTime: editedPost.readTime,
          tags: editedPost.tags,
          content: editedPost.content
        }),
      });

      const data = await response.json();

      if (response.ok) {
        playAlienSound(); // Play cute alien sound
        setIsEditing(false);
        
        // Show animated success message
        const message = document.createElement('div');
        message.className = 'alien-success-message';
        message.innerHTML = '🛸 ✅ Signal transmitted successfully!';
        document.body.appendChild(message);
        
        setTimeout(() => {
          message.remove();
          window.location.reload();
        }, 1500);
      } else {
        alert('❌ Failed to save: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Failed to save changes. Check console for details.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original post data
    setEditedPost({
      title: post.title,
      date: post.date,
      readTime: post.readTime,
      tags: post.tags.join(', '),
      content: post.content.join('\n\n')
    });
  };

  if (isEditing) {
    return (
      <article className="article">
        <div className="card cardPad">
          <div className="edit-controls">
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btnPrimary" onClick={handleSave}>
                💾 Save Changes
              </button>
              <button className="btn btnGhost" onClick={handleCancel}>
                ✕ Cancel
              </button>
            </div>
            <AvatarUploadWidget />
          </div>

          <div className="edit-section">
            <label>Date & Read Time</label>
            <div className="edit-row">
              <input
                type="text"
                value={editedPost.date}
                onChange={(e) => setEditedPost({...editedPost, date: e.target.value})}
                placeholder="Date"
                className="edit-input"
              />
              <input
                type="text"
                value={editedPost.readTime}
                onChange={(e) => setEditedPost({...editedPost, readTime: e.target.value})}
                placeholder="Read time"
                className="edit-input"
              />
            </div>
          </div>

          <div className="edit-section">
            <label>Title</label>
            <input
              type="text"
              value={editedPost.title}
              onChange={(e) => setEditedPost({...editedPost, title: e.target.value})}
              className="edit-input edit-title"
            />
          </div>

          <div className="edit-section">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              value={editedPost.tags}
              onChange={(e) => setEditedPost({...editedPost, tags: e.target.value})}
              className="edit-input"
            />
          </div>

          <div className="edit-section">
            <label>Content (paragraphs separated by blank lines)</label>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              💡 To add images, use the drag & drop area below or manually type: ![description](/images/filename.jpg)
            </div>
            <textarea
              value={editedPost.content}
              onChange={(e) => setEditedPost({...editedPost, content: e.target.value})}
              className="edit-textarea"
              rows={15}
            />
            
            <ImageUpload onImageInsert={handleImageInsert} />
          </div>

          <div style={{ height: 10 }} />
          <div className="btnRow">
            <Link className="btn btnPrimary" href="/blog">Back to Logbook</Link>
            <Link className="btn btnGhost" href="/">Home</Link>
          </div>
        </div>
      </article>
    );
  }

  const displayTags = editedPost.tags.split(',').map(t => t.trim()).filter(Boolean);
  const displayContent = editedPost.content.split('\n\n').filter(Boolean);

  return (
    <article className="article">
      <div className="card cardPad">
        {isAdmin && (
          <button 
            className="edit-toggle-btn"
            onClick={() => setIsEditing(true)}
            title="Edit post"
          >
            ✏️ Edit
          </button>
        )}

        <div className="postMeta">
          <span>{editedPost.date}</span>
          <span>{editedPost.readTime}</span>
        </div>

        <h1 className="articleTitle" style={{ marginTop: 10 }}>{editedPost.title}</h1>
        <p className="articleMeta">
          Tags: {displayTags.join(' • ')}
        </p>

        <div className="articleContent">
          {displayContent.map((para, idx) => {
            const contentParts = renderContent(para);
            return (
              <div key={idx} style={{ marginBottom: '1.5em' }}>
                {contentParts.map((part, partIdx) => {
                  if (part.type === 'image') {
                    return (
                      <img
                        key={partIdx}
                        src={part.src}
                        alt={part.alt}
                        style={{
                          maxWidth: '85%',
                          height: 'auto',
                          borderRadius: '12px',
                          margin: '2em auto',
                          display: 'block',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                          border: '1px solid rgba(234,255,247,.1)'
                        }}
                      />
                    );
                  }
                  return part.content ? (
                    <TypingAnimation key={partIdx} speed={8}>
                      {part.content}
                    </TypingAnimation>
                  ) : null;
                })}
              </div>
            );
          })}
        </div>

        <AuthorBio />

        <div style={{ height: 10 }} />
        <div className="btnRow">
          <Link className="btn btnPrimary" href="/blog">Back to Logbook</Link>
          <Link className="btn btnGhost" href="/">Home</Link>
        </div>
      </div>
    </article>
  );
}
