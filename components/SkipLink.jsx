'use client';

export default function SkipLink() {
  const handleClick = (e) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      className="skip-link"
      onClick={handleClick}
    >
      Skip to main content
    </a>
  );
}
