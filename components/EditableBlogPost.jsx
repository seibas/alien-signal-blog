'use client';

import { useState, useEffect, memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import TypingAnimation from './TypingAnimation';
import AuthorBio from './AuthorBio';
import { playAlienSound } from '@/lib/alienSound';
import { toast } from '@/lib/toast';
import { logger } from '@/lib/logger';
import SpatialBlurTitle from './SpatialBlurTitle';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Rule 2.4: Dynamic Imports for Heavy Components
 * SyntaxHighlighter (~300KB) and MonacoEditor (~2MB) loaded on demand
 */
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then(mod => mod.Prism),
  {
    ssr: false,
    loading: () => (
      <div style={{
        background: '#1e1e1e',
        borderRadius: 10,
        padding: 18,
        color: '#888',
        fontFamily: 'monospace'
      }}>
        Loading code...
      </div>
    ),
  }
);

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Dynamically import editing components only when needed
const ImageUpload = dynamic(() => import('./ImageUpload'), { ssr: false });
const AvatarUploadWidget = dynamic(() => import('./AvatarUploadWidget'), { ssr: false });

// Import syntax highlighter theme
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Rule 5.2: Extract to Memoized Components
 * Prevents re-rendering of expensive SyntaxHighlighter
 */
const CodeBlock = memo(function CodeBlock({ code, language }) {
  return (
    <div style={{ margin: '2em 0' }}>
      <SyntaxHighlighter
        language={language || 'javascript'}
        style={vscDarkPlus}
        customStyle={{ borderRadius: 10, fontSize: 16, padding: 18 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
});

/**
 * Rule 5.5: Use Lazy State Initialization
 * Expensive initial state computation only runs once
 */
function initializeEditedPost(post) {
  return {
    title: post.title,
    date: post.date,
    readTime: post.readTime,
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
    blocks: Array.isArray(post.blocks)
      ? post.blocks
      : (Array.isArray(post.content)
          ? [{ type: 'text', value: post.content.join('\n\n') }]
          : [{ type: 'text', value: post.content || '' }])
  };
}

export default function EditableBlogPost({ post }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // Rule 5.5: Lazy state initialization - function only runs on first render
  const [editedPost, setEditedPost] = useState(() => initializeEditedPost(post));

  // Use translation hook
  const { 
    displayContent, 
    displayTitle, 
    isTranslating, 
    error: translationError 
  } = useTranslation(
    post?.slug,
    editedPost.blocks,
    editedPost.title
  );

  /**
   * Parses text content and extracts inline markdown images
   * Converts markdown image syntax ![alt](url) into structured parts
   * Returns array of {type, content} or {type, alt, src} objects
   */
  const renderContent = (text) => {
    // Match markdown image syntax: ![alt text](image-url)
    const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    // Find all images in the text
    while ((match = imageRegex.exec(text)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
      }
      // Add the image (match[1] = alt text, match[2] = URL)
      parts.push({ type: 'image', alt: match[1], src: match[2] });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last image
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  useEffect(() => {
    // Check if user is authenticated
    const auth = sessionStorage.getItem('admin_authenticated');
    setIsAdmin(auth === 'true');
    setEditedPost({
      title: post.title,
      date: post.date,
      readTime: post.readTime,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      blocks: Array.isArray(post.blocks)
        ? post.blocks
        : (Array.isArray(post.content)
            ? [{ type: 'text', value: post.content.join('\n\n') }]
            : [{ type: 'text', value: post.content || '' }])
    });
  }, [post]);

  const handleImageInsert = (markdown) => {
    // Insert image markdown at the end of the last text block
    setEditedPost((prev) => {
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
          blocks: editedPost.blocks
        }),
      });
      const data = await response.json();
      if (response.ok) {
        playAlienSound();
        setIsEditing(false);
        toast.success('Signal transmitted successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error('Failed to save: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      logger.error('Save error:', error);
      toast.error('Failed to save changes.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    setEditedPost({
      title: post.title,
      date: post.date,
      readTime: post.readTime,
      tags: post.tags.join(', '),
      content: post.content.join('\n\n')
    });
  };

  const handleDelete = async () => {
    if (!confirm('⚠️ Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/posts/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: post.slug }),
      });

      if (response.ok) {
        toast.success('Post deleted successfully!');
        setTimeout(() => {
          window.location.href = '/blog';
        }, 1000);
      } else {
        const data = await response.json();
        toast.error(`Failed to delete: ${data.error}`);
      }
    } catch (error) {
      logger.error('Delete error:', error);
      toast.error('Failed to delete post');
    }
  };

  if (isEditing) {
    // Handlers for multi-block editing
    const handleBlockChange = (idx, value) => {
      setEditedPost((prev) => {
        const blocks = [...prev.blocks];
        blocks[idx].value = value;
        return { ...prev, blocks };
      });
    };
    const handleBlockLanguage = (idx, language) => {
      setEditedPost((prev) => {
        const blocks = [...prev.blocks];
        if (blocks[idx].type === 'code') blocks[idx].language = language;
        return { ...prev, blocks };
      });
    };
    const addBlock = (type) => {
      if (type === 'image') {
        setEditedPost((prev) => ({
          ...prev,
          blocks: [...prev.blocks, { type: 'image', src: '', alt: '' }]
        }));
      } else {
        setEditedPost((prev) => ({
          ...prev,
          blocks: [...prev.blocks, type === 'code' ? { type: 'code', value: '', language: 'javascript' } : { type: 'text', value: '' }]
        }));
      }
    };
    const removeBlock = (idx) => {
      setEditedPost((prev) => {
        const blocks = [...prev.blocks];
        blocks.splice(idx, 1);
        return { ...prev, blocks };
      });
    };

    const moveBlock = (idx, direction) => {
      setEditedPost((prev) => {
        const blocks = [...prev.blocks];
        const newIndex = idx + direction;
        if (newIndex < 0 || newIndex >= blocks.length) return prev;
        const temp = blocks[idx];
        blocks[idx] = blocks[newIndex];
        blocks[newIndex] = temp;
        return { ...prev, blocks };
      });
    };
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
            <label>📸 Add Images</label>
            <ImageUpload onImageInsert={handleImageInsert} />
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
            <label>Content Blocks</label>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              💡 Add text or code blocks. Code blocks support language selection and Monaco Editor.
            </div>
            {editedPost.blocks.map((block, idx) => (
              <div key={idx} style={{ marginBottom: 24, border: '1px solid #222', borderRadius: 8, padding: 12, background: '#181c1f' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>{block.type === 'code' ? 'Code Block' : block.type === 'image' ? '📸 Image Block' : 'Text Block'}</span>
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
                      disabled={idx === editedPost.blocks.length - 1}
                      style={{
                        color: idx === editedPost.blocks.length - 1 ? '#555' : '#ff9100',
                        background: idx === editedPost.blocks.length - 1 ? '#333' : 'linear-gradient(180deg, #ff9100 0%, #7a4d00 100%)',
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
                        boxShadow: idx === editedPost.blocks.length - 1 ? 'none' : '0 2px 8px #ff910044',
                        cursor: idx === editedPost.blocks.length - 1 ? 'not-allowed' : 'pointer',
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
                {block.type === 'text' ? (
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
                                  setEditedPost((prev) => {
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
                ) : block.type === 'code' ? (
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
                          setEditedPost((prev) => {
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
                        setEditedPost((prev) => {
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
              <button className="btn" type="button" onClick={() => addBlock('text')}>+ Add Text Block</button>
              <button className="btn" type="button" onClick={() => addBlock('code')}>+ Add Code Block</button>
              <button className="btn" type="button" onClick={() => addBlock('image')}>📸 Add Image Block</button>
            </div>
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

  // Use translated content if available, otherwise use original
  const blocks = displayContent || (Array.isArray(post.blocks)
    ? post.blocks
    : (Array.isArray(post.content)
        ? [{ type: 'text', value: post.content.join('\n\n') }]
        : [{ type: 'text', value: post.content || '' }]));

  return (
    <article className="article">
      <div className="card cardPad">
        {/* Language Switcher - Top Right */}
        <div style={{ 
          position: 'absolute', 
          top: '1rem', 
          right: '1rem',
          zIndex: 10
        }}>
          <LanguageSwitcher />
        </div>

        {/* Translation Status Indicators */}
        {isTranslating && (
          <div className="translation-loading">
            🛸 Translating to Italian...
          </div>
        )}
        
        {translationError && (
          <div className="translation-error">
            ⚠️ Translation failed. Showing original.
          </div>
        )}

        {isAdmin && (
          <button 
            className="edit-toggle-btn"
            onClick={() => setIsEditing(true)}
            title="Edit post"
          >
            ✏️ Edit
          </button>
        )}
        {isAdmin && (
          <button
            className="edit-toggle-btn"
            onClick={handleDelete}
            title="Delete post"
            style={{
              right: '80px',
              background: 'rgba(202, 74, 74, 0.9)',
              borderColor: 'rgba(202, 74, 74, 0.5)'
            }}
          >
            🗑️ Delete
          </button>
        )}

        <div className="postMeta">
          <span>{editedPost.date}</span>
          <span>{editedPost.readTime}</span>
        </div>

        <SpatialBlurTitle 
          text={displayTitle || editedPost.title} 
          as="h1"
          sparkleCount={8}
          className="post-main-title"
        />
        
        <p className="articleMeta">
          Tags: {displayTags.join(' • ')}
        </p>

        <div className="articleContent">
          {blocks.map((block, idx) => {
            if (block.type === 'code') {
              return (
                <CodeBlock key={idx} code={block.value} language={block.language} />
              );
            } else if (block.type === 'image') {
              return (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    maxWidth: '85%',
                    margin: '2em auto',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(234,255,247,.1)'
                  }}
                >
                  <Image
                    src={block.src}
                    alt={block.alt || 'Blog image'}
                    width={800}
                    height={600}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                </div>
              );
            } else {
              // Render text with inline image support
              const contentParts = renderContent(block.value || '');
              return (
                <div key={idx} style={{ marginBottom: '1.5em' }}>
                  {contentParts.map((part, partIdx) => {
                    if (part.type === 'image') {
                      return (
                        <div
                          key={partIdx}
                          style={{
                            position: 'relative',
                            maxWidth: '85%',
                            margin: '2em auto',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(234,255,247,.1)'
                          }}
                        >
                          <Image
                            src={part.src}
                            alt={part.alt}
                            width={800}
                            height={600}
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block'
                            }}
                            loading="lazy"
                          />
                        </div>
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
            }
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
