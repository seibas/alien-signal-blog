'use client';

import Link from "next/link";
import AlienLogo from "./AlienLogo";
import { useState, useEffect } from "react";

export default function SiteHeader() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = sessionStorage.getItem('admin_authenticated');
      setIsAdmin(auth === 'true');
    };
    
    checkAuth();
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    // Custom event for same-tab updates
    window.addEventListener('adminAuthChanged', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('adminAuthChanged', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAdmin(false);
    window.dispatchEvent(new Event('adminAuthChanged'));
    window.location.href = '/';
  };

  return (
    <>
      <header className="header">
        <div className="headerInner">
          <Link className="brand" href="/">
            <AlienLogo />
            <span>ALIEN SIGNAL</span>
          </Link>

          <nav className="nav" aria-label="Primary">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            {!isAdmin && <Link href="/admin">🔒 Admin</Link>}
          </nav>
        </div>
      </header>
      {isAdmin && (
        <div className="admin-bar">
          <div className="admin-bar-content">
            <span className="admin-badge">👤 Admin Mode Active</span>
            <div className="admin-bar-actions">
              <Link href="/settings" className="admin-settings">⚙️ Settings</Link>
              <button onClick={handleLogout} className="admin-logout">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}