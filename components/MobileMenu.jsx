'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MobileMenu({ isAdmin, onLogout, onQuickCapture }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  
  // Mount check to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Direct admin check - only after mount
  const checkIsAdmin = () => {
    if (!isMounted) return false;
    return sessionStorage.getItem('admin_authenticated') === 'true';
  };

  // Prevent body scroll when menu is open - Robust iOS fix
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.classList.add('mobile-menu-open');
      document.body.style.top = `-${scrollY}px`;
      
      return () => {
        // Restore scroll position
        document.body.classList.remove('mobile-menu-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Keyboard navigation for menu items
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Get all focusable menu items
      const menuItemsElements = document.querySelectorAll(
        '.mobile-menu-item, .mobile-menu-reading-btn'
      );
      const currentIndex = Array.from(menuItemsElements).findIndex(
        el => el === document.activeElement
      );

      switch(e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          // Return focus to toggle button
          document.querySelector('.mobile-menu-toggle')?.focus();
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (menuItemsElements.length > 0) {
            const nextIndex = (currentIndex + 1) % menuItemsElements.length;
            menuItemsElements[nextIndex]?.focus();
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (menuItemsElements.length > 0) {
            const prevIndex = currentIndex <= 0 ? menuItemsElements.length - 1 : currentIndex - 1;
            menuItemsElements[prevIndex]?.focus();
          }
          break;

        case 'Home':
          e.preventDefault();
          menuItemsElements[0]?.focus();
          break;

        case 'End':
          e.preventDefault();
          menuItemsElements[menuItemsElements.length - 1]?.focus();
          break;

        case 'Tab':
          // Trap focus within menu
          const firstItem = menuItemsElements[0];
          const lastItem = menuItemsElements[menuItemsElements.length - 1];

          if (e.shiftKey && document.activeElement === firstItem) {
            e.preventDefault();
            lastItem?.focus();
          } else if (!e.shiftKey && document.activeElement === lastItem) {
            e.preventDefault();
            firstItem?.focus();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus first menu item when menu opens
    const firstMenuItem = document.querySelector('.mobile-menu-item');
    firstMenuItem?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const menuItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/blog', label: 'Blog', icon: '📡' },
    { href: '/skills', label: 'Skills', icon: '🛠️' },
    { href: '/about', label: 'About', icon: '👽' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`mobile-menu-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <nav
        className={`mobile-menu-panel ${isOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
      >
        {/* Small Reading Mode Button */}
        <button
          className="mobile-menu-reading-btn"
          onClick={() => {
            const html = document.documentElement;
            html.classList.toggle('reading-mode');
          }}
          aria-label="Toggle reading mode"
          title="Reading Mode"
        >
          <span className="toggle-icon">📖</span>
        </button>

        <div className="mobile-menu-content">
          {/* Cosmic Background Animation */}
          <div className="mobile-menu-bg-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>

          {/* Menu Items */}
          <div className="mobile-menu-items">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-menu-item ${pathname === item.href ? 'active' : ''}`}
                onClick={handleLinkClick}
                style={{ '--item-index': index }}
              >
                <span className="menu-item-icon">{item.icon}</span>
                <span className="menu-item-label">{item.label}</span>
                <span className="menu-item-arrow">→</span>
              </Link>
            ))}

            {/* Admin Section */}
            {checkIsAdmin() && (
              <>
                <div className="mobile-menu-divider"></div>
                
                {/* Quick Capture - Highlighted */}
                <button
                  className="mobile-menu-item mobile-menu-quick-capture"
                  onClick={() => {
                    setIsOpen(false);
                    if (onQuickCapture) onQuickCapture();
                  }}
                  style={{ '--item-index': menuItems.length }}
                >
                  <span className="menu-item-icon">✨</span>
                  <span className="menu-item-label">Quick Capture</span>
                  <span className="menu-item-arrow">→</span>
                </button>

                <Link
                  href="/settings"
                  className={`mobile-menu-item ${pathname === '/settings' ? 'active' : ''}`}
                  onClick={handleLinkClick}
                  style={{ '--item-index': menuItems.length + 1 }}
                >
                  <span className="menu-item-icon">⚙️</span>
                  <span className="menu-item-label">Settings</span>
                  <span className="menu-item-arrow">→</span>
                </Link>

                <button
                  className="mobile-menu-item mobile-menu-logout"
                  onClick={handleLogout}
                  style={{ '--item-index': menuItems.length + 2 }}
                >
                  <span className="menu-item-icon">🚪</span>
                  <span className="menu-item-label">Logout</span>
                  <span className="menu-item-arrow">→</span>
                </button>
              </>
            )}

            {!checkIsAdmin() && (
              <>
                <div className="mobile-menu-divider"></div>
                
                <Link
                  href="/admin"
                  className={`mobile-menu-item ${pathname === '/admin' ? 'active' : ''}`}
                  onClick={handleLinkClick}
                  style={{ '--item-index': menuItems.length }}
                >
                  <span className="menu-item-icon">🔒</span>
                  <span className="menu-item-label">Admin</span>
                  <span className="menu-item-arrow">→</span>
                </Link>
              </>
            )}
          </div>

          {/* Status Indicator */}
          <div className="mobile-menu-footer">
            <div className="signal-status">
              <span className="status-dot"></span>
              <span className="status-text">Signal Active</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
