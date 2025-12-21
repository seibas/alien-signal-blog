'use client';

import { useState, useEffect } from 'react';
import { posts } from "@/content/posts";
import PostCard from "@/components/PostCard";
import NewPostForm from "@/components/NewPostForm";

export default function BlogIndex() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [allPosts, setAllPosts] = useState(posts);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    // Check admin status
    const adminStatus = sessionStorage.getItem('admin_authenticated') === 'true';
    setIsAdmin(adminStatus);
    
    // Fetch fresh posts from API when component mounts
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('/api/posts/list')
      .then(res => res.json())
      .then(data => {
        if (data.posts && data.posts.length > 0) {
          setAllPosts(data.posts);
        }
      })
      .catch(err => console.error('Error fetching posts:', err));
  };

  const handleSelectPost = (slug) => {
    setSelectedPosts(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedPosts.length === 0) return;
    
    const confirmMsg = selectedPosts.length === 1 
      ? 'Delete this post?' 
      : `Delete ${selectedPosts.length} posts?`;
    
    if (!confirm(confirmMsg)) return;

    try {
      // Delete all selected posts
      for (const slug of selectedPosts) {
        await fetch('/api/posts/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug })
        });
      }
      
      // Refresh posts
      fetchPosts();
      setSelectedPosts([]);
      setDeleteMode(false);
      alert('✅ Posts deleted successfully!');
    } catch (error) {
      console.error('Error deleting posts:', error);
      alert('❌ Failed to delete posts');
    }
  };

  const all = allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));

  if (showNewPostForm) {
    return <NewPostForm onCancel={() => setShowNewPostForm(false)} />;
  }

  return (
    <section className="container">
      <div className="card cardPad">
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h1 className="h2" style={{ fontSize: 28, margin: 0 }}>Logbook</h1>
            {isAdmin && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {deleteMode ? (
                  <>
                    <button 
                      className="btn btnPrimary"
                      onClick={handleDeleteSelected}
                      disabled={selectedPosts.length === 0}
                      style={{ 
                        background: selectedPosts.length > 0 ? '#ff4444' : '#444',
                        cursor: selectedPosts.length > 0 ? 'pointer' : 'not-allowed',
                        opacity: selectedPosts.length > 0 ? 1 : 0.5,
                        padding: '8px 16px',
                        fontSize: '14px'
                      }}
                    >
                      🗑️ Delete {selectedPosts.length > 0 ? `(${selectedPosts.length})` : ''}
                    </button>
                    <button 
                      className="btn btnGhost"
                      onClick={() => {
                        setDeleteMode(false);
                        setSelectedPosts([]);
                      }}
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn btnGhost"
                      onClick={() => setDeleteMode(true)}
                      title="Delete posts"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      🗑️ Delete
                    </button>
                    <button 
                      className="btn btnPrimary"
                      onClick={() => setShowNewPostForm(true)}
                      title="Create new post"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      ➕ New Post
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          
          {deleteMode && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255, 68, 68, 0.1)',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#ff6666'
            }}>
              ⚠️ Delete mode active - Click on posts to select them for deletion
            </div>
          )}
          
          <p className="p" style={{ marginTop: deleteMode ? '16px' : '10px', marginBottom: 0 }}>
            Entries from my coding journey—what I learn, what I build, and what I discover along the way.
          </p>
        </div>

        <div className="postGrid">
          {all.map((p) => (
            <div 
              key={p.slug} 
              style={{ 
                position: 'relative',
                cursor: deleteMode ? 'pointer' : 'default'
              }}
              onClick={() => deleteMode && handleSelectPost(p.slug)}
            >
              {deleteMode && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: selectedPosts.includes(p.slug) ? '#00ff88' : 'rgba(0,0,0,0.6)',
                  border: `2px solid ${selectedPosts.includes(p.slug) ? '#00ff88' : '#666'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  zIndex: 10,
                  pointerEvents: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedPosts.includes(p.slug) ? '0 0 12px rgba(0,255,136,0.5)' : 'none'
                }}>
                  {selectedPosts.includes(p.slug) ? '✓' : ''}
                </div>
              )}
              <div style={{
                opacity: deleteMode && selectedPosts.includes(p.slug) ? 0.7 : 1,
                transform: deleteMode && selectedPosts.includes(p.slug) ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}>
                <PostCard post={p} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
