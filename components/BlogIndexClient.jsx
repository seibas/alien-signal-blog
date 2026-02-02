'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PostCard from "@/components/PostCard";
import NewPostForm from "@/components/NewPostForm";
import { toast } from '@/lib/toast';

const QuickCapture = dynamic(() => import('@/components/QuickCapture'), { ssr: false });

export default function BlogIndexClient({ initialPosts }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [allPosts, setAllPosts] = useState(initialPosts);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleFixSlugs = async () => {
    if (!confirm('Fix all invalid slugs? This will update posts with spaces/special characters in their URLs.')) return;

    try {
      const response = await fetch('/api/posts/fix-slugs', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        toast.success(`Fixed ${data.fixes?.length || 0} posts!`);
        fetchPosts();
      } else {
        toast.error('Failed to fix slugs');
      }
    } catch (error) {
      console.error('Error fixing slugs:', error);
      toast.error('Error fixing slugs');
    }
  };

  useEffect(() => {
    const adminStatus = sessionStorage.getItem('admin_authenticated') === 'true';
    setIsAdmin(adminStatus);
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

    setDeleting(true);
    try {
      for (const slug of selectedPosts) {
        await fetch('/api/posts/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug })
        });
      }

      fetchPosts();
      setSelectedPosts([]);
      setDeleteMode(false);
      toast.success('Posts deleted successfully!');
    } catch (error) {
      console.error('Error deleting posts:', error);
      toast.error('Failed to delete posts');
    } finally {
      setDeleting(false);
    }
  };

  const all = allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));

  if (showNewPostForm) {
    return <NewPostForm onCancel={() => setShowNewPostForm(false)} />;
  }

  if (showQuickCapture) {
    return (
      <QuickCapture
        onClose={() => setShowQuickCapture(false)}
        onPostCreated={(slug) => {
          setShowQuickCapture(false);
          fetchPosts();
        }}
      />
    );
  }

  return (
    <>
      {isAdmin && (
        <button
          className="fab-quick-capture"
          onClick={() => setShowQuickCapture(true)}
          title="Quick Capture"
        >
          ✨
        </button>
      )}
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
                      disabled={selectedPosts.length === 0 || deleting}
                      style={{
                        background: selectedPosts.length > 0 ? '#ff4444' : '#444',
                        cursor: selectedPosts.length > 0 && !deleting ? 'pointer' : 'not-allowed',
                        opacity: selectedPosts.length > 0 && !deleting ? 1 : 0.5,
                        padding: '8px 16px',
                        fontSize: '14px'
                      }}
                    >
                      {deleting ? '⏳ Deleting...' : `🗑️ Delete ${selectedPosts.length > 0 ? `(${selectedPosts.length})` : ''}`}
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
                      onClick={handleFixSlugs}
                      title="Fix invalid slugs"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      🔧 Fix Slugs
                    </button>
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
          {all.map((p, index) => (
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
                <PostCard post={p} index={index} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
