'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUpload from './ImageUpload';
import { playAlienSound } from '@/lib/alienSound';
import { toast } from '@/lib/toast';
import { logger } from '@/lib/logger';

export default function NewPostForm({ onCancel }) {
  // Generate URL-safe slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-')       // Replace multiple hyphens with single
      .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens
  };

  // Sanitize slug input to ensure it's URL-safe
  const sanitizeSlug = (slug) => {
    return slug
      .toLowerCase()
      .trim()
      .replace(/[^\w-]/g, '-')   // Replace invalid chars with hyphen
      .replace(/-+/g, '-')       // Replace multiple hyphens with single
      .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens
  };

  const [newPost, setNewPost] = useState({
    slug: '',
    title: '',
    excerpt: '',
    tags: '',
    date: '',
    readTime: '',
    blocks: [],
  });

  // Track raw slug input before sanitization
  const [rawSlug, setRawSlug] = useState('');

  // AI Magic state
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [writingModeBlockIndex, setWritingModeBlockIndex] = useState(null);

  // ESC key handler for writing mode
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && writingModeBlockIndex !== null) {
        setWritingModeBlockIndex(null);
      }
    };

    if (writingModeBlockIndex !== null) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [writingModeBlockIndex]);

  // AI Magic - auto-fill fields
  const handleMagic = async () => {
    // Get content from blocks
    const contentText = newPost.blocks
      .map(b => b.type === 'code' ? `\`\`\`${b.language}\n${b.value}\n\`\`\`` : b.value)
      .join('\n\n');

    if (!newPost.title.trim() && !contentText.trim()) {
      toast.error('Add a title or content first');
      return;
    }

    setIsEnhancing(true);
    toast.success('Applying magic...');

    try {
      const response = await fetch('/api/posts/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPost.title.trim() || 'Untitled Post',
          content: contentText,
          useAI
        })
      });

      const data = await response.json();

      if (response.ok && data.enhanced) {
        const enhanced = data.enhanced;

        setNewPost(prev => ({
          ...prev,
          slug: enhanced.slug || prev.slug,
          title: enhanced.title || prev.title,
          date: enhanced.date || prev.date,
          readTime: enhanced.readTime || prev.readTime,
          excerpt: enhanced.excerpt || prev.excerpt,
          tags: Array.isArray(enhanced.tags) ? enhanced.tags.join(', ') : enhanced.tags || prev.tags,
          blocks: enhanced.blocks?.length > 0 ? enhanced.blocks : prev.blocks
        }));

        setRawSlug(enhanced.slug || '');
        playAlienSound();
        toast.success('Magic applied!');
      } else {
        toast.error(data.error || 'Enhancement failed');
      }
    } catch (error) {
      console.error('Magic error:', error);
      toast.error('Magic failed - try again');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Insert image markdown at the cursor or end of the last text block
  function handleImageInsert(markdown) {
    setNewPost((prev) => {
      const blocks = [...prev.blocks];
      // Find last text block
      let idx = blocks.length - 1;
      while (idx >= 0 && blocks[idx].type !== 'text') idx--;
      if (idx >= 0) {
        // Insert image markdown at the end of the last text block
        blocks[idx].value += `\n${markdown}\n`;
      } else {
        // If no text block, add a new one
        blocks.push({ type: 'text', value: `${markdown}\n` });
      }
      return { ...prev, blocks };
    });
  }

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
    if (type === 'image') {
      setNewPost((prev) => ({
        ...prev,
        blocks: [...prev.blocks, { type: 'image', src: '', alt: '' }]
      }));
    } else {
      setNewPost((prev) => ({
        ...prev,
        blocks: [...prev.blocks, type === 'code' ? { type: 'code', value: '', language: 'javascript' } : { type: 'text', value: '' }]
      }));
    }
  }

  function removeBlock(idx) {
    setNewPost((prev) => {
      const blocks = [...prev.blocks];
      blocks.splice(idx, 1);
      return { ...prev, blocks };
    });
  }

  function moveBlock(idx, direction) {
    setNewPost((prev) => {
      const blocks = [...prev.blocks];
      const newIndex = idx + direction;
      if (newIndex < 0 || newIndex >= blocks.length) return prev;
      const temp = blocks[idx];
      blocks[idx] = blocks[newIndex];
      blocks[newIndex] = temp;
      return { ...prev, blocks };
    });
  }

  const handleCreate = async () => {
    // Auto-generate missing fields - no validation needed!
    const postTitle = newPost.title.trim() || 'Untitled Post';
    const postSlug = newPost.slug.trim() || `untitled-${Date.now()}`;
    const postExcerpt = newPost.excerpt.trim() || 'No description yet.';
    const postTags = newPost.tags.trim() || 'draft';
    const postDate = newPost.date.trim() || new Date().toISOString().split('T')[0];
    const postReadTime = newPost.readTime.trim() || '1 min';
    
    // If no blocks, add a default text block
    const postBlocks = newPost.blocks.length > 0 ? newPost.blocks : [
      { type: 'text', value: 'Start writing your post here...' }
    ];

    try {
      // Send blocks array directly (not converted to string)
      const postData = {
        slug: postSlug,
        title: postTitle,
        date: postDate,
        readTime: postReadTime,
        tags: postTags,
        excerpt: postExcerpt,
        blocks: postBlocks
      };

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        playAlienSound();
        toast.success('Post created successfully! 🛸');
        setTimeout(() => {
          window.location.href = `/blog/${data.post.slug}`;
        }, 1000);
      } else {
        const errorMsg = data.missing 
          ? `Missing fields: ${data.missing.join(', ')}` 
          : (data.error || 'Unknown error');
        logger.error('Create failed:', errorMsg, data);
        toast.error('Failed: ' + errorMsg);
      }
    } catch (error) {
      logger.error('Create error:', error);
      toast.error('Failed to create post.');
    }
  };

  return (
    <article className="article">
      <div className="card cardPad">
        <div className="edit-controls" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btnPrimary" onClick={handleCreate}>
            🚀 Create Post
          </button>
          <button
            className="btn"
            onClick={handleMagic}
            disabled={isEnhancing}
            style={{
              background: 'linear-gradient(135deg, #00ff8c 0%, #007a4d 100%)',
              color: '#000',
              fontWeight: 700,
              border: 'none',
              boxShadow: '0 0 20px rgba(0, 255, 140, 0.3)'
            }}
          >
            {isEnhancing ? '✨ Working...' : '✨ Magic'}
          </button>
          <button
            className="btn"
            onClick={() => setUseAI(!useAI)}
            title={useAI ? 'AI Mode: ON' : 'AI Mode: OFF'}
            style={{
              background: useAI ? 'rgba(0, 255, 140, 0.2)' : 'rgba(255, 145, 0, 0.2)',
              border: `1px solid ${useAI ? '#00ff8c' : '#ff9100'}`,
              color: useAI ? '#00ff8c' : '#ff9100',
              minWidth: 48
            }}
          >
            {useAI ? '🤖' : '📝'}
          </button>
          <button className="btn btnGhost" onClick={onCancel}>
            ✕ Cancel
          </button>
        </div>

        <div style={{ fontSize: 12, color: '#888', marginTop: 8, marginBottom: 16 }}>
          {useAI
            ? '🤖 AI Mode: Click Magic to auto-generate slug, tags, excerpt & format content'
            : '📝 Manual Mode: Basic auto-fill without AI'}
        </div>

        <div className="edit-section">
          <label>📸 Add Images</label>
          <ImageUpload onImageInsert={handleImageInsert} />
        </div>

        <div className="edit-section">
          <label>Slug (URL identifier, e.g., "log-003-my-journey")</label>
          <input
            type="text"
            value={rawSlug}
            onChange={(e) => {
              const input = e.target.value;
              setRawSlug(input);
              setNewPost({...newPost, slug: sanitizeSlug(input)});
            }}
            placeholder="log-003-my-journey"
            className="edit-input"
          />
          {rawSlug && newPost.slug !== rawSlug && (
            <div style={{ fontSize: '12px', color: '#00ff8c', marginTop: '4px' }}>
              Final URL: {newPost.slug}
            </div>
          )}
          {newPost.title && !newPost.slug && (
            <button 
              type="button"
              className="btn btnGhost"
              onClick={() => {
                const generated = generateSlug(newPost.title);
                setRawSlug(generated);
                setNewPost({...newPost, slug: generated});
              }}
              style={{ marginTop: '8px', fontSize: '12px' }}
            >
              🔗 Generate from title
            </button>
          )}
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
            onChange={(e) => {
              const title = e.target.value;
              const generatedSlug = generateSlug(title);
              setNewPost({
                ...newPost, 
                title,
                // Auto-generate slug from title if slug is empty
                slug: newPost.slug === '' ? generatedSlug : newPost.slug
              });
              // Update raw slug if it's empty
              if (rawSlug === '') {
                setRawSlug(generatedSlug);
              }
            }}
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
            💡 Add text or code blocks. Click 📝 on any text block for focused writing mode.
          </div>
          {newPost.blocks.map((block, idx) => (
            <div key={idx} style={{ marginBottom: 24, border: '1px solid #222', borderRadius: 8, padding: 12, background: '#181c1f' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{block.type === 'code' ? 'Code Block' : block.type === 'image' ? '📸 Image Block' : 'Text Block'}</span>
                  {block.type === 'text' && (
                    <button
                      type="button"
                      onClick={() => setWritingModeBlockIndex(idx)}
                      title="Open focus writing mode"
                      aria-label="Open focus writing mode"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 140, 0.2) 0%, rgba(0, 200, 100, 0.15) 100%)',
                        border: '1px solid rgba(0, 255, 140, 0.35)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#00ff8c',
                        cursor: 'pointer',
                        minHeight: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 255, 140, 0.3) 0%, rgba(0, 200, 100, 0.25) 100%)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 255, 140, 0.2) 0%, rgba(0, 200, 100, 0.15) 100%)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span>📝</span>
                      <span>Write</span>
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    title="Move Up"
                    onClick={() => moveBlock(idx, -1)}
                    disabled={idx === 0}
                    style={{
                      color: idx === 0 ? '#555' : '#00ff8c',
                      background: idx === 0 ? '#333' : 'linear-gradient(180deg, #00ff8c 0%, #007a4d 100%)',
                      border: 'none',
                      borderRadius: '50%',
                      fontSize: 18,
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      minHeight: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: idx === 0 ? 'none' : '0 2px 8px #00ff8c44',
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      padding: 0,
                      marginRight: 4,
                      transition: 'transform 0.1s',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                    }}
                  >
                    <span style={{ display: 'inline-block', transform: 'translateY(-1px)' }}>▲</span>
                  </button>
                  <button
                    type="button"
                    title="Move Down"
                    onClick={() => moveBlock(idx, 1)}
                    disabled={idx === newPost.blocks.length - 1}
                    style={{
                      color: idx === newPost.blocks.length - 1 ? '#555' : '#ff9100',
                      background: idx === newPost.blocks.length - 1 ? '#333' : 'linear-gradient(180deg, #ff9100 0%, #7a4d00 100%)',
                      border: 'none',
                      borderRadius: '50%',
                      fontSize: 18,
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      minHeight: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: idx === newPost.blocks.length - 1 ? 'none' : '0 2px 8px #ff910044',
                      cursor: idx === newPost.blocks.length - 1 ? 'not-allowed' : 'pointer',
                      padding: 0,
                      marginRight: 4,
                      transition: 'transform 0.1s',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                    }}
                  >
                    <span style={{ display: 'inline-block', transform: 'translateY(1px)' }}>▼</span>
                  </button>
                  <button
                    onClick={() => removeBlock(idx)}
                    style={{
                      color: '#ca4a4a',
                      background: 'rgba(202,74,74,0.15)',
                      border: '1px solid rgba(202,74,74,0.3)',
                      borderRadius: '50%',
                      fontSize: 16,
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      minHeight: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                    }}
                  >✕</button>
                </div>
              </div>
              {block.type === 'code' ? (
                <>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 13, marginRight: 8 }}>Language:</label>
                    <select
                      value={block.language}
                      onChange={e => handleBlockLanguage(idx, e.target.value)}
                      style={{
                        background: '#1e1e1e',
                        color: '#00ff8c',
                        border: '1px solid #333',
                        borderRadius: 6,
                        padding: '8px 12px',
                        fontSize: 14,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="json">JSON</option>
                      <option value="markdown">Markdown</option>
                      <option value="jsx">JSX</option>
                      <option value="bash">Bash</option>
                    </select>
                  </div>
                  <textarea
                    value={block.value}
                    onChange={e => handleBlockChange(idx, e.target.value)}
                    className="edit-textarea code-textarea"
                    rows={8}
                    placeholder="// Write your code here..."
                    style={{
                      fontFamily: "'Share Tech Mono', 'Fira Code', monospace",
                      fontSize: 14,
                      lineHeight: 1.5,
                      background: '#1e1e1e',
                      color: '#d4d4d4',
                      border: '1px solid #333',
                      borderRadius: 8,
                      padding: 16,
                      whiteSpace: 'pre',
                      overflowX: 'auto'
                    }}
                  />
                  <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                    Code will be syntax-highlighted when displayed
                  </div>
                </>
              ) : block.type === 'text' ? (
                <>
                  {/* Show preview of images in text */}
                  {(() => {
                    const imageMatches = [...(block.value || '').matchAll(/!\[([^\]]*)\]\(([^\)]+)\)/g)];
                    return imageMatches.length > 0 && (
                      <div style={{ marginBottom: 12, padding: 12, background: '#0a0a0a', borderRadius: 8 }}>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>📸 Images in this text block:</div>
                        {imageMatches.map((match, i) => (
                          <div key={i} style={{ marginBottom: 8, padding: 8, background: '#181c1f', borderRadius: 6 }}>
                            <img src={match[2]} alt={match[1]} style={{ width: '100%', maxWidth: '300px', display: 'block', borderRadius: 4, marginBottom: 4 }} />
                            <div style={{ fontSize: 11, color: '#666' }}>Alt: {match[1] || '(none)'}</div>
                            <button
                              type="button"
                              onClick={() => {
                                // Convert to image block
                                const newImageBlock = { type: 'image', src: match[2], alt: match[1] };
                                // Remove from text
                                const newValue = block.value.replace(match[0], '').trim();
                                setNewPost((prev) => {
                                  const blocks = [...prev.blocks];
                                  blocks[idx].value = newValue;
                                  blocks.splice(idx + 1, 0, newImageBlock);
                                  return { ...prev, blocks };
                                });
                              }}
                              style={{ marginTop: 8, fontSize: 13, padding: '10px 16px', minHeight: 44, background: '#00ff8c', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                            >
                              🔄 Convert to Image Block
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  <textarea
                    value={block.value}
                    onChange={e => handleBlockChange(idx, e.target.value)}
                    className="edit-textarea"
                    rows={4}
                  />
                  <div style={{ marginTop: 8 }}>
                    <ImageUpload onImageInsert={(markdown) => {
                      // Append image markdown to this text block
                      handleBlockChange(idx, block.value + '\n\n' + markdown);
                    }} />
                  </div>
                </>
              ) : block.type === 'image' ? (
                <>
                  <div style={{ marginBottom: 12, position: 'relative', maxWidth: '100%', borderRadius: 8, overflow: 'hidden', background: block.src ? 'transparent' : '#0a0a0a', minHeight: block.src ? 'auto' : '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {block.src ? (
                      <img src={block.src} alt={block.alt || 'Preview'} style={{ width: '100%', display: 'block' }} />
                    ) : (
                      <div style={{ color: '#555', fontSize: '14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '8px' }}>📸</div>
                        <div>No image yet</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>Click upload below</div>
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <input
                      type="text"
                      value={block.alt || ''}
                      onChange={e => {
                        setNewPost((prev) => {
                          const blocks = [...prev.blocks];
                          blocks[idx].alt = e.target.value;
                          return { ...prev, blocks };
                        });
                      }}
                      placeholder="Image description (optional)"
                      className="edit-input"
                      style={{ marginBottom: 8, fontSize: 13 }}
                    />
                  </div>
                  <ImageUpload onImageInsert={(markdown) => {
                    // Parse markdown to extract URL and alt text: ![alt](url)
                    const match = markdown.match(/!\[([^\]]*)\]\(([^\)]+)\)/);
                    if (match) {
                      setNewPost((prev) => {
                        const blocks = [...prev.blocks];
                        blocks[idx].alt = match[1] || blocks[idx].alt;
                        blocks[idx].src = match[2];
                        return { ...prev, blocks };
                      });
                    }
                  }} />
                </>
              ) : null}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn" type="button" onClick={() => {
              addBlock('text');
              // Open writing mode for the newly added block
              setTimeout(() => setWritingModeBlockIndex(newPost.blocks.length), 0);
            }}>+ Add Text Block</button>
            <button className="btn" type="button" onClick={() => addBlock('code')}>+ Add Code Block</button>
            <button className="btn" type="button" onClick={() => addBlock('image')}>📸 Add Image Block</button>
          </div>
        </div>
      </div>

      {writingModeBlockIndex !== null && newPost.blocks[writingModeBlockIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="writing-mode-title"
          className="writing-mode-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setWritingModeBlockIndex(null);
            }
          }}
        >
          <div className="writing-mode-container">
            {/* Header */}
            <div className="writing-mode-header">
              <div id="writing-mode-title" className="writing-mode-header-title">
                Writing Mode
              </div>
              <div className="writing-mode-header-actions">
                {/* Mobile back button */}
                <button
                  className="writing-mode-back-btn"
                  onClick={() => setWritingModeBlockIndex(null)}
                  title="Exit writing mode"
                  aria-label="Go back"
                >
                  ←
                </button>
                {/* Desktop exit button */}
                <button
                  className="writing-mode-exit-btn"
                  onClick={() => setWritingModeBlockIndex(null)}
                  title="Exit writing mode (ESC)"
                  aria-label="Close writing mode"
                >
                  ✕ Close
                </button>
                <button
                  className="writing-mode-save-btn"
                  onClick={handleCreate}
                  title="Create post"
                >
                  🚀 Create
                </button>
              </div>
            </div>

            {/* Body - A4 writing area */}
            <div className="writing-mode-body">
              <label className="writing-mode-label">
                Text Block {writingModeBlockIndex + 1}
              </label>
              <div className="writing-mode-sublabel">
                Focus mode — write comfortably on this A4-style page
              </div>
              <textarea
                autoFocus
                value={newPost.blocks[writingModeBlockIndex]?.value || ''}
                onChange={(e) => handleBlockChange(writingModeBlockIndex, e.target.value)}
                className="writing-mode-textarea"
                placeholder="Start writing your content here..."
                aria-label="Writing area"
              />
              <div style={{ marginTop: 20 }}>
                <ImageUpload onImageInsert={(markdown) => {
                  handleBlockChange(writingModeBlockIndex, (newPost.blocks[writingModeBlockIndex]?.value || '') + '\n\n' + markdown);
                }} />
              </div>
            </div>

            {/* Footer */}
            <div className="writing-mode-footer">
              <div className="writing-mode-footer-hint">
                Press <kbd>ESC</kbd> to close
              </div>
              <button
                className="writing-mode-exit-btn"
                onClick={() => setWritingModeBlockIndex(null)}
                title="Return to normal view"
              >
                ← Back to editor
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
