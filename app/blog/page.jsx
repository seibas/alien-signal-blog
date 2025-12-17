'use client';

import { useState, useEffect } from 'react';
import { getAllPosts } from "@/content/posts";
import PostCard from "@/components/PostCard";
import NewPostForm from "@/components/NewPostForm";

export default function BlogIndex() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const all = getAllPosts();

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    setIsAdmin(auth === 'true');
  }, []);

  if (showNewPostForm) {
    return <NewPostForm onCancel={() => setShowNewPostForm(false)} />;
  }

  return (
    <section className="container">
      <div className="card cardPad">
        <div style={{ position: 'relative' }}>
          <h1 className="h2" style={{ fontSize: 28 }}>Logbook</h1>
          {isAdmin && (
            <button 
              className="new-post-btn"
              onClick={() => setShowNewPostForm(true)}
              title="Create new post"
              style={{ position: 'absolute', top: '0', right: '0' }}
            >
              ➕ New Post
            </button>
          )}
        </div>
        <p className="p" style={{ marginTop: 10 }}>
          Entries from my coding journey—what I learn, what I build, and what I discover along the way.
        </p>

        <div style={{ height: 16 }} />

        <div className="postGrid">
          {all.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
