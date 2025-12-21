'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewPostForm({ onCancel }) {
  const [newPost, setNewPost] = useState({
    slug: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '3 min',
    excerpt: '',
    tags: '',
    content: ''
  });


  const playAlienSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
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

  const handleCreate = async () => {
    if (!newPost.slug || !newPost.title || !newPost.excerpt || !newPost.tags || !newPost.content) {
      alert('❌ Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      const data = await response.json();

      if (response.ok) {
        playAlienSound();
        
        const message = document.createElement('div');
        message.className = 'alien-success-message';
        message.innerHTML = '🛸 ✅ New post created successfully!';
        document.body.appendChild(message);
        
        setTimeout(() => {
          message.remove();
          window.location.reload();
        }, 1500);
      } else {
        alert('❌ Failed to create post: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('❌ Failed to create post. Check console for details.');
    }
  };

  return (
    <article className="article">
      <div className="card cardPad">
        <div className="edit-controls">
          <button className="btn btnPrimary" onClick={handleCreate}>
            🚀 Create Post
          </button>
          <button className="btn btnGhost" onClick={onCancel}>
            ✕ Cancel
          </button>
        </div>

        <div className="edit-section">
          <label>Slug (URL identifier, e.g., "log-003-my-journey")</label>
          <input
            type="text"
            value={newPost.slug}
            onChange={(e) => setNewPost({...newPost, slug: e.target.value})}
            placeholder="log-003-my-journey"
            className="edit-input"
          />
        </div>

        <div className="edit-section">
          <label>Date & Read Time</label>
          <div className="edit-row">
            <input
              type="text"
              value={newPost.date}
              onChange={(e) => setNewPost({...newPost, date: e.target.value})}
              placeholder="YYYY-MM-DD"
              className="edit-input"
            />
            <input
              type="text"
              value={newPost.readTime}
              onChange={(e) => setNewPost({...newPost, readTime: e.target.value})}
              placeholder="3 min"
              className="edit-input"
            />
          </div>
        </div>

        <div className="edit-section">
          <label>Title</label>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            placeholder="LOG 003: My Amazing Journey"
            className="edit-input edit-title"
          />
        </div>

        <div className="edit-section">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            value={newPost.tags}
            onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
            placeholder="learning, javascript, react"
            className="edit-input"
          />
        </div>

        <div className="edit-section">
          <label>Excerpt (short preview shown on blog page)</label>
          <textarea
            value={newPost.excerpt}
            onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
            placeholder="A brief summary of your post..."
            className="edit-textarea"
            rows={3}
          />
        </div>

        <div className="edit-section">
          <label>Content (paragraphs separated by blank lines)</label>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
            💡 To add images, use: ![description](/images/filename.jpg)
          </div>
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            placeholder="First paragraph goes here.

Second paragraph goes here.

To add an image: ![My cool image](/images/my-image.jpg)

Third paragraph goes here."
            className="edit-textarea"
            rows={15}
          />
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
