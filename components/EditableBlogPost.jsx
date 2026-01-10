'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import TypingAnimation from './TypingAnimation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ImageUpload from './ImageUpload';
import AuthorBio from './AuthorBio';
import AvatarUploadWidget from './AvatarUploadWidget';
import { playAlienSound } from '@/lib/alienSound';
import { toast } from '@/lib/toast';
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function EditableBlogPost({ post }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // Support multi-block content: [{type: 'text', value: ''}, {type: 'code', value: '', language: 'javascript'}]
  const [editedPost, setEditedPost] = useState({
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

  const handleImageInsert = (imageMarkdown) => {
    // Insert image markdown at the end of content with proper spacing
    const currentContent = editedPost.content;
    const newContent = currentContent 
      ? `${currentContent}\n\n${imageMarkdown}\n\n`
      : `${imageMarkdown}\n\n`;
    setEditedPost({...editedPost, content: newContent});
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
      console.error('Save error:', error);
      toast.error('Failed to save changes. Check console for details.');
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
      console.error('Delete error:', error);
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
      setEditedPost((prev) => ({
        ...prev,
        blocks: [...prev.blocks, type === 'code' ? { type: 'code', value: '', language: 'javascript' } : { type: 'text', value: '' }]
      }));
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
                  <span style={{ fontWeight: 600 }}>{block.type === 'code' ? 'Code Block' : 'Text Block'}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      title="Move Up"
                      onClick={() => moveBlock(idx, -1)}
                      disabled={idx === 0}
                      style={{
                        color: idx === 0 ? '#555' : '#00ff8c',
                        background: 'linear-gradient(180deg, #00ff8c 0%, #007a4d 100%)',
                        border: 'none',
                        borderRadius: '50%',
                        fontSize: 22,
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: idx === 0 ? 'none' : '0 2px 8px #00ff8c44',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        padding: 0,
                        marginRight: 2,
                        transition: 'transform 0.1s',
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
                        background: 'linear-gradient(180deg, #ff9100 0%, #7a4d00 100%)',
                        border: 'none',
                        borderRadius: '50%',
                        fontSize: 22,
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: idx === editedPost.blocks.length - 1 ? 'none' : '0 2px 8px #ff910044',
                        cursor: idx === editedPost.blocks.length - 1 ? 'not-allowed' : 'pointer',
                        padding: 0,
                        marginRight: 2,
                        transition: 'transform 0.1s',
                      }}
                    >
                      <span style={{ display: 'inline-block', transform: 'translateY(1px)' }}>▼</span>
                    </button>
                    <button onClick={() => removeBlock(idx)} style={{ color: '#ca4a4a', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
                  </div>
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
              <button className="btn" type="button" onClick={() => addBlock('text')}>+ Add Text Block</button>
              <button className="btn" type="button" onClick={() => addBlock('code')}>+ Add Code Block</button>
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

  // Multi-block rendering: support both new (blocks) and old (content) formats
  const blocks = Array.isArray(post.blocks)
    ? post.blocks
    : (Array.isArray(post.content)
        ? [{ type: 'text', value: post.content.join('\n\n') }]
        : [{ type: 'text', value: post.content || '' }]);

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
        {isAdmin && (
          <button 
            className="edit-toggle-btn"
            onClick={handleDelete}
            title="Delete post"
            style={{ 
              right: '60px', 
              background: '#ca4a4aff',
              fontSize: '0.7em',
              padding: '4px 8px'
            }}
          >
            🗑️ Delete
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
          {blocks.map((block, idx) => {
            if (block.type === 'code') {
              return (
                <div key={idx} style={{ margin: '2em 0' }}>
                  <SyntaxHighlighter language={block.language || 'javascript'} style={vscDarkPlus} customStyle={{ borderRadius: 10, fontSize: 16, padding: 18 }}>
                    {block.value}
                  </SyntaxHighlighter>
                </div>
              );
            } else {
              // Render text with image support
              const contentParts = renderContent(block.value);
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
