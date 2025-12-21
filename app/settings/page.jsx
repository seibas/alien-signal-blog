'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('/images/avatar.jpg');
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const fileInputRef = useRef(null);

  // Load saved settings from localStorage
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('author_name') || 'Alien Signal';
      const savedTitle = localStorage.getItem('author_title') || 'Cosmic Explorer & Digital Storyteller';
      const savedBio = localStorage.getItem('author_bio') || 'Transmitting signals from the depths of space and code. Exploring the intersection of technology, creativity, and the unknown. 每個故事都是一次旅程 🛸';
      
      setAuthorName(savedName);
      setAuthorTitle(savedTitle);
      setAuthorBio(savedBio);
    }
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('isAvatar', 'true'); // Mark as avatar

      const response = await fetch('/api/posts/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Rename uploaded file to avatar.jpg
        const avatarUrl = `/images/avatar.jpg?t=${Date.now()}`; // Cache bust
        setCurrentAvatar(avatarUrl);
        alert('✅ Avatar updated successfully!');
      } else {
        alert(`❌ Failed to upload: ${data.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Failed to upload avatar');
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveSettings = () => {
    setSaving(true);
    
    try {
      localStorage.setItem('author_name', authorName);
      localStorage.setItem('author_title', authorTitle);
      localStorage.setItem('author_bio', authorBio);
      
      alert('✅ Author settings saved successfully!');
      window.location.reload(); // Reload to apply changes
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Failed to save settings');
    }
    
    setSaving(false);
  };

  return (
    <section className="container">
      <article className="article">
        <div className="card cardPad">
          <h1 className="h2" style={{ marginBottom: 24 }}>⚙️ Settings</h1>

          <div className="settings-section">
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>Author Profile Picture</h3>
            <p style={{ color: 'rgba(234,255,247,.7)', marginBottom: 20, fontSize: 14 }}>
              Upload your profile picture to display in the author bio section of blog posts.
            </p>

            <div className="avatar-upload-area">
              <div className="avatar-preview">
                <img 
                  src={currentAvatar} 
                  alt="Current Avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="avatar-placeholder">👽</div>
              </div>

              <div className="avatar-upload-controls">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <button 
                  className="btn btnPrimary" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? '⏳ Uploading...' : '📸 Upload New Avatar'}
                </button>
                <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </div>

          <div style={{ height: 32 }} />

          <div className="settings-section">
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>Author Information</h3>
            <p style={{ color: 'rgba(234,255,247,.7)', marginBottom: 20, fontSize: 14 }}>
              This information will be displayed in the author bio section of blog posts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your Name"
                  className="edit-input"
                  style={{ width: '100%', maxWidth: 400 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
                  Author Title
                </label>
                <input
                  type="text"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                  placeholder="e.g., Cosmic Explorer & Digital Storyteller"
                  className="edit-input"
                  style={{ width: '100%', maxWidth: 400 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
                  Short Bio
                </label>
                <textarea
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="Write a short bio about yourself..."
                  className="edit-textarea"
                  rows={4}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <button 
                  className="btn btnPrimary" 
                  onClick={handleSaveSettings}
                  disabled={saving}
                >
                  {saving ? '⏳ Saving...' : '💾 Save Author Info'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ height: 20 }} />
          <div className="btnRow">
            <Link className="btn btnGhost" href="/blog">Back to Blog</Link>
            <Link className="btn btnGhost" href="/">Home</Link>
          </div>
        </div>
      </article>

      <style jsx>{`
        .settings-section {
          padding: 24px;
          border-radius: 12px;
          background: rgba(255,255,255,.02);
          border: 1px solid rgba(234,255,247,.08);
        }

        .avatar-upload-area {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .avatar-preview {
          position: relative;
          flex-shrink: 0;
        }

        .avatar-preview img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(0,255,136,.3);
          box-shadow: 0 4px 16px rgba(0,255,136,.2);
        }

        .avatar-placeholder {
          display: none;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0,255,136,.2), rgba(255,140,0,.2));
          border: 3px solid rgba(0,255,136,.3);
          align-items: center;
          justify-content: center;
          font-size: 60px;
          box-shadow: 0 4px 16px rgba(0,255,136,.2);
        }

        .avatar-upload-controls {
          flex: 1;
        }

        @media (max-width: 600px) {
          .avatar-upload-area {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
