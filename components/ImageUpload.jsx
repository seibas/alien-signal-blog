'use client';

import { useState, useRef } from 'react';

export default function ImageUpload({ onImageInsert }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      alert('❌ Please drop image files only');
      return;
    }

    await uploadImages(imageFiles);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await uploadImages(files);
  };

  const uploadImages = async (files) => {
    setUploading(true);

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/posts/upload-image', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          // Use the URL from the response (could be Blob URL or local path)
          const imageUrl = data.url || `/images/${data.filename}`;
          const imageMarkdown = `![${data.filename}](${imageUrl})`;
          onImageInsert(imageMarkdown);
          
          // Show success message
          showSuccess(`✅ ${file.name} uploaded!`);
        } else {
          // Show detailed error message
          const errorMsg = data.details || data.error || 'Upload failed';
          const helpText = data.helpText ? `\n\n${data.helpText}` : '';
          alert(`❌ Failed to upload ${file.name}\n\n${errorMsg}${helpText}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert(`❌ Failed to upload ${file.name}: ${error.message}`);
      }
    }

    setUploading(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showSuccess = (message) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'image-upload-success';
    msgDiv.textContent = message;
    msgDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #00ff88;
      color: #000;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
    `;
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 2000);
  };

  return (
    <div className="image-upload-container">
      <div
        className={`image-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {uploading ? (
          <div className="upload-status">
            <div className="spinner"></div>
            <p>🛸 Uploading...</p>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📸</div>
            <p><strong>Drag & drop images here</strong></p>
            <p style={{ fontSize: '13px', color: '#888' }}>or click to browse</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .image-upload-container {
          margin: 16px 0;
        }

        .image-dropzone {
          border: 2px dashed #444;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(0, 255, 136, 0.02);
        }

        .image-dropzone:hover {
          border-color: #00ff88;
          background: rgba(0, 255, 136, 0.05);
          transform: translateY(-2px);
        }

        .image-dropzone.dragging {
          border-color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          border-style: solid;
        }

        .upload-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .upload-prompt p {
          margin: 4px 0;
        }

        .upload-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .spinner {
          width: 60px;
          height: 60px;
          position: relative;
          animation: alienPulse 2s ease-in-out infinite;
        }

        .spinner::before {
          content: '👽';
          position: absolute;
          font-size: 60px;
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

        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
