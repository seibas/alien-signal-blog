'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';
import { playAlienSound } from '@/lib/alienSound';

export default function QuickCapture({ onClose, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [step, setStep] = useState('capture'); // 'capture' | 'preview' | 'success'

  // AI Magic - enhance the post
  const handleMagic = async () => {
    if (!title.trim() && !content.trim()) {
      toast.error('Add a title or content first');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/posts/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Untitled Post',
          content: content.trim(),
          useAI
        })
      });

      const data = await response.json();

      if (response.ok && data.enhanced) {
        setPreviewData(data.enhanced);
        setStep('preview');
        toast.success('Magic applied!');
      } else {
        toast.error(data.error || 'Enhancement failed');
      }
    } catch (error) {
      console.error('Magic error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {
    const postData = previewData || {
      slug: title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      title: title || 'Untitled',
      date: new Date().toISOString().split('T')[0],
      readTime: '1 min',
      excerpt: content.substring(0, 160) || 'No description',
      tags: ['draft'],
      blocks: [{ type: 'text', value: content || 'Start writing...' }],
      status: 'draft'
    };

    setIsProcessing(true);

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (response.ok) {
        playAlienSound();
        setStep('success');
        toast.success('Draft saved!');
        setTimeout(() => {
          if (onPostCreated) onPostCreated(postData.slug);
        }, 1500);
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsProcessing(false);
    }
  };

  // Publish directly
  const handlePublish = async () => {
    if (!previewData) {
      await handleMagic();
      return;
    }

    const postData = { ...previewData, status: 'published' };
    setIsProcessing(true);

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (response.ok) {
        playAlienSound();
        setStep('success');
        toast.success('Published!');
        setTimeout(() => {
          window.location.href = `/blog/${postData.slug}`;
        }, 1500);
      } else {
        toast.error(data.error || 'Failed to publish');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish');
    } finally {
      setIsProcessing(false);
    }
  };

  // Edit preview data
  const updatePreview = (field, value) => {
    setPreviewData(prev => ({ ...prev, [field]: value }));
  };

  // Success screen
  if (step === 'success') {
    return (
      <div className="quick-capture">
        <div className="qc-success">
          <div className="qc-success-icon">🛸</div>
          <h2>Signal Transmitted!</h2>
          <p>Your post is ready</p>
        </div>
      </div>
    );
  }

  // Preview screen
  if (step === 'preview' && previewData) {
    return (
      <div className="quick-capture">
        <div className="qc-header">
          <button className="qc-back" onClick={() => setStep('capture')}>
            ← Back
          </button>
          <h2 className="qc-title">Preview</h2>
          <div style={{ width: 60 }} />
        </div>

        <div className="qc-preview">
          <div className="qc-field">
            <label>Title</label>
            <input
              type="text"
              value={previewData.title}
              onChange={(e) => updatePreview('title', e.target.value)}
              className="qc-input"
            />
          </div>

          <div className="qc-field">
            <label>Slug</label>
            <input
              type="text"
              value={previewData.slug}
              onChange={(e) => updatePreview('slug', e.target.value)}
              className="qc-input qc-input-small"
            />
          </div>

          <div className="qc-row">
            <div className="qc-field qc-field-half">
              <label>Date</label>
              <input
                type="text"
                value={previewData.date}
                onChange={(e) => updatePreview('date', e.target.value)}
                className="qc-input"
              />
            </div>
            <div className="qc-field qc-field-half">
              <label>Read Time</label>
              <input
                type="text"
                value={previewData.readTime}
                onChange={(e) => updatePreview('readTime', e.target.value)}
                className="qc-input"
              />
            </div>
          </div>

          <div className="qc-field">
            <label>Tags</label>
            <input
              type="text"
              value={Array.isArray(previewData.tags) ? previewData.tags.join(', ') : previewData.tags}
              onChange={(e) => updatePreview('tags', e.target.value.split(',').map(t => t.trim()))}
              className="qc-input"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="qc-field">
            <label>Excerpt</label>
            <textarea
              value={previewData.excerpt}
              onChange={(e) => updatePreview('excerpt', e.target.value)}
              className="qc-textarea"
              rows={3}
            />
          </div>

          <div className="qc-field">
            <label>Content Blocks ({previewData.blocks?.length || 0})</label>
            <div className="qc-blocks-preview">
              {previewData.blocks?.map((block, i) => (
                <div key={i} className={`qc-block qc-block-${block.type}`}>
                  <span className="qc-block-type">
                    {block.type === 'code' ? '< />' : block.type === 'image' ? '📸' : '¶'}
                  </span>
                  <span className="qc-block-preview">
                    {block.type === 'code'
                      ? `${block.language}: ${block.value?.substring(0, 50)}...`
                      : block.type === 'image'
                        ? block.alt || block.src
                        : block.value?.substring(0, 80) + (block.value?.length > 80 ? '...' : '')
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="qc-actions">
          <button
            className="qc-btn qc-btn-draft"
            onClick={handleSaveDraft}
            disabled={isProcessing}
          >
            {isProcessing ? '...' : '📝 Save Draft'}
          </button>
          <button
            className="qc-btn qc-btn-publish"
            onClick={handlePublish}
            disabled={isProcessing}
          >
            {isProcessing ? '...' : '🚀 Publish'}
          </button>
        </div>
      </div>
    );
  }

  // Capture screen (main)
  return (
    <div className="quick-capture">
      <div className="qc-header">
        <button className="qc-close" onClick={onClose}>✕</button>
        <h2 className="qc-title">Quick Capture</h2>
        <div className="qc-ai-toggle">
          <button
            className={`qc-toggle ${useAI ? 'active' : ''}`}
            onClick={() => setUseAI(!useAI)}
            title={useAI ? 'AI: ON' : 'AI: OFF'}
          >
            {useAI ? '🤖' : '📝'}
          </button>
        </div>
      </div>

      <div className="qc-body">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          className="qc-input qc-input-title"
          autoFocus
        />

        <div className="qc-textarea-wrapper">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here...

Tips:
• Use ```js for code blocks
• Use ![alt](url) for images
• Just write naturally, AI will format it"
            className="qc-textarea qc-textarea-main"
          />
        </div>

        <div className="qc-hint">
          {useAI
            ? '🤖 AI will generate tags, excerpt & format content'
            : '📝 Basic mode - manual metadata'}
        </div>
      </div>

      <div className="qc-actions">
        <button
          className="qc-btn qc-btn-draft"
          onClick={handleSaveDraft}
          disabled={isProcessing || (!title.trim() && !content.trim())}
        >
          {isProcessing ? '...' : '💾 Quick Save'}
        </button>
        <button
          className="qc-btn qc-btn-magic"
          onClick={handleMagic}
          disabled={isProcessing || (!title.trim() && !content.trim())}
        >
          {isProcessing ? '✨...' : '✨ Magic'}
        </button>
      </div>
    </div>
  );
}
