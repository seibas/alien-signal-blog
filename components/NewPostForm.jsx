'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
import Link from 'next/link';
import ImageUpload from './ImageUpload';

export default function NewPostForm({ onCancel }) {
    // Insert image markdown at the cursor or end of the last text block
    function handleImageInsert(url) {
      setNewPost((prev) => {
        const blocks = [...prev.blocks];
        // Find last text block
        let idx = blocks.length - 1;
        while (idx >= 0 && blocks[idx].type !== 'text') idx--;
        if (idx >= 0) {
          // Insert image markdown at the end of the last text block
          blocks[idx].value += `\n![Image](${url})\n`;
        } else {
          // If no text block, add a new one
          blocks.push({ type: 'text', value: `![Image](${url})\n` });
        }
        return { ...prev, blocks };
      });
    }
  const [newPost, setNewPost] = useState({
    slug: '',
    title: '',
    excerpt: '',
    tags: '',
    date: '',
    readTime: '',
    blocks: [],
  });

  // Handlers for multi-block editing
  function handleBlockChange(idx, value) {
    setNewPost((prev) => {
      const blocks = [...prev.blocks];
      blocks[idx].value = value;
      return { ...prev, blocks };
    });
  }
  function handleBlockLanguage(idx, language) {
    setNewPost((prev) => {
      const blocks = [...prev.blocks];
      if (blocks[idx].type === 'code') blocks[idx].language = language;
      return { ...prev, blocks };
    });
  }
  function addBlock(type) {
    setNewPost((prev) => ({
      ...prev,
      blocks: [...prev.blocks, type === 'code' ? { type: 'code', value: '', language: 'javascript' } : { type: 'text', value: '' }]
    }));
  }
  function removeBlock(idx) {
    setNewPost((prev) => {
      const blocks = [...prev.blocks];
      blocks.splice(idx, 1);
      return { ...prev, blocks };
    });
  }

  function playAlienSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    oscillator1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    oscillator1.frequency.value = 440;
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
  }

  const handleCreate = async () => {
    if (!newPost.slug || !newPost.title || !newPost.excerpt || !newPost.tags || newPost.blocks.length === 0) {
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
          <label>📸 Add Images</label>
          <ImageUpload onImageInsert={handleImageInsert} />
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
          <label>Content Blocks</label>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
            💡 Add text or code blocks. Code blocks support language selection and Monaco Editor.
          </div>
          {newPost.blocks.map((block, idx) => (
            <div key={idx} style={{ marginBottom: 24, border: '1px solid #222', borderRadius: 8, padding: 12, background: '#181c1f' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{block.type === 'code' ? 'Code Block' : 'Text Block'}</span>
                <button onClick={() => removeBlock(idx)} style={{ color: '#ca4a4a', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
              </div>
              {block.type === 'text' ? (
                <textarea
                  value={block.value}
                  onChange={e => handleBlockChange(idx, e.target.value)}
                  className="edit-textarea"
                  rows={4}
                />
              ) : (
                <>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 13, marginRight: 8 }}>Language:</label>
                    <select value={block.language} onChange={e => handleBlockLanguage(idx, e.target.value)}>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="json">JSON</option>
                      <option value="markdown">Markdown</option>
                      <option value="jsx">JSX</option>
                    </select>
                  </div>
                  <div style={{ border: '1px solid #333', borderRadius: 6 }}>
                    <MonacoEditor
                      height="180px"
                      language={block.language}
                      value={block.value}
                      theme="vs-dark"
                      options={{ fontSize: 15, minimap: { enabled: false } }}
                      onChange={val => handleBlockChange(idx, val || '')}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="badge green" type="button" onClick={() => addBlock('text')}>+ Add Text Block</button>
            <button className="badge orange" type="button" onClick={() => addBlock('code')}>+ Add Code Block</button>
          </div>
        </div>
      </div>
    </article>
  );
}
