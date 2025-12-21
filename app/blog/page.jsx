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
        <div style={{ position: 'relative' }}>
          <h1 className="h2" style={{ fontSize: 28 }}>Logbook</h1>
          {isAdmin && (
            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', gap: '8px' }}>
              {deleteMode ? (
                <>
                  <button 
                    className="new-post-btn"
                    onClick={handleDeleteSelected}
                    disabled={selectedPosts.length === 0}
                    style={{ 
                      background: selectedPosts.length > 0 ? '#ff4444' : '#666',
                      cursor: selectedPosts.length > 0 ? 'pointer' : 'not-allowed'
                    }}
                  >
                    🗑️ Delete ({selectedPosts.length})
                  </button>
                  <button 
                    className="new-post-btn"
                    onClick={() => {
                      setDeleteMode(false);
                      setSelectedPosts([]);
                    }}
                    style={{ background: '#666' }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="new-post-btn"
                    onClick={() => setDeleteMode(true)}
                    title="Delete posts"
                  >
                    🗑️ Delete
                  </button>
                  <button 
                    className="new-post-btn"
                    onClick={() => setShowNewPostForm(true)}
                    title="Create new post"
                  >
                    ➕ New Post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <p className="p" style={{ marginTop: 10 }}>
          Entries from my coding journey—what I learn, what I build, and what I discover along the way.
        </p>

        <div style={{ height: 16 }} />

        <div className="postGrid">
          {all.map((p) => (
            <div key={p.slug} style={{ position: 'relative' }}>
              {deleteMode && isAdmin && (
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(p.slug)}
                  onChange={() => handleSelectPost(p.slug)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                />
              )}
              <PostCard post={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
