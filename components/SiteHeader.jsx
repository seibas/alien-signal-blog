'use client';

import Link from "next/link";
import AlienLogo from "./AlienLogo";
import { useState, useEffect } from "react";

export default function SiteHeader() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set isMobile based on window width
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAdmin(false);
    window.dispatchEvent(new Event('adminAuthChanged'));
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="headerInner">
          <Link className="brand" href="/" onClick={closeMobileMenu}>
            <AlienLogo />
            <span>ALIEN SIGNAL</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav" aria-label="Primary">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/alien-translator">🛸 AI Translator</Link>
            <Link href="/about">About</Link>
            {!isAdmin && <Link href="/admin">🔒 Admin</Link>}
          </nav>

          {/* Mobile Menu Button */}
          {isMobile && (
            <button 
              className={`mobile-menu-button ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`nav-mobile-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />
      
      {/* Mobile Navigation Overlay */}
      <nav className={`nav-mobile ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile">
        {mobileMenuOpen && (
          <></>
        )}
        <div className="nav-mobile-links">
          <div className="nav-mobile-top-row">
            <div className="nav-mobile-logo">
              <AlienLogo />
            </div>
            <button className="nav-mobile-close" onClick={closeMobileMenu} aria-label="Close menu">
              <span>&#10005;</span>
            </button>
          </div>
          <Link href="/" onClick={closeMobileMenu}>Home</Link>
          <Link href="/blog" onClick={closeMobileMenu}>Blog</Link>
          <Link href="/alien-translator" onClick={closeMobileMenu}>🛸 AI Translator</Link>
          <Link href="/about" onClick={closeMobileMenu}>About</Link>
          {!isAdmin && <Link href="/admin" onClick={closeMobileMenu}>🔒 Admin</Link>}
        </div>
      </nav>

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
