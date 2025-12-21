'use client';

import { useState, useRef } from 'react';

export default function AvatarUploadWidget() {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('❌ Please drop an image file');
      return;
    }

    await uploadAvatar(imageFiles[0]);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) await uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('isAvatar', 'true');

      const response = await fetch('/api/posts/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Author avatar updated!');
        window.location.reload(); // Reload to show new avatar
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

  return (
    <div className="avatar-upload-widget">
      <div
        className={`avatar-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {uploading ? (
          <div className="upload-status">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">👤</div>
            <p><strong>Author Avatar</strong></p>
            <p style={{ fontSize: '11px', color: '#888' }}>Drop image here</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .avatar-upload-widget {
          margin-left: auto;
        }

        .avatar-dropzone {
          border: 2px dashed #444;
          border-radius: 12px;
          padding: 16px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(0, 255, 136, 0.02);
          min-width: 140px;
        }

        .avatar-dropzone:hover {
          border-color: #00ff88;
          background: rgba(0, 255, 136, 0.05);
          transform: translateY(-2px);
        }

        .avatar-dropzone.dragging {
          border-color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          border-style: solid;
        }

        .upload-icon {
          font-size: 32px;
          margin-bottom: 4px;
        }

        .upload-prompt p {
          margin: 2px 0;
          font-size: 12px;
        }

        .upload-status {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80px;
        }

        .spinner {
          width: 30px;
          height: 30px;
          position: relative;
          animation: alienPulse 2s ease-in-out infinite;
        }

        .spinner::before {
          content: '👽';
          position: absolute;
          font-size: 30px;
          animation: alienMorph 1.5s ease-in-out infinite;
        }

        @keyframes alienPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          50% { transform: scale(0.9) rotate(5deg); }
          75% { transform: scale(1.15) rotate(-3deg); }
        }

        @keyframes alienMorph {
          0% { content: '👽'; filter: hue-rotate(0deg) brightness(1); }
          20% { content: '🛸'; filter: hue-rotate(60deg) brightness(1.2); }
          40% { content: '👾'; filter: hue-rotate(120deg) brightness(1.1); }
          60% { content: '🌌'; filter: hue-rotate(180deg) brightness(1.3); }
          80% { content: '💚'; filter: hue-rotate(240deg) brightness(1.2); }
          100% { content: '👽'; filter: hue-rotate(360deg) brightness(1); }
        }
      `}</style>
    </div>
  );
}
