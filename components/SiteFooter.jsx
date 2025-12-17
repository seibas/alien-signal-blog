export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footerInner">
        <div>© {year} Alien Signal Blog</div>
        <div>Green signal + orange accent • Built with Next.js</div>
      </div>
    </footer>
  );
}
