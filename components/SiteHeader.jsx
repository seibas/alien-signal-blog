'use client';

import Link from "next/link";
import AlienLogo from "./AlienLogo";
import MobileMenu from "./MobileMenu";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';

const QuickCapture = dynamic(() => import('./QuickCapture'), { ssr: false });

export default function SiteHeader() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const auth = sessionStorage.getItem('admin_authenticated');
      setIsAdmin(auth === 'true');
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
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

  const handleQuickCapture = () => {
    setShowQuickCapture(true);
  };

  return (
    <>
      {showQuickCapture && (
        <QuickCapture
          onClose={() => setShowQuickCapture(false)}
          onPostCreated={(slug) => {
            setShowQuickCapture(false);
            window.location.href = `/blog/${slug}`;
          }}
        />
      )}
      
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
            <Link href="/skills">Skills</Link>
            {!isAdmin && <Link href="/admin"> Admin</Link>}
          </nav>

          <MobileMenu 
            isAdmin={isAdmin} 
            onLogout={handleLogout}
            onQuickCapture={handleQuickCapture}
          />
        </div>
      </header>

      {isAdmin && pathname === '/' && (
        <div className="admin-bar">
          <div className="admin-bar-content">
            <span className="admin-badge"> Admin Mode Active</span>
            <div className="admin-bar-actions">
              <Link href="/settings" className="admin-settings"> Settings</Link>
              <button onClick={handleLogout} className="admin-logout">
                 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
